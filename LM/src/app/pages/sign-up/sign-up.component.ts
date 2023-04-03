import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
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
  minExperienceDate: any;
  minEducationDate: any;
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
  loginData: any = [];
  signUpForm: any = FormGroup;
  CandidateFamilyForm: any = FormGroup;
  employementForm: any = FormGroup;
  educationForm: any = FormGroup;
  documentsForm: any = FormGroup;
  minDate = new Date('1950/01/01');
  maxBirthDate = new Date();
  bloodGroupdetails: any[] = [];
  industryTypeList: any[] = [
    { id:1,name:'IT Software'}, { id:2,name:'Education Management'},{ id:3,name:'Financial Services'}, { id:4,name:'Hospital & Health Care'},
    { id:5,name:'Marketing & Advertising'}, { id:5,name:'Others'}
  ];
  employeeRelationship: any = [];
  maritalStatusDetails: any[] = [];
  countryDetails: any = [];
  stateDetails: any = [];
  cityDetails: any = [];


  companyName: any;
  checked = false;
  params:any;
  email:any;
  companycode:any
;
  constructor(private formBuilder: FormBuilder, private companyService: CompanySettingService, private spinner: NgxSpinnerService,
    private LM: EmployeeMasterService, private dialog: MatDialog, private router: Router
    , private EMS: EmsService, private adminService: AdminService, private mainService: MainService, private activatedRoute: ActivatedRoute) {
   // this.companyName = JSON.parse(atob(this.activatedRoute.snapshot.params.token)).companyName;
  }


  ngOnInit(): void {
    this.params = this.activatedRoute.snapshot.params;
    // if (this.params && this.params.token) {
      this.email = JSON.parse(atob(this.params.token)).email;
      this.companycode = JSON.parse(atob(this.params.token)).companycode;

    this.createPersonalInfoForm();

  }
  getCountry() {
    this.countryDetails = []
    this.companyService.getPreonboardingCountry('countrymaster', null, 1, 10, this.companyName).subscribe(result => {
      this.countryDetails = result.data;
    })
  }


  createPersonalInfoForm() {
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
        // companyemail: [this.email, [Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
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
       
      })
  }
  submit() {
    
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