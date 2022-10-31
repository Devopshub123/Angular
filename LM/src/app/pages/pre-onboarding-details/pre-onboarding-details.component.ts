import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { AdminService } from 'src/app/modules/admin/admin.service';
import { ConfirmationComponent } from 'src/app/modules/leaves/dialog/confirmation/confirmation.component';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import { EmployeeMasterService } from 'src/app/services/employee-master-service';
import { MainService } from 'src/app/services/main.service';
import { ReusableDialogComponent } from '../reusable-dialog/reusable-dialog.component';
import {NgxSpinnerService} from "ngx-spinner";
import {EmsService} from '../../modules/ems/ems.service';
import { ComfirmationDialogComponent } from '../comfirmation-dialog/comfirmation-dialog.component'
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { environment } from 'src/environments/environment';
import * as _moment from 'moment';
const moment =  _moment;
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
  selector: 'app-pre-onboarding-details',
  templateUrl: './pre-onboarding-details.component.html',
  styleUrls: ['./pre-onboarding-details.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class PreOnboardingDetailsComponent implements OnInit {
  minExperienceDate: any;
  minEducationDate: any;

  constructor(private formBuilder: FormBuilder, private companyService: CompanySettingService,private spinner:NgxSpinnerService,
    private LM: EmployeeMasterService, private dialog: MatDialog, private router: Router
    ,private EMS:EmsService, private adminService: AdminService, private mainService:MainService,private activatedRoute: ActivatedRoute) {
      this.formData = new FormData();
    }

    displayedColumns = ['position', 'name', 'relation', 'gender', 'contact', 'status', 'action'];
    familyTableColumns = ['position','name','relation','gender','contact','status','action'];
    documentTableColumns = ['position','category','number','name','action'];
    workTableColumns = ['sno','company','desig','fromDate','toDate','action'];
    educationTableColumns = ['sno','course','college','fromDate','toDate','action'];
  dataSource :  MatTableDataSource<any> = <any>[];
  familyDataSource: MatTableDataSource<any> = <any>[];
  documentDataSource: MatTableDataSource<any> = <any>[];
  workExperienceDataSource: MatTableDataSource<any> = <any>[];
  educationDataSource: MatTableDataSource<any> = <any>[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  loginData: any = [];
  personalInfoForm!: FormGroup;
  CandidateFamilyForm: any = FormGroup;
  employementForm: any = FormGroup;
  educationForm:  any = FormGroup;
  documentsForm:any = FormGroup;
  minDate = new Date('1950/01/01');
  maxBirthDate= new Date();
  bloodGroupdetails: any[] = [];
  genderDetails: any[] = [];
  employeeRelationship: any = [];
  maritalStatusDetails: any[] = [];
  countryDetails: any = [];
  stateDetails: any = [];
  cityDetails: any = [];
  permanentCountryDetails: any = [];
  permanentStateDetails: any = [];
  permanentCityDetails: any = [];
  isfamilyedit: boolean = false;
  familyDetails: any = [];
  documentDetails:any = [];
  isviewemployee:boolean = false;
  isview: boolean = true;
  availableDesignations: any = [];
  availableDepartments: any = [];
  availableRole: any = [];
  worklocationDetails: any[] = [];
  loginCandidateId: any;
  filename:any;
  file:any;
  fileURL:any;
  expFromDate: any;
  expToDate: any;
  maxDate = new Date();
  minetodate: any;
  editDockinfo:any;

  edmaxDate = new Date();
  documentTypeList: any ;
  isFile: boolean = true;
  formData: any;
  selectedtab = new FormControl(0);
  userSession: any;
  pipe = new DatePipe('en-US');
  messagesDataList: any = [];
  requiredField: any;
  requiredOption: any;
  dataSave: any;
  dataNotSave: any;
  workExperienceDetails: any = [];
  educationDetails: any = [];
  designationId: any;
  preOnboardId!: number;
  email:any;
  candidateId:any;
  date:any;
  params:any;
  activeModule:any;
  EM11:any;
  EM12:any;
  EM13:any;
  EM14:any;
  EM15:any;
  EM16:any;
  EM17:any;
  EM18:any;
  EM19:any;
  EM20:any;
  EM21:any;
  EM22:any;
  EM2:any;
  EM1:any;
  EM61:any;
  isedit:boolean=false;
  editFileName:any;
  employeeNameh: any;
  employeeDesignation: any;
  employeeJoinDate: any;
  employeeMobile: any;
  companyDBName:any = environment.dbName;
  ngOnInit(): void {
    this.params = this.activatedRoute.snapshot.params;
    if(this.params && this.params.token) {
      this.email = JSON.parse(atob(this.params.token)).email;
      this.candidateId = JSON.parse(atob(this.params.token)).candidateId;
      this.date = JSON.parse(atob(this.params.token)).date;

      //this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
      this.getDocumentsEMS();
      this.getFilecategoryMasterForEMS();
      this.createPersonalInfoForm();
      this.createFamilyForm();
      this.createEmployementForm();
      this.createEducationForm();
      this.createDocumentsForm();
      this.getMessagesList();
      this.getBloodgroups();
      this.getGender();
      this.getMaritalStatusMaster();
      this.getRelationshipMaster();
      this.getDesignationsMaster();
      this.getDepartmentsMaster();
      this.getWorkLocation();
      this.getCountry();
      this.getCandidateData();
      this.personalInfoForm.get('checked')?.valueChanges.subscribe(selectedValue => {
        if (selectedValue) {
          this.personalInfoForm.get('pcountry')?.valueChanges.subscribe(selectedValue => {
            this.permanentStateDetails = [];
            this.companyService.getStatesc(selectedValue).subscribe((data) => {
              this.permanentStateDetails = data[0]
              if (this.personalInfoForm.controls.rstate.value != null) {
                this.personalInfoForm.controls.pstate.setValue(this.personalInfoForm.controls.rstate.value);

              }

            })
          })
          this.personalInfoForm.get('pstate')?.valueChanges.subscribe(selectedValue => {
            this.permanentCityDetails = [];
            this.companyService.getCities(selectedValue).subscribe((data) => {
              this.permanentCityDetails = data[0]
              if (this.personalInfoForm.controls.rcity.value != null) {
                this.personalInfoForm.controls.pcity.setValue(this.personalInfoForm.controls.rcity.value);

              }

            })
          })

          this.personalInfoForm.controls.paddress.setValue(this.personalInfoForm.controls.raddress.value),
            this.personalInfoForm.controls.pcountry.setValue(this.personalInfoForm.controls.rcountry.value),
            this.personalInfoForm.controls.ppincode.setValue(this.personalInfoForm.controls.rpincode.value)
          this.personalInfoForm.controls.paddress.disable();
          this.personalInfoForm.controls.pcountry.disable();
          this.personalInfoForm.controls.pstate.disable();
          this.personalInfoForm.controls.pstate.disable();
          this.personalInfoForm.controls.pcity.disable();
          this.personalInfoForm.controls.ppincode.disable();
        }
        else {
          this.personalInfoForm.controls.paddress.setValue('')
          this.personalInfoForm.controls.paddress.enable()
          this.personalInfoForm.controls.pcountry.setValue('')
          this.personalInfoForm.controls.pcountry.enable()
          this.personalInfoForm.controls.pstate.setValue('')
          this.personalInfoForm.controls.pstate.enable()
          this.personalInfoForm.controls.pcity.setValue('')
          this.personalInfoForm.controls.pcity.enable()
          this.personalInfoForm.controls.ppincode.setValue('')
          this.personalInfoForm.controls.ppincode.enable()
        }
      })
      this.personalInfoForm.get('rcountry')?.valueChanges.subscribe(selectedValue => {
        this.stateDetails = [];
        this.companyService.getStatesc(selectedValue).subscribe((data) => {
          this.stateDetails = data[0];
        })
      })
      this.personalInfoForm.get('rstate')?.valueChanges.subscribe(selectedValue => {
        this.cityDetails = [];
        this.companyService.getCities(selectedValue).subscribe((data) => {
          this.cityDetails = data[0]
        })
      })

      this.personalInfoForm.get('pcountry')?.valueChanges.subscribe(selectedValue => {
        this.permanentStateDetails = [];
        this.companyService.getStatesc(selectedValue).subscribe((data) => {
          this.permanentStateDetails = data[0];
        })
      })
      this.personalInfoForm.get('pstate')?.valueChanges.subscribe(selectedValue => {
        this.permanentCityDetails = [];
        this.companyService.getCities(selectedValue).subscribe((data) => {
          this.permanentCityDetails = data[0]
        })
      })
      this.employementForm.get('expFromDate')?.valueChanges.subscribe((selectedValue: any) => {
        this.minExperienceDate = selectedValue._d;
      })
      this.educationForm.get('eduFromDate')?.valueChanges.subscribe((selectedValue: any) => {
        this.minEducationDate = selectedValue._d;
      })
      //////////

    }else {
      this.router.navigate(['/Login'])
    }
  }

//////////
  getCandidateData() {
  this.loginData = [];
  this.familyDetails = [];
  this.workExperienceDetails = [];
  this.educationDetails = [];
    this.mainService.getPreonboardCandidateData(this.candidateId).subscribe((res: any) => {
      this.loginData = JSON.parse(res.data[0].json)[0];
      if (this.loginData.id != null) {
        this.preOnboardId = this.loginData.id;
      }
      this.availableDesignations.forEach((e: any) => {
        if (e.id == this.loginData.designation) {
          this.employeeDesignation = e.designation;
        }
      });
      let a = this.loginData;
      if (a.rcountry == null) {
        this.personalInfoForm.controls.checked.setValue(false)
      }
      else if (a.rcountry == a.pcountry && a.rstate == a.pstate && a.rcity == a.pcity && a.raddress == a.paddress && a.rpincode == a.ppincode) {
        this.personalInfoForm.controls.checked.setValue(true)
      }
      this.employeeNameh = this.loginData.firstname + ' ' + this.loginData.middlename + ' ' + this.loginData.lastname;
      this.employeeJoinDate = this.loginData.dateofjoin;
      this.employeeMobile = this.loginData.contact_number;
      this.designationId = this.loginData.designation;
      this.loginCandidateId = this.loginData.candidateid;
      this.designationId = this.loginData.designation;
      this.personalInfoForm.controls.firstname.setValue(this.loginData.firstname);
      this.personalInfoForm.controls.middlename.setValue(this.loginData.middlename);
      this.personalInfoForm.controls.lastname.setValue(this.loginData.lastname);
      if (this.loginData.dateofbirth != null) {
        this.personalInfoForm.controls.dateofbirth.setValue(new Date(this.loginData.dateofbirth));
      }
      for (let i = 0; i < this.bloodGroupdetails.length; i++) {
        if (this.bloodGroupdetails[i].id == this.loginData.bloodgroup) {
          this.personalInfoForm.controls.bloodgroup.setValue(this.bloodGroupdetails[i].id)
          break;
        }
      }
      this.personalInfoForm.controls.gender.setValue(this.loginData.gender);
      this.personalInfoForm.controls.maritalstatus.setValue(this.loginData.maritalstatus);
      if (this.loginData.aadharnumber != 'null')
        this.personalInfoForm.controls.aadharNumber.setValue(this.loginData.aadharnumber);
      this.personalInfoForm.controls.raddress.setValue(this.loginData.address);
      this.personalInfoForm.controls.rcountry.setValue(this.loginData.country);
      this.personalInfoForm.controls.rstate.setValue(this.loginData.state);
      this.personalInfoForm.controls.rcity.setValue(this.loginData.city);
     
      this.personalInfoForm.controls.rpincode.setValue(this.loginData.pincode);
      this.personalInfoForm.controls.personalemail.setValue(this.loginData.personal_email);
      if (this.loginData.languages_spoken != 'null')
        this.personalInfoForm.controls.spokenLanguages.setValue(this.loginData.languages_spoken);
        if (this.loginData.paddress != 'null')
      this.personalInfoForm.controls.paddress.setValue(this.loginData.paddress);
      this.personalInfoForm.controls.pcountry.setValue(this.loginData.pcountry);
      this.personalInfoForm.controls.pstate.setValue(this.loginData.pstate);
      this.personalInfoForm.controls.pcity.setValue(this.loginData.pcity);
      if (this.loginData.ppincode != 'null')
      this.personalInfoForm.controls.ppincode.setValue(this.loginData.ppincode);
      this.personalInfoForm.controls.mobileNo.setValue(this.loginData.contact_number);
      if (this.loginData.emergencycontact_number != 'null') {
      this.personalInfoForm.controls.alternateMobileNo.setValue(this.loginData.emergencycontact_number);
     }
    this.personalInfoForm.controls.hireDate.setValue(this.loginData.hired_date);
    this.personalInfoForm.controls.joinDate.setValue(this.loginData.dateofjoin);

    let familydata = JSON.parse((this.loginData.relations))
    if (familydata != null) {
      for (let i = 0; i < familydata.length; i++) {
        let relationship;
        let relationshipname;
        this.employeeRelationship.forEach((e:any)=>{
          if(e.id==familydata[i].relationship){
            relationship=e.id;
            relationshipname=e.relationship;
          }
        })
        let gender;
        let gendername;
        this.genderDetails.forEach((e:any)=>{
          if(e.id==familydata[i].gender){
            gender=e.id;
            gendername=e.gender;
          }
        })
        this.familyDetails.push({
          firstname: familydata[i].firstname,
          lastname: familydata[i].lastname,
          gender: gender,
          gendername:gendername,
          contactnumber: familydata[i].contactnumber,
          status: familydata[i].status,
          relationship:relationship ,
          relationshipname:relationshipname,
          dateofbirth: familydata[i].dateofbirth != "null" ? this.pipe.transform(familydata[i].dateofbirth, 'yyyy-MM-dd') : '',
        });
      }
      this.familyDataSource = new MatTableDataSource(this.familyDetails);
    }
///////
    let workExperiencedata = JSON.parse((this.loginData.experience))
    if(workExperiencedata != null){
for (let i = 0; i < workExperiencedata.length; i++) {
  this.workExperienceDetails.push({
    companyname: workExperiencedata[i].companyname,
    skills: workExperiencedata[i].skills,
    designation: workExperiencedata[i].designation,
    fromdate: workExperiencedata[i].fromdate != "null" ? this.pipe.transform(workExperiencedata[i].fromdate, 'yyyy-MM-dd') : '',
    todate: workExperiencedata[i].todate != "null" ? this.pipe.transform(workExperiencedata[i].todate, 'yyyy-MM-dd') : '',
  });
}
    this.workExperienceDataSource = new MatTableDataSource(this.workExperienceDetails);
  }
    ////////
    let educationdata = JSON.parse((this.loginData.education))
    if (educationdata !=null) {
      for (let i = 0; i < educationdata.length; i++) {
        this.educationDetails.push({
          course: educationdata[i].course,
          institutename: educationdata[i].institutename,
          fromdate: educationdata[i].fromdate != "null" ? this.pipe.transform(educationdata[i].fromdate, 'yyyy-MM-dd') : '',
          todate: educationdata[i].todate != "null" ? this.pipe.transform(educationdata[i].todate, 'yyyy-MM-dd') : '',
        });
      }
      this.educationDataSource = new MatTableDataSource(this.educationDetails);
    }
  })

}
  getCountry() {
  this.countryDetails =[]
  this.companyService.getCountry('countrymaster', null, 1, 10, this.companyDBName).subscribe(result => {
    this.countryDetails = result.data;
    this.permanentCountryDetails = result.data;
   })
}


  createPersonalInfoForm(){
    this.personalInfoForm = this.formBuilder.group(
      {
        firstname: ["",[Validators.required,this.noWhitespaceValidator()]],
        lastname: ["", [Validators.required,this.noWhitespaceValidator()]],
      middlename: [""],
      dateofbirth: ["", ],
      bloodgroup: [""],
      gender: ["", ],
      maritalstatus: ["", ],
      aadharNumber: ["",Validators.maxLength(12)],
      panNumber: [""],
      uanNumber: ["", Validators.maxLength(12)],
      /// address controls
      raddress: ["",[Validators.required,this.noWhitespaceValidator()] ],
      rcountry: ["", ],
      rstate: ["", ],
      rcity: ["", ],
      rpincode: ["",[Validators.required, Validators.minLength(6), Validators.maxLength(6)] ],
      personalemail: ["", [Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      spokenLanguages: [""],
      checked:[false],
      paddress: ["", ],
      pcountry: ["", ],
      pstate: ["", ],
      pcity: ["", ],
      ppincode: ["",[Validators.minLength(6), Validators.maxLength(6)] ],
      mobileNo: ["",],
      alternateMobileNo: ["",],
      hireDate: ["",],
      joinDate: ["",],
    })
  }
  createFamilyForm(){
    this.CandidateFamilyForm = this.formBuilder.group(
      {
      familyfirstname: ["", ],
      familycontact: ["",[Validators.pattern('[4-9]\\d{9}')]],
      familygender: ["", ],
      relation: ["", ],
      familystatus: ["Alive", ],
       });
   }
 createEmployementForm(){
  this.employementForm = this.formBuilder.group(
    {
      companyName: [""],
      designation: [""],
      expFromDate: [""],
      expToDate: [""],
      jobDescription: [""],
     });
 }
 createEducationForm(){
  this.educationForm = this.formBuilder.group(
    {
      course: [""],
      instituteName: [""],
      eduFromDate: [""],
      eduToDate: [""],

    });
 }
 createDocumentsForm(){
  this.documentsForm = this.formBuilder.group(
    {
      documentId: [""],
      documentName: ["",Validators.required],
      documentNumber: ["",Validators.required],
      attachedFile: [""],

    });
 }
  getErrorMessage() {
    if ( this.personalInfoForm.controls.personalemail.hasError('required')) {
      return 'You must enter a value';
    }
    return this.personalInfoForm.controls.personalemail.hasError('email') ? 'Not a valid email' : '';
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getBloodgroups() {
    this.companyService.getMastertable('bloodgroupmaster', '1', 1, 10, this.companyDBName).subscribe(data => {
      this.bloodGroupdetails = data.data;
    })
  }
  getGender() {
    this.companyService.getMastertable('gendermaster', null, 1, 40, this.companyDBName).subscribe(data => {
      this.genderDetails = data.data;
    })
  }
  getMaritalStatusMaster() {
    this.companyService.getMastertable('maritalstatusmaster', null, 1, 10, this.companyDBName).subscribe(data => {
      this.maritalStatusDetails = data.data;
    })
  }
  getRelationshipMaster() {
    this.companyService.getMastertable('relationshipmaster', 'Active', 1, 30, this.companyDBName).subscribe(data => {
      this.employeeRelationship = data.data;
    })
  }

  getDesignationsMaster() {
    this.companyService.getMastertable('designationsmaster', 1, 1, 1000, this.companyDBName).subscribe(data => {
      this.availableDesignations = data.data;
    })
  }
  getDepartmentsMaster() {
    this.companyService.getMastertable('departmentsmaster', '1', 1, 1000, this.companyDBName).subscribe(data => {
      this.availableDepartments = data.data;
    })
  }
  getWorkLocation() {
    this.companyService.getactiveWorkLocation({ id: null, companyName: this.companyDBName }).subscribe((result) => {
      this.worklocationDetails = result.data;
    })

  }

  savePersonalInfo() {
    const invalid = [];
    const controls = this.personalInfoForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
          invalid.push(name);
      }
    }
    if (this.personalInfoForm.valid) {
      let data = {
        preid: this.preOnboardId != null ? this.preOnboardId : null,
        candidateid: parseInt(this.loginCandidateId),
        firstname: this.personalInfoForm.controls.firstname.value,
        middlename: this.personalInfoForm.controls.middlename.value,
        lastname: this.personalInfoForm.controls.lastname.value,
        dateofbirth: this.pipe.transform(this.personalInfoForm.controls.dateofbirth.value, 'yyyy-MM-dd hh:mm:ss'),
        bloodgroup: parseInt(this.personalInfoForm.controls.bloodgroup.value),
        gender: parseInt(this.personalInfoForm.controls.gender.value),
        maritalstatus: parseInt(this.personalInfoForm.controls.maritalstatus.value),
        aadharnumber: this.personalInfoForm.controls.aadharNumber.value,
        // panNumber: this.personalInfoForm.controls.panNumber.value,
        //uanNumber: this.personalInfoForm.controls.uanNumber.value,
        address: this.personalInfoForm.controls.raddress.value,
        city: parseInt(this.personalInfoForm.controls.rcity.value),
        state: parseInt(this.personalInfoForm.controls.rstate.value),
        pincode: this.personalInfoForm.controls.rpincode.value,
        country: parseInt(this.personalInfoForm.controls.rcountry.value),
        paddress: this.personalInfoForm.controls.paddress.value,
        pcity: parseInt(this.personalInfoForm.controls.pcity.value),
        pstate: parseInt(this.personalInfoForm.controls.pstate.value),
        ppincode: this.personalInfoForm.controls.ppincode.value,
        pcountry: parseInt(this.personalInfoForm.controls.pcountry.value),
        passport: null,
        personal_email: this.personalInfoForm.controls.personalemail.value,
        languages_spoken: this.personalInfoForm.controls.spokenLanguages.value,
        contact_number: this.personalInfoForm.controls.mobileNo.value,
        hired_date: this.pipe.transform(this.personalInfoForm.controls.hireDate.value, 'yyyy-MM-dd hh:mm:ss'),
        dateofjoin: this.pipe.transform(this.personalInfoForm.controls.joinDate.value, 'yyyy-MM-dd hh:mm:ss'),
        noticeperiod: 0,
        designation: parseInt(this.designationId),
        emergencycontact_number:  this.personalInfoForm.controls.alternateMobileNo.value,
        emergencycontact_relation: null,
        emergencycontactname: null,
        relations: this.familyDetails,
        stepcompleted: 1,
        actionby: parseInt(this.loginCandidateId),
      }

      this.mainService.savePreOnboardingCandidateInfo(data).subscribe((res: any) => {
        if (res.status && res.data[0].statuscode == 0) {
        this.getCandidateData();
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data:"Data saved sucessfully"
          });


        } else {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
           data: "Data is not saved"
          });
        }
      });
    } else {

    }
  }

  personalInfoClear() {

  }

  addfamily() {
    this.addValidators();
    if (this.CandidateFamilyForm.valid) {
      this.familyDetails.push({
        firstname: this.CandidateFamilyForm.controls.familyfirstname.value,
        lastname:null,
        gender: this.CandidateFamilyForm.controls.familygender.value.id,
        gendername: this.CandidateFamilyForm.controls.familygender.value.gender,
        contactnumber: this.CandidateFamilyForm.controls.familycontact.value,
        status: this.CandidateFamilyForm.controls.familystatus.value,
        relationship: this.CandidateFamilyForm.controls.relation.value.id,
        relationshipname: this.CandidateFamilyForm.controls.relation.value.relationship,
        dateofbirth:null
      });
      this.familyDataSource = new MatTableDataSource(this.familyDetails);
      this.clearValidators();
      this.clearfamily();
    }else{}
  }

  // AddDucument(){
  //   if (this.documentsForm.valid) {
  //     // var doc=this.documentsForm.controls.documentName.value
  //     // var filename = this.documentsForm.controls.attachedFile.value
  //     this.documentDetails.push({
  //       documentId: this.documentsForm.controls.documentId.value?this.documentsForm.controls.documentId.value:null,
  //     documentName:this.documentsForm.controls.documentName.value,
  //     documentNumber: this.documentsForm.controls.documentNumber.value,
  //     attachedFile:this.filename
  //     });
  //     // this.documentDataSource = new MatTableDataSource(this.documentDetails);
  //   }


  // }
  // clearDucument(){

  // }
  clearValidators() {
    this.CandidateFamilyForm.get("familyfirstname").clearValidators();
    this.CandidateFamilyForm.get("familyfirstname").updateValueAndValidity();

    this.CandidateFamilyForm.get("relation").clearValidators();
    this.CandidateFamilyForm.get("relation").updateValueAndValidity();

    this.CandidateFamilyForm.get("familycontact").clearValidators();
    this.CandidateFamilyForm.get("familycontact").updateValueAndValidity();

    this.CandidateFamilyForm.get("familygender").clearValidators();
    this.CandidateFamilyForm.get("familygender").updateValueAndValidity();
  }

  addValidators() {
    this.CandidateFamilyForm.get("familyfirstname").setValidators(Validators.required);
    this.CandidateFamilyForm.get("familyfirstname").updateValueAndValidity();

    this.CandidateFamilyForm.get("relation").setValidators(Validators.required);
    this.CandidateFamilyForm.get("relation").updateValueAndValidity();

    this.CandidateFamilyForm.get("familygender").setValidators(Validators.required);
    this.CandidateFamilyForm.get("familygender").updateValueAndValidity();
}
  clearfamily() {
    //this.createFamilyForm();
    this.CandidateFamilyForm.controls.familyfirstname.reset();
    this.CandidateFamilyForm.controls.relation.reset();
    this.CandidateFamilyForm.controls.familycontact.reset();
    this.CandidateFamilyForm.controls.familygender.reset();
    this.CandidateFamilyForm.valid = true;
    this.isfamilyedit = false;
  }

  editfamily(i: any) {

  }

  deletefamily(index: any) {
    this.familyDetails.splice(index, 1);
    this.familyDataSource = new MatTableDataSource(this.familyDetails);
    this.isfamilyedit = false;
  }

  saveWorkExperience() {
    const invalid = [];
    const controls = this.employementForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
          invalid.push(name);
      }
    }
    if(this.workExperienceDetails.length >0){
    let data = {
      preid:  this.preOnboardId != null ?  this.preOnboardId : null,
      candidateid: this.loginCandidateId,
      stepcompleted:3,
      experience: this.workExperienceDetails,
      }
    this.mainService.savePreOnboardingCandidateExperience(data).subscribe((res: any) => {
      if (res.status && res.data[0].statuscode == 0) {
      this.getCandidateData();
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
          data:"Data saved sucessfully"
        });

      } else {
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
         data: "Data is not saved"
        });
      }
    });
    } else {
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position: { top: `70px` },
        disableClose: true,
        data:"Please enter data"
      });
    }
  }

  addWorkExperience() {
    this.addExperienceValidators();
    if (this.employementForm.valid) {
      this.workExperienceDetails.push({
        companyname: this.employementForm.controls.companyName.value,
        fromdate:this.pipe.transform( this.employementForm.controls.expFromDate.value, 'yyyy-MM-dd'),
        todate:this.pipe.transform( this.employementForm.controls.expToDate.value, 'yyyy-MM-dd'),
        skills: this.employementForm.controls.jobDescription.value,
        designation: this.employementForm.controls.designation.value,
        });
      this.workExperienceDataSource = new MatTableDataSource(this.workExperienceDetails);
      this.clearExperienceValidators();
      this.clearWork();
    }else{}
  }
  clearExperienceValidators() {
    this.employementForm.get("companyName").clearValidators();
    this.employementForm.get("companyName").updateValueAndValidity();

    this.employementForm.get("expFromDate").clearValidators();
    this.employementForm.get("expFromDate").updateValueAndValidity();

    this.employementForm.get("expToDate").clearValidators();
    this.employementForm.get("expToDate").updateValueAndValidity();

    this.employementForm.get("designation").clearValidators();
    this.employementForm.get("designation").updateValueAndValidity();

    this.employementForm.get("jobDescription").clearValidators();
    this.employementForm.get("jobDescription").updateValueAndValidity();
  }

  addExperienceValidators() {
    this.employementForm.get("companyName").setValidators(Validators.required);
    this.employementForm.get("companyName").updateValueAndValidity();

    this.employementForm.get("expFromDate").setValidators(Validators.required);
    this.employementForm.get("expFromDate").updateValueAndValidity();

    this.employementForm.get("expToDate").setValidators(Validators.required);
    this.employementForm.get("expToDate").updateValueAndValidity();

    this.employementForm.get("designation").setValidators(Validators.required);
    this.employementForm.get("designation").updateValueAndValidity();

}
  clearWork() {
    //this.createEmployementForm();
    this.employementForm.controls.companyName.reset();
    this.employementForm.controls.designation.reset();
    this.employementForm.controls.expFromDate.reset();
    this.employementForm.controls.expToDate.reset();
    this.employementForm.controls.jobDescription.reset();
    this.employementForm.valid = true;
    this.isfamilyedit = false;
  }
  deleteExperience(index: any) {
    this.workExperienceDetails.splice(index, 1);
    this.workExperienceDataSource = new MatTableDataSource(this.workExperienceDetails);
    this.isfamilyedit = false;
  }

  saveEducation() {
    const invalid = [];
    const controls = this.educationForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
          invalid.push(name);
      }
    }
    if (this.educationDetails.length > 0) {
      let data = {
        preid: this.preOnboardId != null ? this.preOnboardId : null,
        candidateid: this.loginCandidateId,
        stepcompleted: 2,
        education: this.educationDetails,
      }
      this.mainService.savePreOnboardingCandidateEducation(data).subscribe((res: any) => {
        if (res.status && res.data[0].statuscode == 0) {
          this.getCandidateData();
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: "Data saved sucessfully"
          });

        } else {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: "Data is not saved"
          });
        }
      });
    } else {
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position: { top: `70px` },
        disableClose: true,
        data:"Please enter data"
      });
    }

  }

  addEducation() {
    this.addEducationValidators();
    if (this.educationForm.valid) {
      this.educationDetails.push({
        course: this.educationForm.controls.course.value,
        institutename: this.educationForm.controls.instituteName.value,
        fromdate:this.pipe.transform( this.educationForm.controls.eduFromDate.value, 'yyyy-MM-dd'),
        todate:this.pipe.transform( this.educationForm.controls.eduToDate.value, 'yyyy-MM-dd'),
         });
      this.educationDataSource = new MatTableDataSource(this.educationDetails);
      this.clearEducationValidators();
      this.clearEducation();
    } else { }

  }
  clearEducationValidators() {
    this.educationForm.get("course").clearValidators();
    this.educationForm.get("course").updateValueAndValidity();

    this.educationForm.get("instituteName").clearValidators();
    this.educationForm.get("instituteName").updateValueAndValidity();

    this.educationForm.get("eduFromDate").clearValidators();
    this.educationForm.get("eduFromDate").updateValueAndValidity();

    this.educationForm.get("eduToDate").clearValidators();
    this.educationForm.get("eduToDate").updateValueAndValidity();
  }

  addEducationValidators() {
    this.educationForm.get("course").setValidators(Validators.required);
    this.educationForm.get("course").updateValueAndValidity();

    this.educationForm.get("instituteName").setValidators(Validators.required);
    this.educationForm.get("instituteName").updateValueAndValidity();

    this.educationForm.get("eduFromDate").setValidators(Validators.required);
    this.educationForm.get("eduFromDate").updateValueAndValidity();

    this.educationForm.get("eduToDate").setValidators(Validators.required);
    this.educationForm.get("eduToDate").updateValueAndValidity();

}
  clearEducation() {
    this.educationForm.controls.course.reset();
    this.educationForm.controls.instituteName.reset();
    this.educationForm.controls.eduFromDate.reset();
    this.educationForm.controls.eduToDate.reset();
    this.educationForm.valid = true;
  }

  DeleteEducationPopup(event: any){
    let dialogRef = this.dialog.open(ComfirmationDialogComponent, {
      position:{top:`70px`},
      disableClose: true,
      data: {message:this.EM61,YES:'YES',NO:'NO'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result == 'YES'){
        this.deleteEducation(event)
      }
      });
  }
  deleteEducation(index: any) {
    this.educationDetails.splice(index, 1);
    this.educationDataSource = new MatTableDataSource(this.educationDetails);
    this.isfamilyedit = false;
  }
  validateDocument(){
    this.createValidatorForDocument();
console.log("hhhhhhhh",this.documentsForm)
    if(this.documentsForm.valid){
    if(this.documentsForm.controls.attachedFile.value || this.editDockinfo){
      if(this.isFile){
    var valid =true
    var ReplaceDocument:any;
    if(this.documentDetails.length !=0 && !this.editDockinfo){
    for(let i=0;i<this.documentDetails.length;i++){
      if(this.documentsForm.controls.documentName.value == this.documentDetails[i].file_category){
        valid = false;
        ReplaceDocument = this.documentDetails[i];
        break;
      }
    }
  }
    if(!valid){
      let dialogRef = this.dialog.open(ComfirmationDialogComponent, {
        position:{top:`70px`},
        disableClose: true,
        data: {message:ReplaceDocument.description +' '+this.EM21,YES:'YES',NO:'NO'}
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result == 'YES'){
          this.documentsForm.controls.documentId.setValue(ReplaceDocument.id,{emitEvent:false}) ;
          this.editDockinfo=JSON.stringify(ReplaceDocument);
          this.saveDocument();
        }
        });
    }else{
      this.saveDocument();
    }
  }else{
    let dialogRef = this.dialog.open(ReusableDialogComponent, {
      position: {top: `70px`},
      disableClose: true,
      data: this.EM13
    });
  }
}
else{
  let dialogRef = this.dialog.open(ReusableDialogComponent, {
    position: {top: `70px`},
    disableClose: true,
    data: this.EM18
  });
}
}
  }
  saveDocument() {
    // if(this.documentsForm.controls.attachedFile.value || this.editDockinfo){
    // if(this.isFile){
    //   if(this.validateDocument()){
    this.mainService.getFilepathsMasterForEMS(1).subscribe((resultData) => {
      if(resultData && resultData.status){
        let obj = {
          'id':this.documentsForm.controls.documentId.value?this.documentsForm.controls.documentId.value:null,
          'employeeId':0,
          'candidateId':this.candidateId,
          'filecategory': this.documentsForm.controls.documentName.value,
          'moduleId':1,
          'documentnumber':this.documentsForm.controls.documentNumber.value,
          'fileName':this.file?this.file.name:this.editFileName,
          'modulecode':resultData.data[0].module_code,
          'requestId':null,
          'status':'Submitted'
        }
        this.mainService.setFilesMasterForEMS(obj).subscribe((data) => {
          if(data && data.status) {
            if( obj.fileName != this.editFileName){
            let info =JSON.stringify(data.data[0])
            this.mainService.setDocumentOrImageForEMS(this.formData, info).subscribe((data) => {
              // this.spinner.hide()
              if(data && data.status){
                if(this.editDockinfo){
                  this.mainService.removeDocumentOrImagesForEMS(this.editDockinfo).subscribe((data) => {})
                }
                let dialogRef = this.dialog.open(ReusableDialogComponent, {
                    position: {top: `70px`},
                    disableClose: true,
                    data: this.EM11
                  });
                  this.getDocumentsEMS();
                  this.clearDock();
              }else{
                let dialogRef = this.dialog.open(ReusableDialogComponent, {
                  position: {top: `70px`},
                  disableClose: true,
                  data: this.EM12
                });
                // this.open(result.isLeaveUpdated ? this.msgLM76 : this.msgLM79,'8%','500px','250px',false,"/LeaveManagement/UserDashboard")

              }
              this.file = null;
              this.formData.delete('file');
              this.editDockinfo=null;
              this.editFileName= null;

            });
          }else{
            this.getDocumentsEMS();
            this.clearDock();
            this.editDockinfo=null;
            this.editFileName= null;
            this.file = null;
              this.formData.delete('file');
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: {top: `70px`},
              disableClose: true,
              data: this.EM19
            });
          }
          }else{
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: {top: `70px`},
              disableClose: true,
              data: this.EM17
            });
          }
        });
      }});
  //   }
  //   }else{
  //     let dialogRef = this.dialog.open(ReusableDialogComponent, {
  //       position: {top: `70px`},
  //       disableClose: true,
  //       data: this.EM13
  //     });
  //   }
  // }
  // else{
  //   let dialogRef = this.dialog.open(ReusableDialogComponent, {
  //     position: {top: `70px`},
  //     disableClose: true,
  //     data: this.EM18
  //   });
  // }

  }

  onSelectFile(event:any) {
    if(event.target.files.length!=0){
    if (event.target.files[0].size <=	2097152) {
      this.file = event.target.files[0];
      var pdf = this.file.name.split('.');
      if(pdf[pdf.length-1] == 'pdf' || pdf[pdf.length-1] == 'jpg' || pdf[pdf.length-1] == 'png'){
        this.isFile = true;
        this.formData.append('file', this.file, this.file.name);
      }else{
        this.isFile = false;
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: {top: `70px`},
          disableClose: true,
          data: this.EM13
        });
        // this.open(this.msgLM141,'8%','500px','250px',false,"/LeaveManagement/LeaveRequest")


      }
    } else {
      this.isFile = false;
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position: {top: `70px`},
        disableClose: true,
        data: this.EM14
      });
    }
  }else{
    let dialogRef = this.dialog.open(ReusableDialogComponent, {
      position: {top: `70px`},
      disableClose: true,
      data: this.EM18
    });
    // th
  }
  }

  open(errormessages:any,top:any,width:any,height:any,flag:any,url:any){
    const dialogRef = this.dialog.open(ConfirmationComponent,{ position: {top: `70px`}, data:{"Message":errormessages,flag:flag,url:url}});
    dialogRef.afterClosed().subscribe(result => {});
  }

  delete()
  {
    this.isedit =false;
  }

  alphabetKeyPress(event: any,) {
    const pattern = /[a-zA-Z ]/;
      let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  alphaNumberOnly (e:any) {  // Accept only alpha numerics, not special characters
    var regex = new RegExp("^[a-zA-Z0-9 ]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
        return true;
    }

    e.preventDefault();
    return false;
  }

  tabClick(event:any){
    if(event.index== 0){
      //this.createPersonalInfoForm();
    } else if(event.index== 1){
     // this.createEmployementForm();
    } else if (event.index== 2) {
      //this.createEducationForm();
    } else {
      //this.createDocumentsForm();
     }

  }

//   getMessagesList() {
//     let data =
//      {
//        "code": null,
//        "pagenumber":1,
//        "pagesize":100
//    }
//    this.adminService.getMessagesListApi(data).subscribe((res:any)=>{
//      if(res.status) {
//        this.messagesDataList = res.data;
//        this.messagesDataList.forEach((e: any) => {
//         if (e.code == "ATT1") {
//          this.requiredField = e.message
//         } else if (e.code == "ATT2") {
//           this.requiredOption =e.message
//         } else if (e.code == "ATT11") {
//           this.dataSave =e.message
//         } else if (e.code == "ATT12") {
//           this.dataNotSave =e.message
//         }
//       })
//      } else {
//        this.messagesDataList = [];
//      }

//    })
//  }

  getDocumentsEMS(){

        let input = {
          'employeeId':0,
          "candidateId":this.candidateId,
          "moduleId":1,
          "filecategory":null,
          "requestId":null,
          'status':null
        }
        this.mainService.getDocumentsForEMS(input).subscribe((result: any) => {
          this.documentDetails=[];
          if(result && result.status){
            for(let k=0;k<result.data.length;k++){
              let documentName = result.data[k].filename.split('_')
              var docArray=[];
              var pdfName;
              for(let i=0;i<=documentName.length;i++){
                if(i>2){
                  docArray.push(documentName[i])
                }
              }
              pdfName = docArray.join('')
              result.data[k].pdfName=pdfName
            }
            this.documentDetails=result.data
            this.documentDataSource = new MatTableDataSource(this.documentDetails)
          }


        })
        this.isedit = false;

    }


  getFilecategoryMasterForEMS() {
    let input = {
      'id':null,
      "moduleId":1,
    }
    this.mainService.getFilecategoryMasterForEMS(input).subscribe((result: any) => {
      if(result && result.status){

        this.documentTypeList = result.data;

      }
    })
  }
  fileView(data:any){
    let info = data
    this.spinner.show()
        this.mainService.getDocumentOrImagesForEMS(info).subscribe((imageData) => {

          if(imageData.success){


            this.spinner.hide();

            let TYPED_ARRAY = new Uint8Array(imageData.image.data);
            const STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
              return data + String.fromCharCode(byte);
            }, '');
            let base64String= btoa(STRING_CHAR)
              var documentName= data.pdfName.split('.')

            if(documentName[documentName.length-1]=='pdf'){
            const file = new Blob([TYPED_ARRAY], { type: "application/pdf" });
            this.fileURL = URL.createObjectURL(file);
            window.open(this.fileURL);

            }else{
              this.fileURL=new Blob([TYPED_ARRAY], { type: "image/png" })
              let url = URL.createObjectURL(this.fileURL)
              window.open( url, '_blank' );

            }

          }
        })
  }

  editDock(data:any){
    this.createValidatorForDocument();
    this.isedit = true;
    this.editFileName=data.fname;
    this.editDockinfo = JSON.stringify(data)
    this.documentsForm.controls.documentId.setValue(data.id,{emitEvent:false}) ;
    this.documentsForm.controls.documentName.setValue(data.file_category,{emitEvent:false});
    this.documentsForm.controls.documentNumber.setValue(data.document_number,{emitEvent:false});

    // this.documentsForm.controls.attachedFile.setValue(data.filename,{emitEvent:false});

    // documentId: [""],
    //   documentName: [""],
    //   documentNumber: [""],
    //   attachedFile: [""],

  }
  deleteDock(data:any){
    let dialogRef = this.dialog.open(ComfirmationDialogComponent, {
      position:{top:`70px`},
      disableClose: true,
      data: {message:this.EM16,YES:'YES',NO:'NO'}
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result == 'YES'){
        this.mainService.deleteFilesMaster(data.id).subscribe((res:any)=>{
          if(res && res.status){
            var info = JSON.stringify(data)
            this.mainService.removeDocumentOrImagesForEMS(info).subscribe((result:any) => {})
            // this.mainService.removeDocumentOrImagesForEMS(data).subscribe(result => {})
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: {top: `70px`},
              disableClose: true,
              data: this.EM15
            });
            this.getDocumentsEMS()


          }else{
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: {top: `70px`},
              disableClose: true,
              data: this.EM17
            });
          }

        });

      }
      });




  }



  getMessagesList() {
    let data =
     {
       "code": null,
       "pagenumber":1,
       "pagesize":1000
   }
   this.EMS.getMessagesListApi(data).subscribe((res:any)=>{
     if(res.status) {
       this.messagesDataList = res.data;
       this.messagesDataList.forEach((e: any) => {
        if (e.code == "EM15") {
         this.EM15 = e.message
        } else if (e.code == "EM11") {
          this.EM11 =e.message
        } else if (e.code == "EM12") {
          this.EM12 =e.message
        }else if (e.code == "EM13") {
          this.EM13 =e.message
        } else if (e.code == "EM14") {
          this.EM14 =e.message
        }
        else if (e.code == "EM16") {
          this.EM16 =e.message
        } else if (e.code == "EM17") {
          this.EM17 =e.message
        } else if (e.code == "EM18") {
          this.EM18 =e.message
        }else if (e.code == "EM19") {
          this.EM19 =e.message
        }else if (e.code == "EM20") {
          this.EM20 =e.message
        }else if (e.code == "EM21") {
          this.EM21 =e.message
        }else if (e.code == "EM22") {
          this.EM22 =e.message
        }else if (e.code == "EM1") {
          this.EM1 =e.message
        }else if (e.code == "EM2") {
          this.EM2 =e.message
        }
        else if (e.code == "EM61") {
          this.EM61 =e.message
          console.log("hello",this.EM61)
        }

      })
     } else {
       this.messagesDataList = [];
     }

   })
  }

  clearDock(){
    // this.documentsForm.resetForm({resetType:ResetFormType.ControlsOnly})
    this.documentsForm.reset();
    this.documentsForm.get('documentName').clearValidators();
    this.documentsForm.get('documentName').updateValueAndValidity();
    this.documentsForm.get('documentNumber').clearValidators();
    this.documentsForm.get('documentNumber').updateValueAndValidity();
    this.documentsForm.get('documentId').clearValidators();
    this.documentsForm.get('documentId').updateValueAndValidity();
    this.documentsForm.get('attachedFile').clearValidators();
    this.documentsForm.get('attachedFile').updateValueAndValidity();

  }
  createValidatorForDocument(){
  this.documentsForm.controls.documentNumber.setValidators([Validators.required,Validators.minLength(6), Validators.maxLength(14)])
  this.documentsForm.controls.documentName.setValidators([Validators.required])
  this.documentsForm.get('documentNumber').updateValueAndValidity();
   this.documentsForm.get('documentName').updateValueAndValidity();

}
noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
}
}

