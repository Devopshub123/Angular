import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/modules/admin/admin.service';
import { ConfirmationComponent } from 'src/app/modules/leaves/dialog/confirmation/confirmation.component';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import { EmployeeMasterService } from 'src/app/services/employee-master-service';
import { EmsService } from '../../ems.service';
import {MainService} from '../../../../services/main.service'
import {ComfirmationDialogComponent} from '../../../../pages/comfirmation-dialog/comfirmation-dialog.component'
import {NgxSpinnerService} from "ngx-spinner";
import { ThemeService } from 'ng2-charts';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
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
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class EmployeeProfileComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private companyService: CompanySettingService,
    private dialog: MatDialog, private mainService:MainService,private spinner:NgxSpinnerService, private router: Router, private activeroute: ActivatedRoute,
    private adminService: AdminService, private emsService: EmsService) { this.formData = new FormData();}
  personalInfoForm!: FormGroup;
  CandidateFamilyForm: any = FormGroup;
  employeeJobForm: any = FormGroup;
  promotionsForm: any = FormGroup;
  employementForm!: FormGroup;
  experienceForm: any = FormGroup;
  educationForm: any = FormGroup;
  documentsForm:any= FormGroup;
  documentTypeList: any =[];
  isedit:boolean=false;

  displayedColumns = ['position', 'name', 'relation', 'gender', 'contact', 'status', 'action'];
  familyTableColumns = ['position', 'name', 'relation', 'gender', 'contact', 'status', 'action'];
  documentTableColumns = ['position','category','number','status','name','action'];

  promotionsTableColumns = ['sno', 'salary', 'fromDate', 'action'];
  workTableColumns = ['sno', 'company','desig', 'fromDate', 'toDate', 'action'];
  educationTableColumns = ['sno', 'course', 'college', 'fromDate', 'toDate', 'action'];
  familyDataSource: MatTableDataSource<any> = <any>[];
  promotionsDataSource: MatTableDataSource<any> = <any>[];
  documentDataSource: MatTableDataSource<any> = <any>[];
  workExperienceDataSource: MatTableDataSource<any> = <any>[];
  educationDataSource: MatTableDataSource<any> = <any>[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  minDate = new Date('1950/01/01');
  maxBirthDate: any;
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
  isviewemployee: boolean = false;
  isview: boolean = true;
  availableDesignations: any = [];
  availableDepartments: any = [];
  availableRole: any = [];
  availablereportingmanagers: any[] = [];
  worklocationDetails: any[] = [];
  loginCandidateId: any;
  loginData: any = [];
  employeeInformationData: any = [];
  employeeJobData: any = [];
  employeeEmployementData: any = [];
  employeeEducationData: any = [];

  expFromDate: any;
  expToDate: any;
  maxDate = new Date();
  minetodate: any;

  edmaxDate = new Date();
  // documentTypeList: any = ['Aadhar', 'PAN Card', 'Passport ID'];
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
  candidateId: any;
  employeeId: any;
  employeeCode: any;

  editemployee: boolean = false;
  EmploymentTypeDetails: any = [];
  contractStartDate: any;
  contractEndDate: any;
  addFamilyView: boolean = false;
  isself: boolean = false;
  employeeNameh: any;
  employeeDesignation: any;
  employeeJoinDate: any;
  employeeMobile: any;
  statusList: any;
  promotionsList: any = [];
  empId:any;
  editFileName:any;
  editDockinfo:any;
  EM1:any;
  EM2:any;
  EM11:any
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
  fileURL:any;
  file:any;
  documentDetails:any=[];
  familyindex: any;
  educationIndex: any;
  experienceIndex: any;
  isExperienceEdit: boolean = false;
  isEducationEdit: boolean = false;
  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.empId=this.userSession.id
    this.getDocumentsEMS();
    this.getFilecategoryMasterForEMS();
    this.createPersonalInfoForm();
    this.createFamilyForm();
    this.createEmployeeJobForm();
    this.createPromotionsForm();
    this.createEmployementForm();
    this.createExperienceForm();
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
    this.getEmploymentTypeMaster();
    this.getRoles();
    this.getstatuslist();
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
    //////////
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
    this.personalInfoForm.get('usertype')?.valueChanges.subscribe(selectedValue => {
      if (selectedValue == 2) {
        this.isself = true;
      }
      else {
        this.isself = false;
      }
    })

    this.personalInfoForm.get('department')?.valueChanges.subscribe(selectedValue => {
      this.availablereportingmanagers = []
      let data = {
        id: selectedValue
      }
      this.companyService.getReportingManagers(data).subscribe(data => {
        this.availablereportingmanagers = data[0]
      })
    })
  /** through employee directory */
    if (this.activeroute.snapshot.params.empId != 0 && this.activeroute.snapshot.params.empId != null) {
      this.employeeId = this.activeroute.snapshot.params.empId
      this.getEmployeeInformationList();
      this.getEmployeeJobList();
      this.getEmployeeEmploymentList();
      this.getEmployeeEducationList();
    } else {
      this.employeeId = this.userSession.id;
      this.getEmployeeInformationList();
      this.getEmployeeJobList();
      this.getEmployeeEmploymentList();
      this.getEmployeeEducationList();
    }

  }

  /** through employee directory login data  */
  getEmployeeInformationList() {
    this.employeeInformationData = [];
    this.emsService.getEmployeeInformationData(this.employeeId).subscribe((res: any) => {
      this.employeeInformationData = JSON.parse(res.data[0].json)[0];

      if (this.employeeInformationData.id != null) {
        this.preOnboardId = this.employeeInformationData.id;
      }
      let a = this.employeeInformationData;
      if (a.rcountry == a.pcountry && a.rstate == a.pstate && a.rcity == a.pcity && a.raddress == a.paddress && a.rpincode == a.ppincode) {
        this.personalInfoForm.controls.checked.setValue(true)
      }
      this.employeeNameh = this.employeeInformationData.firstname +' '+ this.employeeInformationData.lastname;
      this.employeeCode = this.employeeInformationData.empid;
      this.availableDesignations.forEach((e:any)=> {
        if (e.id ==  this.employeeInformationData.designation) {
          this.employeeDesignation = e.designation;
       }
      });
      this.employeeJoinDate = this.employeeInformationData.dateofjoin;
      this.employeeMobile = this.employeeInformationData.contactnumber;
      this.designationId = this.employeeInformationData.designation;

      this.personalInfoForm.controls.firstname.setValue(this.employeeInformationData.firstname);
      this.personalInfoForm.controls.middlename.setValue(this.employeeInformationData.middlename);
      this.personalInfoForm.controls.lastname.setValue(this.employeeInformationData.lastname);
      this.personalInfoForm.controls.dateofbirth.setValue(new Date(this.employeeInformationData.dateofbirth));
      this.personalInfoForm.controls.bloodgroup.setValue(this.employeeInformationData.bloodgroup);
      this.personalInfoForm.controls.gender.setValue(this.employeeInformationData.gender);
      this.personalInfoForm.controls.maritalstatus.setValue(this.employeeInformationData.maritalstatus);

      this.personalInfoForm.controls.aadharNumber.setValue(this.employeeInformationData.aadharnumber);
      this.personalInfoForm.controls.raddress.setValue(this.employeeInformationData.address);
      this.personalInfoForm.controls.rcountry.setValue(this.employeeInformationData.country);
      this.personalInfoForm.controls.rstate.setValue(this.employeeInformationData.state);
      this.personalInfoForm.controls.rcity.setValue(this.employeeInformationData.city);
      this.personalInfoForm.controls.rpincode.setValue(this.employeeInformationData.pincode);

      this.personalInfoForm.controls.personalemail.setValue(this.employeeInformationData.personalemail);
      if(this.employeeInformationData.languages_spoken !=null || this.employeeInformationData.languages_spoken !='null')
      this.personalInfoForm.controls.spokenLanguages.setValue(this.employeeInformationData.languages_spoken);
      this.personalInfoForm.controls.paddress.setValue(this.employeeInformationData.paddress);
      this.personalInfoForm.controls.pcountry.setValue(this.employeeInformationData.pcountry);
      this.personalInfoForm.controls.pstate.setValue(this.employeeInformationData.pstate);
      this.personalInfoForm.controls.pcity.setValue(this.employeeInformationData.pcity);
      this.personalInfoForm.controls.ppincode.setValue(this.employeeInformationData.ppincode);
      this.personalInfoForm.controls.mobileNo.setValue(this.employeeInformationData.contactnumber);
      if(this.employeeInformationData.emergencycontactnumber !='null')
      this.personalInfoForm.controls.alternateMobileNo.setValue(this.employeeInformationData.emergencycontactnumber);
      this.personalInfoForm.controls.hireDate.setValue(new Date(this.employeeInformationData.hired_date));
      // /**work information */
      this.personalInfoForm.controls.empid.setValue(this.employeeInformationData.empid);
      this.personalInfoForm.controls.officeemail.setValue(this.employeeInformationData.officeemail);
      this.personalInfoForm.controls.empStatus.setValue(this.employeeInformationData.status);
      this.personalInfoForm.controls.employmentType.setValue(this.employeeInformationData.employmenttype);
      this.personalInfoForm.controls.usertype.setValue(this.employeeInformationData.usertype);
      this.personalInfoForm.controls.companylocation.setValue(this.employeeInformationData.worklocation);
      this.personalInfoForm.controls.designation.setValue(this.employeeInformationData.designation);
      this.personalInfoForm.controls.department.setValue(this.employeeInformationData.department);
      this.personalInfoForm.controls.reportingmanager.setValue(this.employeeInformationData.reportingmanager);
      this.personalInfoForm.controls.noticePeriod.setValue(this.employeeInformationData.noticeperiod);

      if (this.employeeInformationData.relations != null) {
        let familydata = JSON.parse((this.employeeInformationData.relations))
        if (familydata != null) {
          for (let i = 0; i < familydata.length; i++) {
            let relationship;
            let relationshipname;
            this.employeeRelationship.forEach((e: any) => {
              if (e.id == familydata[i].relationship) {
                relationship = e.id;
                relationshipname = e.relationship;
              }
            })

            let gender;
            let gendername;
            this.genderDetails.forEach((e: any) => {
              if (e.id == familydata[i].gender) {
                gender = e.id;
                gendername = e.gender;
              }
            })

            this.familyDetails.push({
              firstname: familydata[i].firstname,
              lastname: familydata[i].lastname,
              gender: gender,
              gendername: gendername,
              contactnumber: familydata[i].contactnumber,
              status: familydata[i].status,
              relationship: relationship,
              relationshipname: relationshipname,
              dateofbirth: familydata[i].dateofbirth != "null" ? this.pipe.transform(familydata[i].dateofbirth, 'yyyy-MM-dd') : '',
            });
          }
          this.familyDataSource = new MatTableDataSource(this.familyDetails);
        }
      }


    })
  }

  /** through employee directory login data  */
  getEmployeeJobList() {
    this.employeeJobData = [];
    this.emsService.getEmployeeJobData(this.employeeId).subscribe((res: any) => {
      this.employeeJobData = JSON.parse(res.data[0].json)[0];
      if(this.employeeJobData.contractname != 'null')
      this.employeeJobForm.controls.contractName.setValue(this.employeeJobData.contractname);
      if(this.employeeJobData.fileid != 'null')
        this.employeeJobForm.controls.contractFile.setValue(this.employeeJobData.fileid);
        if(this.employeeJobData.notes != 'null')
      this.employeeJobForm.controls.contractNotes.setValue(this.employeeJobData.notes);
      if (this.employeeJobData.startdate !=null) {
        this.employeeJobForm.controls.contractStartDate.setValue(new Date(this.employeeJobData.startdate));
      }
      if (this.employeeJobData.enddate !=null) {
        this.employeeJobForm.controls.contractEndDate.setValue(new Date(this.employeeJobData.enddate));
      }
      if (this.employeeJobData.promotions != null) {
        let promotionsdata = JSON.parse((this.employeeJobData.promotions))
        if (promotionsdata != null) {
          for (let i = 0; i < promotionsdata.length; i++) {
            this.promotionsList.push({
              newsalary: promotionsdata[i].salary,
              newdescription: promotionsdata[i].description,
              effectivedate: promotionsdata[i].effectivedate != "null" ? this.pipe.transform(promotionsdata[i].effectivedate, 'yyyy-MM-dd') : '',
              annualsalary: promotionsdata[i].annualsalary,
            });
          }
          this.promotionsDataSource = new MatTableDataSource(this.promotionsList);
        }
      }
    })
  }
  /** through employee directory login data  */
  getEmployeeEmploymentList() {
    this.employeeEmployementData = [];
    this.emsService.getEmployeeEmployement(this.employeeId).subscribe((res: any) => {
      this.employeeEmployementData = JSON.parse(res.data[0].json)[0];

      this.employementForm.controls.bankName.setValue(this.employeeEmployementData.bankname);
      this.employementForm.controls.bankAccountName.setValue(this.employeeEmployementData.nameasperbankaccount);
      this.employementForm.controls.bankAccountNumber.setValue(this.employeeEmployementData.bankaccountnumber);
      this.employementForm.controls.ifscCode.setValue(this.employeeEmployementData.ifsccode);
      this.employementForm.controls.branchName.setValue(this.employeeEmployementData.branchname);
      this.employementForm.controls.uanNumber.setValue(this.employeeEmployementData.uanumber);
      this.employementForm.controls.panNumber.setValue(this.employeeEmployementData.pan);

      if (this.employeeEmployementData.experience != null) {
        let employementdata = JSON.parse((this.employeeEmployementData.experience))
        if (employementdata != null) {
          for (let i = 0; i < employementdata.length; i++) {
            this.workExperienceDetails.push({
              companyname: employementdata[i].companyname,
              fromdate: employementdata[i].fromdate != "null" ? this.pipe.transform(employementdata[i].fromdate, 'yyyy-MM-dd') : '',
              todate: employementdata[i].todate != "null" ? this.pipe.transform(employementdata[i].todate, 'yyyy-MM-dd') : '',
              skills: employementdata[i].skills,
            });
          }
          this.workExperienceDataSource = new MatTableDataSource(this.workExperienceDetails);
        }
      }
    })
  }

  /** through employee directory login data  */
  getEmployeeEducationList() {
    this.employeeEducationData = [];
    this.emsService.getEmployeeEducationData(this.employeeId).subscribe((res: any) => {
      this.employeeEducationData = JSON.parse(res.data[0].json)[0];

      if (this.employeeEducationData.education != null) {
        let educationdata = JSON.parse((this.employeeEducationData.education))
        if (educationdata != null) {
          for (let i = 0; i < educationdata.length; i++) {
            this.educationDetails.push({
              course: educationdata[i].course,
              fromdate: educationdata[i].fromdate != "null" ? this.pipe.transform(educationdata[i].fromdate, 'yyyy-MM-dd') : '',
              todate: educationdata[i].todate != "null" ? this.pipe.transform(educationdata[i].todate, 'yyyy-MM-dd') : '',
              institutename: educationdata[i].institutename,
            });
          }
          this.educationDataSource = new MatTableDataSource(this.educationDetails);
        }
      }
    })
  }

  getCountry() {
    this.countryDetails = []
    this.companyService.getCountry('countrymaster', null, 1, 10, 'ems').subscribe(result => {
      this.countryDetails = result.data;
      this.permanentCountryDetails = result.data;
    })
  }


  createPersonalInfoForm() {
    this.personalInfoForm = this.formBuilder.group(
      {
        firstname: [""],
        lastname: ["",],
        middlename: [""],
        dateofbirth: ["",],
        bloodgroup: [""],
        gender: ["",],
        maritalstatus: ["",],
        aadharNumber: ["", Validators.maxLength(12)],
        panNumber: [""],
        uanNumber: ["", Validators.maxLength(12)],
        /// address controls
        raddress: ["",],
        rcountry: ["",],
        rstate: ["",],
        rcity: ["",],
        rpincode: ["",],
        personalemail: ["", [Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        spokenLanguages: [""],
        checked: [false],
        paddress: ["",],
        pcountry: ["",],
        pstate: ["",],
        pcity: ["",],
        ppincode: ["",],
        mobileNo: ["",],
        alternateMobileNo: ["",],
        officeemail: [""],
        usertype: ["",],
        designation: ["",],
        department: ["",],
        employmentType: ["",],
        dateofjoin: ["",],
        companylocation: ["",],
        reportingmanager: ["",],
        empid: [""],
        empStatus: ["Active"],
        noticePeriod: [""],
        hireDate: [""],

      })
  }
  createFamilyForm() {
    this.CandidateFamilyForm = this.formBuilder.group(
      {
        familyfirstname: ["",],
        familycontact: [""],
        familygender: ["",],
        relation: ["",],
        familystatus: ["Alive",],
      });
  }

  //** */

  //** */

  createEmployeeJobForm() {
    this.employeeJobForm = this.formBuilder.group(
      {
        contractName: [""],
        contractStartDate: [""],
        contractEndDate: [""],
        contractFile: [""],
        contractNotes: [""],

      });
  }
  createPromotionsForm() {
    this.promotionsForm = this.formBuilder.group(
      {
        newSalary: [""],
        newDescription: [""],
        effectiveDate: [""],
        annualSalary: [""],
      });
  }
  createEmployementForm() {
    this.employementForm = this.formBuilder.group(
      {
        bankName: [""],
        bankAccountName: [""],
        bankAccountNumber: [""],
        ifscCode: [""],
        branchName: [""],
        uanNumber: [""],
        panNumber: [""],

      });
  }
  createExperienceForm() {
    this.experienceForm = this.formBuilder.group(
      {
        companyName: [""],
        designation: [""],
        expFromDate: [""],
        expToDate: [""],
        jobDescription: [""],
      });
  }

  createEducationForm() {
    this.educationForm = this.formBuilder.group(
      {
        course: [""],
        instituteName: [""],
        eduFromDate: [""],
        eduToDate: [""],

      });
  }
  createDocumentsForm() {
    this.documentsForm = this.formBuilder.group(
      {
        documentId: [""],
        documentName: ["",Validators.required],
        documentNumber: ["",Validators.required],
        attachedFile: [""],

      });
  }


  getBloodgroups() {
    this.companyService.getMastertable('bloodgroupmaster', '1', 1, 10, 'ems').subscribe(data => {
      this.bloodGroupdetails = data.data;
    })
  }
  getGender() {
    this.companyService.getMastertable('gendermaster', null, 1, 40, 'ems').subscribe(data => {
      this.genderDetails = data.data;
    })
  }
  getMaritalStatusMaster() {
    this.companyService.getMastertable('maritalstatusmaster', null, 1, 10, 'ems').subscribe(data => {
      this.maritalStatusDetails = data.data;
    })
  }
  getRelationshipMaster() {
    this.companyService.getMastertable('relationshipmaster', 'Active', 1, 30, 'ems').subscribe(data => {
      this.employeeRelationship = data.data;
    })
  }
  getEmploymentTypeMaster() {
    this.companyService.getMastertable('employmenttypemaster', null, 1, 1000, 'ems').subscribe(data => {
      this.EmploymentTypeDetails = data.data;
    })
  }
  getDesignationsMaster() {
    this.companyService.getMastertable('designationsmaster', 1, 1, 1000, 'ems').subscribe(data => {
      if (data.status) {
        this.availableDesignations = data.data;
      }
    })
  }
  getDepartmentsMaster() {
    this.companyService.getMastertable('departmentsmaster', 1, 1, 1000, 'ems').subscribe(data => {
      if (data.status) {
        this.availableDepartments = data.data;
      }
    })
  }
  getWorkLocation() {
    this.companyService.getactiveWorkLocation({ id: null, companyName: 'ems' }).subscribe((result) => {
      this.worklocationDetails = result.data;
    })

  }
  getRoles() {
    this.companyService.getMastertable('rolesmaster', null, 1, 1000, 'ems').subscribe(data => {
      let roledata = data.data;
      this.availableRole = [];
      for (let i = 0; i < roledata.length; i++) {
        if (roledata[i].isEditable == 0) {
          this.availableRole.push(roledata[i])
        }
      }
    })
  }
  getReportingManagers(id: any) {
    let data = {
      id: id
    }
    this.companyService.getReportingManagers(data).subscribe(data => {
      this.availablereportingmanagers = data[0]
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
    if(this.personalInfoForm.valid){
    let data = {
      condidateid:this.loginCandidateId,
      empid: this.employeeCode != undefined || this.employeeCode != null ? this.employeeCode: null,
      firstname: this.personalInfoForm.controls.firstname.value,
      middlename: this.personalInfoForm.controls.middlename.value,
      lastname: this.personalInfoForm.controls.lastname.value,
      dateofbirth: this.pipe.transform(this.personalInfoForm.controls.dateofbirth.value, 'yyyy-MM-dd hh:mm:ss'),
      bloodgroup: parseInt(this.personalInfoForm.controls.bloodgroup.value),
      gender: parseInt(this.personalInfoForm.controls.gender.value),
      maritalstatus: parseInt(this.personalInfoForm.controls.maritalstatus.value),
      aadharnumber: this.personalInfoForm.controls.aadharNumber.value,
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
      personalemail: this.personalInfoForm.controls.personalemail.value,
      languages_spoken: this.personalInfoForm.controls.spokenLanguages.value,
      contactnumber: this.personalInfoForm.controls.mobileNo.value,
      hiredon: this.pipe.transform(this.personalInfoForm.controls.hireDate.value, 'yyyy-MM-dd hh:mm:ss'),
      dateofjoin: this.pipe.transform(this.employeeJoinDate, 'yyyy-MM-dd hh:mm:ss'),
      noticeperiod: parseInt(this.personalInfoForm.controls.noticePeriod.value),
      //noticeperiod: 0,
      designation: parseInt(this.designationId),
      emergencycontactnumber: this.personalInfoForm.controls.alternateMobileNo.value,
      emergencycontactrelation: null,
      emergencycontactname: null,
      relations: this.familyDetails,
      education: this.educationDetails.length > 0 ? this.educationDetails: null,
      experience: this.workExperienceDetails.length > 0 ? this.workExperienceDetails: null,
      status: 1,
      actionby: parseInt(this.userSession.id),
      ///////
      officeemail: this.personalInfoForm.controls.officeemail.value,
      usertype: this.personalInfoForm.controls.usertype.value,
      department: this.personalInfoForm.controls.department.value,
      employmenttype: this.personalInfoForm.controls.employmentType.value,
      companylocation: this.personalInfoForm.controls.companylocation.value,
      reportingmanager: "Self",
    }

    this.emsService.saveEmployeeInformationData(data).subscribe((res: any) => {
      if (res.status) {
        this.getEmployeeInformationList();
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
  }
  }

  personalInfoClear() {

  }
  addingFamilyView() {
    this.addFamilyView = true

  }
  addfamily() {
    this.addValidators();
    if (this.isfamilyedit) {
      this.isfamilyedit = false;
      this.familyDetails[this.familyindex].firstname = this.CandidateFamilyForm.controls.familyfirstname.value;
      //this.familyDetails[this.familyindex].lastname = this.CandidateFamilyForm.controls.familylastname.value;
      this.familyDetails[this.familyindex].gender = this.CandidateFamilyForm.controls.familygender.value.id;
      this.familyDetails[this.familyindex].gendername = this.CandidateFamilyForm.controls.familygender.value.gender;
     this.familyDetails[this.familyindex].contactnumber = this.CandidateFamilyForm.controls.familycontact.value;
      this.familyDetails[this.familyindex].status = this.CandidateFamilyForm.controls.familystatus.value;
      this.familyDetails[this.familyindex].relationship = this.CandidateFamilyForm.controls.relation.value.id;
      this.familyDetails[this.familyindex].relationshipname = this.CandidateFamilyForm.controls.relation.value.relationship;
      //this.familyDetails[this.familyindex].dateofbirth = this.CandidateFamilyForm.controls.familydateofbirth.value != "" ? this.pipe.transform(this.CandidateFamilyForm.controls.familydateofbirth.value, 'yyyy-MM-dd') : ''
      this.clearValidators();
      this.clearfamily();
    } else {

      if (this.CandidateFamilyForm.valid) {
        this.familyDetails.push({
          firstname: this.CandidateFamilyForm.controls.familyfirstname.value,
          lastname: null,
          gender: this.CandidateFamilyForm.controls.familygender.value.id,
          gendername: this.CandidateFamilyForm.controls.familygender.value.gender,
          contactnumber: this.CandidateFamilyForm.controls.familycontact.value,
          status: this.CandidateFamilyForm.controls.familystatus.value,
          relationship: this.CandidateFamilyForm.controls.relation.value.id,
          relationshipname: this.CandidateFamilyForm.controls.relation.value.relationship,
          dateofbirth: null
        });
        this.familyDataSource = new MatTableDataSource(this.familyDetails);
        this.clearValidators();
        this.clearfamily();
      }
    }
  }
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
    this.familyindex = i;
    this.isfamilyedit = true;
    this.addFamilyView = true
    this.CandidateFamilyForm.controls.familyfirstname.setValue(this.familyDetails[i].firstname);
    //this.CandidateFamilyForm.controls.familylastname.setValue(this.familyDetails[i].lastname);
    //this.CandidateFamilyForm.controls.familydateofbirth.setValue(new Date(this.familyDetails[i].dateofbirth));
    this.CandidateFamilyForm.controls.familystatus.setValue(this.familyDetails[i].status);
    if(this.familyDetails[i].contactnumber !='null')
     this.CandidateFamilyForm.controls.familycontact.setValue(this.familyDetails[i].contactnumber);
    this.employeeRelationship.forEach((e:any)=>{
      if(e.id==this.familyDetails[i].relationship){
        this.CandidateFamilyForm.controls.relation.setValue(e);
      }
    })
    this.genderDetails.forEach((e:any)=>{
      if(e.id==this.familyDetails[i].gender){
        this.CandidateFamilyForm.controls.familygender.setValue(e);
      }
    })

  }
  deletefamily(index: any) {
    this.familyDetails.splice(index, 1);
    this.familyDataSource = new MatTableDataSource(this.familyDetails);
    this.isfamilyedit = false;
  }

  addPromotions() {
    if (this.promotionsForm.valid) {
      this.promotionsList.push({
        newsalary: this.promotionsForm.controls.newSalary.value,
        newdescription: this.promotionsForm.controls.newDescription.value,
        effectivedate: this.pipe.transform(this.promotionsForm.controls.effectiveDate.value, 'yyyy-MM-dd'),
        annualsalary: this.promotionsForm.controls.annualSalary.value,
      });
      this.promotionsDataSource = new MatTableDataSource(this.promotionsList);
      this.clearPromotions();
    } else { }
  }
  clearPromotions() {
    this.promotionsForm.controls.newSalary.reset();
    this.promotionsForm.controls.newDescription.reset();
    this.promotionsForm.controls.effectiveDate.reset();
    this.promotionsForm.controls.annualSalary.reset();
    this.promotionsForm.valid = true;

  }
  deletePromotions(index: any) {
    this.promotionsList.splice(index, 1);
    this.promotionsDataSource = new MatTableDataSource(this.promotionsList);
    this.isfamilyedit = false;
  }
  //** */
  saveJobDetails() {
    const invalid = [];
    const controls = this.employeeJobForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    let data = {
      empid: this.employeeCode,
      contractname: this.employeeJobForm.controls.contractName.value,
      notes: this.employeeJobForm.controls.contractNotes.value,
      //fileid: this.employeeJobForm.controls.contractFile.value,
      fileid: null,
      startdate: this.pipe.transform(this.employeeJobForm.controls.contractStartDate.value, 'yyyy-MM-dd'),
      enddate: this.pipe.transform(this.employeeJobForm.controls.contractEndDate.value, 'yyyy-MM-dd'),
      promotions: this.promotionsList,
    }
    this.emsService.saveEmployeeJobDetailsData(data).subscribe((res: any) => {
      if (res.status && res.data[0].statuscode == 0) {
        this.getEmployeeJobList();
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
  }

  //** */
  addWorkExperience() {
    this.addExperienceValidators();
    if (this.isExperienceEdit) {
      this.isExperienceEdit = false;
      this.workExperienceDetails[this.experienceIndex].companyname = this.experienceForm.controls.companyName.value;
      this.workExperienceDetails[this.experienceIndex].designation =  this.experienceForm.controls.designation.value;
      this.workExperienceDetails[this.experienceIndex].skills =  this.experienceForm.controls.jobDescription.value;
      this.workExperienceDetails[this.experienceIndex].fromdate = this.pipe.transform(this.experienceForm.controls.expFromDate.value, 'yyyy-MM-dd'),
      this.workExperienceDetails[this.experienceIndex].todate =this.pipe.transform(this.experienceForm.controls.expToDate.value, 'yyyy-MM-dd'),
      this.clearExperienceValidators();
        this.clearWorkExperience();
    } else {
    if (this.experienceForm.valid) {
      this.workExperienceDetails.push({
        companyname: this.experienceForm.controls.companyName.value,
        fromdate: this.pipe.transform(this.experienceForm.controls.expFromDate.value, 'yyyy-MM-dd'),
        todate: this.pipe.transform(this.experienceForm.controls.expToDate.value, 'yyyy-MM-dd'),
        skills: this.experienceForm.controls.jobDescription.value,
        designation: this.experienceForm.controls.designation.value,
      });
      this.workExperienceDataSource = new MatTableDataSource(this.workExperienceDetails);
      this.clearExperienceValidators();
      this.clearWorkExperience();
    } else { }
  }
  }
  editExperience(i: any) {
    this.experienceIndex = i; 
    this.isExperienceEdit = true;
    this.experienceForm.controls.companyName.setValue(this.workExperienceDetails[i].companyname);
    this.experienceForm.controls.designation.setValue(this.workExperienceDetails[i].designation);
    this.experienceForm.controls.jobDescription.setValue(this.workExperienceDetails[i].skills);
    this.experienceForm.controls.expFromDate.setValue(this.workExperienceDetails[i].fromdate);
    this.experienceForm.controls.expToDate.setValue(this.workExperienceDetails[i].todate);
}
clearExperienceValidators() {
  this.experienceForm.get("companyName").clearValidators();
  this.experienceForm.get("companyName").updateValueAndValidity();

  this.experienceForm.get("expFromDate").clearValidators();
  this.experienceForm.get("expFromDate").updateValueAndValidity();
  
  this.experienceForm.get("expToDate").clearValidators();
  this.experienceForm.get("expToDate").updateValueAndValidity();

  this.experienceForm.get("designation").clearValidators();
  this.experienceForm.get("designation").updateValueAndValidity();

  this.experienceForm.get("jobDescription").clearValidators();
  this.experienceForm.get("jobDescription").updateValueAndValidity();
}

addExperienceValidators() {
  this.experienceForm.get("companyName").setValidators(Validators.required);
  this.experienceForm.get("companyName").updateValueAndValidity();

  this.experienceForm.get("expFromDate").setValidators(Validators.required);
  this.experienceForm.get("expFromDate").updateValueAndValidity();
  
  this.experienceForm.get("expToDate").setValidators(Validators.required);
  this.experienceForm.get("expToDate").updateValueAndValidity();

  this.experienceForm.get("designation").setValidators(Validators.required);
  this.experienceForm.get("designation").updateValueAndValidity();

}
  clearWorkExperience() {
    this.experienceForm.controls.companyName.reset();
    this.experienceForm.controls.expFromDate.reset();
    this.experienceForm.controls.expToDate.reset();
    this.experienceForm.controls.designation.reset();
    this.experienceForm.controls.jobDescription.reset();
    this.experienceForm.valid = true;
  }
  deleteExperience(index: any) {
    this.workExperienceDetails.splice(index, 1);
    this.workExperienceDataSource = new MatTableDataSource(this.workExperienceDetails);
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
    let data = {
      empid: this.employeeCode,
      bankname: this.employementForm.controls.bankName.value,
      ifsccode: this.employementForm.controls.ifscCode.value,
      nameasperbankaccount: this.employementForm.controls.bankAccountName.value,
      branchname: this.employementForm.controls.branchName.value,
      bankaccountnumber: this.employementForm.controls.bankAccountNumber.value,
      uanumber: this.employementForm.controls.uanNumber.value,
      //pfaccountnumber: this.employementForm.controls.contractFile.value,
      pan: this.employementForm.controls.panNumber.value,
      experience: this.workExperienceDetails,
    }

    this.emsService.saveEmployeeEmployementData(data).subscribe((res: any) => {
      if (res.status && res.data[0].statuscode == 0) {
        this.getEmployeeEmploymentList();
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

  }


  //** */
  saveEducation() {
    const invalid = [];
    const controls = this.employementForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    let data = {
      empid: this.employeeCode,
      education: this.educationDetails,
    }

    this.emsService.saveEmployeeEducationData(data).subscribe((res: any) => {
      if (res.status && res.data[0].statuscode == 0) {

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
  }

  addEducation() {
    this.addEducationValidators();
    if (this.isEducationEdit) {
      this.isEducationEdit = false;
      this.educationDetails[this.educationIndex].course = this.educationForm.controls.course.value;
      this.educationDetails[this.educationIndex].institutename =  this.educationForm.controls.instituteName.value;
      this.educationDetails[this.educationIndex].fromdate = this.pipe.transform(this.educationForm.controls.eduFromDate.value, 'yyyy-MM-dd'),
      this.educationDetails[this.educationIndex].todate =this.pipe.transform(this.educationForm.controls.eduToDate.value, 'yyyy-MM-dd'),
      this.clearEducationValidators();
        this.clearEducation();
    } else {

      if (this.educationForm.valid) {
        this.educationDetails.push({
          course: this.educationForm.controls.course.value,
          institutename: this.educationForm.controls.instituteName.value,
          fromdate: this.pipe.transform(this.educationForm.controls.eduFromDate.value, 'yyyy-MM-dd'),
          todate: this.pipe.transform(this.educationForm.controls.eduToDate.value, 'yyyy-MM-dd'),
        });
        this.educationDataSource = new MatTableDataSource(this.educationDetails);
        this.clearEducationValidators();
        this.clearEducation();
      } else { }
    }
  }
  editEduction(i: any) {
    this.educationIndex = i; 
    this.isEducationEdit = true;
    this.educationForm.controls.course.setValue(this.educationDetails[i].course);
    this.educationForm.controls.instituteName.setValue(this.educationDetails[i].institutename);
    this.educationForm.controls.eduFromDate.setValue(this.educationDetails[i].fromdate);
    this.educationForm.controls.eduToDate.setValue(this.educationDetails[i].todate);
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
  deleteEducation(index: any) {
    this.educationDetails.splice(index, 1);
    this.educationDataSource = new MatTableDataSource(this.educationDetails);
    this.isfamilyedit = false;
  }



  open(errormessages: any, top: any, width: any, height: any, flag: any, url: any) {
    const dialogRef = this.dialog.open(ConfirmationComponent, { position: { top: `70px` }, data: { "Message": errormessages, flag: flag, url: url } });
    dialogRef.afterClosed().subscribe(result => { });
  }



  alphabetKeyPress(event: any,) {
    const pattern = /[a-zA-Z ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  tabClick(event: any) {
    if (event.index == 0) {
      //this.createPersonalInfoForm();
    } else if (event.index == 1) {
      // this.createEmployementForm();
    } else if (event.index == 2) {
      //this.createEducationForm();
    } else {
      //this.createDocumentsForm();
    }

  }

  getMessagesList() {
    let data =
    {
      "code": null,
      "pagenumber": 1,
      "pagesize": 1000
    }
    this.emsService.getMessagesListApi(data).subscribe((res: any) => {
      if (res.status) {
        this.messagesDataList = res.data;
        this.messagesDataList.forEach((e: any) => {
          if (e.code == "EM15") {
            this.EM15 = e.message
           }  else if (e.code == "EM1") {
            this.EM1 =e.message
          } else if (e.code == "EM22") {
            this.EM22 =e.message
          } else if (e.code == "EM2") {
            this.EM2 =e.message
          }else if (e.code == "EM11") {
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
           }
        })
      } else {
        this.messagesDataList = [];
      }

    })
  }
  getstatuslist() {
    this.companyService.getstatuslists().subscribe((result: any) => {
      if (result.status) {
        this.statusList = result.data;
      }

    })
  }
  numberOnly(event:any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  _keyPress(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
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



  getDocumentsEMS(){
    let input = {
      'employeeId':this.empId,
      "candidateId":0,
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

editDock(data:any){
  this.createValidatorForDocument();
  this.isedit = true;
  this.editFileName=data.fname;
  this.editDockinfo = JSON.stringify(data)
  this.documentsForm.controls.documentId.setValue(data.id,{emitEvent:false}) ;
  this.documentsForm.controls.documentName.setValue(data.file_category,{emitEvent:false});
  this.documentsForm.controls.documentNumber.setValue(data.document_number,{emitEvent:false});
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


validateDocument(){
  this.createValidatorForDocument()
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
        'employeeId':this.empId,
        'candidateId':0,
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



  // this.documentsForm.controls.documentId.setValidators([Validators.required])
  // this.documentsForm.controls.documentNumber.setValidators([Validators.required])
  // this.documentsForm.controls.documentName.setValidators([Validators.required])
  // this.documentsForm.controls.attachedFile.setValidators([Validators.required])
  // this.documentsForm.get('documentNumber').updateValueAndValidity();
  // this.documentsForm.get('documentId').updateValueAndValidity();
  // this.documentsForm.get('attachedFile').updateValueAndValidity();
  // this.documentsForm.get('documentName').updateValueAndValidity();



//   this.documentsForm.controls['documentName'].setErrors(null);
//   this.documentsForm.controls['documentNumber'].setErrors(null);
//   this.documentsForm.controls['attachedFile'].setErrors(null);
//   this.documentsForm.controls['documentId'].setErrors(null);
// this.createDocumentsForm()
//   // this.documentsForm.controls.documentName.reset();
  // this.documentsForm.controls.documentNumber.reset();
  // this.documentsForm.controls.attachedFile.reset();

}
delete()
{
  this.isedit =false;
}
createValidatorForDocument(){
  this.documentsForm.controls.documentNumber.setValidators([Validators.required,Validators.minLength(6), Validators.maxLength(14)])
  this.documentsForm.controls.documentName.setValidators([Validators.required])
  this.documentsForm.get('documentNumber').updateValueAndValidity();
   this.documentsForm.get('documentName').updateValueAndValidity();

}
}
