import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { LeavePoliciesService } from 'src/app/services/leave-policies.service';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { AddleavepopupComponent } from '../addleavepopup/addleavepopup.component';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { Location } from '@angular/common';
import {LeavePoliciesDialogComponent} from '../../dialog/leave-policies-dialog/leave-policies-dialog.component'
@Component({
  selector: 'app-leavepolicies',
  templateUrl: './leavepolicies.component.html',
  styleUrls: ['./leavepolicies.component.scss']
})
export class LeavepoliciesComponent implements OnInit {
  leavepoliciesForm:any =FormGroup;
  addleaveForm:any=FormGroup;
  ruleInfo:any=[];
  ruleInfos:any=[];
  ruleMaasterData:any=[];
  defaultRuleInfo:any=[];
  existingColors:any = [];
  leavesTypeData:any = [];
  leaveTypes:any=[];
  rgbcolor:any=[];
  setleavecolor:any;
  advanceLeavetypes:any=[];
  istoggle:boolean=false;
  isterm:boolean=true;
  isnewleave:boolean=true;
  isadvanced:boolean=false;
  isaddnew: boolean = true;
  addBtn1: boolean = true;
  addBtn2: boolean = true;
  isaddnewleave:boolean =false;
  msgLM1:any;
  msgLM2:any;
  msgLM3:any;
  msgLM21:any;
  msgLM110:any;
  msgLM111:any;
  msgLM133:any;
  msgLM134:any;
  msgLM135:any;
  msgLM136:any;
  isCreditfrequence: boolean = true;
  datas:any=[]

  dataSource: MatTableDataSource<any>=<any>[];
  dataSource2: MatTableDataSource<any>=<any>[];
  dataSource3: MatTableDataSource<any>=<any>[];
  isEditDefaultRules:boolean=false;
  actionflag:boolean=false;
  ischecked:boolean=false;
  tabledata:boolean=false;
  editingleavetype:boolean=false;
  arrayValue:any=[{Value:'1',name:'Yes'},{Value:'0',name:'No'}]
  arrayValues:any=[{Value:'1',name:'Yes'},{Value:'0',name:'No'}]
  arrayValuess:any=[{Value:'1',name:'Monthly'},{Value:'3',name:'Quarterly'},{Value:'6',name:'Half-Yearly'},{Value:'12',name:'Yearly'}]
  isdisabled:boolean=true;
  arrayValueOne:any;
  // arrayValueOne:any=[{Value:'1',name:'Jan-Dec'},{Value:'2',name:' Apr-Mar'}]
  arrayValuesDefalult:any=[{value:'1',name:'Yes'},{value:'0',name:'No'}]
  arrayValuesWeek:any=[{Value:'1',name:'Yes'},{Value:'0',name:'No'}];
  displayedColumns: string[] = ['sno','configurationrules','data','addditionalinformation'];
  displayedColumns4: string[] = ['sno','configurationrules','data','addditionalinformation','actions'];
  displayedColumns3: any=[];
  displayedColumns2: string[] = ['leavetypename','displayname','daysperyear','color','status','action'];
  leaveConfigure: any;
  leaveId: any;
  editLeaveInfo: any;
  leaveConfig: any;
  advanceflag:boolean=true;
  isLeaveColorAlreadyExists:boolean=false;
  isadvanceLeveflag:boolean=false;
  DEDUCTION :boolean=false;
  INCLUDED:boolean=false;
  MAIL:boolean=false;
  BACKDATED:boolean=false;


  leaveMaxCapForOneInstance:boolean=false;
  leaveCreditFrequence:boolean=false;
  leaveWeekendsIncluded:boolean=false;
  leaveMaxCountPerYear:boolean=false;
  leaveMinServiceEligibility:boolean=false;
  leaveMinDaysPriorApplication:boolean=false;
  leaveCompanyHolidaysIncluded:boolean=false;
  leaveCountToBeCarried:boolean=false;
  leaveEncashmentMinCounteligibility:boolean=false;
  leaveMaxAvailCount:boolean=false;
  sickLeavesMinDays:boolean=false;
  leavesMinDaysForDocumentUpload:boolean=false;
  leavesGapBeetweenTerms:boolean=false;
  leavesEligibleOnWeekends:boolean=false;
  leavesEligibleOnCompanyHolidays:boolean=false;
  leavesLapsePeriod:boolean=false;
  leavesLapsedConversionToPerksApplicable:boolean=false;
  leavesEligibletyMinimumHours:boolean=false;
  maxAvailCount:boolean=false;
  leavesMaxCountPerter:boolean=false;
  isactivate:boolean=true;
  isdeactivate:boolean=false;
  disble:boolean=false;
  addadvanced:boolean=false;
  LMS139:any;

  compoffMinWorkingHoursForEligibility:boolean=false;
  compoffMaxBackDatedDayspermittedForSubmission:boolean=false;
  compoffThresholdDaysToLapesOrConvertLeavesToPerks:boolean=false;
  ispredefined:boolean=false;


  constructor(private location:Location,private LM: LeavePoliciesService, private router: Router, private ts: LoginService, private dialog: MatDialog, private formBuilder: FormBuilder,) {
    this.datas = this.location.getState();
    this.getLeaveCycleYearOptions();
  }

