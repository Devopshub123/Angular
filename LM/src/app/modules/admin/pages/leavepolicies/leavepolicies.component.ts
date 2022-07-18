import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { LeavePoliciesService } from 'src/app/services/leave-policies.service'; 
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
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
  ruleInfos:any=[];
  ruleMaasterData:any=[];
  defaultRuleInfo:any=[];
  existingColors:any = [];
  leavesTypeData:any = [];
  leaveTypes:any=[];
  rgbcolor:any=[];
  setleavecolor:any;
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
  arrayValueOne:any=[{Value:'1',name:'Jan-Dec'},{Value:'2',name:' Apr-Mar'}]
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

  compoffMinWorkingHoursForEligibility:boolean=false;
  compoffMaxBackDatedDayspermittedForSubmission:boolean=false;
  compoffThresholdDaysToLapesOrConvertLeavesToPerks:boolean=false;
  ispredefined:boolean=false;
  msgLM110:any;
  msgLM111:any;
 
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
      LEAVES_MAX_COUNT_PER_YEAR:["",],
      data:["",],
      maxcapyear:[""],
      LEAVES_CREDIT_FREQUENCY:[""],
      LEAVES_WEEKENDS_INCLUDED:["",],
      LEAVES_COMPANY_HOLIDAYS_INCLUDED:[""],
      LEAVES_MAX_CAP_FOR_ONE_INSTANCE:[""],
      LEAVES_MIN_SERVICE_ELIGIBILITY:[""],
      LEAVES_MIN_DAYS_PRIOR_APPLICATION:[""],
      LEAVES_COUNT_TO_BE_CARRIED_FORWARD:[""],
      LEAVES_MAX_AVAIL_COUNT:["",],
      LEAVES_MIN_DAYS_FOR_DOCUMENT_UPLOAD:["",],
      LEAVES_GAP_BETWEEN_TERMS:[""],
      MAX_AVAIL_COUNT:[""],
      LEAVES_MAX_COUNT_PER_TERM:[""],
      LEAVES_ELIGIBLE_ON_WEEKOFFS:[""],
      LEAVES_ELIGIBILITY_MINIMUM_HOURS:[""],
      LEAVES_ENCASHMENT_MIN_COUNT_ELIGIBILITY:["",],
      SICK_LEAVES_MIN_DAYS_PRIOR_APPLICATION_FOR_KNOWN_AILMENTS:[""],
      LEAVES_ELIGIBLE_ON_COMPANY_HOLIDAYS:["",],
      LEAVES_LAPSE_PERIOD:[""],
      LEAVES_LAPSED_CONVERSION_TO_PERKS_APPLICABLE:[""],
      COMPOFF_MIN_WORKING_HOURS_FOR_ELIGIBILITY:["",],
      COMPOFF_MAX_BACKDATED_DAYS_PERMITTED_FOR_SUBMISSION:[""],
      COMPOFF_THRESHOLD_DAYS_TO_LAPSE_OR_CONVERT_LEAVES_TO_PERKS:[""],
      

    });
    this.addleaveForm.get('leavecolor')?.valueChanges.subscribe((selectedValue:any) => {
      this.setleavecolor = "rgb("+this.hexToRgb(selectedValue)+")"
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
      console.log(this.leaveTypes.length)
      for(let i=0;i<this.leaveTypes.length;i++){
        if(this.leaveTypes[i].id == selectedValue){
          this.addleaveForm.controls.displayname.setValue(this.leaveTypes[i].leavename);
          break;
        }

      }
      this.displayedColumns3 =  selectedValue > 11 ? this.displayedColumns4 : this.displayedColumns4.filter(column => column !== 'actions');

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
  /**Edit time get leavetypes */
  getLeavesDetailsedit(leave:any) {
    this.LM.getLeaveDetails('lm_leavesmaster','Active',1,100).subscribe((result) =>{
      if(result.status) {
        this.leaveTypes = result.data;
        console.log(result.data)
        this.editLeaveInfo = leave;
 
        this.isaddnew=false;
        this.isdeactivate = true;
        this.isactivate =false;
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
  setLeaveStatus(){
      var info = {
          id: this.editLeaveInfo.id,
          leavetype_status:this.editLeaveInfo.status
      }
      if(this.editLeaveInfo.status === 'Active') {
          info.leavetype_status = 'Inactive';
      }
      else if(this.editLeaveInfo.status === 'Inactive') {
          info.leavetype_status = 'Active';
      }
      console.log("this.editLeaveInfo.info",info,this.editLeaveInfo)
     
      this.LM.setToggleLeaveType(info).subscribe((data) => {
    
          if(data.status && this.editLeaveInfo.status == 'Active'){
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position:{top:`70px`},
              disableClose: true,
              data: 'Leave type deactivated successfully'
            });
              this.editLeaveInfo.status = info.leavetype_status;
              this.cancelLeave()
              // window.location.href='AddLeaveConfigure'
              this.ngOnInit();
          }
          else if(data.status && this.editLeaveInfo.status == 'Inactive'){
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position:{top:`70px`},
              disableClose: true,
              data: 'Leave type activated successfully'
            });  
            // this.toastr.success("Leave type activated successfully")
              this.editLeaveInfo.status = info.leavetype_status;
              this.cancelLeave()
              // window.location.href='AddLeaveConfigure'
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


    console.log("skjsbkd",ruleData)
    for(let obj of ruleData){

      if((obj.value === null && obj.status == 'Active')||(obj.value === '' && obj.status == 'Active') ){
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

        this.isLeaveColorAlreadyExists = true;
        // valid =false;
        valid =true;
        return valid;
      }else{
        this.isLeaveColorAlreadyExists = true;
        // this.isLeaveColorAlreadyExists = false;
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
  editLeaveTypeName(leave:any){
    console.log(leave)
    this.displayedColumns3 = leave.id > 11 ? this.displayedColumns4 : this.displayedColumns4.filter(column => column !== 'actions');
    this.leaveTypes=[];
    this.getLeavesDetailsedit(leave);
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
    this.leaveConfig = this.getLeaveFormatedValue(this.leaveId);
  for(let i=0;i<this.ruleInfos.length;i++){
    // console.log(this.ruleInfos[i].rulename)
    if(this.ruleInfos[i].rulename === "MAX_AVAIL_COUNT"){
      this.ruleInfos[i].value = this.addleaveForm.controls.MAX_AVAIL_COUNT.value;
      this.ruleInfos[i].leavecolor = this.setleavecolor;
    }
    else if(this.ruleInfos[i].rulename ===  "LEAVES_GAP_BETWEEN_TERMS"){
      this.ruleInfos[i].leavecolor = this.setleavecolor;
      this.ruleInfos[i].value =this.addleaveForm.controls.LEAVES_GAP_BETWEEN_TERMS.value;
    }
    else if(this.ruleInfos[i].rulename === "LEAVES_MAX_COUNT_PER_TERM"){
      this.ruleInfos[i].leavecolor = this.setleavecolor;
      this.ruleInfos[i].value =this.addleaveForm.controls.LEAVES_MAX_COUNT_PER_TERM.value;
    }
    else if(this.ruleInfos[i].rulename === "LEAVES_CREDIT_FREQUENCY"){
      this.ruleInfos[i].leavecolor = this.setleavecolor;
      this.ruleInfos[i].value = this.addleaveForm.controls.LEAVES_CREDIT_FREQUENCY.value;
    }
    else if(this.ruleInfos[i].rulename === "LEAVES_WEEKENDS_INCLUDED"){
      this.ruleInfos[i].leavecolor = this.setleavecolor;
      this.ruleInfos[i].value = this.addleaveForm.controls.LEAVES_WEEKENDS_INCLUDED.value;
    }
    else if(this.ruleInfos[i].rulename === "LEAVES_COMPANY_HOLIDAYS_INCLUDED"){
      this.ruleInfos[i].leavecolor = this.setleavecolor;
      this.ruleInfos[i].value = this.addleaveForm.controls.LEAVES_COMPANY_HOLIDAYS_INCLUDED.value;
    }
    else if(this.ruleInfos[i].rulename === "LEAVES_MAX_CAP_FOR_ONE_INSTANCE"){
      this.ruleInfos[i].leavecolor = this.setleavecolor;
      this.ruleInfos[i].value = this.addleaveForm.controls.LEAVES_MAX_CAP_FOR_ONE_INSTANCE.value;
    }
    else if(this.ruleInfos[i].rulename === "LEAVES_MIN_SERVICE_ELIGIBILITY"){
      this.ruleInfos[i].leavecolor = this.setleavecolor;
      this.ruleInfos[i].value = this.addleaveForm.controls.LEAVES_MIN_SERVICE_ELIGIBILITY.value;
    }
    else if(this.ruleInfos[i].rulename === "LEAVES_MIN_DAYS_PRIOR_APPLICATION"){
      this.ruleInfos[i].leavecolor = this.setleavecolor;
      this.ruleInfos[i].value = this.addleaveForm.controls.LEAVES_MIN_DAYS_PRIOR_APPLICATION.value;
    }
    else if(this.ruleInfos[i].rulename === "LEAVES_COUNT_TO_BE_CARRIED_FORWARD"){
      this.ruleInfos[i].leavecolor = this.setleavecolor;
      this.ruleInfos[i].value = this.addleaveForm.controls.LEAVES_COUNT_TO_BE_CARRIED_FORWARD.value;
    }
    else if(this.ruleInfos[i].rulename === "LEAVES_MAX_AVAIL_COUNT"){
      this.ruleInfos[i].leavecolor = this.setleavecolor;
      this.ruleInfos[i].value = this.addleaveForm.controls.LEAVES_MAX_AVAIL_COUNT.value;
    }
    else if(this.ruleInfos[i].rulename === "LEAVES_MIN_DAYS_FOR_DOCUMENT_UPLOAD"){
      this.ruleInfos[i].leavecolor = this.setleavecolor;
      this.ruleInfos[i].value = this.addleaveForm.controls.LEAVES_MIN_DAYS_FOR_DOCUMENT_UPLOAD.value;
    }
    else if(this.ruleInfos[i].rulename === "LEAVES_ELIGIBLE_ON_WEEKOFFS"){
      this.ruleInfos[i].leavecolor = this.setleavecolor;
      this.ruleInfos[i].value = this.addleaveForm.controls.LEAVES_ELIGIBLE_ON_WEEKOFFS.value;
    }
    else if(this.ruleInfos[i].rulename === "LEAVES_ELIGIBLE_ON_COMPANY_HOLIDAYS"){
      this.ruleInfos[i].leavecolor = this.setleavecolor;
      this.ruleInfos[i].value = this.addleaveForm.controls.LEAVES_ELIGIBLE_ON_COMPANY_HOLIDAYS.value;
    }
    else if(this.ruleInfos[i].rulename === "LEAVES_LAPSED_CONVERSION_TO_PERKS_APPLICABLE"){
      this.ruleInfos[i].leavecolor = this.setleavecolor;
      this.ruleInfos[i].value = this.addleaveForm.controls.LEAVES_LAPSED_CONVERSION_TO_PERKS_APPLICABLE.value;
    }
    else if(this.ruleInfos[i].rulename === "COMPOFF_MIN_WORKING_HOURS_FOR_ELIGIBILITY"){
      this.ruleInfos[i].leavecolor = this.setleavecolor;
      this.ruleInfos[i].value = this.addleaveForm.controls.COMPOFF_MIN_WORKING_HOURS_FOR_ELIGIBILITY.value;
    }
    else if(this.ruleInfos[i].rulename === "COMPOFF_MAX_BACKDATED_DAYS_PERMITTED_FOR_SUBMISSION"){
      this.ruleInfos[i].leavecolor = this.setleavecolor;
      this.ruleInfos[i].value = this.addleaveForm.controls.COMPOFF_MAX_BACKDATED_DAYS_PERMITTED_FOR_SUBMISSION.value;
    }
    else if(this.ruleInfos[i].rulename === "COMPOFF_THRESHOLD_DAYS_TO_LAPSE_OR_CONVERT_LEAVES_TO_PERKS"){
      this.ruleInfos[i].leavecolor = this.setleavecolor;
      this.ruleInfos[i].value = this.addleaveForm.controls.COMPOFF_THRESHOLD_DAYS_TO_LAPSE_OR_CONVERT_LEAVES_TO_PERKS.value;
    }
    else if(this.ruleInfos[i].rulename === "LEAVES_MAX_COUNT_PER_YEAR"){
      this.ruleInfos[i].leavecolor = this.setleavecolor;
      this.ruleInfos[i].value = this.addleaveForm.controls.LEAVES_MAX_COUNT_PER_YEAR.value;
    }
  }
  var info = {
    ruleData:this.ruleInfos
  };
  console.log("before",info)
  

if( this.validateCustomLeave(info.ruleData)) {
  // for(let m=0;m<info.ruleData.length;m++){
  //   info.ruleData[m].leavecolor = info.ruleData[0].leavecolor;
  //   if (info.ruleData[m].status == 'Inactive') {
  //     info.ruleData[m].status = 'Active'
  //   } else{
  //         info.ruleData[m].status = 'Inactive'
  //   }
  // }

  console.log("hellooo",this.leaveConfigure,this.editLeaveInfo)
  // this.LM.updateLeaveDisplayName(this.leaveConfigure).subscribe((data:any)=>{})
  console.log("afetr",info)
  this.LM.setLeaveConfigure(info).subscribe((data) => {
    // this.isEditLeaveType = false;
    if (data.status) {
      console.log("submit")
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position:{top:`70px`},
        disableClose: true,
        data: 'Leave type added successfully'
      });
      // if(flag == 'submit') {
      //   this.toastr.success(this.msgLM110)
      // }else{
      //   this.toastr.success(this.msgLM111)

      // }
      // this.cancelLeave();
      
    }
    else {
      console.log("failure")
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position:{top:`70px`},
        disableClose: true,
        data: 'Unable to add Leave type '
      });
      // this.toastr.error(data.message)
    }
  });
}
  }
  // validateCustomLeave(data:any){
    //

  // }

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
      let dialogRef = this.dialog.open(AddleavepopupComponent, {
        width: '400px',
        position:{top:`70px`},
        
      })
  }
  /**toggle change */
  toglechange(element:any) {
    console.log(element)
    // element.disable() = !element.disable();
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
        this.ruleInfo.push({ruledescription:"Select unique color for each leave type"})
        console.log("hjsdjhvhh",ruleDetails[0].leavecolor)
        for(let i=0;i<this.ruleInfos.length;i++){
          // console.log(this.ruleInfos[i].rulename)
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
  saveDefaultrules(){
    if(this.validation()){
      
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

      }
      var info = {
        ruleData:this.defaultRuleInfo
      }
      console.log(info)   
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
  }
  validation(){
    var valid = true;
    console.log("hjj",this.defaultRuleInfo.length)
    for(let i =0; i< this.defaultRuleInfo.length; i++){
      if(this.defaultRuleInfo[i].value === null || this.defaultRuleInfo[i].value === ''){
        valid = false;
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
  cancelDefaultRules(){
    this.isEditDefaultRules = !this.isEditDefaultRules;

  }
  editDefaultRules(){
    this.isEditDefaultRules=true;
    console.log()
    for(let i=0;i<this.defaultRuleInfo.length;i++){
    //   if(this.defaultRuleInfo[i].rulename=='LEAVES_DEFAULT_TYPE_FOR_DEDUCTION'){
        

    //  }
    if(this.defaultRuleInfo[i].rulename=='LEAVES_WEEKENDS_INCLUDED'){
       
      // this.leavepoliciesForm.controls.email.SetValue(this.defaultRuleInfo[i].value)
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

}


