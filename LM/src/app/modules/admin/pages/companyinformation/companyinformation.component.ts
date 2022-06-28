import { Component, OnInit,ViewChild} from '@angular/core';
import { EmployeeMasterService } from 'src/app/services/employee-master-service';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import { FormGroup,FormControl,Validators, FormBuilder,FormArray, AbstractControl} from '@angular/forms';
@Component({
  selector: 'app-companyinformation',
  templateUrl: './companyinformation.component.html',
  styleUrls: ['./companyinformation.component.scss']
})
export class CompanyinformationComponent implements OnInit {
  companyForm!: FormGroup;
  CountryDetails:any=[];
  stateDetails:any=[];
  cityDetails:any=[];

  constructor(private formBuilder: FormBuilder,private LMS:CompanySettingService,) { }

  ngOnInit(): void {
    this.getCountry();
    this.companyForm=this.formBuilder.group(
      { 
        companyname:[""],
        contact:["",],
        email:["",],
        address1:[""],
        address2:[""],
        city: ["",],
        state: ["",],
        pincode: ["",],
        country: ["",],

      })
      this.companyForm.get('country')?.valueChanges.subscribe(selectedValue => {
        this.stateDetails= [];
        this.LMS.getStatesc(selectedValue).subscribe((data)=>{
          this.stateDetails=data[0];
          // if(this.employeedata != null)
          // {
          //   this.companyForm.controls.state.setValue(this.employeedata.state);

          // }
        })
      
         
      })
      this.companyForm.get('state')?.valueChanges.subscribe(selectedValue => {
        this.cityDetails=[];
        this.LMS.getCities(selectedValue).subscribe((data)=>{
          this.cityDetails=data[0]
          // if(this.employeedata != null)
          // {
          //   this.companyForm.controls.city.setValue(this.employeedata.city);

          // }
      // this.availablecities=data
        })
      })
  }
  getCountry(){
    this.LMS.getCountry('countrymaster',null,1,10,'boon_client').subscribe((results)=>{
      this.CountryDetails=results.data;
  

    })
  }
  save(){}
  cancel(){}

}