  ngOnInit(): void {
    this.getLeaveTypesForCarryForword()
    this.getErrorMessages('LM1')
    this.getErrorMessages('LM2')
    this.getErrorMessages('LM3')
    this.getErrorMessages('LM23')
    this.getErrorMessages('LM21')
    this.getErrorMessages('LM22')
    this.getErrorMessages('LM110')
    this.getErrorMessages('LM111')
    this.getErrorMessages('LM133')
    this.getErrorMessages('LM134')
    this.getErrorMessages('LM135')
    this.getErrorMessages('LM139')
    this.getLeaveRules();
    this.getLeavesTypeInfo();
    this.getLeaveTypesToAdd();
    this.getAdvancedLeavetypes();
    this.leavepoliciesForm=this.formBuilder.group(
      {
      leavecycleyear: [""],
      email: ["",],
      pastdays: ["",Validators.required],
      carrayForwordLeaveTypeId:["",],
      maxLeavesCarrayForwordValue:['',]

    });

    this.getCarryforwardedLeaveMaxCount(2)
    this.addleaveForm = this.formBuilder.group({
      displayname:["",Validators.required],
      leaveid:["",Validators.required],
      advancedleaveid:["",Validators.required],
      leavecolor:["",Validators.required],
      pastdays:["",Validators.required],
      LEAVES_MAX_COUNT_PER_YEAR:["",Validators.required],
      data:["",Validators.required],
      maxcapyear:["",Validators.required],
      LEAVES_CREDIT_FREQUENCY:["",Validators.required],
      LEAVES_WEEKENDS_INCLUDED:["",Validators.required],
      LEAVES_COMPANY_HOLIDAYS_INCLUDED:["",Validators.required],
      LEAVES_MAX_CAP_FOR_ONE_INSTANCE:["",Validators.required],
      LEAVES_MIN_SERVICE_ELIGIBILITY:["",Validators.required],
      LEAVES_MIN_DAYS_PRIOR_APPLICATION:["",Validators.required],
      LEAVES_COUNT_TO_BE_CARRIED_FORWARD:["",Validators.required],
      LEAVES_MAX_AVAIL_COUNT:["",Validators.required],
      LEAVES_MIN_DAYS_FOR_DOCUMENT_UPLOAD:["",Validators.required],
      LEAVES_GAP_BETWEEN_TERMS:["",Validators.required],
      MAX_AVAIL_COUNT:["",Validators.required],
      LEAVES_MAX_COUNT_PER_TERM:["",Validators.required],
      LEAVES_ELIGIBLE_ON_WEEKOFFS:["",Validators.required],
      LEAVES_ELIGIBILITY_MINIMUM_HOURS:["",Validators.required],
      LEAVES_ENCASHMENT_MIN_COUNT_ELIGIBILITY:["",Validators.required],
      SICK_LEAVES_MIN_DAYS_PRIOR_APPLICATION_FOR_KNOWN_AILMENTS:["",Validators.required],
      LEAVES_ELIGIBLE_ON_COMPANY_HOLIDAYS:["",Validators.required],
      LEAVES_LAPSE_PERIOD:["",Validators.required],
      LEAVES_LAPSED_CONVERSION_TO_PERKS_APPLICABLE:["",Validators.required],
      COMPOFF_MIN_WORKING_HOURS_FOR_ELIGIBILITY:["",Validators.required],
      COMPOFF_MAX_BACKDATED_DAYS_PERMITTED_FOR_SUBMISSION:["",Validators.required],
      COMPOFF_THRESHOLD_DAYS_TO_LAPSE_OR_CONVERT_LEAVES_TO_PERKS:["",Validators.required],
      LEAVETYPE_THAT_CAN_BE_AVAILED_IN_ADVANCE:["",Validators.required]


    });
    this.addleaveForm.get('leavecolor')?.valueChanges.subscribe((selectedValue:any) => {
      this.setleavecolor = "rgb("+this.hexToRgb(selectedValue)+")"
      this.checkLeaveTypes(this.addleaveForm.controls.leaveid.value,this.setleavecolor);
    });
    this.addleaveForm.get('LEAVES_MAX_COUNT_PER_YEAR')?.valueChanges.subscribe((selectedValue:any) => {
      this.istoggle = false;
    });
    this.addleaveForm.get('LEAVES_CREDIT_FREQUENCY')?.valueChanges.subscribe((selectedValue:any) => {
      if(selectedValue == '12' ){
      this.LM.getLeavePolicies(1, false, 1, 100).subscribe((result) => {
          let info = JSON.parse(result.data[0].json);
        if(result){
          if(info[0].value == this.addleaveForm.controls.leaveid.value ){
            this.isCreditfrequence=false;

               }else{
            this.isCreditfrequence=true;
          }
        }

      })
    }else{
      this.isCreditfrequence=true;

    }

      this.istoggle = false;
    });
    this.addleaveForm.get('LEAVES_WEEKENDS_INCLUDED')?.valueChanges.subscribe((selectedValue:any) => {
      this.istoggle = false;
    });

    this.addleaveForm.get('LEAVES_COMPANY_HOLIDAYS_INCLUDED')?.valueChanges.subscribe((selectedValue:any) => {
      this.istoggle = false;
    });
    this.addleaveForm.get('LEAVES_MAX_CAP_FOR_ONE_INSTANCE')?.valueChanges.subscribe((selectedValue:any) => {
      this.istoggle = false;
    });
    this.addleaveForm.get('LEAVES_MIN_SERVICE_ELIGIBILITY')?.valueChanges.subscribe((selectedValue:any) => {
      this.istoggle = false;
    });
    this.addleaveForm.get('LEAVES_MIN_DAYS_PRIOR_APPLICATION')?.valueChanges.subscribe((selectedValue:any) => {
      this.istoggle = false;
    });
    this.addleaveForm.get('LEAVES_COUNT_TO_BE_CARRIED_FORWARD')?.valueChanges.subscribe((selectedValue:any) => {
      this.istoggle = false;
    });
    this.addleaveForm.get('LEAVES_MAX_AVAIL_COUNT')?.valueChanges.subscribe((selectedValue:any) => {
      this.istoggle = false;
    });
    this.addleaveForm.get('LEAVES_MIN_DAYS_FOR_DOCUMENT_UPLOAD')?.valueChanges.subscribe((selectedValue:any) => {
      this.istoggle = false;
    });
    this.addleaveForm.get('LEAVES_GAP_BETWEEN_TERMS')?.valueChanges.subscribe((selectedValue:any) => {
      this.istoggle = false;
    });
    this.addleaveForm.get('MAX_AVAIL_COUNT')?.valueChanges.subscribe((selectedValue:any) => {
      this.istoggle = false;
    });
    this.addleaveForm.get('LEAVES_MAX_COUNT_PER_TERM')?.valueChanges.subscribe((selectedValue:any) => {
      this.istoggle = false;
    });
    this.addleaveForm.get('LEAVES_ELIGIBLE_ON_WEEKOFFS')?.valueChanges.subscribe((selectedValue:any) => {
      this.istoggle = false;
    });
    this.addleaveForm.get('LEAVES_ELIGIBILITY_MINIMUM_HOURS')?.valueChanges.subscribe((selectedValue:any) => {
      this.istoggle = false;
    });
    this.addleaveForm.get('LEAVES_ENCASHMENT_MIN_COUNT_ELIGIBILITY')?.valueChanges.subscribe((selectedValue:any) => {
      this.istoggle = false;
    });
    this.addleaveForm.get('SICK_LEAVES_MIN_DAYS_PRIOR_APPLICATION_FOR_KNOWN_AILMENTS')?.valueChanges.subscribe((selectedValue:any) => {
      this.istoggle = false;
    });
    this.addleaveForm.get('LEAVES_ELIGIBLE_ON_COMPANY_HOLIDAYS')?.valueChanges.subscribe((selectedValue:any) => {
      this.istoggle = false;
    });
    this.addleaveForm.get('LEAVES_LAPSE_PERIOD')?.valueChanges.subscribe((selectedValue:any) => {
      this.istoggle = false;
    });
    this.addleaveForm.get('LEAVES_LAPSED_CONVERSION_TO_PERKS_APPLICABLE')?.valueChanges.subscribe((selectedValue:any) => {
      this.istoggle = false;
    });
    this.addleaveForm.get('COMPOFF_MIN_WORKING_HOURS_FOR_ELIGIBILITY')?.valueChanges.subscribe((selectedValue:any) => {
      this.istoggle = false;
    });
    this.addleaveForm.get('COMPOFF_MAX_BACKDATED_DAYS_PERMITTED_FOR_SUBMISSION')?.valueChanges.subscribe((selectedValue:any) => {
      this.istoggle = false;
    });
    this.addleaveForm.get('COMPOFF_THRESHOLD_DAYS_TO_LAPSE_OR_CONVERT_LEAVES_TO_PERKS')?.valueChanges.subscribe((selectedValue:any) => {
      this.istoggle = false;
    });
    this.addleaveForm.get('LEAVETYPE_THAT_CAN_BE_AVAILED_IN_ADVANCE')?.valueChanges.subscribe((selectedValue:any) => {
      this.istoggle = false;
    });
    this.addleaveForm.get('advancedleaveid')?.valueChanges.subscribe((selectedValue:any) => {
      this.addadvanced=true;
      // this.changeLeaveType(selectedValue,null);
      // this.addleaveForm.controls.leavecolor.disable();
      // this.addleaveForm.controls.pastdays.disable();
      // this.addleaveForm.controls.LEAVES_MAX_COUNT_PER_YEAR.disable();
      // this.addleaveForm.controls.data.disable();
      // this.addleaveForm.controls.maxcapyear.disable();
      // this.addleaveForm.controls.LEAVES_CREDIT_FREQUENCY.disable();
      // this.addleaveForm.controls.LEAVES_WEEKENDS_INCLUDED.disable();
      // this.addleaveForm.controls.LEAVES_COMPANY_HOLIDAYS_INCLUDED.disable();
      // this.addleaveForm.controls.LEAVES_MAX_CAP_FOR_ONE_INSTANCE.disable();
      // this.addleaveForm.controls.LEAVES_MIN_SERVICE_ELIGIBILITY.disable();
      // this.addleaveForm.controls.LEAVES_MIN_DAYS_PRIOR_APPLICATION.disable();
      // this.addleaveForm.controls.LEAVES_COUNT_TO_BE_CARRIED_FORWARD.disable();
      // this.addleaveForm.controls.LEAVES_MAX_AVAIL_COUNT.disable();
      // this.addleaveForm.controls.LEAVES_MIN_DAYS_FOR_DOCUMENT_UPLOAD.disable();
      // this.addleaveForm.controls.LEAVES_GAP_BETWEEN_TERMS.disable();
      // this.addleaveForm.controls.MAX_AVAIL_COUNT.disable();
      // this.addleaveForm.controls.LEAVES_MAX_COUNT_PER_TERM.disable();
      // this.addleaveForm.controls.LEAVES_ELIGIBLE_ON_WEEKOFFS.disable();
      // this.addleaveForm.controls.LEAVES_ELIGIBILITY_MINIMUM_HOURS.disable();

      // this.addleaveForm.controls.LEAVES_ENCASHMENT_MIN_COUNT_ELIGIBILITY.disable();
      // this.addleaveForm.controls.SICK_LEAVES_MIN_DAYS_PRIOR_APPLICATION_FOR_KNOWN_AILMENTS.disable();
      // this.addleaveForm.controls.LEAVES_ELIGIBLE_ON_COMPANY_HOLIDAYS.disable();
      // this.addleaveForm.controls.LEAVES_LAPSE_PERIOD.disable();
      // this.addleaveForm.controls.LEAVES_LAPSED_CONVERSION_TO_PERKS_APPLICABLE.disable();
      // this.addleaveForm.controls.COMPOFF_MIN_WORKING_HOURS_FOR_ELIGIBILITY.disable();
      // this.addleaveForm.controls.COMPOFF_MAX_BACKDATED_DAYS_PERMITTED_FOR_SUBMISSION.disable();
      // this.addleaveForm.controls.COMPOFF_THRESHOLD_DAYS_TO_LAPSE_OR_CONVERT_LEAVES_TO_PERKS.disable();
      // this.displayedColumns3 =  selectedValue > 11 ? this.displayedColumns4 : this.displayedColumns4.filter(column => column !== 'actions');
    })
    this.addleaveForm.get('leaveid')?.valueChanges.subscribe((selectedValue:any) => {
      if( !this.editingleavetype ){
        for(let i=0;i<=this.leaveTypes.length;i++){
          if(selectedValue==this.leaveTypes[i].id){
            if(this.leaveTypes[i].is_new == 1){
              this.isnewleave= true;
              break;
            }else if(this.leaveTypes[i].is_new == 0){
              this.isnewleave=false;
              break;
            }
          }
        }

      }
      
      if(selectedValue==6 || selectedValue==7){
        this.isterm=false;
      }

      this.tabledata = true;
      if (selectedValue <= 10){
        this.actionflag=false;
      }
      else{
        this.addleaveForm.controls.leavecolor.disable();
        this.addleaveForm.controls.pastdays.disable();
        this.addleaveForm.controls.LEAVES_MAX_COUNT_PER_YEAR.disable();
        this.addleaveForm.controls.data.disable();
        this.addleaveForm.controls.maxcapyear.disable();
        this.addleaveForm.controls.LEAVES_CREDIT_FREQUENCY.disable();
        this.addleaveForm.controls.LEAVES_WEEKENDS_INCLUDED.disable();
        this.addleaveForm.controls.LEAVES_COMPANY_HOLIDAYS_INCLUDED.disable();
        this.addleaveForm.controls.LEAVES_MAX_CAP_FOR_ONE_INSTANCE.disable();
        this.addleaveForm.controls.LEAVES_MIN_SERVICE_ELIGIBILITY.disable();
        this.addleaveForm.controls.LEAVES_MIN_DAYS_PRIOR_APPLICATION.disable();
        this.addleaveForm.controls.LEAVES_COUNT_TO_BE_CARRIED_FORWARD.disable();
        this.addleaveForm.controls.LEAVES_MAX_AVAIL_COUNT.disable();
        this.addleaveForm.controls.LEAVES_MIN_DAYS_FOR_DOCUMENT_UPLOAD.disable();
        this.addleaveForm.controls.LEAVES_GAP_BETWEEN_TERMS.disable();
        this.addleaveForm.controls.MAX_AVAIL_COUNT.disable();
        this.addleaveForm.controls.LEAVES_MAX_COUNT_PER_TERM.disable();
        this.addleaveForm.controls.LEAVES_ELIGIBLE_ON_WEEKOFFS.disable();
        this.addleaveForm.controls.LEAVES_ELIGIBILITY_MINIMUM_HOURS.disable();

        this.addleaveForm.controls.LEAVES_ENCASHMENT_MIN_COUNT_ELIGIBILITY.disable();
        this.addleaveForm.controls.SICK_LEAVES_MIN_DAYS_PRIOR_APPLICATION_FOR_KNOWN_AILMENTS.disable();
        this.addleaveForm.controls.LEAVES_ELIGIBLE_ON_COMPANY_HOLIDAYS.disable();
        this.addleaveForm.controls.LEAVES_LAPSE_PERIOD.disable();
        this.addleaveForm.controls.LEAVES_LAPSED_CONVERSION_TO_PERKS_APPLICABLE.disable();
        this.addleaveForm.controls.COMPOFF_MIN_WORKING_HOURS_FOR_ELIGIBILITY.disable();
        this.addleaveForm.controls.COMPOFF_MAX_BACKDATED_DAYS_PERMITTED_FOR_SUBMISSION.disable();
        this.addleaveForm.controls.COMPOFF_THRESHOLD_DAYS_TO_LAPSE_OR_CONVERT_LEAVES_TO_PERKS.disable();
        this.actionflag = true;
      }
      for(let i=0;i<this.leaveTypes.length;i++){
        if(this.leaveTypes[i].id == selectedValue){
          this.addleaveForm.controls.displayname.setValue(this.leaveTypes[i].display_name);
          break;
        }

      }
      if(selectedValue == 1){
        this.isadvanced = true;
        this.tabledata=false;
      }
      else{
        this.isadvanced = false;
        this.displayedColumns3 =  selectedValue > 10 ? this.displayedColumns4 : this.displayedColumns4.filter(column => column !== 'actions');
      }
      if(selectedValue!=1){
      this.changeLeaveType(selectedValue,null);
      }
    })

    this.leavepoliciesForm.get('carrayForwordLeaveTypeId')?.valueChanges.subscribe((selectedValue:any) => {
      this.getCarryforwardedLeaveMaxCount(selectedValue);
    });

  }
  setadvanceleavepolicies(){
    let data ={
      id:this.addleaveForm.controls.advancedleaveid.value
    }
    let advancedata ={
      leaveId: this.addleaveForm.controls.leaveid.value,
      advancedLeaveId: this.addleaveForm.controls.advancedleaveid.value,
      displayName: this.addleaveForm.controls.displayname.value

    }



    this.LM.updateLeaveDisplayName(advancedata).subscribe((data)=>{})


    this.LM.setAdvancedLeaveRuleValues(data).subscribe((result)=>{
      if(result.status){
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: this.msgLM133
        });
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate(["/Admin/Leavepolicies"]));

      }
      else{
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: this.msgLM134
        });

      }
    })

  }
  /**Common leave rules */
  getLeaveRules() {
    this.LM.getLeavePolicies(null,true,1,10).subscribe((result) => {

      this.defaultRuleInfo=JSON.parse(result.data[0].json);
      for (let obj of this.defaultRuleInfo) {
        if(obj.status === "Inactive"){
          obj.isselected= false;

        }else{
          obj.isselected = true;

        }

        obj.isValidate = false;
      }
      this.dataSource = new MatTableDataSource(this.defaultRuleInfo);

    })
  }
  /**Edit time get leavetypes */
  getLeavesDetailsedit(leave:any) {
    this.isaddnewleave = false;
    this.leaveTypes =[];
    this.LM.getLeaveDetails('lm_leavesmaster','Active',1,100).subscribe((result) =>{
      if(result.status) {
        this.leaveTypes = result.data;
        this.editLeaveInfo = leave;
        this.isaddnew=false;
        this.isaddnewleave=true;
        this.isdeactivate = true;
        this.isactivate =false;
       this.isnewleave= true;
        this.addleaveForm.controls.leaveid.setValue(leave.id)
        this.addleaveForm.controls.leaveid.disable()
         // this.advansed = this.getAdvancedLeavetypes();
        // if (this.advanceLeavetypes && this.advanceLeavetypes.length == 0){
        //   this.leaveTypes.shift();
        // }
      }
    });
  }
  /**leavetype dropdown */
  getLeavesDetails() {
    this.LM.getLeaveDetails('lm_leavesmaster','Inactive',1,100).subscribe((result) =>{
      if(result.status) {
        this.leaveTypes = result.data;
         // this.advansed = this.getAdvancedLeavetypes();
        // if (this.advanceLeavetypes && this.advanceLeavetypes.length == 0){
        //   this.leaveTypes.shift();
        // }
      }
    });
  }
  
