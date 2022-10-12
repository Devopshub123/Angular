import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hr-onboarding-checklistoverview',
  templateUrl: './hr-onboarding-checklistoverview.component.html',
  styleUrls: ['./hr-onboarding-checklistoverview.component.scss']
})
export class HrOnboardingChecklistoverviewComponent implements OnInit {
  checklistForm:any= FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private formBuilder: FormBuilder, private router: Router) { }
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'symbolLabel', 'nameLabel'];
  dataSource = ELEMENT_DATA;
  checked = false;
  indeterminate = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;
  ngOnInit(): void {
    this.checklistForm = this.formBuilder.group(
      {
        employeeName: [],
        joiningDate: [],
        designation: [],
        remarks: [],
        isChecked: [],
      });
  }
  saveRequest() {
    
  }
  cancel() { 
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    this.router.navigate(["/ems/hr-onboarding"]));
  }


}

export interface PeriodicElement {
  name: string;
  position: string;
  weight: string;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 'Admin', name: 'John', weight: 'Software', symbol: 'H'},
  {position: 'Tech Team', name: 'Helium', weight: 'Hardware', symbol: 'He'},
  {position: 'Finance Dept', name: 'Lithium', weight: 'Salary', symbol: 'Li'},
  {position: 'HR', name: 'Beryllium',weight: 'Attendence', symbol: 'Be'},
  {position: 'Employee', name: 'Boron', weight: 'Insurence', symbol: 'B'},
];