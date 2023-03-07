import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import {PayrollService} from "../../payroll.service";
import {Location} from "@angular/common";
import {Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import {MatTableDataSource} from "@angular/material/table";
// import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-pay-schedule-request',
  templateUrl: './pay-schedule-request.component.html',
  styleUrls: ['./pay-schedule-request.component.scss']
})
export class PayScheduleRequestComponent implements OnInit {
  payGroupRequestForm!: FormGroup;
  isShowWorkingDaysText: boolean = false;
  isShowSalaryDayText: boolean = false;
  payScheduleDetails :any;
  PR7:any;
  PR8:any;
  messagesDataList:any;
  // editInfo:any=[]
  constructor(private formBuilder: FormBuilder,private location:Location,private PR:PayrollService,private router:Router,private dialog: MatDialog) {
    this.payScheduleDetails= this.location.getState();

    // this.payScheduleDetails = this.editInfo.payScheduleData

  }
  arrayValue:any=[{Value:'CALENDAR',name:'Actual days in a month '},{Value:'WORKING',name:'Organization working days'}];
  arrayPayValue:any=[{Value:'0',name:'The last working day of every month '},{Value:'1',name:'Select day of every month'}];

  ngOnInit(): void {
    if(!this.payScheduleDetails.payScheduleData){
      this.router.navigate(["/Payroll/PaySchedule"])
    }
    console.log("this.payScheduleDetails.payScheduleData",this.payScheduleDetails.payScheduleData)
    this.payGroupRequestForm = this.formBuilder.group(
      {
        paymentFrequency: ["Monthly"],
        caluculateSalaryBasedON:  [this.payScheduleDetails ?this.payScheduleDetails.payScheduleData ? this.payScheduleDetails.payScheduleData.caluculateSalaryBasedON :'':'' ],
        days_range:  [this.payScheduleDetails ?this.payScheduleDetails.payScheduleData ? this.payScheduleDetails.payScheduleData.salaryPayDayOfMonth !== 'LAST_WORKING_DAY'?this.payScheduleDetails.payScheduleData.salaryPayDayOfMonth:'':'':''],
        pay_employee: [this.payScheduleDetails ?this.payScheduleDetails.payScheduleData ? this.payScheduleDetails.payScheduleData.salaryPayDayOfMonth == 'LAST_WORKING_DAY'? '0':'1':'':'' ],
        date_salary:[""],
        first_payroll: [""],
        status: [""],
        companyPayrollCycle:[this.payScheduleDetails ?this.payScheduleDetails.payScheduleData ? this.payScheduleDetails.payScheduleData.companyPayrollCycle :'':'' ],
        payrollFromDate: ["First Day of the month"],
        payrollToDate:["Last Day of the present month"],
        leaveWindowStartDate: [this.payScheduleDetails ?this.payScheduleDetails.payScheduleData ? this.payScheduleDetails.payScheduleData.leaveWindowStartDate :'':'' ],
        leaveWindowEndDate:[this.payScheduleDetails ?this.payScheduleDetails.payScheduleData ? this.payScheduleDetails.payScheduleData.leaveWindowEndDate :'':'' ],
        payroll_leavewindow:[""],
        nonWorkingDayPaymentOption:['']
      });
      this.payGroupRequestForm.get('payroll_leavewindow')?.valueChanges.subscribe(selectedValue=>{
        if(selectedValue){
          this.payGroupRequestForm.controls.leaveWindowStartDate.setValue('First Day of the month');
          this.payGroupRequestForm.controls.leaveWindowEndDate.setValue("Last Day of the present month");
        }
        
      });
      this.payGroupRequestForm.get('leaveWindowStartDate')?.valueChanges.subscribe(selectedValue=>{
        if(this.payGroupRequestForm.controls.payroll_leavewindow){
          if(selectedValue == 'LAST_DAY'){
            this.payGroupRequestForm.controls.leaveWindowEndDate.setValue('LAST_BUT_1_DAY')
          }
          else if(selectedValue == 'LAST_BUT_1_DAY'){
            this.payGroupRequestForm.controls.leaveWindowEndDate.setValue('LAST_BUT_2_DAYS')
          }
          else if(selectedValue == 'LAST_BUT_2_DAYS'){
            this.payGroupRequestForm.controls.leaveWindowEndDate.setValue('LAST_BUT_3_DAYS')
          }
          else{
            this.payGroupRequestForm.controls.leaveWindowEndDate.setValue(JSON.stringify(Number(selectedValue)-1))
          }
        }
        
      });


    if( this.payGroupRequestForm.controls.leaveWindowStartDate.value == '1' && this.payGroupRequestForm.controls.leaveWindowEndDate.value == 'LAST_DAY_OF_PRESENT_MONTH'){
      this.payGroupRequestForm.controls.payroll_leavewindow.setValue(true)
    }else {
      this.payGroupRequestForm.controls.payroll_leavewindow.setValue(false)

    }

    if(this.payScheduleDetails && this.payScheduleDetails.payScheduleData && this.payScheduleDetails.payScheduleData.nonWorkingDayPaymentOption == 'NEXT_DAY'){
      this.payGroupRequestForm.controls.nonWorkingDayPaymentOption.setValue(true)
    }else if(this.payScheduleDetails&& this.payScheduleDetails.payScheduleData && this.payScheduleDetails.payScheduleData.nonWorkingDayPaymentOption == 'PREVIOUS_DAY'){
      this.payGroupRequestForm.controls.nonWorkingDayPaymentOption.setValue(false)

    }
    this.getMessagesList();



  }




