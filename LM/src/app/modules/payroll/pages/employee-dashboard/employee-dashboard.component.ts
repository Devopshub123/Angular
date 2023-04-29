import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { PayrollService } from '../../payroll.service';
import { Router } from '@angular/router';
import { ConditionalExpr } from '@angular/compiler';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.scss']
})
export class EmployeeDashboardComponent implements OnInit {
  Empdashboardform!: FormGroup;
  financeyears:any=[];
  userSession:any;
  dataSource:any=[];
  EPFfulldetails:any=[];
  deduction:any;
  month:any;
  public chartType: ChartType = 'doughnut';
  public data: ChartData<'doughnut'> = {
    labels: ['one', 'two', 'three'],
    datasets: [
      {
        label: 'data 1',
        data: [350, 450, 100]
      },
      // {
      //   label: 'data 2',
      //   data: [350, 450, 100]
      // }
    ]
  };

  public options: ChartOptions<'doughnut'> = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }

  constructor(private router:Router,private PR:PayrollService,private formBuilder: FormBuilder) {
    this.getFinancialYears();
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
   }
  arrayValue:any=['January','Febraury','March','April','May','June','July','August','September','October','November','December'];
  ngOnInit(): void {
    this.getEmployeeEpfDetails();
    this.Empdashboardform = this.formBuilder.group(
      {
        financial_year:  ["2022-2023"],
        EPF:[this.arrayValue[new Date().getMonth()]]
      });
      this.getEmployeePayslips("2022-2023");
      this.Empdashboardform.get('financial_year')?.valueChanges.subscribe((selectedValue:any) => {
        this.getEmployeePayslips(selectedValue);
      })
      this.Empdashboardform.get('EPF')?.valueChanges.subscribe((selectedValue:any) => {
        // this.getEmployeePayslips(selectedValue);
        for(let i=0;i<this.EPFfulldetails.length;i++){
          if(this.EPFfulldetails[i].month_name == selectedValue){
            this.deduction = this.EPFfulldetails[i].employee_provident_fund;
            this.month = selectedValue;
            break;
          }
        }
      })
  }

   /** getFinancialYears Data*/
   getFinancialYears(){
    this.PR.getFinancialYears().subscribe((result:any)=>{
      if(result.status && result.data.length>0){
        this.financeyears = result.data;
      }
      else{
        this.financeyears=[]
      }
    })
  }

      /**getEmployeePayslips */
      getEmployeePayslips(fyear:any){
        let data={
          fyear:fyear,
          id:this.userSession.id
        }
        this.dataSource=[];
        this.PR.getEmployeePaySlips(data).subscribe((result:any)=>{
          if(result.status&&result.data.length>0){
            this.dataSource =result.data;
            let datas ={
              id:this.dataSource.id,
              empid:this.userSession.id
            }
       
            this.PR.getEmployeePayslipDetails(datas).subscribe((result:any)=>{
           })
          }
        })
      }
      getEmployeeEpfDetails(){
        this.PR.getEmployeeEpfDetails(this.userSession.id).subscribe((result:any)=>{
          this.EPFfulldetails=[];
          if(result.status){
            this.EPFfulldetails =result.data;
            for(let i=0;i<this.EPFfulldetails.length;i++){
              if(this.EPFfulldetails[i].month_name == this.arrayValue[new Date().getMonth()]){
                this.deduction = this.EPFfulldetails[i].employee_provident_fund;
                this.month = this.arrayValue[new Date().getMonth()];
                break;
              }
            }
          }
         
        })

      }

      payslipview(data:any){
        this.router.navigate(["/Payroll/PaySlipsView"],{state: {userData:data}}); 
        
         
          
        

      }      

}
