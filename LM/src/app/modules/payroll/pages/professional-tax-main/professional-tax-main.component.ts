import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
export interface SalaryGroupElement {
  Sno: string;  
  State: string;
  ptSlabs: string;  
  action: string;
}
const ELEMENT_DATA: SalaryGroupElement[] = [
  {Sno: '1', State: 'Telangana',ptSlabs:'view',action:'edit'},
  {Sno: '2', State: 'Andhra Pradesh',ptSlabs:'view',action:'edit'},
  {Sno: '3', State: 'Maharasthra',ptSlabs:'view',action:'edit'}  
];
@Component({
  selector: 'app-professional-tax-main',
  templateUrl: './professional-tax-main.component.html',
  styleUrls: ['./professional-tax-main.component.scss']
})
export class ProfessionalTaxMainComponent implements OnInit {

  constructor(private router:Router) { }
  displayedColumns: string[] = ['Sno', 'State','ptSlabs','action'];
  dataSource = ELEMENT_DATA;
  ngOnInit(): void {
   
  }
  onRequestClick(){     
    this.router.navigate(["/Payroll/ProfessionalTaxRequest"],{state: {}}); 
  }
  onEditClick(element:any){  
    console.log("Element",element);
   /* this.router.navigate(["/Payroll/InvestmentRequest"],{state: {userData:element}}); */
  }
  onViewClick(element:any){  
    console.log("Element",element);
   /* this.router.navigate(["/Payroll/InvestmentRequest"],{state: {userData:element}}); */
  }
}
