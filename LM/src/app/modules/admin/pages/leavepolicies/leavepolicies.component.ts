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
  isEditDefaultRules:boolean=false;
  arrayValue:any=[{Value:'1',name:'Yes'},{Value:'0',name:'No'}]
  arrayValues:any=[{Value:'1',name:'Yes'},{Value:'0',name:'No'}]
  arrayValuess:any=[{Value:'1',name:'Monthly'},{Value:'3',name:'Quarterly'},{Value:'6',name:'Half-Yearly'},{Value:'12',name:'Yearly'}]
  isdisabled:boolean=true;
  arrayValueOne:any=[{value:'1',name:'Jan-Dec'},{value:'2',name:' Apr-Mar'}]
  arrayValuesDefalult:any=[{value:'1',name:'Yes'},{value:'0',name:'No'}]
  arrayValuesWeek:any=[{Value:'1',name:'Yes'},{Value:'0',name:'No'}];
  displayedColumns: string[] = ['sno','configurationrules','data','addditionalinformation'];
  displayedColumns2: string[] = ['leavetypename','displayname','daysperyear','color','status','action'];
 
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
      advancedleaveid:[""]

    });
    this.addleaveForm.get('leaveid')?.valueChanges.subscribe((selectedValue:any) => {
      console.log(selectedValue)
      
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
        // width: '250px',
        position:{top:`70px`},
        
      })
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

