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
  fileURL: any;
  dataSource: MatTableDataSource<any> = <any>[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild("stepper", { static: false }) stepper: any;
  loginData: any = [];
  signUpForm: any = FormGroup;
  PayviewForm: any = FormGroup;
  PayForm: any = FormGroup;
  minDate = new Date('1950/01/01');
  industryTypeList: any[] = [];
  companySizeList: any[] = [
    { id: 50, value: '0-50' },
    { id: 100, value: '51-100' },
    { id: 200, value: '101-200' },
    { id: 300, value: '200+ Users' },
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
  clientId: any;
  planName: any;
  userSession:any;
  hide:boolean=false;
  isdisable:boolean=true;
  constructor(private formBuilder: FormBuilder, private companyService: CompanySettingService,
    private spinner: NgxSpinnerService, private dialog: MatDialog, private router: Router,
    private mainService: MainService, private activatedRoute: ActivatedRoute) {
    this.agreement()
  }


  ngOnInit(): void {
    this.params = this.activatedRoute.snapshot.params;
    this.email = JSON.parse(atob(this.params.token)).email;
    this.companycode = JSON.parse(atob(this.params.token)).companycode;
    this.planId = JSON.parse(atob(this.params.token)).Planid;
    this.planName = JSON.parse(atob(this.params.token)).PlanName;
    this.createForm();
    this.getIndustryTypes();
    this.getCountry();
    // IndustryType
    this.signUpForm.get('IndustryType')?.valueChanges.subscribe((selectedValue: any) => {
      if (selectedValue !=null) {
        if(selectedValue.industry_type_name == 'Others'){
          this.hide = true;  
          this.signUpForm.controls.others.setValue('') 
       }
       else{
         this.hide=false;
         this.signUpForm.controls.others.setValue(selectedValue.industry_type_name)
       }
      }
    })
    
    this.signUpForm.get('country')?.valueChanges.subscribe((selectedValue: any) => {
      this.stateDetails= [];
      this.companyService.getPreonboardingStatesc(selectedValue,'spryple_hrms').subscribe((data)=>{
        this.stateDetails = data.data;
      })
    })

  this.signUpForm.get('state')?.valueChanges.subscribe((selectedValue: any) => {
    this.signUpForm.controls.city.setValue("");
    this.cityDetails = [];
     this.companyService.getPreonboardingCities(selectedValue,'spryple_hrms').subscribe((data)=>{
        this.cityDetails=data.data
       })
  })
    this.getUnverifiedSprypleClient();
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
        planid:[this.planName]
       
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

  change() {
    if (this.checked == true) {
      this.isdisable = false;
    } else {
      this.isdisable = true;
    }
  }

  getUnverifiedSprypleClient(){
    let data={
      companycode: this.companycode
    }
    this.mainService.getUnverifiedSprypleClient(data).subscribe((result:any)=>{
      if (result.status) {
        let value = result.data[0];
        this.clientId = value.id;
      this.signUpForm.controls.companyName.setValue(value.company_name);
       this.signUpForm.controls.companyCode.setValue(value.company_code);
       this.signUpForm.controls.companySize.setValue(value.company_size);
       this.signUpForm.controls.totalUsers.setValue(value.number_of_users);
       this.signUpForm.controls.IndustryType.setValue(value.industry_type);
       this.signUpForm.controls.mobile.setValue(value.mobile_number);
       this.signUpForm.controls.contactPerson.setValue(value.contact_name);
        this.signUpForm.controls.address1.setValue(value.company_address1);
       this.signUpForm.controls.address2.setValue(value.company_address2);
       this.signUpForm.controls.country.setValue(value.country_id);
       this.signUpForm.controls.state.setValue(value.state_id);
       this.signUpForm.controls.city.setValue(value.city_id);
       this.signUpForm.controls.pincode.setValue(value.pincode);
       this.signUpForm.controls.gstNumber.setValue(value.gst_number);
      //  this.signUpForm.controls.isChecked.setValue(value.company_name);
        this.signUpForm.controls.others.setValue(value.industry_type_value);
        this.getPlanDetailsByPlanIdAndClientId();
      }
    })
  }

  getPlanDetailsByPlanIdAndClientId(){
    let data={
      plan_id_value: this.planId,
      client_id_value: this.clientId,
    }
    this.mainService.getPlanDetailsByPlanIdAndClientId(data).subscribe((result:any)=>{
      if (result.status) {
        let value = result.data[0];
        this.PayviewForm.controls.plan.setValue(value.plan_name);
       this.PayviewForm.controls.totalusers.setValue(value.number_of_users);
       this.PayviewForm.controls.validFrom.setValue(value.fromdate);
       this.PayviewForm.controls.validTo.setValue(value.todate);
       this.PayviewForm.controls.cost.setValue(value.number_of_users);
      }
    })
  }

  submit() {
    this.spinner.show();
    if (this.signUpForm.valid && this.signUpForm.controls.isChecked.value) {
      let data ={
        company_name_value:this.signUpForm.controls.companyName.value,
        company_code_value:this.signUpForm.controls.companyCode.value,
        company_size_value:this.signUpForm.controls.companySize.value,
        number_of_users_value:this.signUpForm.controls.totalUsers.value, 
        plan_id_value:1,
        industry_type_pm:this.signUpForm.controls.IndustryType.value, 
        industry_type_value_pm:this.signUpForm.controls.others.value,
        mobile_number_value: this.signUpForm.controls.mobile.value,
        company_email_value:this.signUpForm.controls.companyemail.value,
        contact_name_value:this.signUpForm.controls.contactPerson.value,
        company_address1_value:this.signUpForm.controls.address1.value,
        company_address2_value:this.signUpForm.controls.address2.value,
        country_id_value:this.signUpForm.controls.country.value,
        state_id_value:this.signUpForm.controls.state.value,
        city_id_value:this.signUpForm.controls.city.value,
        pincode_value:this.signUpForm.controls.pincode.value,
        gst_number_value:this.signUpForm.controls.gstNumber.value,
        agree_to_terms_and_conditions_value: 1,
        steps_completed_value:2,
        id_value:null,
        created_by_value:null,
     }

      this.mainService.setSprypleClient(data).subscribe((res: any) => {
        if (res.status) {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: "You are registered successfully."
          });
          this.getUnverifiedSprypleClient();
          this.spinner.hide();
        
        } else {
          this.spinner.hide();
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: "Unable to Sign-up"
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