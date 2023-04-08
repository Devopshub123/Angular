import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

// import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AdminService } from 'src/app/modules/admin/admin.service';
import { ConfirmationComponent } from 'src/app/modules/leaves/dialog/confirmation/confirmation.component';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import { EmployeeMasterService } from 'src/app/services/employee-master-service';
import { MainService } from 'src/app/services/main.service';
import { ReusableDialogComponent } from '../reusable-dialog/reusable-dialog.component';
import { NgxSpinnerService } from "ngx-spinner";
import { EmsService } from '../../modules/ems/ems.service';
import { ComfirmationDialogComponent } from '../comfirmation-dialog/comfirmation-dialog.component'
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { environment } from 'src/environments/environment';
import * as _moment from 'moment';
const moment = _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class SignUpComponent implements OnInit {
  isLinear = true;
  isstep2 = true;
  minExperienceDate: any;
  minEducationDate: any;
  fileURL: any;
  displayedColumns = ['position', 'name', 'relation', 'gender', 'contact', 'status', 'action'];
  familyTableColumns = ['position', 'name', 'relation', 'gender', 'contact', 'status', 'action'];
  documentTableColumns = ['position', 'category', 'number', 'name', 'action'];
  workTableColumns = ['sno', 'company', 'desig', 'fromDate', 'toDate', 'action'];
  educationTableColumns = ['sno', 'course', 'college', 'fromDate', 'toDate', 'action'];
  dataSource: MatTableDataSource<any> = <any>[];
  familyDataSource: MatTableDataSource<any> = <any>[];
  documentDataSource: MatTableDataSource<any> = <any>[];
  workExperienceDataSource: MatTableDataSource<any> = <any>[];
  educationDataSource: MatTableDataSource<any> = <any>[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild("stepper", { static: false }) stepper: any;
  loginData: any = [];
  signUpForm: any = FormGroup;
  PayviewForm: any = FormGroup;
  PayForm: any = FormGroup;
  minDate = new Date('1950/01/01');
  maxBirthDate = new Date();
  bloodGroupdetails: any[] = [];
  industryTypeList: any[] = [];
  companySizeList: any[] = [
    { id: 1, value: '0-50' },
    { id: 2, value: '51-100' },
    { id: 3, value: '101-200' },
    { id: 4, value: '200+ Users' },
  ];
  countryDetails: any = [];
  stateDetails: any = [];
  cityDetails: any = [];
  


  companyName: any;
  checked = false;
  params:any;
  email:any;
  companycode: any;
  planId: any;
  clientSignupId: any;
  userSession:any;
  hide:boolean=false;
  constructor(private formBuilder: FormBuilder, private companyService: CompanySettingService, private spinner: NgxSpinnerService,
    private LM: EmployeeMasterService, private dialog: MatDialog, private router: Router
    , private mainService: MainService, private activatedRoute: ActivatedRoute) {
   // this.companyName = JSON.parse(atob(this.activatedRoute.snapshot.params.token)).companyName;
    this.agreement()
  }


  ngOnInit(): void {
    this.params = this.activatedRoute.snapshot.params;
    this.email = JSON.parse(atob(this.params.token)).email;
    this.companycode = JSON.parse(atob(this.params.token)).companycode;
    this.planId =JSON.parse(atob(this.params.token)).Planid;
    this.getUnverifiedSprypleClient()
    this.createForm();
    // this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    // console.log("asdf--",this.userSession)
    this.getIndustryTypes();
    this.getCountry();
  

    
    // IndustryType
    this.signUpForm.get('IndustryType')?.valueChanges.subscribe((selectedValue: any) => {
      console.log(selectedValue)
      if(selectedValue.industry_type_name == 'Others'){
         this.hide = true;  
         this.signUpForm.controls.others.setValue('') 
      }
      else{
        this.hide=false;
        this.signUpForm.controls.others.setValue(selectedValue.industry_type_name)
      }

    })
    this.signUpForm.get('country')?.valueChanges.subscribe((selectedValue: any) => {
      this.stateDetails= [];
      this.companyService.getPreonboardingStatesc(selectedValue,'spryple_hrms').subscribe((data)=>{
        this.stateDetails = data.data;
        // {
        //   this.signUpForm.controls.state.setValue(this.companyinfo.stateid);

        // }
      })
    })

  this.signUpForm.get('state')?.valueChanges.subscribe((selectedValue: any) => {
    this.signUpForm.controls.city.setValue("");
    this.cityDetails = [];
     this.companyService.getPreonboardingCities(selectedValue,'spryple_hrms').subscribe((data)=>{
        this.cityDetails=data.data
        // {
        //   this.signUpForm.controls.city.setValue(this.companyinfo.locationid);
        // }
      })
    })

  }
  agreement() {
    this.mainService.agreement().subscribe((result:any)=>{
      let TYPED_ARRAY = new Uint8Array(result.image.data);
            const STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
              return data + String.fromCharCode(byte);
            }, '');

            const file = new Blob([TYPED_ARRAY], { type: "application/pdf" });
            this.fileURL = URL.createObjectURL(file);
    })
  }
  getIndustryTypes() {
    this.industryTypeList = [];
    this.mainService.getIndustryTypes('industry_type_master', null, 1, 10, 'spryple_hrms').subscribe(result => {
      this.industryTypeList = result.data;
    })
  }
  getCountry() {
    this.countryDetails = []
    this.companyService.getPreonboardingCountry('countrymaster', null, 1, 10, 'spryple_hrms').subscribe(result => {
      this.countryDetails = result.data;
    })
  }
  agree() {
    window.open(this.fileURL);
  }

  getUnverifiedSprypleClient(){
    let data={
      email:this.email,
      companycode:this.companycode
    }
    this.mainService.getUnverifiedSprypleClient(data).subscribe((result:any)=>{
      console.log("result",result)
    })
  }
  createForm(){
    this.signUpForm = this.formBuilder.group(
      {
        companyName: [""],
        companyCode: [this.companycode],
        companySize: [""],
        totalUsers: ["",],
        IndustryType: [""],
        mobile: ["",],
        contactPerson: ["",],
        companyemail:[this.email],
        password: [""],
        address1: [""],
        address2: [""],
        country: ["",],
        state: ["",],
        city: ["",],
        pincode: ["",],
        gstNumber: [""],
        others: [""],
        isChecked: [""],
        planid:[this.planId]
       
    })
    this.PayviewForm = this.formBuilder.group({
      plan:[""],
      totalusers:[""],
      validity:[""],
      cost:[""],
      validFrom:[""],
      validTo:[""],
    });
    this.PayForm = this.formBuilder.group({})

  }
  submit() {
    if (this.signUpForm.valid && this.signUpForm.controls.isChecked.value) {
      let data ={
        company_name_value:this.signUpForm.controls.companyName.value,
        company_code_value:this.signUpForm.controls.companyCode.value,
        company_size_value:50,
        number_of_users_value:this.signUpForm.controls.totalUsers.value,
        plan_id_value:1,
        industry_type_pm:this.signUpForm.controls.IndustryType.value.id,
        industry_type_value_pm:this.signUpForm.controls.others.value,
        mobile_number_value:this.signUpForm.controls.mobile.value,
        company_email_value:this.signUpForm.controls.companyemail.value,
        company_address_value:this.signUpForm.controls.address1.value,
        country_id_value:this.signUpForm.controls.country.value,
        state_id_value:this.signUpForm.controls.state.value,
        city_id_value:this.signUpForm.controls.city.value,
        pincode_value:this.signUpForm.controls.pincode.value,
        agree_to_terms_and_conditions_value:1,
        id_value:null,
        created_by_value:null,
        contact_name_value:'rakesh'
      }
      console.log("data--", data);
      this.mainService.setSprypleClient(data).subscribe((res: any) => {
        if (res.status) {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: "You are registered successfully."
          });
          } else {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: "Data is not saved"
          });
        }
      });
    }

    
  }
  clear() {
    
  }
  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }
  stopLeadingZero(event:any) {
    const input = event.target.value;
    if (input.length === 0 && event.which === 48) {
      event.preventDefault();
    }
  }
}