  setPayGroup(){
    if(this.payGroupRequestForm.controls.leaveWindowStartDate.value!='' && this.payGroupRequestForm.controls.payroll_leavewindow.value){
      let input = {
        monthlySalaryCalculationBasis:this.payGroupRequestForm.controls.caluculateSalaryBasedON.value,
        payDayOfMonth:null,
        // payDayOfMonth:this.payGroupRequestForm.controls.pay_employee.value === '0' ? "LAST_WORKING_DAY" :this.payGroupRequestForm.controls.days_range.value,
        payrollWindowFromDate:'1',
        payrollWindowToDate:"LAST_DAY_OF_PRESENT_MONTH",
        leaveWindowFromDateInPreviousMonth:this.payGroupRequestForm.controls.payroll_leavewindow.value?'1':this.payGroupRequestForm.controls.leaveWindowStartDate.value,
        leaveWindowToDateInCurrentMonth:this.payGroupRequestForm.controls.payroll_leavewindow.value?'LAST_DAY_OF_PRESENT_MONTH':this.payGroupRequestForm.controls.leaveWindowEndDate.value,
        nonWorkingDayPaymentOption:null
        // nonWorkingDayPaymentOption:this.payGroupRequestForm.controls.pay_employee.value === '0' ? null:this.payGroupRequestForm.controls.nonWorkingDayPaymentOption.value === true ? 'NEXT_DAY':'PREVIOUS_DAY'
      }
      this.PR.setCompanyPaySchedule(input).subscribe((result:any)=> {
        if(result && result.status){
          this.router.navigate(["/Payroll/PaySchedule"])
          this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: this.PR8
          });
  
        }else {
          this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: this.PR7
          });
        }
  
  
      })

    }
    else{
      this.dialog.open(ReusableDialogComponent, {
        position:{top:`70px`},
        disableClose: true,
        data: "Please select new leave window start date and end date."
      });

    }
   

  }
  cancel(){
    this.router.navigate(["/Payroll/PaySchedule"]); 

  }
  status(status:any,type:any){
    if(status == '1' && type == 'monthly')
    {
      this.isShowWorkingDaysText = true;
    }
    else if(status == '0' && type == 'monthly')
    {
      this.isShowWorkingDaysText = false;
    }
    else if(status == '1' && type == 'salary')
    {
      this.isShowSalaryDayText = true;
    }
    else if(status == '0' && type == 'salary')
    {
      this.isShowSalaryDayText = false;
    }
  }
  getMessagesList() {
    let data =
      {
        "code": null,
        "pagenumber":1,
        "pagesize":1000
      }
    this.PR.getErrorMessages(null,1,1000).subscribe((res:any)=>{
      if(res.status && res.data && res.data.length >0) {
        this.messagesDataList = res.data;
        this.messagesDataList.forEach((e: any) => {
          if (e.code == "PR7") {
            this.PR7 = e.message
          } else if (e.code == "PR8") {
            this.PR8 =e.message
          }
        })

      }

    })
  }
}
