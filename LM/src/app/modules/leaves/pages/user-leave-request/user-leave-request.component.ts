import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {LeavesService} from "../../leaves.service";
import {DatePipe} from "@angular/common";
import {ConfirmationComponent} from "../../dialog/confirmation/confirmation.component";

@Component({
  selector: 'app-user-leave-request',
  templateUrl: './user-leave-request.component.html',
  styleUrls: ['./user-leave-request.component.scss']
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
  FromDatesHalfDays:any=[];
  ToDatesHalfDays:any=[];
  fromDateFilter:any;
  toDateFilter:any;
  pipe = new DatePipe('en-US');
  isFirstHalf: boolean = true;
  isSecondHalf: boolean = true;
  toMaxDate: any;
  isDisableFirstHalf: boolean = false;
  isDisableSecondHalf: boolean = false;
  document: boolean = false;
  isValidateLeave: boolean = false;
  msgLM79: any;
  msgLM76: any;
  msgLM1: any;
  msgLM3: any;
  msgLM7: any;


  constructor(private router: Router,private LM:LeavesService,private formBuilder: FormBuilder,private dialog: MatDialog) { }

  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.leaveRequestForm = this.formBuilder.group({
      leaveTypeId: ['',Validators.required],
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
    this.getLeaveBalance();
    this.getLeavesTypeInfo();
    this.getDaystobedisabledfromdate();
    this.getDaystobedisabledtodate();
    this.leaveRequestForm.get('leaveTypeId')?.valueChanges.subscribe((selectedValue:any) => {
      this.leaveRequestForm.controls.fromDate.setValue('');
      this.leaveRequestForm.controls.toDate.setValue('');
      this.leaveRequestForm.controls.fromDateHalf.setValue('');
      this.leaveRequestForm.controls.toDateHalf.setValue('');
      this.leaveRequestForm.controls.leaveCount.setValue('');
      this.leaveRequestForm.controls.reason.setValue('');
      this.leaveRequestForm.controls.reason.setValue('');
      this.leaveRequestForm.controls.contact.setValue(this.userSession.contactnumber);
      this.leaveRequestForm.controls.emergencyEmail.setValue('');

    });
    // this.leaveRequestForm.get('fromDate')?.valueChanges.subscribe((selectedValue:any) => {
    //   console.log("fromDate")
    //   if(selectedValue) {
    //     this.changeFromDate(selectedValue);
    //   }
    // });
    //
    // this.leaveRequestForm.get('toDate')?.valueChanges.subscribe((selectedValue:any) => {
    //   if(selectedValue) {
    //     this.changeToDate(selectedValue);
    //   }
    // });

    this.leaveRequestForm.get('fromDateHalf')?.valueChanges.subscribe((selectedValue:any) => {
      if(selectedValue) {
        this.changeHalfs();
      }
    });

    this.leaveRequestForm.get('toDateHalf')?.valueChanges.subscribe((selectedValue:any) => {
      if(selectedValue) {
        this.changeHalfs();
      }
    });

    this.getErrorMessages('LM1')
    this.getErrorMessages('LM3')
    this.getErrorMessages('LM79')
    this.getErrorMessages('LM76')
    this.getErrorMessages('LM7')
  }
  changeHalfs(){
    if (this.leaveRequestForm.controls.leaveTypeId.value && this.leaveRequestForm.controls.fromDate.value && this.leaveRequestForm.controls.toDate.value) {
      this.setValidateLeave();
    }
  }

  getLeaveBalance() {
    this.LM.getLeaveBalance(this.userSession.id).subscribe((result) => {
      if(result && result.status){
        this.leavebalance = this.leaveTypes(result.data[0])
      }
    })
  }
  /**
   * leaveTypes
   * few leavetypes will display based on  gender and maritalstatus in leave types dropdown
   **/

  leaveTypes(leaveTypes:any){
    var data = [];
    for (var i = 0; i < leaveTypes.length; i++) {

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

  getLeavesTypeInfo() {
    this.LM.getLeavesTypeInfo().subscribe((result) => {
        console.log("OUThello12121", result.data)
        if (result.status) {
          this.leavesTypeData = this.leaveTypes(result.data);
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
    console.log("onetwo")
    // this.spinner.show()
    // var info = this.LM.getDaysToBeDisabledFromDate(this.userSession.id, this.newLeaveRequest.id ? this.newLeaveRequest.id : null).then((result) => {

      var info = this.LM.getDaysToBeDisabledFromDate(this.userSession.id,  null).then((result) => {

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



        // if(this.leaveData && (!this.newLeaveRequest.toDateHalf || !this.newLeaveRequest.fromDateHalf )){
        //   if(this.newLeaveRequest.id == 9){
        //     this.changeCompOffFromDate(new Date(this.leaveData.fromdate))
        //   }else{
        //     this.changeFromDate(new Date(this.leaveData.fromdate));
        //     this.changeToDate(new Date(this.leaveData.todate))
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

    var data =  this.LM.getDaysToBeDisabledToDate(this.userSession.id,  null).then((result) => {
      if (result && result.status) {
        console.log("fulltodate", result.data)
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
        console.log('ToDatesHalfDays', this.ToDatesHalfDays)

      }

    })
  }

  // disabledCalender(){
  //
  // }
  // setApplyLeave(){
  //
  // }

  cancel(){

  }



  changeFromDate(date:any) {
    // this.newLeaveRequest.toDate = date;
    for (let i = 0; i < this.FromDatesHalfDays.length; i++) {
      if (this.FromDatesHalfDays[i].edate === this.pipe.transform(date, 'yyyy-MM-dd')) {
        if (this.FromDatesHalfDays[i].first_half === 0 && this.FromDatesHalfDays[i].second_half) {
          // this.newLeaveRequest.toDateHalf = true;
          this.leaveRequestForm.controls.toDateHalf.setValue(true);

          this.isDisableFirstHalf = true;
          this.isDisableSecondHalf = false;
          // this.newLeaveRequest.fromDateHalf = false;
          this.leaveRequestForm.controls.fromDateHalf.setValue(false);
          this.isSecondHalf = false;
          this.isFirstHalf = true;
          this.leaveRequestForm.controls.toDate.setValue(date)
          if (this.leaveRequestForm.controls.leaveTypeId.value && this.leaveRequestForm.controls.fromDate.value && this.leaveRequestForm.controls.toDate.value) {
            this.setValidateLeave();
          }
          break;
        } else if (this.FromDatesHalfDays[i].first_half && this.FromDatesHalfDays[i].second_half === 0) {
          console.log(":::::::")
          this.leaveRequestForm.controls.toDateHalf.setValue(false);
          this.isDisableFirstHalf = false;
          this.isDisableSecondHalf = true;
          this.leaveRequestForm.controls.fromDateHalf.setValue(true);
          this.isSecondHalf = true;
          this.isFirstHalf = false;
          break;
          if (this.leaveRequestForm.controls.leaveTypeId.value && this.leaveRequestForm.controls.fromDate.value && this.leaveRequestForm.controls.toDate.value) {
            this.setValidateLeave();
          }
        }

      }else {
        this.leaveRequestForm.controls.toDateHalf.setValue(false);
        this.isDisableFirstHalf = false;
        this.isDisableSecondHalf = false;
        this.leaveRequestForm.controls.fromDateHalf.setValue(false);
        this.isSecondHalf = false;
        this.isSecondHalf = true;
        this.isFirstHalf = true;

      }
    }
    if (this.leaveRequestForm.controls.leaveTypeId.value && this.leaveRequestForm.controls.fromDate.value && this.leaveRequestForm.controls.toDate.value) {
      this.setValidateLeave();
    }
  }

  changeToDate(date:any)
  {
    console.log("two")


    for (let i = 0; i < this.ToDatesHalfDays.length; i++) {
      if (this.ToDatesHalfDays[i].edate === this.pipe.transform(date, 'yyyy-MM-dd')) {
        if (this.ToDatesHalfDays[i].first_half && this.ToDatesHalfDays[i].second_half === 0) {
          // this.newLeaveRequest.toDateHalf = false;
          this.leaveRequestForm.controls.toDateHalf.setValue(false);
          // this.newLeaveRequest.fromDateHalf = true;
          this.leaveRequestForm.controls.fromDateHalf.setValue(true);
          this.isFirstHalf = false;
          this.isDisableSecondHalf = true;
          this.isDisableFirstHalf = false;

        }
        else if (this.ToDatesHalfDays[i].first_half === 0 && this.ToDatesHalfDays[i].second_half) {

          if (this.leaveRequestForm.controls.fromDate.value === this.leaveRequestForm.controls.toDate.value) {
            // this.newLeaveRequest.toDateHalf = true;
            this.leaveRequestForm.controls.toDateHalf.setValue(true);

            // this.newLeaveRequest.fromDateHalf = false;
            this.leaveRequestForm.controls.fromDateHalf.setValue(false);

            // this.maxDate = date;
            this.leaveRequestForm.controls.toDate.setValue(date);
            // this.newLeaveRequest.toDate = date;
            this.isSecondHalf = false;
            this.isDisableSecondHalf = false;
            this.isDisableFirstHalf = true;

          } else if (this.leaveRequestForm.controls.fromDateHalf.value && this.ToDatesHalfDays[i].first_half === 0) {
            this.isSecondHalf = true;
            this.isFirstHalf = true;
            // this.newLeaveRequest.toDateHalf = true;
            this.leaveRequestForm.controls.toDateHalf.setValue(true);

            // this.newLeaveRequest.fromDateHalf = true;
            this.leaveRequestForm.controls.fromDateHalf.setValue(true);

            this.isDisableSecondHalf = true;
            this.isDisableFirstHalf = true;
          }
          else {
            this.isSecondHalf = true;
            // this.newLeaveRequest.toDateHalf = true;
            this.leaveRequestForm.controls.toDateHalf.setValue(true);


            // this.newLeaveRequest.fromDateHalf = false;
            this.leaveRequestForm.controls.fromDateHalf.setValue(false);

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
        this.leaveRequestForm.controls.toDateHalf.value ? this.leaveRequestForm.controls.toDateHalf.setValue(true):this.leaveRequestForm.controls.toDateHalf.setValue(false);

        // this.newLeaveRequest.fromDateHalf ? true : false;
        this.leaveRequestForm.controls.fromDateHalf.value ? this.leaveRequestForm.controls.fromDateHalf.setValue(true):this.leaveRequestForm.controls.fromDateHalf.setValue(false);


      }
    }
    this.leaveRequestForm.controls.leaveCount.setValue('');
    console.log("three")

    // this.newLeaveRequest.empid = this.usersession.id;
    console.log("hghghghghgcghchg",this.leaveRequestForm.controls.leaveTypeId.value && this.leaveRequestForm.controls.fromDate.value && this.leaveRequestForm.controls.toDate.value)
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
      'document':false,
    }

    this.LM.setValidateLeave(obj).subscribe((result)=>{
      if(result && result.status){
        var validLeave = JSON.parse(result.data[0].count_json);
        console.log("temmmm",validLeave)
        var errorMessage =[];
        for(let i=0;i<validLeave.length;i++){
          errorMessage.push(validLeave[i].message)
        }
        console.log("errorMessage",errorMessage)

        this.leaveRequestForm.controls.leaveCount.setValue(JSON.parse(result.data[0].count_json)[0].leavecount);
        if(result.status && validLeave[0].message === 1){
          if(validLeave[0].fileupload && !this.leaveRequestForm.controls.document.value){
            this.document = false;
          }
          this.isValidateLeave= true;
        } else{
          if(!validLeave[0].fileupload){
            this.document = true;
          }
          this.isValidateLeave= false;
          this.open(validLeave)
          // Swal.fire({title:'',text:validLeave.message?validLeave.message:'please try again later',color:"red",position:'top'});

        }

      }

    })
  }


  open(errormessages:any){
    const dialogRef = this.dialog.open(ConfirmationComponent,{ position:{top:'8%'},width:'40%',height:'400px',data:{"Messages":errormessages,flag:true}});
    dialogRef.afterClosed().subscribe(result => {
      if(result.status)
      {
        // this.getRoleMaster();
      }
    });

  }

  setApplyLeave() {
    // this.isLeaveRequestSubmitted = true;
    console.log("status",this.leaveRequestForm.status)
    if (this.leaveRequestForm.status === 'VALID') {
      if (this.leaveRequestForm.controls.fromDate.value <= this.leaveRequestForm.controls.toDate.value) {
        this.setValidateLeave();
        // this.isValidateLeave = true;
        // console.log("hello", this.newLeaveRequest)
        if (this.isValidateLeave) {
          // if (this.isFile) {
            // this.newLeaveRequest.fromDate = this.pipe.transform(this.newLeaveRequest.fromDate, 'yyyy-MM-dd')
            // this.newLeaveRequest.toDate = this.pipe.transform(this.newLeaveRequest.toDate, 'yyyy-MM-dd')
            if (this.document) {
              // this.LM.setUploadDocument(null,this.userSession.id,'Sreeb').subscribe((results) => {
              // })
            }
            let obj={
              'empid':this.userSession.id,
              'fromDate':this.pipe.transform(this.leaveRequestForm.controls.fromDate.value, 'yyyy-MM-dd'),
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
            // console.log("hello", this.newLeaveRequest.compOffWorkedDate = this.datepipe.transform(this.newLeaveRequest.compoffApprovedDate, 'yyyy-MM-dd'))
            // this.newLeaveRequest.fromDate = this.datepipe.transform(this.newLeaveRequest.fromDate, 'yyyy-MM-dd')
            this.LM.setEmployeeLeave(obj).subscribe((result) => {
              if (result.status) {

                // Swal.fire({
                //   text: result.isLeaveUpdated ? this.msgLM76 : this.msgLM79,
                //   icon: 'success',
                //   position: 'top',
                //   iconColor: 'blue',
                //   showCloseButton: true,
                //   allowOutsideClick: false
                // }).then((result) => {
                //   if (result.isConfirmed) {
                //     this.router.navigate(['UserDashboard']);
                //   }
                // });
                this.leaveRequestForm.leaveTypeId = '';
                this.leaveRequestForm.reset();
                // this.isLeaveRequestSubmitted = false;
                this.document = false;
                this.ngOnInit();

              }
              else {
                // this.newLeaveRequest.fromDate = new Date(this.newLeaveRequest.fromDate)
                // this.newLeaveRequest.toDate = new Date(this.newLeaveRequest.toDate)

                // Swal.fire({text: "please try again later", color: "red", position: 'top', showCloseButton: true});

              }
            })
          // } else {
          //   this.isFile = false;
          //   Swal.fire({title: '', text: 'File size is must be less than 15MB', color: "red", position: 'top'});
          // }

        }
      }else{
        var errorMessages=[{message:this.msgLM7}]
        this.open(errorMessages)
      }
    }
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
      }

    })
  }


}
