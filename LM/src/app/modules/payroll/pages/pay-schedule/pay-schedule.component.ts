import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PayrollService } from '../../payroll.service';
@Component({
  selector: 'app-pay-schedule',
  templateUrl: './pay-schedule.component.html',
  styleUrls: ['./pay-schedule.component.scss']
})
export class PayScheduleComponent implements OnInit {
  payfrequency:any;
  firstpayperiod:any;
  leaveWindowStartDate:any;
  leaveWindowEndDate:any;
  payollwindowfromdate:any;
  payrollwindowtodate:any;
  payDay:any;
  companyPayrollCycle:any;
  payData :any= {};



  constructor(private router:Router,private PR:PayrollService) { }

  ngOnInit(): void {
   this.getCompanyPaySchedule();
  }
  onRequestClick(){
    this.router.navigate(["/Payroll/PayScheduleRequest"],{state: {payScheduleData:this.payData,routeName:'/Payroll/PaySchedule'}});
  }
  /**Get company Payschedules Details*/
  getCompanyPaySchedule(){
    this.PR.getCompanyPaySchedule().subscribe((result:any)=>{
      if(result.status){
        let data = result.data[0];
        for(let i=0;i<data.length;i++){
          if(data[i].rule_name == "COMPANY_PAYROLL_CYCLE"){
            this.companyPayrollCycle = data[i].rule_value;
            this.payData.companyPayrollCycle = this.companyPayrollCycle;
          }
          else if(data[i].rule_name == "CALCULATE_SALARY_BASED_ON_WORKING_DAYS_OR_CALENDAR_DAYS")
          {
            this.payData.caluculateSalaryBasedON=data[i].rule_value
          }
          else if(data[i].rule_name == "SALARY_PAY_DAY_OF_MONTH")
          {
            this.payDay = data[i].rule_value;
            this.payData.salaryPayDayOfMonth=data[i].rule_value
          }
          else if(data[i].rule_name == "PAYROLL_WINDOW_FROM_DATE")
          {
            this.payData.payrollWindowFromDate=data[i].rule_value
          }
          else if(data[i].rule_name == "PAYROLL_WINDOW_TO_DATE")
          {
            this.payData.payrollWindowToDate=data[i].rule_value
          }
          else if(data[i].rule_name == "LEAVE_WINDOW_START_DATE")
          {

              this.leaveWindowStartDate = this.getPreviousMonthDays(data[i].rule_value)
            // if(lastDayOfMonth)
             this.payData.leaveWindowStartDate = data[i].rule_value;

          }
          else if(data[i].rule_name == "LEAVE_WINDOW_END_DATE")
          {
            this.leaveWindowEndDate = this.getPresentMonthDays(data[i].rule_value);
            this.payData.leaveWindowEndDate = data[i].rule_value;

          }

        else if(data[i].rule_name == "NON_WORKING_DAY_PAYMENT_OPTION")
          {
            this.payData.nonWorkingDayPaymentOption = data[i].rule_value;

          }



        }
      }
    })

  }

  getPresentMonthDays(info:any){
    let lastDayOPresentMonth =null;
    let today = new Date();
    lastDayOPresentMonth = new Date(today.getFullYear(), today.getMonth()+1, 0).getDate();
    let date = null;
    if(info == 'LAST_DAY'){
      date = 'Last Day';
    }else if (info == 'LAST_BUT_1_DAY') {
      date = 'Last But 1 Day';

    }else if (info == 'LAST_BUT_2_DAYS'){
      date = 'Last But 2 Days';

    }
    else if (info == 'LAST_BUT_3_DAYS'){
      date = 'Last But 3 Days';
    }
    else if (info == 'LAST_DAY_OF_PRESENT_MONTH'){
      date = 'Last Day';
    }
    else {
      date = info;
    }
    return date

  }
  getPreviousMonthDays(info:any){
    let lastDayOfPreviousMonth =null;
    let today = new Date();
    let Month = today.getMonth()+1;
    lastDayOfPreviousMonth = new Date(Month === 1 ? today.getFullYear()-1:today.getFullYear(), Month === 1 ?12:Month-1, 0).getDate();
    let date = null;
    if(info == 'LAST_DAY'){
      date = 'Last Day';
    }else if (info == 'LAST_BUT_1_DAY') {
      date = 'Last But 1 Day';

    }else if (info == 'LAST_BUT_2_DAYS'){
      date = 'Last But 2 Days';

    }
    else if (info == 'LAST_BUT_3_DAYS'){
      date = 'Last But 3 Days';

    }
    else if (info == 'LAST_DAY_OF_PRESENT_MONTH'){
      date = 'Last Day of the present month';
    }
    else {
      date = info;
    }
    return date

  }
}
