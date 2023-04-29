import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-employee-form16',
  templateUrl: './employee-form16.component.html',
  styleUrls: ['./employee-form16.component.scss']
})
export class EmployeeForm16Component implements OnInit {
  employeeFinancialYearForm!: FormGroup;
  constructor(private formBuilder: FormBuilder) { }
  isShowDownloadView:any='';
  financialFormData:any;
  ngOnInit(): void {
    this.employeeFinancialYearForm = this.formBuilder.group(
      {
        financialYear: [""]       
      });
  }
  download() {

  }
  status() {
    this.financialFormData = this.employeeFinancialYearForm.value;
    this.isShowDownloadView = this.financialFormData.financialYear;
  }
  cancel() {
    this.employeeFinancialYearForm.reset();
    this.isShowDownloadView = '';
  }
}
