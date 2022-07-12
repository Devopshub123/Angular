import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { LeavePoliciesService } from 'src/app/services/leave-policies.service'; 
import { AddleavepopupComponent } from '../addleavepopup/addleavepopup.component';
@Component({
  selector: 'app-leavepolicies',
  templateUrl: './leavepolicies.component.html',
  styleUrls: ['./leavepolicies.component.scss']
})
export class LeavepoliciesComponent implements OnInit {
  leavepoliciesForm:any =FormGroup;
  addleaveForm:any=FormGroup;
  ruleInfo:any=[];
  ruleMaasterData:any=[];
  defaultRuleInfo:any=[];
  existingColors:any = [];
  leavesTypeData:any = [];
  leaveTypes:any=[];
  advanceLeavetypes:any=[];
  isadvanced:boolean=false;
  isaddnew:boolean=true;
  dataSource: MatTableDataSource<any>=<any>[];
  dataSource2: MatTableDataSource<any>=<any>[];
  dataSource3: MatTableDataSource<any>=<any>[];
  isEditDefaultRules:boolean=false;
  actionflag:boolean=false;
  tabledata:boolean=false;
  arrayValue:any=[{Value:'1',name:'Yes'},{Value:'0',name:'No'}]
  arrayValues:any=[{Value:'1',name:'Yes'},{Value:'0',name:'No'}]
  arrayValuess:any=[{Value:'1',name:'Monthly'},{Value:'3',name:'Quarterly'},{Value:'6',name:'Half-Yearly'},{Value:'12',name:'Yearly'}]
  isdisabled:boolean=true;
  arrayValueOne:any=[{value:'1',name:'Jan-Dec'},{value:'2',name:' Apr-Mar'}]
  arrayValuesDefalult:any=[{value:'1',name:'Yes'},{value:'0',name:'No'}]
  arrayValuesWeek:any=[{Value:'1',name:'Yes'},{Value:'0',name:'No'}];
  displayedColumns: string[] = ['sno','configurationrules','data','addditionalinformation'];
  displayedColumns3: string[] = ['sno','configurationrules','data','addditionalinformation','actions'];
  displayedColumns2: string[] = ['leavetypename','displayname','daysperyear','color','status','action'];
  leaveConfigure: any;
  leaveId: any;
  ispredefined: any;
  editLeaveInfo: any;
 
  constructor(private LM:LeavePoliciesService,private dialog: MatDialog,private formBuilder: FormBuilder,) { }

  ngOnInit(): void {
    this.getLeaveRules();
    this.getLeavesTypeInfo();
    this.getLeavesDetails();
    this.getAdvancedLeavetypes();
    this.leavepoliciesForm=this.formBuilder.group(
      {
      leavecycleyear: [""],        
      email: ["",],
      pastdays: ["",],  
      
    });
    this.addleaveForm = this.formBuilder.group({
      displayname:["",],
      leaveid:["",],
      advancedleaveid:[""],
      leavecolor:[""],
      pastdays:["",],
      leavecountperyear:["",],
      data:["",],
      maxcapyear:[""]

    });
    
    this.addleaveForm.get('leaveid')?.valueChanges.subscribe((selectedValue:any) => {
      console.log(selectedValue)
      this.tabledata = true;
      if (selectedValue < 11){
        this.actionflag=false;
      }
      else{
        this.actionflag = true;
      }
      
      for(let i=0;i<this.leaveTypes.length;i++){
        if(this.leaveTypes[i].id == selectedValue){
          this.addleaveForm.controls.displayname.setValue(this.leaveTypes[i].leavename);
          break;
        }

      }
      if(selectedValue == 1){
        this.isadvanced = true;
      }
      else{
        this.isadvanced = false;
      }
      this.changeLeaveType(selectedValue,null);

      

    })
  }
  /**Common leave rules */
  getLeaveRules() {
    this.LM.getLeavePolicies(null,true,1,10).subscribe((result) => {

      this.defaultRuleInfo=JSON.parse(result.data[0].json);
      console.log(this.defaultRuleInfo)
      this.dataSource = new MatTableDataSource(this.defaultRuleInfo);

    })
  }
  /**leavetype dropdown */
  getLeavesDetails() {
    this.LM.getLeaveDetails('lm_leavesmaster','Active',1,100).subscribe((result) =>{
      if(result.status) {
        this.leaveTypes = result.data;
        console.log('this.leaveTypes',this.leaveTypes)
         // this.advansed = this.getAdvancedLeavetypes();
        // if (this.advanceLeavetypes && this.advanceLeavetypes.length == 0){
        //   this.leaveTypes.shift();
        // }
      }
    });
  }
  /**advance leavetype dropdown*/
  getAdvancedLeavetypes(){
    this.LM.getleavetypesforadvancedleave().subscribe((result) => {
      if(result.status) {
        this.advanceLeavetypes = result.data;
      }
    });
  }
  editLeaveTypeName(leave:any){}
  /**Leavetypes data (Added leave showing table) */
  getLeavesTypeInfo(){
      this.LM.getLeavesTypeInfo().subscribe((result) =>{
          this.leavesTypeData = result.data;
          for(let i=0; i<this.leavesTypeData.length;i++) {
              this.existingColors.push(this.leavesTypeData[i].leavecolor);
          }
          this.dataSource2 = new MatTableDataSource(this.leavesTypeData);
      });
  }
  addLeaveConfigure(){
    this.isaddnew=false;
  }
  addnewleave(){
    console.log("hh")
   
      let dialogRef = this.dialog.open(AddleavepopupComponent, {
        width: '500px',
        height:'300px',
        position:{top:`70px`},
        
      })
  }

