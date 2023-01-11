import { Component, OnInit } from '@angular/core';
export interface PaySlipsElement {
  Employee_Id: string;  
  Employee_Name: string;
  Pan_Number:string; 
  Active:string; 
}
const ELEMENT_DATA: PaySlipsElement[] = [
  {Employee_Id: 'SBT000101', Employee_Name: 'Lahari',Pan_Number:'ADAA7382L',Active:"Download"},
  {Employee_Id: 'SBT000102', Employee_Name: 'Sruthi',Pan_Number:'ADAA7385L',Active:"Download"},
  {Employee_Id: 'SBT000103', Employee_Name: 'Sushma',Pan_Number:'ADAA7386L',Active:"Download"}
];
@Component({
  selector: 'app-finance-form16',
  templateUrl: './finance-form16.component.html',
  styleUrls: ['./finance-form16.component.scss']
})
export class FinanceForm16Component implements OnInit {

  constructor() { }
  displayedColumns: string[] = ['Employee_Id', 'Employee_Name','Pan_Number','Active'];
  dataSource = ELEMENT_DATA;
  ngOnInit(): void {
  }

}