// /api/getLeaveTypesToAdd/:companyNam
/**getLeaveTypesToAdd for drop down for leavetype add and activate */
getLeaveTypesToAdd() {
  this.LM.getLeaveTypesToAdd().subscribe((result) =>{
    this.leaveTypes =[];
    if(result.status) {
      this.leaveTypes = result.data;
       // this.advansed = this.getAdvancedLeavetypes();
      // if (this.advanceLeavetypes && this.advanceLeavetypes.length == 0){
      //   this.leaveTypes.shift();
      // }
    }
  });
}
  cancelLeave(){
    // this.isShowLeaveConfigure = !this.isShowLeaveConfigure;
    // this.defaultrules=true;
    // this.isEditLeaveType= false;
    // this.isShowCustomLeave=false;
    // this.leaveConfigure.leaveId='';
    // this.leaveConfigure.displayName = '';
    // this.ruleInfo = [];
  }

  /**Active and Inactive leavetypes */
  setLeaveStatus(data:any){
    if(data){
      var info = {
        id: this.addleaveForm.controls.leaveid.value,
        leavetype_status:'Active'
      }

    }
    else{
      var info = {
        id: this.addleaveForm.controls.leaveid.value,
        leavetype_status:'Inactive'
      }

    }
      this.LM.setToggleLeaveType(info).subscribe((data) => {

          if(data.status && info.leavetype_status == 'Inactive'){
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position:{top:`70px`},
              disableClose: true,
              data: this.msgLM135
            });
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
              this.router.navigate(["/Admin/Leavepolicies"]));
          }
          else if(data.status && info.leavetype_status == 'Active'){
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position:{top:`70px`},
              disableClose: true,
              data: this.msgLM133
            });
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
              this.router.navigate(["/Admin/Leavepolicies"]));
            this.cancelLeave()

              this.ngOnInit();
          }
          // else {
          //     if(this.isEditLeaveType) {
          //         this.toastr.error(this.msgLM41)
          //     }
          //     else {
          //         this.toastr.error(this.msgLM40)
          //     }
          // }
      });
  }
  /** */
  validateCustomLeave(ruleData:any){
    var valid:boolean = true;
    var validLeaveCreditFrequence:boolean=true;
    var validLeaveWeekendsIncluded:boolean = true;
    var validLeaveMaxCountPerYear:boolean = true;
    var validLeaveMinServiceEligibility:boolean = true;
    var validLeaveMinDaysPriorApplication:boolean = true;
    var validLeaveCompanyHolidaysIncluded:boolean = true;
    var validLeaveCountToBeCarried:boolean = true;
    var validLeaveEncashmentMinCounteligibility:boolean = true;
    var validLeaveMaxAvailCount :boolean = true;
    var validSickLeavesMinDays:boolean = true;
    var validLeavesMinDaysForDocumentUpload:boolean = true;
    var validLeavesGapBeetweenTerms:boolean = true;
    var validLeavesEligibleOnWeekends:boolean = true;
    var validLeavesEligibleOnCompanyHolidays:boolean = true;
    var validLeavesLapsePeriod:boolean = true;
    var validLeavesLapsedConversionToPerksApplicable:boolean = true;
    var validLeavesEligibletyMinimumHours:boolean = true;
    var validMaxAvailCount:boolean = true;
    var validLeavesMaxCountPerter:boolean=true;
    var validCompoffMinWorkingHoursForEligibility:boolean = true;
    var validCompoffMaxBackDatedDayspermittedForSubmission:boolean = true;
    var validCompoffThresholdDaysToLapesOrConvertLeavesToPerks:boolean = true;
    for(let obj of ruleData){

      if((obj.value === null && this.istoggle)||(obj.value === '' && this.istoggle) ){
        if(obj.rulename == 'LEAVES_MAX_CAP_FOR_ONE_INSTANCE'){
          valid = false;
          this.leaveMaxCapForOneInstance = true;
        }else if(obj.rulename == 'LEAVES_CREDIT_FREQUENCY'){
            validLeaveCreditFrequence = false;
          this.leaveCreditFrequence = true;
        }else if(obj.rulename == 'LEAVES_WEEKENDS_INCLUDED'){
          validLeaveWeekendsIncluded = false;
          this.leaveWeekendsIncluded = true;
        }else if(obj.rulename == 'LEAVES_MAX_COUNT_PER_YEAR'){
           validLeaveMaxCountPerYear = false;
          this.leaveMaxCountPerYear = true;

        }else if(obj.rulename == 'LEAVES_MIN_SERVICE_ELIGIBILITY'){
           validLeaveMinServiceEligibility = false;
          this.leaveMinServiceEligibility = true;

        }else if(obj.rulename == 'LEAVES_MIN_DAYS_PRIOR_APPLICATION'){
          validLeaveMinDaysPriorApplication = false;
          this.leaveMinDaysPriorApplication = true;



        }else if(obj.rulename == 'LEAVES_COMPANY_HOLIDAYS_INCLUDED'){
          validLeaveCompanyHolidaysIncluded = false;
          this.leaveCompanyHolidaysIncluded = true;


        }else if(obj.rulename == 'LEAVES_COUNT_TO_BE_CARRIED_FORWARD'){
          validLeaveCountToBeCarried = false;
          this.leaveCountToBeCarried= true;

        }else if(obj.rulename == 'LEAVES_ENCASHMENT_MIN_COUNT_ELIGIBILITY'){
          validLeaveEncashmentMinCounteligibility = false;
          this.leaveEncashmentMinCounteligibility = true;

        }else if(obj.rulename == 'LEAVES_MAX_AVAIL_COUNT'){
          validLeaveMaxAvailCount= false;
          this.leaveMaxAvailCount = true;

        }else if(obj.rulename == 'SICK_LEAVES_MIN_DAYS_PRIOR_APPLICATION_FOR_KNOWN_AILMENTS'){
          validSickLeavesMinDays= false;
          this.sickLeavesMinDays = true;

        }else if(obj.rulename == 'LEAVES_MIN_DAYS_FOR_DOCUMENT_UPLOAD'){
          validLeavesMinDaysForDocumentUpload= false;
          this.leavesMinDaysForDocumentUpload = true;

        }else if(obj.rulename == 'LEAVES_GAP_BETWEEN_TERMS'){
          validLeavesGapBeetweenTerms= false;
          this.leavesGapBeetweenTerms = true;

        }else if(obj.rulename == 'LEAVES_ELIGIBLE_ON_WEEKENDS'){
          validLeavesEligibleOnWeekends= false;
          this.leavesEligibleOnWeekends = true;

        }else if(obj.rulename == 'LEAVES_ELIGIBLE_ON_COMPANY_HOLIDAYS'){
          validLeavesEligibleOnCompanyHolidays= false;
          this.leavesEligibleOnCompanyHolidays = true;

        }else if(obj.rulename == 'LEAVES_LAPSE_PERIOD'){
          validLeavesLapsePeriod= false;
          this.leavesLapsePeriod = true;



        }else if(obj.rulename == 'LEAVES_LAPSED_CONVERSION_TO_PERKS_APPLICABLE'){
          validLeavesLapsedConversionToPerksApplicable= false;
          this.leavesLapsedConversionToPerksApplicable = true;

        }else if(obj.rulename == 'LEAVES_ELIGIBILITY_MINIMUM_HOURS'){
          validLeavesEligibletyMinimumHours= false;
          this.leavesEligibletyMinimumHours = true;

        }else if(obj.rulename == 'MAX_AVAIL_COUNT'){
          validMaxAvailCount= false;
          this.maxAvailCount = true;


        }else if(obj.rulename == 'LEAVES_MAX_COUNT_PER_TERM'){
          validLeavesMaxCountPerter= false;
          this.leavesMaxCountPerter = true;


        }else if(obj.rulename == 'COMPOFF_MIN_WORKING_HOURS_FOR_ELIGIBILITY'){
          validCompoffMinWorkingHoursForEligibility= false;
          this.compoffMinWorkingHoursForEligibility = true;

        }else if(obj.rulename == 'COMPOFF_MAX_BACKDATED_DAYS_PERMITTED_FOR_SUBMISSION'){
          validCompoffMaxBackDatedDayspermittedForSubmission= false;
          this.compoffMaxBackDatedDayspermittedForSubmission = true;

        }else if(obj.rulename == 'COMPOFF_THRESHOLD_DAYS_TO_LAPSE_OR_CONVERT_LEAVES_TO_PERKS'){
          validCompoffThresholdDaysToLapesOrConvertLeavesToPerks= false;
          this.compoffThresholdDaysToLapesOrConvertLeavesToPerks = true;

        }
        // return valid && validLeaveCreditFrequence && validLeaveWeekendsIncluded && validLeaveMaxCountPerYear && validLeaveMinServiceEligibility;

      }
      // else{
      //   valid = false;
      // }
    }
    var color = this.checkLeaveTypes(this.leaveId,ruleData[0].leavecolor)

    return valid && validLeaveCreditFrequence && validLeaveWeekendsIncluded && validLeaveMaxCountPerYear && validLeaveMinServiceEligibility  && validLeaveMinDaysPriorApplication && validLeaveCompanyHolidaysIncluded
           && validLeaveCountToBeCarried && validLeaveEncashmentMinCounteligibility && validLeaveMaxAvailCount && validSickLeavesMinDays && validLeavesMinDaysForDocumentUpload && validLeavesGapBeetweenTerms
           && validLeavesEligibleOnWeekends && validLeavesEligibleOnCompanyHolidays && validLeavesLapsePeriod && validLeavesLapsedConversionToPerksApplicable && validLeavesEligibletyMinimumHours && validMaxAvailCount
           && validLeavesMaxCountPerter && validCompoffMinWorkingHoursForEligibility && validCompoffMaxBackDatedDayspermittedForSubmission && validCompoffThresholdDaysToLapesOrConvertLeavesToPerks&&color;

  }
