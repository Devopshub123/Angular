import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
@Component({
  selector: 'app-organization-details',
  templateUrl: './organization-details.component.html',
  styleUrls: ['./organization-details.component.scss']
})
export class OrganizationDetailsComponent implements OnInit {

  constructor(private formBuilder: FormBuilder) { }
  organizationDetailsRequestForm!: FormGroup;
  isOrganizationDetailsDisabled:boolean = true;

  ngOnInit(): void {
    this.organizationDetailsRequestForm = this.formBuilder.group(
      {
        pan: [""],
        tan: [""],
        tdsCircle:[""],
        taxPaymentFrequency:["Monthly"]
      });
  }
  setPayGroup(){

  }
  cancel(){

  }
  editOrganizationDetails() {
    if(this.isOrganizationDetailsDisabled)
    {
      this.isOrganizationDetailsDisabled = false;
    }
  }
}
