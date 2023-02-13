import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { PayrollService } from '../../payroll.service';
export interface SalaryGroupElement {
  Salary_Components: string;  
  Amount_Monthly: string;
  Amount_Annually: string;  
}
// const ELEMENT_DATA: SalaryGroupElement[] = [
//   {Salary_Components: 'Basic', Amount_Monthly: '3,02,084.00',Amount_Annually:'36,25,008.00'},
//   {Salary_Components: 'HRA', Amount_Monthly: '3,02,084.00',Amount_Annually:'36,25,008.00'},
//   {Salary_Components: 'Conveyance', Amount_Monthly: '3,02,084.00',Amount_Annually:'36,25,008.00'},
//   {Salary_Components: 'Fixed Allowance', Amount_Monthly: '3,02,084.00',Amount_Annually:'36,25,008.00'},
//   {Salary_Components: 'Total', Amount_Monthly: '6,02,084.00',Amount_Annually:'72,50,008.00'}
// ];
@Component({
  selector: 'app-salary-master',
  templateUrl: './salary-master.component.html',
  styleUrls: ['./salary-master.component.scss']
})
export class SalaryMasterComponent implements OnInit {
  salaryMasterForm!: FormGroup;
  durationlist:any=[];
  userSession: any;
  constructor(private PR:PayrollService,private formBuilder: FormBuilder,) {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.getEmployeeDurationsForSalaryDisplay(this.userSession.id);
   }
  displayedColumns: string[] = ['Salary_Components', 'Amount_Monthly','Amount_Annually'];
  dataSource : any=[];
  ngOnInit(): void {
    this.salaryMasterForm = this.formBuilder.group({
      range:[1]
    });
    this.salaryMasterForm.get('range')?.valueChanges.subscribe((selectedValue:any) => {
      this.getEmployeeSalaryDetais(selectedValue);
    })
    
  }
  /** emplaoyee salary duration time period*/
  getEmployeeDurationsForSalaryDisplay(id:any){
    this.PR.getEmployeeDurationsForSalaryDisplayForCTC(id).subscribe((result:any)=>{
      if(result.status){
        this.durationlist=result.data[0]
      }
      else{
        this.durationlist=[]
      }
    })
  }/**get employee salary details */
  getEmployeeSalaryDetais(data:any){
     this.PR.getCtcDetails(this.userSession.id,data).subscribe((result:any)=>{
      if(result.status){
        this.dataSource = result.data[0]
      }
     })
  }

}
