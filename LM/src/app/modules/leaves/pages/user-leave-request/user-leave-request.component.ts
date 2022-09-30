import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {LeavesService} from "../../leaves.service";
import {DatePipe,Location} from "@angular/common";
import {ConfirmationComponent} from "../../dialog/confirmation/confirmation.component";
import { sample } from 'rxjs/operators';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';
import {DomSanitizer} from '@angular/platform-browser'
import { NgxSpinnerService } from 'ngx-spinner';
import {CompanySettingService} from '../../../../services/companysetting.service'
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';


import * as _moment from 'moment';
// import {default as _rollupMoment} from 'moment';
const moment =  _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};


@Component({
  selector: 'app-user-leave-request',
  templateUrl: './user-leave-request.component.html',
  styleUrls: ['./user-leave-request.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class UserLeaveRequestComponent implements OnInit {
  leaveRequestForm:any= FormGroup;
  leavebalance:any=[];
  userSession:any=[];
  leavesTypeData:any=[];
  existingCount:any=[];
  fromdate:any=[];
  todate:any=[];
  holidays:any=[];
  fileURL:any;
  FromDatesHalfDays:any=[];
  ToDatesHalfDays:any=[];
  fromDateFilter:any;
  toDateFilter:any;
  iseditDoc:boolean=true;
  pipe = new DatePipe('en-US');
  isFirstHalf: boolean = true;
  isSecondHalf: boolean = true;
  toMaxDate: any;
  pdfName :any = null;
  isDisableFirstHalf: boolean = false;
  isDisableSecondHalf: boolean = false;
  document: boolean = false;
  isValidateLeave: boolean = false;
  msgLM79: any;
  msgLM76: any;
  msgLM1: any;
  msgLM3: any;
  msgLM7: any;
  msgLM119: any;
  msgLM140: any;
  msgLM141: any;
  msgLM142: any;
  roleValue:any;
  minDate:any;
  maxDate:any;
  fromMaxDate:any;
  nextLeaveDate:any;
  compOffApprovedDates:any=[];
  isCompOff:boolean=true;
  employeeRelations:any=[];
  maxCountPerTermValue:any;
  isFile: boolean = true;
  formData: any;
  leaveInfo:any;
  leaveData:any;
  submitted:boolean=false;
  documentId:any=null;
  documentInfo:any=null;


  constructor(private sanitizer:DomSanitizer,private router: Router,private location:Location,private LM:LeavesService,private formBuilder: FormBuilder,private dialog: MatDialog,private spinner: NgxSpinnerService,private LMSC:CompanySettingService) {
    this.formData = new FormData();
    this.getDurationFoBackDatedLeave();
    this.getleavecyclelastmonth();
    this.leaveInfo = this.location.getState();
    this.leaveData = this.leaveInfo.leaveData;
    // this.newLeaveRequest.leaveType = this.leaveData ? this.leaveData.leavetypeid : '';
    // this.leaveRequestForm.controls.id.setValue(this.leaveData?this.leaveData.id:'')
    // this.newLeaveRequest.toDate = this.leaveData ? new Date(this.leaveData.todate) : '';
    // this.newLeaveRequest.fromDateHalf = this.leaveData ? this.leaveData.fromhalfdayleave == '0' ? false : true : false;
    // this.newLeaveRequest.toDateHalf = this.leaveData ? this.leaveData.tohalfdayleave == '0' ? false : true : false;
    // this.newLeaveRequest.leavecount = this.leaveData ? this.leaveData.leavecount : '';
    // this.newLeaveRequest.reason = this.leaveData ? this.leaveData.leavereason : '';
    // this.getDaystobedisabledfromdate();
    // this.getDaystobedisabledtodate();
    // this.newLeaveRequest.contact = this.leaveData ? this.leaveData.contactnumber : this.usersession.contactnumber;
    // // this.newLeaveRequest.emergencyContact = this.leaveData ? this.leaveData.contactnumber : '';
    // this.newLeaveRequest.emergencyEmail = this.leaveData ? this.leaveData.contactemail : '';
    // this.newLeaveRequest.compoffApprovedDate = this.leaveData ? this.leaveData.worked_date : '';
    //
    //
    // this.newLeaveRequest.empid = this.usersession.id;
    //









  }
  activeModule:any;

  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.activeModule = JSON.parse(sessionStorage.getItem('activeModule') || '');

    this.leaveRequestForm = this.formBuilder.group({
      leaveTypeId: ['',Validators.required],
      compoffApprovedDate:[''],
      relation:[''],
      fromDate:['',Validators.required],
      toDate:['',Validators.required],
      toDateHalf:[''],
      fromDateHalf:[''],
      leaveCount:['',Validators.required],
      reason:['',Validators.required],
      contact:[this.userSession.contactnumber,Validators.required],
      emergencyEmail:[''],
      document:['']

    });



    // this.newLeaveRequest.fromDate = this.leaveData ? new Date(this.leaveData.fromdate) : '';


    // this.leaveRequestForm.controls.formData.setValue(this.leaveData ? new Date(this.leaveData.fromdate) : '')
    // this.leaveRequestForm.controls.toDate.setValue(this.leaveData ? new Date(this.leaveData.toDate) : '')
    this.leaveRequestForm.controls.fromDateHalf.setValue(this.leaveData ? this.leaveData.fromhalfdayleave == '0' ? false : true : false,{emitEvent:false})
    this.leaveRequestForm.controls.toDateHalf.setValue(this.leaveData ? this.leaveData.tohalfdayleave == '0' ? false : true : false,{emitEvent:false})
    this.leaveRequestForm.controls.leaveCount.setValue(this.leaveData ? this.leaveData.leavecount:'',{emitEvent:false})
    this.leaveRequestForm.controls.reason.setValue(this.leaveData ? this.leaveData.leavereason : '',{emitEvent:false})
    this.leaveRequestForm.controls.contact.setValue(this.leaveData ? this.leaveData.contactnumber : '',{emitEvent:false})
    this.leaveRequestForm.controls.emergencyEmail.setValue(this.leaveData ? this.leaveData.contactemail : '')
    // this.leaveRequestForm.controls.leaveTypeId.setValue(2,{emitEvent:false})
    // this.leaveRequestForm.controls.relation.setValue(this.leaveData?this.leaveData.bereavement_id:'',{emitEvent:false})

    this.getLeaveBalance();
    this.getLeavesTypeInfo();
    this.getApprovedCompoffs();
    this.getEmployeeRelationsForBereavementLeave();

    this.getDaystobedisabledfromdate();
    this.getDaystobedisabledtodate();


    this.leaveRequestForm.get('leaveTypeId')?.valueChanges.subscribe((selectedValue:any) => {
      if(selectedValue) {
        this.document = false;
        this.leaveRequestForm.controls.fromDate.setValue('',{emitEvent:false});
        this.leaveRequestForm.controls.toDate.setValue('',{emitEvent:false});
        this.leaveRequestForm.controls.fromDateHalf.setValue('',{emitEvent:false});
        this.leaveRequestForm.controls.toDateHalf.setValue('',{emitEvent:false});
        this.leaveRequestForm.controls.leaveCount.setValue('');
        this.leaveRequestForm.controls.reason.setValue('');
        this.leaveRequestForm.controls.reason.setValue('');
        this.leaveRequestForm.controls.contact.setValue(this.userSession.contactnumber);
        this.leaveRequestForm.controls.emergencyEmail.setValue('');
        this.leaveRequestForm.controls.compoffApprovedDate.setValue('')
        this.leaveRequestForm.controls.relation.setValue('')


        /**
         * Event based leaves getting max number of leaves eligible per term
         **/
        if (this.leaveRequestForm.controls.leaveTypeId.value == '5' || this.leaveRequestForm.controls.leaveTypeId.value =='6' || this.leaveRequestForm.controls.leaveTypeId.value =='7' || this.leaveRequestForm.controls.leaveTypeId.value =='8') {
          this.getMaxCountPerTermValue();

        }


        /**
         * Condition based validation for berevement and comp-off leaves
         *
         **/

        if (this.leaveRequestForm.controls.leaveTypeId.value == '8') {

          this.leaveRequestForm.controls.relation.setValidators([Validators.required])
          this.leaveRequestForm.controls.relation.updateValueAndValidity();
          this.leaveRequestForm.controls.compoffApprovedDate.clearValidators();
          this.leaveRequestForm.controls.compoffApprovedDate.updateValueAndValidity();
        } else if (this.leaveRequestForm.controls.leaveTypeId.value == '9') {
          this.leaveRequestForm.controls.compoffApprovedDate.setValidators([Validators.required])
          this.leaveRequestForm.controls.compoffApprovedDate.updateValueAndValidity();
          this.leaveRequestForm.controls.relation.clearValidators();
          this.leaveRequestForm.controls.relation.updateValueAndValidity();

        }
        else {
          this.leaveRequestForm.controls.compoffApprovedDate.clearValidators();
          this.leaveRequestForm.controls.compoffApprovedDate.updateValueAndValidity();
          this.leaveRequestForm.controls.relation.clearValidators();
          this.leaveRequestForm.controls.relation.updateValueAndValidity();
        }

      }



    });
    this.leaveRequestForm.get('fromDate')?.valueChanges.subscribe((selectedValue:any) => {
      if(selectedValue) {
        if(this.leaveRequestForm.controls.leaveTypeId.value != 9 ){
          this.changeFromDate(selectedValue);
        }
        else {
          this.maxDate = this.toMaxDate;
          this.changeCompOffFromDate(selectedValue)
        }



      }
    });


      this.leaveRequestForm.get('toDate')?.valueChanges.subscribe((selectedValue: any) => {
        if (selectedValue) {
          this.changeToDate(selectedValue);
        }
      });


    this.leaveRequestForm.get('fromDateHalf')?.valueChanges.subscribe((selectedValue:any) => {
      // if(selectedValue) {
        this.changeHalfs();
      // }
    });

    this.leaveRequestForm.get('toDateHalf')?.valueChanges.subscribe((selectedValue:any) => {
      // if(selectedValue) {

      this.changeHalfs();
      // }
    });

    this.getErrorMessages('LM1')
    this.getErrorMessages('LM3')
    this.getErrorMessages('LM79')
    this.getErrorMessages('LM76')
    this.getErrorMessages('LM7')
    this.getErrorMessages('LM117')
    this.getErrorMessages('LM119')
    this.getErrorMessages('LM140')
    this.getErrorMessages('LM141')
    this.getErrorMessages('LM142')

    this.leaveRequestForm.controls.contact.setValue(this.userSession.contactnumber)
    this.leaveRequestForm.controls.leaveCount.disable();

  }
  changeHalfs(){
    if (this.leaveRequestForm.controls.leaveTypeId.value && this.leaveRequestForm.controls.fromDate.value && this.leaveRequestForm.controls.toDate.value) {
       this.eventBasedLeave(this.leaveRequestForm.controls.fromDate.value)
      this.setValidateLeave();
    }
  }

  getLeaveBalance() {
    this.LM.getLeaveBalance(this.userSession.id).subscribe((result) => {
      if(result && result.status){
        this.leavebalance = this.leaveTypes(result.data[0],true)
      }
    })
  }
  /**
   * leaveTypes
   * few leavetypes will display based on  gender and maritalstatus in leave types dropdown
   **/

  leaveTypes(leaveTypes:any,flag:boolean){
    var data = [];
    for (var i = 0; i < leaveTypes.length; i++) {
      if(flag){
        let total = leaveTypes[i].total.split('.')
        if(total[1] == '00'){
          leaveTypes[i].total = total[0];
        }
      }
      if (leaveTypes[i].leavename === "Marriage Leave" && this.userSession.maritalstatus === "Single") {
        data.push(leaveTypes[i])

      } else if (leaveTypes[i].leavename === 'Maternity Leave'&& this.userSession.maritalstatus === "Married") {
        if (this.userSession.gender === 'Female') {
          data.push(leaveTypes[i])
        }
      } else if (leaveTypes[i].leavename === 'Paternity Leave'&& this.userSession.maritalstatus === "Married") {
        if (this.userSession.gender === 'Male') {
          data.push(leaveTypes[i])
        }
      }else if(leaveTypes[i].leavename !== 'Paternity Leave' && leaveTypes[i].leavename !== "Marriage Leave" && leaveTypes[i].leavename !== 'Maternity Leave'){
        data.push(leaveTypes[i])
      }

    }
    return data;
  }


  /**
   * get all leaveTypes
   *
   * **/

async  getLeavesTypeInfo() {
  await this.LM.getLeavesTypeInfo().subscribe((result) => {
        if (result.status) {
          this.leavesTypeData = this.leaveTypes(result.data,false);
          this.leaveRequestForm.controls.leaveTypeId.setValue(this.leaveData?this.leaveData.leavetypeid.toString():'',{ emitEvent: false });
          if(this.leaveData && this.leaveData.leavetypeid == 3){
            this.leaveRequestForm.controls.document.value=true;
            this.getUploadDocument();
          }else if(this.leaveData && this.leaveData.leavetypeid == 5){
            this.leaveRequestForm.controls.document.value=true;
            this.getUploadDocument();
          }
          if(this.leaveData){
            this.isValidateLeave= true;
          }
          /**
           * Event based leaves getting max number of leaves eligible per term
           **/
          if (this.leaveRequestForm.controls.leaveTypeId.value == '5' || this.leaveRequestForm.controls.leaveTypeId.value =='6' || this.leaveRequestForm.controls.leaveTypeId.value =='7' || this.leaveRequestForm.controls.leaveTypeId.value =='8') {
            this.getMaxCountPerTermValue();

          }
          for (let i = 0; i < this.leavesTypeData.length; i++) {
            this.existingCount[this.leavesTypeData[i].id] = this.leavesTypeData[i].leavetypecount;
          }

        }
      }

    );
  }


  /**
   * getting disabled dates
   *
   * **/

  getDaystobedisabledfromdate() {
    // this.spinner.show()
    // var info = this.LM.getDaysToBeDisabledFromDate(this.userSession.id, this.newLeaveRequest.id ? this.newLeaveRequest.id : null).then((result) => {

      var info = this.LM.getDaysToBeDisabledFromDate(this.userSession.id,  this.leaveData?this.leaveData.id:null).then((result) => {

      if (result && result.status) {
        this.fromdate = result.data;
        for (var i = 0; i < result.data.length; i++) {
          (result.data[i].first_half && result.data[i].second_half) ? this.holidays.push(new Date(result.data[i].edate+' ' +'00:00:00')) : this.FromDatesHalfDays.push(result.data[i]);

        }

        this.fromDateFilter = (d: Date): boolean => {
          let isValid=true;
          this.holidays.forEach((e:any) => {
            if(this.pipe.transform(e, 'yyyy/MM/dd') == this.pipe.transform(d, 'yyyy/MM/dd')){
              isValid=false;
            }
          });
          return isValid;
        }



        this.leaveRequestForm.get("fromDate").setValue(this.leaveData?new Date(this.leaveData.fromdate):'',{emitEvent:false})


        // if(this.leaveData && (!this.leaveRequestForm.controls.toDateHalf.value || !this.leaveRequestForm.controls.fromDateHalf.value )){
        //   if(this.leaveData.leavetypeid == 9){
        //     this.changeCompOffFromDate(new Date(this.leaveData.fromdate))
        //   }else{
        //     this.changeFromDate(new Date(this.leaveData.fromdate));
        //     this.changeToDate(new Date(this.leaveData.todate))
        //       this.leaveRequestForm.controls.fromDateHalf.setValue(true,{emitEvent:false})
        //       this.leaveRequestForm.controls.toDateHalf.setValue(this.leaveData ? this.leaveData.tohalfdayleave === '0' ? false : true : false)
        //
        //
        //
        //   }
        //
        // }
        // else{
        //   // this.spinner.hide()
        // }


      }
    });
  }

  async getDaystobedisabledtodate() {

    var data =  this.LM.getDaysToBeDisabledToDate(this.userSession.id,  this.leaveData?this.leaveData.id:null).then((result) => {
      if (result && result.status) {
        for (var i = 0; i < result.data.length; i++) {
          (result.data[i].first_half && result.data[i].second_half) ? this.todate.push(new Date(result.data[i].edate)) : this.ToDatesHalfDays.push(result.data[i]);

        }


        this.toDateFilter = (d: Date): boolean => {
          let isValid=true;
          this.todate.forEach((e:any) => {
            if(this.pipe.transform(e, 'yyyy/MM/dd') == this.pipe.transform(d, 'yyyy/MM/dd')){
              isValid=false;
            }
          });
          return isValid;
        }
        // this.leaveRequestForm.controls.fromDate.setValue(this.leaveData?new Date(this.leaveData.fromdate):'',{emitEvent:false})
        this.leaveRequestForm.controls.toDate.setValue(this.leaveData?new Date(this.leaveData.todate):'',{emitEvent:false})
        // this.leaveRequestForm.controls.fromDateHalf.setValue(this.leaveData ? this.leaveData.fromhalfdayleave == '0' ? false : true : false,{emitEvent:false})
        // this.leaveRequestForm.controls.toDateHalf.setValue(this.leaveData ? this.leaveData.tohalfdayleave == '0' ? false : true : false,{emitEvent:false})
        this.leaveRequestForm.controls.relation.setValue(this.leaveData ? this.leaveData.bereavement_id?this.leaveData.bereavement_id.toString():'':'',{emitEvent:false})
        this.leaveRequestForm.controls.compoffApprovedDate.setValue(this.leaveData ? this.leaveData.worked_date?this.leaveData.worked_date:'':'',{emitEvent:false})


      }

    })
  }

  // disabledCalender(){
  //
  // }
  // setApplyLeave(){
  //
  // }

  number:number=0;
  cancel(val:any){

    if(this.leaveData){
      this.router.navigate([this.leaveData.URL])
    }
    // this.leaveRequestForm.reset();
    // this.leaveRequestForm.clearValidators();
    // this.leaveRequestForm.markAsPristine();
    // this.leaveRequestForm.markAsUntouched();
    // this.leaveRequestForm.controls.leaveTypeId.updateValueAndValidity();
    // this.leaveRequestForm.controls.leaveCount.disable();
    // this.leaveRequestForm.controls.contact.setValue(this.userSession.contactnumber);


    // this.leaveRequestForm.controls.leaveTypeId.setErrors(null);
    // this.document = false;
    // this.leaveRequestForm.controls.fromDate.setErrors(null);
    // this.leaveRequestForm.controls.toDate.setErrors(null);
    // this.leaveRequestForm.controls.fromDateHalf.setErrors(null);
    // this.leaveRequestForm.controls.toDateHalf.setErrors(null);
    // this.leaveRequestForm.controls.leaveCount.setErrors(null);
    // this.leaveRequestForm.controls.reason.setErrors(null);
    // this.leaveRequestForm.controls.reason.setErrors(null);
    // this.leaveRequestForm.controls.contact.setErrors(null);
    // this.leaveRequestForm.controls.emergencyEmail.setErrors(null);
    // this.leaveRequestForm.controls.compoffApprovedDate.setErrors(null);
    // this.leaveRequestForm.controls.relation.setErrors(null);
    // this.leaveRequestForm.controls.document.setErrors(null);
    // this.leaveRequestForm.controls.toDate.clearValidators();
    // this.leaveRequestForm.controls.toDate.updateValueAndValidity();
    // this.leaveRequestForm.controls.fromDate.clearValidators();
    // this.leaveRequestForm.controls.fromDate.updateValueAndValidity();


//     this.number += val;
//     if(this.number == 1){
// this.document=false;

      this.leaveRequestForm = this.formBuilder.group({
        leaveTypeId: ['',Validators.required],
        compoffApprovedDate:[''],
        relation:[''],
        fromDate:['',Validators.required],
        toDate:['',Validators.required],
        toDateHalf:['',Validators.required],
        fromDateHalf:['',Validators.required],
        leaveCount:['',Validators.required],
        reason:['',Validators.required],
        contact:[this.userSession.contactnumber,Validators.required],
        emergencyEmail:[''],
        document:['']

      })
    this.leaveRequestForm.controls.leaveCount.disable();


    // this.leaveRequestForm.controls.markAsPristine()
      //
      // this.leaveRequestForm.controls.markAsUntouched();

    // }else {
    //   this.number=0;
    //   this.router.navigate(['/LeaveManagement/UserDashboard'])
    // }


  }



  changeCompOffFromDate(date:any) {
    // this.newLeaveRequest.toDate = date;
    this.leaveRequestForm.controls.toDate.setValue(date,{ emitEvent: false })
    for (let i = 0; i < this.FromDatesHalfDays.length; i++) {
      if (this.FromDatesHalfDays[i].edate === this.pipe.transform(date, 'yyyy-MM-dd')) {
        if (this.FromDatesHalfDays[i].first_half === 0 && this.FromDatesHalfDays[i].second_half) {
          // this.newLeaveRequest.toDateHalf = true;
          this.leaveRequestForm.controls.toDateHalf.setValue(true,{ emitEvent: false });

          this.isDisableFirstHalf = true;
          this.isDisableSecondHalf = false;
          // this.newLeaveRequest.fromDateHalf = false;
          this.leaveRequestForm.controls.fromDateHalf.setValue(false,{ emitEvent: false });
          this.isSecondHalf = false;
          this.isFirstHalf = true;
          this.leaveRequestForm.controls.toDate.setValue(date,{ emitEvent: false })
          if (this.leaveRequestForm.controls.leaveTypeId.value && this.leaveRequestForm.controls.fromDate.value && this.leaveRequestForm.controls.toDate.value) {
            this.setValidateLeave();
          }
          break;
        } else if (this.FromDatesHalfDays[i].first_half && this.FromDatesHalfDays[i].second_half === 0) {
          this.leaveRequestForm.controls.toDateHalf.setValue(false,{ emitEvent: false });
          this.isDisableFirstHalf = false;
          this.isDisableSecondHalf = true;
          this.leaveRequestForm.controls.fromDateHalf.setValue(true,{ emitEvent: false });
          this.isSecondHalf = true;
          this.isFirstHalf = false;
          if (this.leaveRequestForm.controls.leaveTypeId.value && this.leaveRequestForm.controls.fromDate.value && this.leaveRequestForm.controls.toDate.value) {
            this.setValidateLeave();
          }
          break;

        }

      }else {
        this.leaveRequestForm.controls.toDateHalf.setValue(false,{ emitEvent: false });
        this.isDisableFirstHalf = false;
        this.isDisableSecondHalf = false;
        this.leaveRequestForm.controls.fromDateHalf.setValue(false,{ emitEvent: false });
        this.isSecondHalf = false;
        this.isSecondHalf = true;
        this.isFirstHalf = true;

      }
    }
    if (this.leaveRequestForm.controls.leaveTypeId.value && this.leaveRequestForm.controls.fromDate.value && this.leaveRequestForm.controls.toDate.value) {
      this.setValidateLeave();
    }
  }



  changeFromDate(date:any)
  {
    this.leaveRequestForm.controls.toDate.setValue('')
    // this.leaveRequestForm.controls.toDate.setValue(this.leaveData?new Date(this.leaveData.todate):'',{emitEvent:false})
    this.leaveRequestForm.controls.leaveCount.setValue('');
    var input = {
      id: this.userSession.id,
      date: this.pipe.transform(date, 'yyyy-MM-dd')
    }
    this.LM.getNextLeaveDate(input).then((result) => {
      if (result && result.status) {
        for (let i = 0; i < result.data.length; i++) {
          if (result.data[i].first_half !== '0') {
            this.todate.push(new Date(result.data[i].fromdate))
          }
        }
        var leaveDate = result.data.length !== 0 ? new Date(result.data[0].fromdate) : '';
        this.nextLeaveDate = leaveDate;
        if(this.leaveRequestForm.controls.leaveTypeId.value !== '8' && this.leaveRequestForm.controls.leaveTypeId.value !== '7' && this.leaveRequestForm.controls.leaveTypeId.value !== '6' && this.leaveRequestForm.controls.leaveTypeId.value !== '5') {

          this.maxDate = leaveDate ? new Date(leaveDate) : this.toMaxDate;
        }
        if(this.FromDatesHalfDays.length>0) {
          for (let i = 0; i < this.FromDatesHalfDays.length; i++) {
            if (this.FromDatesHalfDays[i].edate === this.pipe.transform(date, 'yyyy-MM-dd')) {
              if (this.FromDatesHalfDays[i].first_half && this.FromDatesHalfDays[i].second_half === 0) {
                this.leaveRequestForm.controls.fromDateHalf.setValue(true,{emitEvent:false});

                // this.ToDatesHalfDays.push(this.FromDatesHalfDays[i])
                // this.newLeaveRequest.toDateHalf = false;
                this.leaveRequestForm.controls.toDateHalf.setValue(false,{emitEvent:false});

                this.leaveRequestForm.controls.toDateHalf.setValue(true,{emitEvent:false})
                this.isDisableSecondHalf = true;
                this.isDisableFirstHalf = false;
                this.isFirstHalf = false;
                // this.leaveRequestForm.controls.toDate.setValue(this.leaveData ? new Date(this.leaveData.todate) : '');
                this.eventBasedLeave(date);
                if (this.leaveRequestForm.controls.leaveTypeId.value && this.leaveRequestForm.controls.fromDate.value && this.leaveRequestForm.controls.toDate.value) {
                  this.setValidateLeave();
                }
              } else if (this.FromDatesHalfDays[i].first_half === 0 && this.FromDatesHalfDays[i].second_half) {
                this.eventBasedLeave(date);
                // this.newLeaveRequest.toDateHalf = true;
                this.leaveRequestForm.controls.toDateHalf.setValue(true,{emitEvent:false});
                this.isDisableFirstHalf = true;
                this.isDisableSecondHalf = false;
                // this.newLeaveRequest.fromDateHalf = false;
                this.leaveRequestForm.controls.fromDateHalf.setValue(false,{emitEvent:false});

                this.maxDate = date;
                // this.newLeaveRequest.toDate = date;
                this.leaveRequestForm.controls.toDate.setValue(date);

                this.isSecondHalf = false;
                this.validEventLeave();
                if (this.leaveRequestForm.controls.leaveTypeId.value && this.leaveRequestForm.controls.fromDate.value && this.leaveRequestForm.controls.toDate.value) {
                  this.setValidateLeave();
                }


              }
              break;
            } else {
              // this.newLeaveRequest.toDate = '';
              this.leaveRequestForm.controls.toDate.setValue(this.leaveData?new Date(this.leaveData.todate):'',{emitEvent:false})

              // this.leaveRequestForm.controls.toDate.setValue('',{emitEvent:false});
              // this.newLeaveRequest.fromDateHalf = false;
              this.leaveRequestForm.controls.fromDateHalf.setValue(false,{emitEvent:false});

              // this.newLeaveRequest.toDateHalf = false;
              this.leaveRequestForm.controls.toDateHalf.setValue(false,{emitEvent:false});

              this.isFirstHalf = true;
              this.isSecondHalf = true;
              this.isDisableSecondHalf = false;
              this.isDisableFirstHalf = false;
              if (i === this.FromDatesHalfDays.length - 1) {
                this.eventBasedLeave(date);
                this.leaveRequestForm.controls.leaveCount.setValue('',{emitEvent:false});
                if (this.leaveRequestForm.controls.leaveTypeId.value && this.leaveRequestForm.controls.fromDate.value && this.leaveRequestForm.controls.toDate.value) {
                  this.setValidateLeave();
                }
                // if (this.newLeaveRequest.leaveType && this.newLeaveRequest.fromDate && this.newLeaveRequest.toDate) {
                //   this.setValidateLeave();
                // }
              }

            }
          }
        }else{
          this.eventBasedLeave(date)
          // this.newLeaveRequest.leavecount = '';
          this.leaveRequestForm.controls.leaveCount.setValue('',{emitEvent:false});

          // this.newLeaveRequest.empid = this.usersession.id;
          if (this.leaveRequestForm.controls.leaveTypeId.value && this.leaveRequestForm.controls.fromDate.value && this.leaveRequestForm.controls.toDate.value) {
            this.setValidateLeave();
          }
          // if (this.newLeaveRequest && this.newLeaveRequest.leaveType && this.newLeaveRequest.fromDate && this.newLeaveRequest.toDate) {
          //   this.setValidateLeave();
          // }
        }


      }else{
        // this.eventBasedLeave(date)
        // this.newLeaveRequest.leavecount = '';
        this.leaveRequestForm.controls.leaveCount.setValue('',{emitEvent:false});

        // this.newLeaveRequest.empid = this.usersession.id;
        if (this.leaveRequestForm.controls.leaveTypeId.value && this.leaveRequestForm.controls.fromDate.value && this.leaveRequestForm.controls.toDate.value) {
          this.setValidateLeave();
        }
      }

    })

  }



  changeToDate(date:any)
  {

    for (let i = 0; i < this.ToDatesHalfDays.length; i++) {
      if (this.ToDatesHalfDays[i].edate === this.pipe.transform(date, 'yyyy-MM-dd')) {
        if (this.ToDatesHalfDays[i].first_half && this.ToDatesHalfDays[i].second_half === 0) {
          // this.newLeaveRequest.toDateHalf = false;
          this.leaveRequestForm.controls.toDateHalf.setValue(false,{ emitEvent: false });
          // this.newLeaveRequest.fromDateHalf = true;
          this.leaveRequestForm.controls.fromDateHalf.setValue(true,{ emitEvent: false });
          this.isFirstHalf = false;
          this.isDisableSecondHalf = true;
          this.isDisableFirstHalf = false;

        }
        else if (this.ToDatesHalfDays[i].first_half === 0 && this.ToDatesHalfDays[i].second_half) {

          if (this.leaveRequestForm.controls.fromDate.value === this.leaveRequestForm.controls.toDate.value) {
            // this.newLeaveRequest.toDateHalf = true;
            this.leaveRequestForm.controls.toDateHalf.setValue(true,{ emitEvent: false });

            // this.newLeaveRequest.fromDateHalf = false;
            this.leaveRequestForm.controls.fromDateHalf.setValue(false,{ emitEvent: false });

            // this.maxDate = date;
            this.leaveRequestForm.controls.toDate.setValue(date,{ emitEvent: false });
            // this.newLeaveRequest.toDate = date;
            this.isSecondHalf = false;
            this.isDisableSecondHalf = false;
            this.isDisableFirstHalf = true;

          } else if (this.leaveRequestForm.controls.fromDateHalf.value && this.ToDatesHalfDays[i].first_half === 0) {
            this.isSecondHalf = true;
            this.isFirstHalf = true;
            // this.newLeaveRequest.toDateHalf = true;
            this.leaveRequestForm.controls.toDateHalf.setValue(true,{ emitEvent: false });

            // this.newLeaveRequest.fromDateHalf = true;
            this.leaveRequestForm.controls.fromDateHalf.setValue(true,{ emitEvent: false });

            this.isDisableSecondHalf = true;
            this.isDisableFirstHalf = true;
          }
          else {
            this.isSecondHalf = true;
            // this.newLeaveRequest.toDateHalf = true;
            this.leaveRequestForm.controls.toDateHalf.setValue(true,{ emitEvent: false });


            // this.newLeaveRequest.fromDateHalf = false;
            this.leaveRequestForm.controls.fromDateHalf.setValue(false,{ emitEvent: false });

            this.isDisableSecondHalf = false;
            this.isDisableFirstHalf = true;

          }


        }
        // this.newLeaveRequest.fromDateHalf? true: false;
        //
        // this.isSecondHalf=false;
        // this.isFirstHalf= true;

        break;
      } else {
        this.isSecondHalf = true;
        this.isFirstHalf = true;
        this.isDisableSecondHalf ? true : false;
        this.isDisableFirstHalf = false;
        // this.newLeaveRequest.toDateHalf = false;
        this.leaveRequestForm.controls.toDateHalf.setValue(false,{ emitEvent: false });
        // this.newLeaveRequest.fromDateHalf ? true : false;
        this.leaveRequestForm.controls.fromDateHalf.value ? this.leaveRequestForm.controls.fromDateHalf.setValue(true,{ emitEvent: false }):this.leaveRequestForm.controls.fromDateHalf.setValue(false,{ emitEvent: false });


      }
    }
    this.leaveRequestForm.controls.leaveCount.setValue('');
    // this.newLeaveRequest.empid = this.usersession.id;
    if (this.leaveRequestForm.controls.leaveTypeId.value && this.leaveRequestForm.controls.fromDate.value && this.leaveRequestForm.controls.toDate.value) {
      // this.spinner.hide()
      this.setValidateLeave();
    }

  }


  setValidateLeave()
  {

    let obj= {
      'empid':this.userSession.id,
      'fromDate':this.pipe.transform(this.leaveRequestForm.controls.fromDate.value, 'yyyy-MM-dd'),
      'toDate':this.pipe.transform(this.leaveRequestForm.controls.toDate.value, 'yyyy-MM-dd'),
      'fromDateHalf':this.leaveRequestForm.controls.fromDateHalf.value,
      'toDateHalf':this.leaveRequestForm.controls.toDateHalf.value,
      'leaveTypeId':this.leaveRequestForm.controls.leaveTypeId.value,
      'document':this.leaveRequestForm.controls.document.value?true:false,
      'leaveId':this.leaveData?this.leaveData.id:null
    }

    this.LM.setValidateLeave(obj).subscribe((result)=>{
      if(result && result.status){
        var validLeave = JSON.parse(result.data[0].count_json);
        var errorMessage =[];
        for(let i=0;i<validLeave.length;i++){
          errorMessage.push(validLeave[i].message)
        }
        this.leaveRequestForm.controls.leaveCount.setValue(JSON.parse(result.data[0].count_json)[0].leavecount);
        if(result.status && validLeave[0].message === 1){
          if(validLeave[0].fileupload && !this.leaveRequestForm.controls.document.value){
            this.document = false;
            this.leaveRequestForm.controls["document"].setValidators();
            this.leaveRequestForm.get('document').updateValueAndValidity();
          }
          this.isValidateLeave= true;
        } else{
          if(!validLeave[0].fileupload){
            this.document = true;
            this.leaveRequestForm.controls["document"].setValidators([Validators.required]);
            this.leaveRequestForm.get('document').updateValueAndValidity();

          }
          this.isValidateLeave= false;
          // this.open(validLeave,null)
          this.open(validLeave,'8%','40%','400px',true,"/LeaveManagement/LeaveRequest")

          // Swal.fire({title:'',text:validLeave.message?validLeave.message:'please try again later',color:"red",position:'top'});

        }

      }

    })
  }


  open(errormessages:any,top:any,width:any,height:any,flag:any,url:any){
    const dialogRef = this.dialog.open(ConfirmationComponent,{ position: {top: `70px`}, data:{"Message":errormessages,flag:flag,url:url}});
    dialogRef.afterClosed().subscribe(result => {});
  }

  setApplyLeave() {

    this.submitted=true;
    if (this.leaveRequestForm.status === 'VALID') {
        if (this.leaveRequestForm.controls.fromDate.value <= this.leaveRequestForm.controls.toDate.value) {
        this.setValidateLeave();
        if (this.isValidateLeave && this.validEventLeave()) {
          if (this.isFile) {
            // if (this.document) {
            //   this.LM.setUploadDocument(this.formData, this.userSession.id, 'google').subscribe((results) => {
            //   })
            // }

            let obj={
              'id':this.leaveData?this.leaveData.id:'',
              'empid':this.userSession.id,
              'fromDate':this.pipe.transform(this.leaveRequestForm.controls.fromDate.value, 'yyyy-MM-dd'),
              'compOffWorkedDate':this.leaveRequestForm.controls.compoffApprovedDate.value,
              'relation':this.leaveRequestForm.controls.relation.value,
              'toDate':this.pipe.transform(this.leaveRequestForm.controls.toDate.value, 'yyyy-MM-dd'),
              'fromDateHalf':this.leaveRequestForm.controls.fromDateHalf.value,
              'toDateHalf':this.leaveRequestForm.controls.toDateHalf.value,
              'leaveTypeId':this.leaveRequestForm.controls.leaveTypeId.value,
              'leaveCount':this.leaveRequestForm.controls.leaveCount.value,
              'reason':this.leaveRequestForm.controls.reason.value,
              'contact':this.leaveRequestForm.controls.contact.value,
              'emergencyEmail':this.leaveRequestForm.controls.emergencyEmail.value,
              'document':this.leaveRequestForm.controls.document.value,
            }
            this.LM.setEmployeeLeave(obj).subscribe((result) => {
              if (result && result.status) {
                if(!this.file){
                  this.open(result.isLeaveUpdated ? this.msgLM76 : this.msgLM79,'8%','500px','250px',false,"/LeaveManagement/UserDashboard")

                }else{

                  this.LM.getFilepathsMaster(this.activeModule.moduleid).subscribe((resultData) => {
                    if(resultData && resultData.status){
                      let obj = {
                        'id':this.documentId?this.documentId:null,
                        'employeeId':this.userSession.id,
                        'filecategory': this.leaveRequestForm.controls.leaveTypeId.value ==3 ?'SL':'ML',
                        'moduleId':this.activeModule.moduleid,
                        'documentnumber':'',
                        'fileName':this.file.name,
                        'modulecode':resultData.data[0].module_code,
                        'requestId':result.data[0].last_insert_id
                      }
                      this.LM.setFilesMaster(obj).subscribe((data) => {
                        if(data && data.status) {
                          let info =JSON.stringify(data.data[0])
                          this.LM.setProfileImage(this.formData, info).subscribe((data) => {
                            // this.spinner.hide()
                            if(data && data.status){
                              if(this.documentId){
                                this.LMSC.removeImage(this.documentInfo).subscribe((data) => {})
                              }
                              this.open(result.isLeaveUpdated ? this.msgLM76 : this.msgLM79,'8%','500px','250px',false,"/LeaveManagement/UserDashboard")

                            }else{
                              this.open(result.isLeaveUpdated ? this.msgLM76 : this.msgLM79,'8%','500px','250px',false,"/LeaveManagement/UserDashboard")

                            }
                            this.file = null;
                            this.formData.delete('file');

                          });
                        }else{
                          this.LM.deleteFilesMaster(result.data[0].id).subscribe(data=>{})
                          // this.getUploadImage();
                          // this.dialog.open(ConfirmationComponent, {
                          //   position: {top: `70px`},
                          //   disableClose: true,
                          //   data: {Message: this.LM138, url: '/LeaveManagement/EditProfile'}
                          // });
                        }

                      })



                      }

                  })
                }
                // this.cancel(this.leaveRequestForm);
                // this.document = false;
                // this.leaveRequestForm.clearValidators();
                // this.leaveRequestForm.leaveTypeId = '';
                // this.cancel(this.leaveRequestForm);
                // this.leaveRequestForm.reset();
                // this.leaveRequestForm.controls.markAsPristine()
                // this.leaveRequestForm.controls.markAsUntouched();
                // this.ngOnInit();

              }
              else {
                this.open({'Message': this.msgLM119},'8%','500px','250px',false,"/LeaveManagement/UserDashboard")

              }
            })
          }
            else {
            this.isFile = false;
            if(this.ispdf){
              this.open(this.msgLM141,'8%','500px','250px',false,"/LeaveManagement/LeaveRequest")
            }else{
              this.open(this.msgLM140,'8%','500px','250px',false,"/LeaveManagement/LeaveRequest")
            }

            // Swal.fire({title: '', text: 'File size is must be less than 15MB', color: "red", position: 'top'});
          }

        }

      }
      // else{
      //   var errorMessages=[{message:this.msgLM7}]
      //   this.open(errorMessages)
      // }
    }
  }

  fileView(){

   window.open(this.fileURL);

}

  getUploadDocument(){
    this.spinner.show();

    let info = {
      'employeeId':this.userSession.id,
      'filecategory': this.leaveData.leavetypeid==3?'SL':'ML',
      'moduleId':this.activeModule.moduleid,
      'requestId':this.leaveData?this.leaveData.id:null,
    }
    this.LM.getFilesMaster(info).subscribe((result) => {

      if(result && result.status){
        this.documentId = result.data[0].id;
        this.documentInfo = JSON.stringify(result.data[0])
        let documentName = result.data[0].filename.split('_')
        var docArray=[];
        for(let i=0;i<=documentName.length;i++){
          if(i>2){
            docArray.push(documentName[i])
          }
        }
        this.pdfName = docArray.join('')

       result.data[0].employeeId=this.userSession.id;
       let info = result.data[0]
        this.LM.getProfileImage(info).subscribe((imageData) => {
          this.spinner.hide();

          if(imageData.success){
            this.document = true;

            this.leaveRequestForm.controls.document.value=true;
            this.leaveRequestForm.controls.document.clearValidators();
            this.leaveRequestForm.controls.document.updateValueAndValidity();
            this.iseditDoc=false;

            let TYPED_ARRAY = new Uint8Array(imageData.image.data);
            const STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
              return data + String.fromCharCode(byte);
            }, '');

            const file = new Blob([TYPED_ARRAY], { type: "application/pdf" });
            this.fileURL = URL.createObjectURL(file);
          }
        })
      }
      else{
        this.spinner.hide();

      }

    })
    }

  getErrorMessages(errorCode:any)
  {

    this.LM.getErrorMessages(errorCode, 1, 1).subscribe((result) => {

      if (result.status && errorCode == 'LM79') {
        this.msgLM79 = result.data[0].errormessage
      }
      else if (result.status && errorCode == 'LM76') {
        this.msgLM76 = result.data[0].errormessage
      }
      else if (result.status && errorCode == 'LM1') {
        this.msgLM1 = result.data[0].errormessage
      } else if (result.status && errorCode == 'LM3') {
        this.msgLM3 = result.data[0].errormessage
      }else if (result.status && errorCode == 'LM7') {
        this.msgLM7 = result.data[0].errormessage
      }else if (result.status && errorCode == 'LM119') {
        this.msgLM119 = result.data[0].errormessage
      }else if (result.status && errorCode == 'LM140') {
        this.msgLM140 = result.data[0].errormessage
      }else if (result.status && errorCode == 'LM141') {
        this.msgLM141 = result.data[0].errormessage
      }else if (result.status && errorCode == 'LM142') {
        this.msgLM142 = result.data[0].errormessage
      }

    })
  }



  getDurationFoBackDatedLeave() {
    this.LM.getDurationFoBackDatedLeave().subscribe((result) => {
      if (result && result.status) {
        this.roleValue = result.data[0].value
        this.minDate = new Date();
        this.minDate.setDate(this.minDate.getDate() - this.roleValue);
      }

    })
  }

  getleavecyclelastmonth() {
    this.LM.getleavecyclelastmonth().subscribe((result) => {
      if (result && result.status) {
        this.toMaxDate = new Date(result.data[0].last_date);
        this.maxDate = new Date(result.data[0].last_date);
        this.fromMaxDate = new Date(result.data[0].last_date);
      }
    });

  }

  editdoc(){
    this.pdfName=null;
  }
  // getOffDaysCount()
  // {
  //   this.newLeaveRequest.empid = 27;
  //   var fromDate = new Date(this.newLeaveRequest.fromDate);
  //   var toDate = new Date(this.newLeaveRequest.toDate);
  //   // var myDateString1,myDateString2;
  //   // myDateString1 =  fromDate.getFullYear() + '-' +((fromDate.getMonth()+1) < 10 ? '0' + (fromDate.getMonth()+1) : (fromDate.getMonth()+1)) +'-'+ (fromDate.getDate() < 10 ? '0' + fromDate.getDate() : fromDate.getDate());
  //   // myDateString2 =  toDate.getFullYear() + '-' +((toDate.getMonth()+1) < 10 ? '0' + (toDate.getMonth()+1) : (toDate.getMonth()+1)) +'-'+ (toDate.getDate() < 10 ? '0' + toDate.getDate() : toDate.getDate());
  //   // this.newLeaveRequest.fromDate = myDateString1;
  //   // this.newLeaveRequest.toDate = myDateString2;
  //   this.LM.getOffDaysCount(this.newLeaveRequest).subscribe((result) => {
  //     this.leavedata = JSON.padrse(result.data.count_json)
  //     if (this.leavedata[0].message == 1) {
  //       this.document = false;
  //       this.newLeaveRequest.leavecount = this.leavedata[0].leavecount
  //     }
  //     else {
  //       this.document = true;
  //       this.newLeaveRequest.leavecount = this.leavedata[0].leavecount
  //     }
  //
  //   });
  // }
  //


  /**
   * Get approved compoffs dates for leave submit
   **/

  getApprovedCompoffs()
  {
    let obj = {
      id : this.userSession.id,
      leaveId:this.leaveData?this.leaveData.id:null

    }

    this.LM.getApprovedCompoffs(obj).subscribe((result) => {
      if (result && result.status) {
        this.compOffApprovedDates = result.data;
      }

    });

  }



  /**
   * Get relation for bereavement leave submit
   **/

  getEmployeeRelationsForBereavementLeave()
  {
    let obj = {
      id : this.userSession.id,
      leaveId:this.leaveData?this.leaveData.id:null

    }

    this.LM.getEmployeeRelationsForBereavementLeave(obj).subscribe((result) => {
      if (result && result.status) {
        this.employeeRelations = result.data;

      }
      // bereavement_id

    });

  }



  /**
   * Event based leave getting max number of leaves eligible per term
   **/

  getMaxCountPerTermValue(){
    this.LM.getMaxCountPerTermValue(this.leaveRequestForm.controls.leaveTypeId.value).subscribe((result) => {
      if(result && result.status){
        this.maxCountPerTermValue=parseInt(result.data[0].max_count)-1;

      }
    })

  }

  eventBasedLeave(date:any){

    if(this.leaveRequestForm.controls.leaveTypeId.value === '8' || this.leaveRequestForm.controls.leaveTypeId.value === '7' || this.leaveRequestForm.controls.leaveTypeId.value  === '6' || this.leaveRequestForm.controls.leaveTypeId.value  === '5'){
      var featureDate = new Date(date);
      // var featureDate = new Date()
      if(this.leaveRequestForm.controls.fromDateHalf.value){
        this.isFirstHalf = true;
        this.isDisableFirstHalf = true;
        this.leaveRequestForm.controls.toDateHalf.setValue(true,{emitEvent:false});
        // this.newLeaveRequest.toDate= new Date(featureDate.setDate(featureDate.getDate() + this.maxCountPerTermValue+1))
        this.leaveRequestForm.controls.toDate.setValue(new Date(featureDate.setDate(featureDate.getDate() + this.maxCountPerTermValue+1)),{emitEvent:false})
      }else{

        // this.newLeaveRequest.toDate= new Date(featureDate.setDate(featureDate.getDate() + this.maxCountPerTermValue))

        this.leaveRequestForm.controls.toDate.setValue(new Date(featureDate.setDate(featureDate.getDate() + this.maxCountPerTermValue)),{emitEvent:false})

        // this.changeToDate(this.newLeaveRequest.toDate)

      }
      // featureDate.setDate(featureDate.getDate() + 180);//myPastDate is now 8 days in the past
    }
  }

  validEventLeave(){
    if(this.leaveRequestForm.controls.leaveTypeId.value === '8' || this.leaveRequestForm.controls.leaveTypeId.value === '7' || this.leaveRequestForm.controls.leaveTypeId.value === '6' || this.leaveRequestForm.controls.leaveTypeId.value === '5') {

      if((this.leaveRequestForm.controls.fromDate.value  < this.nextLeaveDate) && (this.nextLeaveDate < this.leaveRequestForm.controls.toDate.value)){

        var errorMessages = [{message: "Please cancel the leave on "+this.pipe.transform(this.nextLeaveDate, 'yyyy-MM-dd')+" day"},{message: "Please change from date"}]
        this.open(errorMessages,'8%','40%','400px',true,"/LeaveManagement/LeaveRequest")
        return  false;
      }
      else if(this.maxCountPerTermValue+1 != parseInt(this.leaveRequestForm.controls.leaveCount.value)){
        var maxValue = this.maxCountPerTermValue+1;
        var errorMessages = [{message: "Total Leave count should be "+maxValue+" days"},
          {message: "Please change from date"}]
        this.open(errorMessages,'8%','40%','400px',true,"/LeaveManagement/LeaveRequest")
        return  false;
      }else if(!this.leaveRequestForm.controls.fromDateHalf.value && this.leaveRequestForm.controls.toDateHalf.value){
        var errorMessages = [{message: "Change from date because you already submitted second half"}]
        this.open(errorMessages,'8%','40%','400px',true,"/LeaveManagement/LeaveRequest")
        return  false;
      } else{
        return  true;
      }

    }else{
      return true;
    }

  }
ispdf:boolean=false;
file:any;

  onSelectFile(event:any) {

    this.iseditDoc=true;

    if (event.target.files[0].size <= 1242880) {
    //  var pdfArray =[];

      this.file= event.target.files[0];
      var pdf = this.file.name.split('.');

    if(pdf[pdf.length-1] == 'pdf'){
      this.isFile = true;
      this.formData.append('file', this.file, this.file.name);
      this.setValidateLeave()
    }else{
      this.ispdf=true;
      this.isFile = false;
      this.setValidateLeave()
      this.open(this.msgLM141,'8%','500px','250px',false,"/LeaveManagement/LeaveRequest")


    }

    } else {
      this.ispdf=false;
      this.isFile = false;
      this.setValidateLeave()
      this.open(this.msgLM140,'8%','500px','250px',false,"/LeaveManagement/LeaveRequest")
      // Swal.fire({title: '', text: 'File size is must be less than 15MB', color: "red", position: 'top'});

    }
  }


  /**
   * deleted upload documents in sick leave submit
   **/
  delete()
  {
    this.leaveRequestForm.controls.document.setValue("");
  }


}