  changeLeaveType(id:any,flag:any){
    this.leaveId = id;
  

    // if(this.leaveConfigure.leaveId == 1 && flag == null) {
    //       // this.advanceLeavetypes =this.getAdvancedLeavetypes();
    //   this.leaveTypes.findIndex((item: { id: any; display_name: any; }) => {
    //     if (item.id == id) {
    //       this.leaveConfigure.displayName = item.display_name;
    //     }
    //   });

    //   }
    //   else {

    //   // if(this.leaveConfigure.leaveId == 1){
    //   //   this.leaveTypes.findIndex(item => {
    //   //     if (item.id == id) {
    //   //       this.leaveConfigure.displayName = item.display_name;
    //   //     }
    //   //   })
    //   // }else{
    //     this.leaveTypes.findIndex((item: { id: any; display_name: any; }) => {
    //       if (item.id == id) {
    //         this.leaveConfigure.displayName = item.display_name;
    //       }
    //     })
    //   // }

    //   /* this.leaveConfigure.displayName =  leave.split('-')[1];*/
    //   this.ruleInfo = [];

      // this.LM.getLeaveTypes('LM_RuleMaster',1,100).subscribe((data) =>{
      this.LM.getLeavePolicies(this.leaveId, false, 1, 100).subscribe((result) => {
        var ruleDetails = JSON.parse(result.data[0].json);
      console.log("hjsdjhvhh",ruleDetails)
        if(this.leaveId == 1 && flag === 'edit'){
          this.leaveConfigure.advancedLeaveId = ruleDetails[0].value;

        }
        for (let obj of ruleDetails) {
          if(obj.status === "Inactive"){
            obj.isselected= false;

          }else{
            obj.isselected = true;

          }

          obj.isValidate = false;
        }
        this.ruleInfo = ruleDetails;
        this.ruleInfo.push({ruledescription:"Select unique color for each leave type"})
        console.log(this.ruleInfo)
        this.dataSource3 = new MatTableDataSource(this.ruleInfo);

        for(let objInfo of this.leaveTypes){
          if(objInfo.ispredefined && objInfo.status === 'Inactive' && objInfo.id == this.leaveId && this.ruleInfo[0].effectivefromdate != null){
            this.ispredefined = objInfo.ispredefined;
            this.editLeaveInfo = objInfo;
            // console.log("editLeaveInfoeditLeaveInfo",this.editLeaveInfo)
          }else if(this.ruleInfo[0].effectivefromdate === null){
            // this.ispredefined = false;
          }else if(!objInfo.ispredefined){
            // this.ispredefined = true;
            // this.editLeaveInfo = objInfo;
          }
        }


      })
      // }else{

      // }
    // }

    }
  
  saveDefaultrules(){}
  cancelDefaultRules(){}
  editDefaultRules(){
    this.isEditDefaultRules=true;
  }

}
function openDialog() {
  throw new Error('Function not implemented.');
}