/**check leave color */
  checkLeaveTypes(id:any ,color:any)
  {

    var valid = true;
    for(let obj of  this.leavesTypeData){
      if(obj.id !== id && obj.leavecolor === color){
        if(obj.id == id && obj.leavecolor === color){
          this.isLeaveColorAlreadyExists = false;
        }else{
          this.isLeaveColorAlreadyExists = true;

        }


        // valid =false;
        valid =true;
        return valid;
      }else{
        // this.isLeaveColorAlreadyExists = true;
        this.isLeaveColorAlreadyExists = false;
      }

    }
    return valid;


  }

  /**advance leavetype dropdown*/
  getAdvancedLeavetypes(){
    this.LM.getleavetypesforadvancedleave().subscribe((result) => {
      if(result.status) {
        this.advanceLeavetypes = result.data;
      }
    });
  }
  /**Edit active status leave */
  editLeaveTypeName(leave: any) {
    this.addBtn2 = false;
    this.isnewleave= true;
    this.editingleavetype = true;
    if(leave.id == 1){
      this.getLeavesDetailsedit(leave);
      this.LM.getLeavePolicies(leave.id, false, 1, 100).subscribe((result) => {
        let data = JSON.parse(result.data[0].json)
        this.addleaveForm.controls.leaveid.setValue(leave.id)
        this.addleaveForm.controls.advancedleaveid.setValue(data[0].value)
        this.editLeaveInfo = leave;
        this.isaddnew=false;
        this.isaddnewleave=true;
        this.isdeactivate = true;
        this.isactivate =false;
      })
      this.displayedColumns3 = leave.id > 11 ? this.displayedColumns4 : this.displayedColumns4.filter(column => column !== 'actions');
    }
    else{
      this.displayedColumns3 = leave.id > 11 ? this.displayedColumns4 : this.displayedColumns4.filter(column => column !== 'actions');
      this.leaveTypes=[];

        this.getLeavesDetailsedit(leave);

    }
     // if(leave.id!=1){
    // }

    // this.defaultRuleInfo




  }

  getLeaveFormatedValue(value:any)
  {

   return this.leaveTypes.find(function(element:any){
      if(element.id == value){
        return element;
      }
    });
  }
  /**setleavepolicies */
  setleavepolicies(){
    if(this.addleaveForm.controls.displayname.valid){
      var infodata = {
        id: this.addleaveForm.controls.leaveid.value,
        leavetype_status:'Active'
      }
      this.leaveConfig = this.getLeaveFormatedValue(this.addleaveForm.controls.leaveid.value);
     for(let i=0;i<this.ruleInfos.length;i++){
      this.ruleInfos[i].leavecolor = this.setleavecolor;
      if(this.ruleInfos[i].effectivefromdate == null) {
        this.ruleInfos[i].isFromDate = 0;
      }
      else if(this.ruleInfos[i].effectivefromdate != null) {
        this.ruleInfos[i].isFromDate = 1;
      }
      if(this.ruleInfos[i].effectivetodate == null) {
        this.ruleInfos[i].isToDate = 0;
      }
      else if(this.ruleInfos[i].effectivetodate != null) {
        this.ruleInfos[i].isToDate = 1;
      }
      delete this.ruleInfos[i].effectivefromdate;
      delete this.ruleInfos[i].effectivetodate;
      if(this.ruleInfos[i].rulename === "MAX_AVAIL_COUNT" && this.addleaveForm.controls.MAX_AVAIL_COUNT.value !=null ){
        this.ruleInfos[i].value = this.addleaveForm.controls.MAX_AVAIL_COUNT.value;
        this.ruleInfos[i].leavecolor = this.setleavecolor;
        this.ruleInfos[i].status = "Active";
      }
      else if(this.ruleInfos[i].rulename ===  "LEAVES_GAP_BETWEEN_TERMS" && this.addleaveForm.controls.LEAVES_GAP_BETWEEN_TERMS.value !=null){
        this.ruleInfos[i].leavecolor = this.setleavecolor;
        this.ruleInfos[i].value =this.addleaveForm.controls.LEAVES_GAP_BETWEEN_TERMS.value;
        this.ruleInfos[i].status = "Active"
      }
      else if(this.ruleInfos[i].rulename === "LEAVES_MAX_COUNT_PER_TERM" && this.addleaveForm.controls.LEAVES_MAX_COUNT_PER_TERM.value!=null){
        this.ruleInfos[i].leavecolor = this.setleavecolor;
        this.ruleInfos[i].value =this.addleaveForm.controls.LEAVES_MAX_COUNT_PER_TERM.value;
        this.ruleInfos[i].status = "Active"
      }
      else if(this.ruleInfos[i].rulename === "LEAVES_CREDIT_FREQUENCY" && this.addleaveForm.controls.LEAVES_CREDIT_FREQUENCY.value!=null){
        this.ruleInfos[i].leavecolor = this.setleavecolor;
        this.ruleInfos[i].value = this.addleaveForm.controls.LEAVES_CREDIT_FREQUENCY.value;
        this.ruleInfos[i].status = "Active"
      }
      else if(this.ruleInfos[i].rulename === "LEAVES_WEEKENDS_INCLUDED" && this.addleaveForm.controls.LEAVES_WEEKENDS_INCLUDED.value!=null){
        this.ruleInfos[i].leavecolor = this.setleavecolor;
        this.ruleInfos[i].value = this.addleaveForm.controls.LEAVES_WEEKENDS_INCLUDED.value;
        this.ruleInfos[i].status = "Active"
      }
      else if(this.ruleInfos[i].rulename === "LEAVES_COMPANY_HOLIDAYS_INCLUDED" && this.addleaveForm.controls.LEAVES_COMPANY_HOLIDAYS_INCLUDED.value!=null){
        this.ruleInfos[i].leavecolor = this.setleavecolor;
        this.ruleInfos[i].value = this.addleaveForm.controls.LEAVES_COMPANY_HOLIDAYS_INCLUDED.value;
        this.ruleInfos[i].status = "Active"
      }
      else if(this.ruleInfos[i].rulename === "LEAVES_MAX_CAP_FOR_ONE_INSTANCE" && this.addleaveForm.controls.LEAVES_MAX_CAP_FOR_ONE_INSTANCE.value!=null ){
        this.ruleInfos[i].leavecolor = this.setleavecolor;
        this.ruleInfos[i].value = this.addleaveForm.controls.LEAVES_MAX_CAP_FOR_ONE_INSTANCE.value;
        this.ruleInfos[i].status = "Active"
      }
      else if(this.ruleInfos[i].rulename === "LEAVES_MIN_SERVICE_ELIGIBILITY" && this.addleaveForm.controls.LEAVES_MIN_SERVICE_ELIGIBILITY.value!=null){
        this.ruleInfos[i].leavecolor = this.setleavecolor;
        this.ruleInfos[i].value = this.addleaveForm.controls.LEAVES_MIN_SERVICE_ELIGIBILITY.value;
        this.ruleInfos[i].status = "Active"
      }
      else if(this.ruleInfos[i].rulename === "LEAVES_MIN_DAYS_PRIOR_APPLICATION" && this.addleaveForm.controls.LEAVES_MIN_DAYS_PRIOR_APPLICATION.value !=null){
        this.ruleInfos[i].leavecolor = this.setleavecolor;
        this.ruleInfos[i].value = this.addleaveForm.controls.LEAVES_MIN_DAYS_PRIOR_APPLICATION.value;
        this.ruleInfos[i].status = "Active"
      }
      else if(this.ruleInfos[i].rulename === "LEAVES_COUNT_TO_BE_CARRIED_FORWARD" && this.addleaveForm.controls.LEAVES_COUNT_TO_BE_CARRIED_FORWARD.value!=null){
        this.ruleInfos[i].leavecolor = this.setleavecolor;
        this.ruleInfos[i].value = this.addleaveForm.controls.LEAVES_COUNT_TO_BE_CARRIED_FORWARD.value;
        this.ruleInfos[i].status = "Active"
      }
      else if(this.ruleInfos[i].rulename === "LEAVES_MAX_AVAIL_COUNT" && this.addleaveForm.controls.LEAVES_MAX_AVAIL_COUNT.value!=null){
        this.ruleInfos[i].leavecolor = this.setleavecolor;
        this.ruleInfos[i].value = this.addleaveForm.controls.LEAVES_MAX_AVAIL_COUNT.value;
        this.ruleInfos[i].status = "Active"
      }
      else if(this.ruleInfos[i].rulename === "LEAVES_MIN_DAYS_FOR_DOCUMENT_UPLOAD" && this.addleaveForm.controls.LEAVES_MIN_DAYS_FOR_DOCUMENT_UPLOAD.value!=null){
        this.ruleInfos[i].leavecolor = this.setleavecolor;
        this.ruleInfos[i].value = this.addleaveForm.controls.LEAVES_MIN_DAYS_FOR_DOCUMENT_UPLOAD.value;
        this.ruleInfos[i].status = "Active"
      }
      else if(this.ruleInfos[i].rulename === "LEAVES_ELIGIBLE_ON_WEEKOFFS" && this.addleaveForm.controls.LEAVES_ELIGIBLE_ON_WEEKOFFS.value!=null){
        this.ruleInfos[i].leavecolor = this.setleavecolor;
        this.ruleInfos[i].value = this.addleaveForm.controls.LEAVES_ELIGIBLE_ON_WEEKOFFS.value;
        this.ruleInfos[i].status = "Active"
      }
      else if(this.ruleInfos[i].rulename === "LEAVES_ELIGIBLE_ON_COMPANY_HOLIDAYS" && this.addleaveForm.controls.LEAVES_ELIGIBLE_ON_COMPANY_HOLIDAYS.value!=null){
        this.ruleInfos[i].leavecolor = this.setleavecolor;
        this.ruleInfos[i].value = this.addleaveForm.controls.LEAVES_ELIGIBLE_ON_COMPANY_HOLIDAYS.value;
        this.ruleInfos[i].status = "Active"
      }
      else if(this.ruleInfos[i].rulename === "LEAVES_LAPSED_CONVERSION_TO_PERKS_APPLICABLE" && this.addleaveForm.controls.LEAVES_LAPSED_CONVERSION_TO_PERKS_APPLICABLE.value!=null){
        this.ruleInfos[i].leavecolor = this.setleavecolor;
        this.ruleInfos[i].value = this.addleaveForm.controls.LEAVES_LAPSED_CONVERSION_TO_PERKS_APPLICABLE.value;
        this.ruleInfos[i].status = "Active"
      }
      else if(this.ruleInfos[i].rulename === "COMPOFF_MIN_WORKING_HOURS_FOR_ELIGIBILITY" && this.addleaveForm.controls.COMPOFF_MIN_WORKING_HOURS_FOR_ELIGIBILITY.value!=null){
        this.ruleInfos[i].leavecolor = this.setleavecolor;
        this.ruleInfos[i].value = this.addleaveForm.controls.COMPOFF_MIN_WORKING_HOURS_FOR_ELIGIBILITY.value;
        this.ruleInfos[i].status = "Active"
      }
      else if(this.ruleInfos[i].rulename === "COMPOFF_MAX_BACKDATED_DAYS_PERMITTED_FOR_SUBMISSION" && this.addleaveForm.controls.COMPOFF_MAX_BACKDATED_DAYS_PERMITTED_FOR_SUBMISSION.value!=null){
        this.ruleInfos[i].leavecolor = this.setleavecolor;
        this.ruleInfos[i].value = this.addleaveForm.controls.COMPOFF_MAX_BACKDATED_DAYS_PERMITTED_FOR_SUBMISSION.value;
        this.ruleInfos[i].status = "Active"
      }
      else if(this.ruleInfos[i].rulename === "COMPOFF_THRESHOLD_DAYS_TO_LAPSE_OR_CONVERT_LEAVES_TO_PERKS" && this.addleaveForm.controls.COMPOFF_THRESHOLD_DAYS_TO_LAPSE_OR_CONVERT_LEAVES_TO_PERKS.value!=null){
        this.ruleInfos[i].leavecolor = this.setleavecolor;
        this.ruleInfos[i].value = this.addleaveForm.controls.COMPOFF_THRESHOLD_DAYS_TO_LAPSE_OR_CONVERT_LEAVES_TO_PERKS.value;
        this.ruleInfos[i].status = "Active"
      }
      else if(this.ruleInfos[i].rulename === "LEAVES_MAX_COUNT_PER_YEAR" && this.addleaveForm.controls.LEAVES_MAX_COUNT_PER_YEAR.value!=null){
        this.ruleInfos[i].leavecolor = this.setleavecolor;
        this.ruleInfos[i].value = this.addleaveForm.controls.LEAVES_MAX_COUNT_PER_YEAR.value;
        this.ruleInfos[i].status = "Active"
      }
    }
    var info = {
      ruleData:this.ruleInfos
    };

    var datas = {
      leaveId:this.addleaveForm.controls.leaveid.value,
      displayName:this.addleaveForm.controls.displayname.value,
    }

    if(this.isCreditfrequence == false){
      let dialogRef = this.dialog.open(LeavePoliciesDialogComponent, {
        position:{top:`70px`},
        disableClose: true,
        data: {message:this.LMS139,YES:'YES',NO:'NO'}
      });
      dialogRef.afterClosed().subscribe(result => {
   
        if(result == 'YES'){
          this.submitLeavepolices(info,datas)
        }
        });
    }else{
      datas.leaveId<11?this.istoggle=true:'';
      this.submitLeavepolices(info,datas)
    }

    }
    

  }


  submitLeavepolices(info: any, datas: any) {

    if(!this.isLeaveColorAlreadyExists || this.editingleavetype){
      if( this.validateCustomLeave(info.ruleData)) {
        this.LM.updateLeaveDisplayName(datas).subscribe((data:any)=>{})
      // this.LM.setToggleLeaveType(infodata).subscribe((data) => {});
          this.LM.setLeaveConfigure(info).subscribe((data) => {
          if (data.status) {
            if(this.editingleavetype){
              let dialogRef = this.dialog.open(ReusableDialogComponent, {
                position:{top:`70px`},
                disableClose: true,
                data: this.msgLM111
              });
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
                      this.router.navigate(["/Admin/Leavepolicies"]));
            }
            else{
              let dialogRef = this.dialog.open(ReusableDialogComponent, {
                position:{top:`70px`},
                disableClose: true,
                data: this.msgLM133
              });
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
                      this.router.navigate(["/Admin/Leavepolicies"]));
            }
  
          }
          else {
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position:{top:`70px`},
              disableClose: true,
              data: this.msgLM134
            });
          }
        });
      }

    } else {
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position:{top:`70px`},
        disableClose: true,
        data: "This color already existed"
      });
    }
    
  }

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
    this.isaddnewleave=true;
  }
  cancelledleave(){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    this.router.navigate(["/Admin/Leavepolicies"]));
  }
  addnewleave(){
      let dialogRef = this.dialog.open(AddleavepopupComponent, {
        width: '350px',
        position: { top: `80px` },
        disableClose: true,
        data: { YES: 'YES', NO: 'NO' }

      })
      dialogRef.afterClosed().subscribe(result => {
      if (result == 'YES' || result == undefined) {
          this.getLeaveTypesToAdd();
        }
      });

  }
  /**toggle change */
  toglechange(event:any,element:any) {
    if(event.checked){

      this.addleaveForm.get(element.rulename).enable();
      this.istoggle = true;
    }


    else{
      this.addleaveForm.get(element.rulename).disable();
      this.istoggle = false;
    }
  }

  changeLeaveType(id:any,flag:any){

    this.leaveId = id;
      this.LM.getLeavePolicies(this.leaveId, false, 1, 100).subscribe((result) => {
        var ruleDetails = JSON.parse(result.data[0].json);
        this.ruleInfos = JSON.parse(result.data[0].json);

      this.rgbsplit(ruleDetails[0].leavecolor)
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
        this.ruleInfo.push({ruledescription:"Select unique color for each leave type",rulename:"leavecolor"})
        for(let i=0;i<this.ruleInfos.length;i++){
          if(this.ruleInfos[i].rulename === "MAX_AVAIL_COUNT"){
            this.addleaveForm.controls.MAX_AVAIL_COUNT.setValue(this.ruleInfos[i].value);

          }
          else if(this.ruleInfos[i].rulename ===  "LEAVES_GAP_BETWEEN_TERMS"){
             this.addleaveForm.controls.LEAVES_GAP_BETWEEN_TERMS.setValue(this.ruleInfos[i].value);
          }
          else if(this.ruleInfos[i].rulename === "LEAVES_MAX_COUNT_PER_TERM"){

           this.addleaveForm.controls.LEAVES_MAX_COUNT_PER_TERM.setValue(this.ruleInfos[i].value);
          }
          else if(this.ruleInfos[i].rulename === "LEAVES_CREDIT_FREQUENCY"){

            this.addleaveForm.controls.LEAVES_CREDIT_FREQUENCY.setValue(this.ruleInfos[i].value);
          }
          else if(this.ruleInfos[i].rulename === "LEAVES_WEEKENDS_INCLUDED"){

            this.addleaveForm.controls.LEAVES_WEEKENDS_INCLUDED.setValue(this.ruleInfos[i].value);
          }
          else if(this.ruleInfos[i].rulename === "LEAVES_COMPANY_HOLIDAYS_INCLUDED"){

             this.addleaveForm.controls.LEAVES_COMPANY_HOLIDAYS_INCLUDED.setValue(this.ruleInfos[i].value);
          }
          else if(this.ruleInfos[i].rulename === "LEAVES_MAX_CAP_FOR_ONE_INSTANCE"){

            this.addleaveForm.controls.LEAVES_MAX_CAP_FOR_ONE_INSTANCE.setValue(this.ruleInfos[i].value);
          }
          else if(this.ruleInfos[i].rulename === "LEAVES_MIN_SERVICE_ELIGIBILITY"){

            this.addleaveForm.controls.LEAVES_MIN_SERVICE_ELIGIBILITY.setValue(this.ruleInfos[i].value);
          }
          else if(this.ruleInfos[i].rulename === "LEAVES_MIN_DAYS_PRIOR_APPLICATION"){

            this.addleaveForm.controls.LEAVES_MIN_DAYS_PRIOR_APPLICATION.setValue(this.ruleInfos[i].value);
          }
          else if(this.ruleInfos[i].rulename === "LEAVES_COUNT_TO_BE_CARRIED_FORWARD"){

            this.addleaveForm.controls.LEAVES_COUNT_TO_BE_CARRIED_FORWARD.setValue(this.ruleInfos[i].value);
          }
          else if(this.ruleInfos[i].rulename === "LEAVES_MAX_AVAIL_COUNT"){

            this.addleaveForm.controls.LEAVES_MAX_AVAIL_COUNT.setValue(this.ruleInfos[i].value);
          }
          else if(this.ruleInfos[i].rulename === "LEAVES_MIN_DAYS_FOR_DOCUMENT_UPLOAD"){

            this.addleaveForm.controls.LEAVES_MIN_DAYS_FOR_DOCUMENT_UPLOAD.setValue(this.ruleInfos[i].value);
          }
          else if(this.ruleInfos[i].rulename === "LEAVES_ELIGIBLE_ON_WEEKOFFS"){

            this.addleaveForm.controls.LEAVES_ELIGIBLE_ON_WEEKOFFS.setValue(this.ruleInfos[i].value);
          }
          else if(this.ruleInfos[i].rulename === "LEAVES_ELIGIBLE_ON_COMPANY_HOLIDAYS"){

          this.addleaveForm.controls.LEAVES_ELIGIBLE_ON_COMPANY_HOLIDAYS.setValue(this.ruleInfos[i].value);
          }
          else if(this.ruleInfos[i].rulename === "LEAVES_LAPSED_CONVERSION_TO_PERKS_APPLICABLE"){

            this.addleaveForm.controls.LEAVES_LAPSED_CONVERSION_TO_PERKS_APPLICABLE.setValue(this.ruleInfos[i].value);
          }
          else if(this.ruleInfos[i].rulename === "COMPOFF_MIN_WORKING_HOURS_FOR_ELIGIBILITY"){

            this.addleaveForm.controls.COMPOFF_MIN_WORKING_HOURS_FOR_ELIGIBILITY.setValue(this.ruleInfos[i].value);
          }
          else if(this.ruleInfos[i].rulename === "COMPOFF_MAX_BACKDATED_DAYS_PERMITTED_FOR_SUBMISSION"){

          this.addleaveForm.controls.COMPOFF_MAX_BACKDATED_DAYS_PERMITTED_FOR_SUBMISSION.setValue(this.ruleInfos[i].value);
          }
          else if(this.ruleInfos[i].rulename === "COMPOFF_THRESHOLD_DAYS_TO_LAPSE_OR_CONVERT_LEAVES_TO_PERKS"){

            this.addleaveForm.controls.COMPOFF_THRESHOLD_DAYS_TO_LAPSE_OR_CONVERT_LEAVES_TO_PERKS.setValue(this.ruleInfos[i].value);
          }
          else if(this.ruleInfos[i].rulename === "LEAVES_MAX_COUNT_PER_YEAR"){

            this.addleaveForm.controls.LEAVES_MAX_COUNT_PER_YEAR.setValue(this.ruleInfos[i].value);
          }
        }
        this.addleaveForm.controls.leavecolor.setValue(this.rgbcolor);
        this.dataSource3 = new MatTableDataSource(this.ruleInfo);

        for(let objInfo of this.leaveTypes){
          if(objInfo.ispredefined && objInfo.status === 'Inactive' && objInfo.id == this.leaveId && this.ruleInfo[0].effectivefromdate != ''){
            this.ispredefined = objInfo.ispredefined;
            this.editLeaveInfo = objInfo;
          }else if(this.ruleInfo[0].effectivefromdate === ''){
          }else if(!objInfo.ispredefined){
          }
        }


      })
      // }else{

      // }
    // }

    }
    rgbsplit(data:any){
      let rgb = data.substring(4, data.length-1)
                  .replace(/ /g, '')
                  .split(',');
      this.rgbcolor = this.rgbToHex(parseInt(rgb[0]),parseInt(rgb[1]),parseInt(rgb[2]));
      this.addleaveForm.controls.leavecolor.setValue(this.rgbcolor);

    }
   rgbToHex(r:any, g:any, b:any) {
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
hexToRgb(hex:any) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if(result){
    var r= parseInt(result[1], 16);
    var g= parseInt(result[2], 16);
    var b= parseInt(result[3], 16);
    return r+","+g+","+b;//return 23,14,45 -> reformat if needed
}
  return null;
}


  /**save default rules*/
  saveDefaultrules() {
    

    if(this.validation()&& this.leavepoliciesForm.controls.pastdays.value !=''){
      for(let i=0;i<this.defaultRuleInfo.length;i++){
        if(this.defaultRuleInfo[i].rulename == "LEAVES_DURATION_FOR_BACKDATED_LEAVES"){
          this.defaultRuleInfo[i].value =this.leavepoliciesForm.controls.pastdays.value;
        }
        else if(this.defaultRuleInfo[i].rulename == "LEAVES_IS_MAIL_FACILITY_REQUIRED"){
          this.defaultRuleInfo[i].value =this.leavepoliciesForm.controls.email.value;
        }
        else if (this.defaultRuleInfo[i].rulename == "LEAVE_CYCLE_YEAR"){
          this.defaultRuleInfo[i].value =this.leavepoliciesForm.controls.leavecycleyear.value;
        }
        else if (this.defaultRuleInfo[i].rulename == "LEAVETYPE_FOR_WHICH_BALANCE_IS_TO_BE_CARRIED_FORWARD"){
          this.defaultRuleInfo[i].value =this.leavepoliciesForm.controls.activeLeaveTypesForCarryForword.value;
        }
        else if (this.defaultRuleInfo[i].rulename == "QUANTITY_OF_LEAVES_TO_BE_CARRIED_FORWARD"){
          this.defaultRuleInfo[i].value =this.leavepoliciesForm.controls.maxLeavesCarrayForwordValue.value;
        }

      }
      var info = {
        ruleData:this.defaultRuleInfo
      }

      this.LM.setLeaveConfigure(info).subscribe((data) => {
        /*  this.isEditLeaveType = false;*/
        this.getLeaveRules();
          if(data.status){
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position:{top:`70px`},
              disableClose: true,
              data: data.message
            });
              // this.toastr.success(data.message)

            this.isEditDefaultRules = false;
            this.addBtn1 = true;
            this.ngOnInit();
          }
          else {
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position:{top:`70px`},
              disableClose: true,
              data: 'Unable to update leave policies. Please try again.'
            });
          }
      });

    }
    else if (this.leavepoliciesForm.controls.pastdays.value == '' || this.leavepoliciesForm.controls.pastdays.value == undefined) {
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position: { top: `70px` },
        disableClose: true,
        data: "Please enter valid data"
      });
    }
  }
  validation(){
    var valid = true;
    for(let i =0; i< this.defaultRuleInfo.length; i++){
      if(this.defaultRuleInfo[i].value === null || this.defaultRuleInfo[i].value === '' || this.leavepoliciesForm.controls.pastdays.value !=''){
        this.leavepoliciesForm.controls.pastdays.value !=''?valid = true:valid=false;
        if(this.defaultRuleInfo[i].rulename=='LEAVES_DEFAULT_TYPE_FOR_DEDUCTION'){
           this.DEDUCTION = true

        }
        if(this.defaultRuleInfo[i].rulename=='LEAVES_WEEKENDS_INCLUDED'){
          this.INCLUDED = true;

          }
        if(this.defaultRuleInfo[i].rulename=='LEAVES_IS_MAIL_FACILITY_REQUIRED'){
          this.MAIL= true

            }
            if(this.defaultRuleInfo[i].rulename=='LEAVES_DURATION_FOR_BACKDATED_LEAVES'){

              this.BACKDATED= true
        }
        return valid;
      }
    }
    return valid;
   }
  cancelDefaultRules() {
    this.addBtn1 = true;
    this.addBtn2 = true;
    this.isEditDefaultRules = !this.isEditDefaultRules;

  }
  editDefaultRules() {
    this.addBtn1 = false;
    this.isEditDefaultRules=true;
    for(let i=0;i<this.defaultRuleInfo.length;i++){
    if(this.defaultRuleInfo[i].rulename=='LEAVES_WEEKENDS_INCLUDED'){
       }
     else if(this.defaultRuleInfo[i].rulename=='LEAVES_IS_MAIL_FACILITY_REQUIRED'){
      this.leavepoliciesForm.controls.email.setValue(this.defaultRuleInfo[i].value)

    }
    else if(this.defaultRuleInfo[i].rulename=='LEAVES_DURATION_FOR_BACKDATED_LEAVES'){
      this.leavepoliciesForm.controls.pastdays.setValue(this.defaultRuleInfo[i].value)

    }
    else if(this.defaultRuleInfo[i].rulename=='LEAVE_CYCLE_YEAR'){

      this.leavepoliciesForm.controls.leavecycleyear.setValue(this.defaultRuleInfo[i].value)
   }

    }
  }
  getErrorMessages(errorCode:any) {

    this.ts.getErrorMessages(errorCode,1,1).subscribe((result)=>{

      if(result.status && errorCode == 'LM1')
      {
        this.msgLM1 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM2')
      {
        this.msgLM2 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM3')
      {
        this.msgLM3 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM110')
      {
        this.msgLM110 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM111')
      {
        this.msgLM111 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM133')
      {
        this.msgLM133 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM134')
      {
        this.msgLM134 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM135')
      {
        this.msgLM135 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM139')
      {
        this.LMS139 = result.data[0].errormessage
      }

    })
  }

  valuesForCarryForwordleaves:any=[];
  getCarryforwardedLeaveMaxCount(leaveId:any){
    this.valuesForCarryForwordleaves = [];
    this.valuesForCarryForwordleaves.push({value:'',name:'Select'})

    // for(let i=1;i<=12;i++){
    //   this.valuesForCarryForwordleaves.push({value:i,name:i})
    // }

    this.LM.getCarryforwardedLeaveMaxCount(leaveId).subscribe((result:any) => {
      if(result.status){
        for(let i=1;i<=parseInt(result.data[0].max_count);i++){
          this.valuesForCarryForwordleaves.push({value:i,name:i})
        }
      }
    })
  }

  activeLeaveTypesForCarryForword:any;
  getLeaveTypesForCarryForword() {

    this.LM.getLeaveDetails('lm_leavesmaster', 'Active', 1, 100).subscribe((result) => {
      this.activeLeaveTypesForCarryForword =result.data;
      this.activeLeaveTypesForCarryForword.push({id:'',leavename:'Select'})
    })
  }
  backArrow() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    this.router.navigate(["/Admin/Leavepolicies"]));
  }
  getLeaveCycleYearOptions(){
    this.LM.getLeaveCycleYearOptions().subscribe((result:any) => {
      if(result.status){
        this.arrayValueOne = result.data
      }
    })

  }
}

