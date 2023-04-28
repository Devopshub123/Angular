import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
import { MainService } from '../../../../services/main.service';
import { ComfirmationDialogComponent } from '../../../../pages/comfirmation-dialog/comfirmation-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ThemeService } from 'ng2-charts';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import * as _moment from 'moment';
import { LeavesService } from 'src/app/modules/leaves/leaves.service';
import { environment } from 'src/environments/environment';
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
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class EmployeeProfileComponent implements OnInit {
  minExperienceDate: any;
  minEducationDate: any;
  companyDBName: any = environment.dbName;
  constructor(
    private formBuilder: FormBuilder,
    private companyService: CompanySettingService,
    private dialog: MatDialog,
    private mainService: MainService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private activeroute: ActivatedRoute,
    private emsService: EmsService,
    private LM: LeavesService
  ) {
    this.formData = new FormData();
    this.companyDBName = sessionStorage.getItem("companyName")?sessionStorage.getItem("companyName"):null;
  }
  personalInfoForm!: FormGroup;
  candidateFamilyForm: any = FormGroup;
  employeeJobForm: any = FormGroup;
  promotionsForm: any = FormGroup;
  employementForm!: FormGroup;
  experienceForm: any = FormGroup;
  educationForm: any = FormGroup;
  documentsForm: any = FormGroup;
  documentTypeList: any = [];
  isedit: boolean = false;

  displayedColumns = [
    'position',
    'name',
    'relation',
    'gender',
    'contact',
    'status',
    'action',
  ];
  familyTableColumns = [
    'position',
    'name',
    'relation',
    'gender',
    'contact',
    'status',
    'action',
  ];
  documentTableColumns = [
    'position',
    'category',
    'number',
    'status',
    'name',
    'action',
  ];

  promotionsTableColumns = ['sno', 'salary', 'fromDate'];
  workTableColumns = [
    'sno',
    'company',
    'desig',
    'fromDate',
    'toDate',
    'action',
  ];
  educationTableColumns = [
    'sno',
    'course',
    'college',
    'fromDate',
    'toDate',
    'action',
  ];
  familyDataSource: MatTableDataSource<any> = <any>[];
  promotionsDataSource: MatTableDataSource<any> = <any>[];
  documentDataSource: MatTableDataSource<any> = <any>[];
  workExperienceDataSource: MatTableDataSource<any> = <any>[];
  educationDataSource: MatTableDataSource<any> = <any>[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  minDate = new Date('1950/01/01');
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
  employeeEmailData: any = [];

  expFromDate: any;
  expToDate: any;
  maxDate: any=new Date();
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
  empId: any;
  editFileName: any;
  editDockinfo: any;
  EM1: any;
  EM2: any;
  EM11: any;
  EM12: any;
  EM13: any;
  EM14: any;
  EM15: any;
  EM16: any;
  EM17: any;
  EM18: any;
  EM19: any;
  EM20: any;
  EM21: any;
  EM22: any;
  EM61: any;
  EM42: any;
  EM43: any;
  EM62: any;
  EM63: any;
  fileURL: any;
  file: any;
  documentDetails: any = [];
  familyindex: any;
  educationIndex: any;
  experienceIndex: any;
  isExperienceEdit: boolean = false;
  isEducationEdit: boolean = false;

  profileId: any = null;
  profileInfo: any = null;
  imageurls = [
    {
      base64String: 'assets/img/profile.jpg',
    },
  ];
  base64String: any;
  name: any;
  imagePath: any;
  isFileImage: boolean = false;
  progressInfos: any = [];
  selectedFiles: any;
  previews: any = [];
  isRemoveImage: boolean = true;
  isContractData: boolean = false;
  isSubmitAdd: boolean = false;
  isUpdate: boolean = false;
  isDelete: boolean = false;
  maxBirthDate:Date | undefined;
  ngOnInit(): void {
    this. maxBirthDate = new Date();
    this.maxBirthDate.setMonth(this.maxBirthDate.getMonth() - 12 * 18);
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.empId = this.userSession.id;
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
    this.personalInfoForm
      .get('checked')
      ?.valueChanges.subscribe((selectedValue) => {
        if (selectedValue) {
          this.personalInfoForm
            .get('pcountry')
            ?.valueChanges.subscribe((selectedValue) => {
              this.permanentStateDetails = [];
              this.companyService
                .getStatesc(selectedValue)
                .subscribe((data) => {
                  this.permanentStateDetails = data.data;
                  if (this.personalInfoForm.controls.rstate.value != null) {
                    this.personalInfoForm.controls.pstate.setValue(
                      this.personalInfoForm.controls.rstate.value
                    );
                  }
                });
            });
          this.personalInfoForm
            .get('pstate')
            ?.valueChanges.subscribe((selectedValue) => {
               this.permanentCityDetails = [];
              this.companyService.getCities(selectedValue).subscribe((data) => {
                this.permanentCityDetails = data.data;
                if (this.personalInfoForm.controls.rcity.value != null) {
                  this.personalInfoForm.controls.pcity.setValue(
                    this.personalInfoForm.controls.rcity.value
                  );
                }
              });
            });

          this.personalInfoForm.controls.paddress.setValue(
            this.personalInfoForm.controls.raddress.value
          ),
            this.personalInfoForm.controls.pcountry.setValue(
              this.personalInfoForm.controls.rcountry.value
            ),
            this.personalInfoForm.controls.ppincode.setValue(
              this.personalInfoForm.controls.rpincode.value
            );
          this.personalInfoForm.controls.paddress.disable();
          this.personalInfoForm.controls.pcountry.disable();
          this.personalInfoForm.controls.pstate.disable();
          this.personalInfoForm.controls.pstate.disable();
          this.personalInfoForm.controls.pcity.disable();
          this.personalInfoForm.controls.ppincode.disable();
        } else {
          this.personalInfoForm.controls.paddress.setValue('');
          this.personalInfoForm.controls.paddress.enable();
          this.personalInfoForm.controls.pcountry.setValue('');
          this.personalInfoForm.controls.pcountry.enable();
          this.personalInfoForm.controls.pstate.setValue('');
          this.personalInfoForm.controls.pstate.enable();
          this.personalInfoForm.controls.pcity.setValue('');
          this.personalInfoForm.controls.pcity.enable();
          this.personalInfoForm.controls.ppincode.setValue('');
          this.personalInfoForm.controls.ppincode.enable();
        }
      });
    this.personalInfoForm
      .get('rcountry')
      ?.valueChanges.subscribe((selectedValue) => {
        this.stateDetails = [];
        this.companyService.getStatesc(selectedValue).subscribe((data) => {
          this.stateDetails = data.data;
        });
      });
    this.personalInfoForm
      .get('rstate')
      ?.valueChanges.subscribe((selectedValue) => {
        this.cityDetails = [];
        this.personalInfoForm.controls.rcity.setValue('');
        this.companyService.getCities(selectedValue).subscribe((data) => {
          this.cityDetails = data.data;
        });
      });

    this.personalInfoForm
      .get('pcountry')
      ?.valueChanges.subscribe((selectedValue) => {
        this.permanentStateDetails = [];
        this.companyService.getStatesc(selectedValue).subscribe((data) => {
          this.permanentStateDetails = data.data;
        });
      });
    this.personalInfoForm
      .get('pstate')
      ?.valueChanges.subscribe((selectedValue) => {
        this.permanentCityDetails = [];
        this.personalInfoForm.controls.pcity.setValue('');
        this.companyService.getCities(selectedValue).subscribe((data) => {
          this.permanentCityDetails = data.data;
        });
      });
    //////////
    this.experienceForm.get('expFromDate')?.valueChanges.subscribe((selectedValue: any) => {
      if (selectedValue != null) {
        this.minExperienceDate = selectedValue._d;
      }
    })

    this.educationForm.get('eduFromDate')?.valueChanges.subscribe((selectedValue: any) => {
      if (selectedValue != null) {
        this.minEducationDate = selectedValue._d;
      }
    });
    
    this.personalInfoForm.get('usertype')?.valueChanges.subscribe((selectedValue) => {
        if (selectedValue == 2) {
          this.isself = true;
        } else {
          this.isself = false;
        }
      });

    this.personalInfoForm
      .get('department')
      ?.valueChanges.subscribe((selectedValue) => {
        this.availablereportingmanagers = [];
        let data = {
          id: selectedValue,
        };
        this.companyService.getReportingManagers(data).subscribe((data) => {
          this.availablereportingmanagers = data[0];
        });
      });
    this.personalInfoForm
      .get('employmentType')
      ?.valueChanges.subscribe((selectedValue: number) => {
        if (selectedValue == 3) {
          this.isContractData = true;
        } else {
          this.isContractData = false;
        }
      });
    /** through employee directory */
    if (
      this.activeroute.snapshot.params.empId != 0 &&
      this.activeroute.snapshot.params.empId != null
    ) {
      this.employeeId = this.activeroute.snapshot.params.empId;
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
    //this.getEmployeeImage();
    this.getEmployeeEmailData();
  }

  onExpDateChange() {
    this.experienceForm.controls.expToDate.setValue('')
    }
  onEduDateChange() {
  this.educationForm.controls.eduToDate.setValue('')  
  }

  /** through employee directory login data  */
  getEmployeeInformationList() {
    this.employeeInformationData = [];
    this.familyDetails = [];
    this.emsService
      .getEmployeeInformationData(this.employeeId)
      .subscribe((res: any) => {
        this.employeeInformationData = JSON.parse(res.data[0].json)[0];

        if (this.employeeInformationData.id != null) {
          this.preOnboardId = this.employeeInformationData.id;
        }
        let a = this.employeeInformationData;
        if (
          a.country == a.pcountry &&
          a.state == a.pstate &&
          a.city == a.pcity &&
          a.address == a.paddress &&
          a.pincode == a.ppincode
        ) {
          this.personalInfoForm.controls.checked.setValue(true);
        }
        this.employeeNameh =
          this.employeeInformationData.firstname +
          ' ' +
          this.employeeInformationData.middlename +
          ' ' +
          this.employeeInformationData.lastname;
        this.employeeCode = this.employeeInformationData.empid;
        this.availableDesignations.forEach((e: any) => {
          if (e.id == this.employeeInformationData.designation) {
            this.employeeDesignation = e.designation;
          }
        });
        this.employeeJoinDate = this.employeeInformationData.dateofjoin;
        this.employeeMobile = this.employeeInformationData.contactnumber;
        this.designationId = this.employeeInformationData.designation;

        let fname = this.employeeInformationData.firstname;
        fname = fname ? fname.charAt(0).toUpperCase() + fname.substr(1).toLowerCase() : '';
        this.personalInfoForm.controls.firstname.setValue(fname);
  
        let mname = this.employeeInformationData.middlename;
        mname = mname ? mname.charAt(0).toUpperCase() + mname.substr(1).toLowerCase() : '';
        this.personalInfoForm.controls.middlename.setValue(mname);
  
        let lname = this.employeeInformationData.lastname;
        lname = lname ? lname.charAt(0).toUpperCase() + lname.substr(1).toLowerCase() : '';
        this.personalInfoForm.controls.lastname.setValue(lname);

       
        this.personalInfoForm.controls.dateofbirth.setValue(
          new Date(this.employeeInformationData.dateofbirth)
        );
        this.personalInfoForm.controls.bloodgroup.setValue(
          this.employeeInformationData.bloodgroup
        );
        this.personalInfoForm.controls.gender.setValue(
          this.employeeInformationData.gender
        );
        this.personalInfoForm.controls.maritalstatus.setValue(
          this.employeeInformationData.maritalstatus
        );
        if (
          this.employeeInformationData.aadharnumber != 'null' ||
          this.employeeInformationData.aadharnumber != null ||
          this.employeeInformationData.aadharnumber != 'null'
        ) {
          this.personalInfoForm.controls.aadharNumber.setValue(
            this.employeeInformationData.aadharnumber
          );
        }
        this.personalInfoForm.controls.raddress.setValue(
          this.employeeInformationData.address
        );
        this.personalInfoForm.controls.rcountry.setValue(
          this.employeeInformationData.country
        );
        this.personalInfoForm.controls.rstate.setValue(
          this.employeeInformationData.state
        );
        this.personalInfoForm.controls.rcity.setValue(
          this.employeeInformationData.city
        );
        this.personalInfoForm.controls.rpincode.setValue(
          this.employeeInformationData.pincode =='null' || null ? "":this.employeeInformationData.pincode
        );

        this.personalInfoForm.controls.personalemail.setValue(
          this.employeeInformationData.personalemail
        );

        this.personalInfoForm.controls.spokenLanguages.setValue(
          this.employeeInformationData.languages_spoken == 'null' || null
            ? ''
            : this.employeeInformationData.languages_spoken
        );

        this.personalInfoForm.controls.paddress.setValue(
          this.employeeInformationData.paddress == 'null' || null
            ? ''
            : this.employeeInformationData.paddress
        );
        this.personalInfoForm.controls.pcountry.setValue(
          this.employeeInformationData.pcountry
        );
        this.personalInfoForm.controls.pstate.setValue(
          this.employeeInformationData.pstate
        );
        this.personalInfoForm.controls.pcity.setValue(
          this.employeeInformationData.pcity
        );
        this.personalInfoForm.controls.ppincode.setValue(
          this.employeeInformationData.ppincode =='null' || null ? "":this.employeeInformationData.ppincode
        );
        this.personalInfoForm.controls.mobileNo.setValue(
          this.employeeInformationData.contactnumber
        );
        if (this.employeeInformationData.emergencycontactnumber != 'null')
          this.personalInfoForm.controls.alternateMobileNo.setValue(
            this.employeeInformationData.emergencycontactnumber
          );
        this.personalInfoForm.controls.hireDate.setValue(
          new Date(this.employeeInformationData.hired_date)
        );
        // /**work information */
        this.personalInfoForm.controls.empid.setValue(
          this.employeeInformationData.empid
        );
        this.personalInfoForm.controls.officeemail.setValue(
          this.employeeInformationData.officeemail
        );
        this.personalInfoForm.controls.empStatus.setValue(
          this.employeeInformationData.status
        );

        this.personalInfoForm.controls.employmentType.setValue(
          this.employeeInformationData.employmenttype
        );
        if (this.employeeInformationData.employmenttype == 3) {
          this.isContractData = true;
        }
        this.personalInfoForm.controls.usertype.setValue(
          JSON.parse(this.employeeInformationData.usertype)[0].role
       );
        this.personalInfoForm.controls.companylocation.setValue(
          this.employeeInformationData.worklocation
        );
        this.personalInfoForm.controls.designation.setValue(
          this.employeeInformationData.designation
        );
        this.personalInfoForm.controls.department.setValue(
          this.employeeInformationData.department
        );
        this.personalInfoForm.controls.reportingmanager.setValue(
          this.employeeInformationData.reportingmanager
        );
        this.personalInfoForm.controls.noticePeriod.setValue(
          this.employeeInformationData.noticeperiod
        );

        if (this.employeeInformationData.relations != null) {
          let familydata = JSON.parse(this.employeeInformationData.relations);
          if (familydata != null) {
            for (let i = 0; i < familydata.length; i++) {
              let relationship;
              let relationshipname;
              this.employeeRelationship.forEach((e: any) => {
                if (e.id == familydata[i].relationship) {
                  relationship = e.id;
                  relationshipname = e.relationship;
                }
              });

              let gender;
              let gendername;
              this.genderDetails.forEach((e: any) => {
                if (e.id == familydata[i].gender) {
                  gender = e.id;
                  gendername = e.gender;
                }
              });

              this.familyDetails.push({
                firstname: familydata[i].firstname,
                lastname: familydata[i].lastname,
                gender: gender,
                gendername: gendername,
                contactnumber: familydata[i].contactnumber,
                status: familydata[i].status,
                relationship: relationship,
                relationshipname: relationshipname,
                dateofbirth:
                  familydata[i].dateofbirth != 'null'
                    ? this.pipe.transform(
                      familydata[i].dateofbirth,
                      'yyyy-MM-dd'
                    )
                    : '',
              });
            }
            this.familyDataSource = new MatTableDataSource(this.familyDetails);
          }
        }
      });
  }
  /** through employee directory login data  */
  getEmployeeJobList() {
    this.employeeJobData = [];
    this.promotionsList = [];
    this.emsService
      .getEmployeeJobData(this.employeeId)
      .subscribe((res: any) => {
        this.employeeJobData = JSON.parse(res.data[0].json)[0];
        if (this.employeeJobData.contractname != 'null')
          this.employeeJobForm.controls.contractName.setValue(
            this.employeeJobData.contractname
          );
        if (this.employeeJobData.fileid != 'null')
          this.employeeJobForm.controls.contractFile.setValue(
            this.employeeJobData.fileid
          );
        if (this.employeeJobData.notes != 'null')
          this.employeeJobForm.controls.contractNotes.setValue(
            this.employeeJobData.notes
          );
        if (this.employeeJobData.startdate != null) {
          this.employeeJobForm.controls.contractStartDate.setValue(
            new Date(this.employeeJobData.startdate)
          );
        }
        if (this.employeeJobData.enddate != null) {
          this.employeeJobForm.controls.contractEndDate.setValue(
            new Date(this.employeeJobData.enddate)
          );
        }
        if (this.employeeJobData.promotions != null) {
          let promotionsdata = JSON.parse(this.employeeJobData.promotions);
          if (promotionsdata != null) {
            for (let i = 0; i < promotionsdata.length; i++) {
              this.promotionsList.push({
                newsalary: promotionsdata[i].salary,
                newdescription: promotionsdata[i].description,
                effectivedate:
                  promotionsdata[i].effectivedate != 'null'
                    ? this.pipe.transform(
                      promotionsdata[i].effectivedate,
                      'yyyy-MM-dd'
                    )
                    : '',
                annualsalary: promotionsdata[i].annualsalary,
              });
            }
            this.promotionsDataSource = new MatTableDataSource(
              this.promotionsList
            );
          }
        }
      });
  }
  /** through employee directory login data  */
  getEmployeeEmploymentList() {
    this.employeeEmployementData = [];
    this.workExperienceDetails = [];
    this.emsService
      .getEmployeeEmployement(this.employeeId)
      .subscribe((res: any) => {
        this.employeeEmployementData = JSON.parse(res.data[0].json)[0];
        if (this.employeeEmployementData.bankname != 'null')
          this.employementForm.controls.bankName.setValue(
            this.employeeEmployementData.bankname
          );
        if (this.employeeEmployementData.nameasperbankaccount != 'null')
          this.employementForm.controls.bankAccountName.setValue(
            this.employeeEmployementData.nameasperbankaccount
          );
        if (this.employeeEmployementData.bankaccountnumber != 'null')
          this.employementForm.controls.bankAccountNumber.setValue(
            this.employeeEmployementData.bankaccountnumber
          );
        if (this.employeeEmployementData.ifsccode != 'null')
          this.employementForm.controls.ifscCode.setValue(
            this.employeeEmployementData.ifsccode
          );
        if (this.employeeEmployementData.branchname != 'null')
          this.employementForm.controls.branchName.setValue(
            this.employeeEmployementData.branchname
          );
        if (this.employeeEmployementData.uanumber != 'null')
          this.employementForm.controls.uanNumber.setValue(
            this.employeeEmployementData.uanumber
          );
        if (this.employeeEmployementData.pan != 'null')
          this.employementForm.controls.panNumber.setValue(
            this.employeeEmployementData.pan
          );

        if (this.employeeEmployementData.experience != null) {
          let employementdata = JSON.parse(
            this.employeeEmployementData.experience
          );
          if (employementdata != null) {
            for (let i = 0; i < employementdata.length; i++) {
              this.workExperienceDetails.push({
                companyname: employementdata[i].companyname,
                designation: employementdata[i].designation,
                fromdate:
                  employementdata[i].fromdate != 'null'
                    ? this.pipe.transform(
                      employementdata[i].fromdate,
                      'yyyy-MM-dd'
                    )
                    : '',
                todate:
                  employementdata[i].todate != 'null'
                    ? this.pipe.transform(
                      employementdata[i].todate,
                      'yyyy-MM-dd'
                    )
                    : '',
                skills: employementdata[i].skills,
              });
            }
            this.workExperienceDataSource = new MatTableDataSource(
              this.workExperienceDetails
            );
          }
        }
      });
  }

  /** through employee directory login data  */
  getEmployeeEducationList() {
    this.employeeEducationData = [];
    this.educationDetails = [];
    this.emsService
      .getEmployeeEducationData(this.employeeId)
      .subscribe((res: any) => {
        this.employeeEducationData = JSON.parse(res.data[0].json)[0];

        if (this.employeeEducationData.education != null) {
          let educationdata = JSON.parse(this.employeeEducationData.education);
          if (educationdata != null) {
            for (let i = 0; i < educationdata.length; i++) {
              this.educationDetails.push({
                course: educationdata[i].course,
                fromdate:
                  educationdata[i].fromdate != 'null'
                    ? this.pipe.transform(
                      educationdata[i].fromdate,
                      'yyyy-MM-dd'
                    )
                    : '',
                todate:
                  educationdata[i].todate != 'null'
                    ? this.pipe.transform(educationdata[i].todate, 'yyyy-MM-dd')
                    : '',
                institutename: educationdata[i].institutename,
              });
            }
            this.educationDataSource = new MatTableDataSource(
              this.educationDetails
            );
          }
        }
      });
  }

  getCountry() {
    this.countryDetails = [];
    this.companyService
      .getCountry('countrymaster', null, 1, 10, this.companyDBName)
      .subscribe((result) => {
        this.countryDetails = result.data;
        this.permanentCountryDetails = result.data;
      });
  }

  createPersonalInfoForm() {
    this.personalInfoForm = this.formBuilder.group({
      firstname: [''],
      lastname: [''],
      middlename: [''],
      dateofbirth: [''],
      bloodgroup: [''],
      gender: [''],
      maritalstatus: [''],
      aadharNumber: ['', Validators.maxLength(12)],
      panNumber: [''],
      uanNumber: ['', Validators.maxLength(12)],
      /// address controls
      raddress: [''],
      rcountry: [''],
      rstate: [''],
      rcity: [''],
      rpincode: [''],
      personalemail: [
        '',
        [
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      spokenLanguages: [''],
      checked: [false],
      paddress: [''],
      pcountry: [''],
      pstate: [''],
      pcity: [''],
      ppincode: [''],
      mobileNo: [
        '',
        [
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern('^(91)?[4-9][0-9]{9}'),
        ],
      ],
      alternateMobileNo: [
        '',
        [
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern('^(91)?[4-9][0-9]{9}'),
        ],
      ],
      officeemail: [''],
      usertype: [''],
      designation: [''],
      department: [''],
      employmentType: [''],
      dateofjoin: [''],
      companylocation: [''],
      reportingmanager: [''],
      empid: [''],
      empStatus: ['Active'],
      noticePeriod: [''],
      hireDate: [''],
    });
  }
  createFamilyForm() {
    this.candidateFamilyForm = this.formBuilder.group({
      familyfirstname: [''],
      familycontact: [
        '',
        [
          Validators.minLength(10),
          Validators.maxLength(10),
          Validators.pattern('^(91)?[4-9][0-9]{9}'),
        ],
      ],
      familygender: [''],
      relation: [''],
      familystatus: ['Alive'],
    });
  }

  //** */

  //** */

  createEmployeeJobForm() {
    this.employeeJobForm = this.formBuilder.group({
      contractName: [''],
      contractStartDate: [''],
      contractEndDate: [''],
      contractFile: [''],
      contractNotes: [''],
    });
  }
  createPromotionsForm() {
    this.promotionsForm = this.formBuilder.group({
      newSalary: [''],
      newDescription: [''],
      effectiveDate: [''],
      annualSalary: [''],
    });
  }
  createEmployementForm() {
    this.employementForm = this.formBuilder.group({
      bankName: [''],
      bankAccountName: [''],
      bankAccountNumber: [''],
      ifscCode: [''],
      branchName: [''],
      uanNumber: [''],
      panNumber: [''],
    });
  }
  createExperienceForm() {
    this.experienceForm = this.formBuilder.group({
      companyName: ['',Validators.required],
      designation: ['',Validators.required],
      expFromDate: ['',Validators.required],
      expToDate: ['',Validators.required],
      jobDescription: ['',Validators.required],
    });
  }

  createEducationForm() {
    this.educationForm = this.formBuilder.group({
      course: ['',Validators.required],
      instituteName: ['',Validators.required],
      eduFromDate: ['',Validators.required],
      eduToDate: ['',Validators.required],
    });
  }
  createDocumentsForm() {
    this.documentsForm = this.formBuilder.group({
      documentId: [''],
      documentName: ['', Validators.required],
      documentNumber: ['', Validators.required],
      attachedFile: [''],
    });
  }

  getBloodgroups() {
    this.companyService
      .getMastertable('bloodgroupmaster', '1', 1, 10, this.companyDBName)
      .subscribe((data) => {
        this.bloodGroupdetails = data.data;
      });
  }
  getGender() {
    this.companyService
      .getMastertable('gendermaster', null, 1, 40, this.companyDBName)
      .subscribe((data) => {
        this.genderDetails = data.data;
      });
  }
  getMaritalStatusMaster() {
    this.companyService
      .getMastertable('maritalstatusmaster', null, 1, 10, this.companyDBName)
      .subscribe((data) => {
        this.maritalStatusDetails = data.data;
      });
  }
  getRelationshipMaster() {
    this.companyService
      .getMastertable('relationshipmaster', 'Active', 1, 30, this.companyDBName)
      .subscribe((data) => {
        this.employeeRelationship = data.data;
      });
  }
  getEmploymentTypeMaster() {
    this.companyService
      .getMastertable('employmenttypemaster', null, 1, 1000, this.companyDBName)
      .subscribe((data) => {
        this.EmploymentTypeDetails = data.data;
      });
  }
  getDesignationsMaster() {
    this.companyService
      .getMastertable('designationsmaster', 1, 1, 1000, this.companyDBName)
      .subscribe((data) => {
        if (data.status) {
          this.availableDesignations = data.data;
        }
      });
  }
  getDepartmentsMaster() {
    this.companyService
      .getMastertable('departmentsmaster', 1, 1, 1000, this.companyDBName)
      .subscribe((data) => {
        if (data.status) {
          this.availableDepartments = data.data;
        }
      });
  }
  getWorkLocation() {
    this.companyService
      .getactiveWorkLocation({ id: null, companyName: this.companyDBName })
      .subscribe((result) => {
        this.worklocationDetails = result.data;
      });
  }
  getRoles() {
    this.companyService
      .getMastertable('rolesmaster', null, 1, 1000, this.companyDBName)
      .subscribe((data) => {
        let roledata = data.data;
        this.availableRole = [];
        for (let i = 0; i < roledata.length; i++) {
          if (roledata[i].isEditable == 0) {
            this.availableRole.push(roledata[i]);
          }
        }
      });
  }
  getReportingManagers(id: any) {
    let data = {
      id: id,
    };
    this.companyService.getReportingManagers(data).subscribe((data) => {
      this.availablereportingmanagers = data[0];
    });
  }

  savePersonalInfo() {

    if (this.personalInfoForm.valid) {
      let data = {
        condidateid: this.loginCandidateId,
        empid:
          this.employeeCode != undefined || this.employeeCode != null
            ? this.employeeCode
            : null,
        firstname: this.personalInfoForm.controls.firstname.value,
        middlename: this.personalInfoForm.controls.middlename.value,
        lastname: this.personalInfoForm.controls.lastname.value,
        dateofbirth: this.pipe.transform(
          this.personalInfoForm.controls.dateofbirth.value,
          'yyyy-MM-dd hh:mm:ss'
        ),
        bloodgroup: parseInt(this.personalInfoForm.controls.bloodgroup.value),
        gender: parseInt(this.personalInfoForm.controls.gender.value),
        maritalstatus: parseInt(
          this.personalInfoForm.controls.maritalstatus.value
        ),
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
        hiredon: this.pipe.transform(
          this.personalInfoForm.controls.hireDate.value,
          'yyyy-MM-dd hh:mm:ss'
        ),
        dateofjoin: this.pipe.transform(
          this.employeeJoinDate,
          'yyyy-MM-dd hh:mm:ss'
        ),
        noticeperiod: parseInt(
          this.personalInfoForm.controls.noticePeriod.value ?? 0
        ),
        //noticeperiod: 0,
        designation: parseInt(this.designationId),
        emergencycontactnumber:
          this.personalInfoForm.controls.alternateMobileNo.value,
        emergencycontactrelation: null,
        emergencycontactname: null,
        relations: this.familyDetails,
        education:
          this.educationDetails.length > 0 ? this.educationDetails : null,
        experience:
          this.workExperienceDetails.length > 0
            ? this.workExperienceDetails
            : null,
        status: 1,
        actionby: parseInt(this.userSession.id),
        ///////
        officeemail: this.personalInfoForm.controls.officeemail.value,
        usertype: this.personalInfoForm.controls.usertype.value,
        department: this.personalInfoForm.controls.department.value,
        employmenttype: this.personalInfoForm.controls.employmentType.value,
        companylocation: this.personalInfoForm.controls.companylocation.value,
        reportingmanager: this.personalInfoForm.controls.reportingmanager.value,
      };

      this.emsService
        .saveEmployeeInformationData(data)
        .subscribe((res: any) => {
          if (res.status) {
            if (res.data.email == null) {
              this.employeeId = res.data.empid;
              this.getEmployeeInformationList();
              this.getEmployeeJobList();
              this.getEmployeeEmploymentList();
              this.getEmployeeEducationList();
              this.spinner.hide();
              let dialogRef = this.dialog.open(ReusableDialogComponent, {
                position: { top: `70px` },
                disableClose: true,
                data: this.EM42,
              });
              this.selectedtab.setValue(1);
            } else {
              this.spinner.hide();
              let dialogRef = this.dialog.open(ReusableDialogComponent, {
                position: { top: `70px` },
                disableClose: true,
                data: res.data.email,
              });
            }
          } else {
            this.spinner.hide();
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
              data: this.EM43,
            });
          }
        });
    }
  }

  addingFamilyView() {
    this.addFamilyView = true;
  }
  addfamily() {
    this.addValidators();
    if (this.isfamilyedit && this.candidateFamilyForm.valid) {
      this.isfamilyedit = false;
      this.familyDetails[this.familyindex].firstname =
        this.candidateFamilyForm.controls.familyfirstname.value;
      //this.familyDetails[this.familyindex].lastname = this.candidateFamilyForm.controls.familylastname.value;
      this.familyDetails[this.familyindex].gender =
        this.candidateFamilyForm.controls.familygender.value.id;
      this.familyDetails[this.familyindex].gendername =
        this.candidateFamilyForm.controls.familygender.value.gender;
      this.familyDetails[this.familyindex].contactnumber =
        this.candidateFamilyForm.controls.familycontact.value;
      this.familyDetails[this.familyindex].status =
        this.candidateFamilyForm.controls.familystatus.value;
      this.familyDetails[this.familyindex].relationship =
        this.candidateFamilyForm.controls.relation.value.id;
      this.familyDetails[this.familyindex].relationshipname =
        this.candidateFamilyForm.controls.relation.value.relationship;
      //this.familyDetails[this.familyindex].dateofbirth = this.candidateFamilyForm.controls.familydateofbirth.value != "" ? this.pipe.transform(this.candidateFamilyForm.controls.familydateofbirth.value, 'yyyy-MM-dd') : ''
      this.clearValidators();
      this.clearfamily();
    } else {
      if (this.candidateFamilyForm.valid) {
        this.familyDetails.push({
          firstname: this.candidateFamilyForm.controls.familyfirstname.value,
          lastname: null,
          gender: this.candidateFamilyForm.controls.familygender.value.id,
          gendername:
            this.candidateFamilyForm.controls.familygender.value.gender,
          contactnumber: this.candidateFamilyForm.controls.familycontact.value,
          status: this.candidateFamilyForm.controls.familystatus.value,
          relationship: this.candidateFamilyForm.controls.relation.value.id,
          relationshipname:
            this.candidateFamilyForm.controls.relation.value.relationship,
          dateofbirth: null,
        });
        this.familyDataSource = new MatTableDataSource(this.familyDetails);
        this.clearValidators();
        this.clearfamily();
      }
    }
  }
  clearValidators() {
    this.candidateFamilyForm.get('familyfirstname').clearValidators();
    this.candidateFamilyForm.get('familyfirstname').updateValueAndValidity();

    this.candidateFamilyForm.get('relation').clearValidators();
    this.candidateFamilyForm.get('relation').updateValueAndValidity();

    this.candidateFamilyForm.get('familycontact').clearValidators();
    this.candidateFamilyForm.get('familycontact').updateValueAndValidity();

    this.candidateFamilyForm.get('familygender').clearValidators();
    this.candidateFamilyForm.get('familygender').updateValueAndValidity();
  }

  addValidators() {
    this.candidateFamilyForm
      .get('familyfirstname')
      .setValidators(Validators.required);
    this.candidateFamilyForm.get('familyfirstname').updateValueAndValidity();

    this.candidateFamilyForm.get('relation').setValidators(Validators.required);
    this.candidateFamilyForm.get('relation').updateValueAndValidity();

    this.candidateFamilyForm
      .get('familygender')
      .setValidators(Validators.required);
    this.candidateFamilyForm.get('familygender').updateValueAndValidity();
  }
  clearfamily() {
    //this.createFamilyForm();
    this.candidateFamilyForm.controls.familyfirstname.reset();
    this.candidateFamilyForm.controls.relation.reset();
    this.candidateFamilyForm.controls.familycontact.reset();
    this.candidateFamilyForm.controls.familygender.reset();
    this.candidateFamilyForm.valid = true;
    this.isfamilyedit = false;
  }

  editfamily(i: any) {
    this.familyindex = i;
    this.isfamilyedit = true;
    this.addFamilyView = true;
    this.candidateFamilyForm.controls.familyfirstname.setValue(
      this.familyDetails[i].firstname
    );
    //this.candidateFamilyForm.controls.familylastname.setValue(this.familyDetails[i].lastname);
    //this.candidateFamilyForm.controls.familydateofbirth.setValue(new Date(this.familyDetails[i].dateofbirth));
    this.candidateFamilyForm.controls.familystatus.setValue(
      this.familyDetails[i].status
    );
    if (this.familyDetails[i].contactnumber != 'null')
      this.candidateFamilyForm.controls.familycontact.setValue(
        this.familyDetails[i].contactnumber
      );
    this.employeeRelationship.forEach((e: any) => {
      if (e.id == this.familyDetails[i].relationship) {
        this.candidateFamilyForm.controls.relation.setValue(e);
      }
    });
    this.genderDetails.forEach((e: any) => {
      if (e.id == this.familyDetails[i].gender) {
        this.candidateFamilyForm.controls.familygender.setValue(e);
      }
    });
  }
  deleteFamilyPopup(event: any) {
    let dialogRef = this.dialog.open(ComfirmationDialogComponent, {
      position: { top: `70px` },
      disableClose: true,
      data: { message: this.EM61, YES: 'YES', NO: 'NO' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'YES') {
        this.deletefamily(event);
      }
    });
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
        effectivedate: this.pipe.transform(
          this.promotionsForm.controls.effectiveDate.value,
          'yyyy-MM-dd'
        ),
        annualsalary: this.promotionsForm.controls.annualSalary.value,
      });
      this.promotionsDataSource = new MatTableDataSource(this.promotionsList);
      this.clearPromotions();
    } else {
    }
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
  }
  //** */
  saveJobDetails() {
    let data = {
      empid: this.employeeCode,
      contractname: this.employeeJobForm.controls.contractName.value,
      notes: this.employeeJobForm.controls.contractNotes.value,
      //fileid: this.employeeJobForm.controls.contractFile.value,
      fileid: null,
      startdate: this.pipe.transform(
        this.employeeJobForm.controls.contractStartDate.value,
        'yyyy-MM-dd'
      ),
      enddate: this.pipe.transform(
        this.employeeJobForm.controls.contractEndDate.value,
        'yyyy-MM-dd'
      ),
      promotions: this.promotionsList,
    };
    this.emsService.saveEmployeeJobDetailsData(data).subscribe((res: any) => {
      if (res.status && res.data[0].statuscode == 0) {
        this.getEmployeeJobList();
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
          data: 'Data saved sucessfully',
        });
        this.selectedtab.setValue(2);
      } else {
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
          data: 'Data is not saved',
        });
      }
    });
  }
  submitAdd() {
    this.isSubmitAdd = true;
    this.addWorkExperience();
  }
  //** */
  addWorkExperience() {
    this.addExperienceValidators();
    if(this.experienceForm.valid){
      
      if (this.isExperienceEdit) {
        this.isExperienceEdit = false;
        this.workExperienceDetails[this.experienceIndex].companyname =
          this.experienceForm.controls.companyName.value;
        this.workExperienceDetails[this.experienceIndex].designation =
          this.experienceForm.controls.designation.value;
        this.workExperienceDetails[this.experienceIndex].skills =
          this.experienceForm.controls.jobDescription.value;
        (this.workExperienceDetails[this.experienceIndex].fromdate =
          this.pipe.transform(
            this.experienceForm.controls.expFromDate.value,
            'yyyy-MM-dd'
          )),
          (this.workExperienceDetails[this.experienceIndex].todate =
            this.pipe.transform(
              this.experienceForm.controls.expToDate.value,
              'yyyy-MM-dd'
            )),
        this.saveWorkExperience();
      } else {
        if (this.experienceForm.valid) {
          this.workExperienceDetails.push({
            companyname: this.experienceForm.controls.companyName.value,
            fromdate: this.pipe.transform(
              this.experienceForm.controls.expFromDate.value,
              'yyyy-MM-dd'
            ),
            todate: this.pipe.transform(
              this.experienceForm.controls.expToDate.value,
              'yyyy-MM-dd'
            ),
            skills: this.experienceForm.controls.jobDescription.value,
            designation: this.experienceForm.controls.designation.value,
          });
         
          this.workExperienceDataSource = new MatTableDataSource(
            this.workExperienceDetails
          );
          
          this.clearExperienceValidators();
          this.clearWorkExperience();
          this.saveWorkExperience();
        } else {
        }
      }

    }
  }
  editExperience(i: any) {
    this.experienceIndex = i;
    this.isExperienceEdit = true;
    this.isUpdate = true;
    this.experienceForm.controls.companyName.setValue(
      this.workExperienceDetails[i].companyname
    );
    this.experienceForm.controls.designation.setValue(
      this.workExperienceDetails[i].designation
    );
    this.experienceForm.controls.jobDescription.setValue(
      this.workExperienceDetails[i].skills
    );
    this.experienceForm.controls.expFromDate.setValue(
      this.workExperienceDetails[i].fromdate
    );
    this.experienceForm.controls.expToDate.setValue(
      this.workExperienceDetails[i].todate
    );
  }
  clearExperienceValidators() {
    this.experienceForm.get('companyName').clearValidators();
    this.experienceForm.get('companyName').updateValueAndValidity();

    this.experienceForm.get('expFromDate').clearValidators();
    this.experienceForm.get('expFromDate').updateValueAndValidity();

    this.experienceForm.get('expToDate').clearValidators();
    this.experienceForm.get('expToDate').updateValueAndValidity();

    this.experienceForm.get('designation').clearValidators();
    this.experienceForm.get('designation').updateValueAndValidity();

    this.experienceForm.get('jobDescription').clearValidators();
    this.experienceForm.get('jobDescription').updateValueAndValidity();
  }

  addExperienceValidators() {
    this.experienceForm.get('companyName').setValidators(Validators.required);
    this.experienceForm.get('companyName').updateValueAndValidity();

    this.experienceForm.get('expFromDate').setValidators(Validators.required);
    this.experienceForm.get('expFromDate').updateValueAndValidity();

    this.experienceForm.get('expToDate').setValidators(Validators.required);
    this.experienceForm.get('expToDate').updateValueAndValidity();

    this.experienceForm.get('designation').setValidators(Validators.required);
    this.experienceForm.get('designation').updateValueAndValidity();
  }
  clearWorkExperience() {
    this.isExperienceEdit = false;
    this.isUpdate = false;
    this.isDelete = false;
    this.experienceForm.controls.companyName.reset();
    this.experienceForm.controls.expFromDate.reset();
    this.experienceForm.controls.expToDate.reset();
    this.experienceForm.controls.designation.reset();
    this.experienceForm.controls.jobDescription.reset();
  }
  deleteExperiencePopup(event: any) {
    let dialogRef = this.dialog.open(ComfirmationDialogComponent, {
      position: { top: `70px` },
      disableClose: true,
      data: { message: this.EM61, YES: 'YES', NO: 'NO' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'YES') {
        this.isDelete = true;
        this.deleteExperience(event);
      }
    });
  }
  deleteExperience(index: any) {
    this.workExperienceDetails.splice(index, 1);
    this.workExperienceDataSource = new MatTableDataSource(
      this.workExperienceDetails
    );
    this.saveWorkExperience();
  }
  saveWorkExperience() {
    let data = {
      empid: this.employeeCode,
      experience: this.workExperienceDetails,
    };
    this.emsService.saveEmployeeEmployementData(data).subscribe((res: any) => {
      if (res.status && res.data[0].statuscode == 0) {
        this.getEmployeeEmploymentList();
        if (this.isUpdate == false && this.isDelete ==false) {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: this.EM42,
          });
        } else if (this.isUpdate == true) {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: this.EM62
          });
        } else if (this.isDelete == true) {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: this.EM63,
          });
        }
        if (this.isSubmitAdd == false) {
          this.selectedtab.setValue(3);
        }
        this.isSubmitAdd = false;
        this.clearExperienceValidators();
        this.clearWorkExperience();
      } else {
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
          data: this.EM43,
        });
      }
    });
  }
  //** */
  saveEducation() {
    if (this.educationForm.valid) {
      this.spinner.show();
      let data = {
        empid: this.employeeCode,
        education: this.educationDetails,
      };

      this.emsService.saveEmployeeEducationData(data).subscribe((res: any) => {
        if (res.status && res.data[0].statuscode == 0) {
          this.getEmployeeEducationList();
          // -----
          if (this.isUpdate == false && this.isDelete ==false) {
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
              data: this.EM42,
            });
          } else if (this.isUpdate == true) {
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
              data: this.EM62
            });
          } else if (this.isDelete == true) {
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
              data: this.EM63,
            });
          }
          // ----

          this.spinner.hide();
          if (this.isSubmitAdd == false) {
            this.selectedtab.setValue(5);
          }
          this.isSubmitAdd = false;
          this.clearEducationValidators();
          this.clearEducation();
        } else {
          this.spinner.hide();
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: this.EM43,
          });
        }
      });
    } else {
      this.spinner.hide();
    }
  }
  educationSaveAdd() {
    this.isSubmitAdd = true;
    this.addEducation();
  }
  addEducation() {
    this.addEducationValidators();
    if(this.educationForm.valid){
      if (this.isEducationEdit) {
        this.isEducationEdit = false;
        this.educationDetails[this.educationIndex].course =
          this.educationForm.controls.course.value;
        this.educationDetails[this.educationIndex].institutename =
          this.educationForm.controls.instituteName.value;
        (this.educationDetails[this.educationIndex].fromdate =
          this.pipe.transform(
            this.educationForm.controls.eduFromDate.value,
            'yyyy-MM-dd'
          )),
          (this.educationDetails[this.educationIndex].todate =
            this.pipe.transform(
              this.educationForm.controls.eduToDate.value,
              'yyyy-MM-dd'
            )),
        this.saveEducation();
      } else {
        if (this.educationForm.valid) {
          this.educationDetails.push({
            course: this.educationForm.controls.course.value,
            institutename: this.educationForm.controls.instituteName.value,
            fromdate: this.pipe.transform(
              this.educationForm.controls.eduFromDate.value,
              'yyyy-MM-dd'
            ),
            todate: this.pipe.transform(
              this.educationForm.controls.eduToDate.value,
              'yyyy-MM-dd'
            ),
          });
          this.educationDataSource = new MatTableDataSource(
            this.educationDetails
          );
          this.clearEducationValidators();
          this.clearEducation();
          this.saveEducation();
        } else {
        }
      }

    }
    
  }
  editEduction(i: any) {
    this.educationIndex = i;
    this.isEducationEdit = true;
    this.isUpdate = true;
    this.educationForm.controls.course.setValue(
      this.educationDetails[i].course
    );
    this.educationForm.controls.instituteName.setValue(
      this.educationDetails[i].institutename
    );
    this.educationForm.controls.eduFromDate.setValue(
      this.educationDetails[i].fromdate
    );
    this.educationForm.controls.eduToDate.setValue(
      this.educationDetails[i].todate
    );
  }
  clearEducationValidators() {
    this.educationForm.get('course').clearValidators();
    this.educationForm.get('course').updateValueAndValidity();

    this.educationForm.get('instituteName').clearValidators();
    this.educationForm.get('instituteName').updateValueAndValidity();

    this.educationForm.get('eduFromDate').clearValidators();
    this.educationForm.get('eduFromDate').updateValueAndValidity();

    this.educationForm.get('eduToDate').clearValidators();
    this.educationForm.get('eduToDate').updateValueAndValidity();
  }

  addEducationValidators() {
    this.educationForm.get('course').setValidators(Validators.required);
    this.educationForm.get('course').updateValueAndValidity();

    this.educationForm.get('instituteName').setValidators(Validators.required);
    this.educationForm.get('instituteName').updateValueAndValidity();

    this.educationForm.get('eduFromDate').setValidators(Validators.required);
    this.educationForm.get('eduFromDate').updateValueAndValidity();

    this.educationForm.get('eduToDate').setValidators(Validators.required);
    this.educationForm.get('eduToDate').updateValueAndValidity();
  }
  clearEducation() {
    this.isEducationEdit = false;
    this.isUpdate = false;
    this.isDelete = false;
    this.educationForm.controls.course.reset();
    this.educationForm.controls.instituteName.reset();
    this.educationForm.controls.eduFromDate.reset();
    this.educationForm.controls.eduToDate.reset();
  }
  deleteEducationPopup(event: any) {
    let dialogRef = this.dialog.open(ComfirmationDialogComponent, {
      position: { top: `70px` },
      disableClose: true,
      data: { message: this.EM61, YES: 'YES', NO: 'NO' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'YES') {
        this.isDelete = true;
        this.deleteEducation(event);
      }
    });
  }
  deleteEducation(index: any) {
    this.educationDetails.splice(index, 1);
    this.educationDataSource = new MatTableDataSource(this.educationDetails);
    this.saveEducation();
  }

  open(
    errormessages: any,
    top: any,
    width: any,
    height: any,
    flag: any,
    url: any
  ) {
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      position: { top: `70px` },
      data: { Message: errormessages, flag: flag, url: url },
    });
    dialogRef.afterClosed().subscribe((result) => { });
  }

  alphabetKeyPress(event: any) {
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
    let data = {
      code: null,
      pagenumber: 1,
      pagesize: 1000,
    };
    this.emsService.getMessagesListApi(data).subscribe((res: any) => {
      if (res.status) {
        this.messagesDataList = res.data;
        this.messagesDataList.forEach((e: any) => {
          if (e.code == 'EM15') {
            this.EM15 = e.message;
          } else if (e.code == 'EM1') {
            this.EM1 = e.message;
          } else if (e.code == 'EM22') {
            this.EM22 = e.message;
          } else if (e.code == 'EM2') {
            this.EM2 = e.message;
          } else if (e.code == 'EM11') {
            this.EM11 = e.message;
          } else if (e.code == 'EM12') {
            this.EM12 = e.message;
          } else if (e.code == 'EM13') {
            this.EM13 = e.message;
          } else if (e.code == 'EM14') {
            this.EM14 = e.message;
          } else if (e.code == 'EM16') {
            this.EM16 = e.message;
          } else if (e.code == 'EM17') {
            this.EM17 = e.message;
          } else if (e.code == 'EM18') {
            this.EM18 = e.message;
          } else if (e.code == 'EM19') {
            this.EM19 = e.message;
          } else if (e.code == 'EM20') {
            this.EM20 = e.message;
          } else if (e.code == 'EM21') {
            this.EM21 = e.message;
          } else if (e.code == 'EM61') {
            this.EM61 = e.message;
          } else if (e.code == 'EM42') {
            this.EM42 = e.message;
          } else if (e.code == 'EM43') {
            this.EM43 = e.message;
          } else if (e.code == 'EM62') {
            this.EM62 = e.message;
          } else if (e.code == 'EM63') {
            this.EM63 = e.message;
          }
        });
      } else {
        this.messagesDataList = [];
      }
    });
  }
  getstatuslist() {
    this.companyService.getstatuslists().subscribe((result: any) => {
      if (result.status) {
        this.statusList = result.data;
      }
    });
  }
  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
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
  alphaNumberOnly(e: any) {
    // Accept only alpha numerics, not special characters
    var regex = new RegExp('^[a-zA-Z0-9 ]+$');
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
      return true;
    }

    e.preventDefault();
    return false;
  }

  getDocumentsEMS() {
    let input = {
      employeeId: this.empId,
      candidateId: null,
      moduleId: 1,
      filecategory: null,
      requestId: null,
      status: null,
    };
    this.mainService.getDocumentsFiles(input).subscribe((result: any) => {
      this.documentDetails = [];
      if (result && result.status) {
        // for(let k=0;k<result.data.length;k++){
        //   let documentName = result.data[k].filename.split('_')
        //   var docArray=[];
        //   var pdfName;
        //   for(let i=0;i<=documentName.length;i++){
        //     if(i>2){
        //       docArray.push(documentName[i])
        //     }
        //   }
        //   pdfName = docArray.join('')
        //   result.data[k].pdfName=pdfName
        // }
        this.documentDetails = result.data;
        this.documentDataSource = new MatTableDataSource(this.documentDetails);
      }
    });
    this.isedit = false;
  }

  editDock(data: any) {
    //this.createValidatorForDocument();
    this.isedit = true;
    this.editFileName = data.fname;
    this.editDockinfo = JSON.stringify(data);
    this.documentsForm.controls.documentId.setValue(data.id, {
      emitEvent: false,
    });
    this.documentsForm.controls.documentName.setValue(data.file_category, {
      emitEvent: false,
    });
    this.documentsForm.controls.documentNumber.setValue(data.document_number, {
      emitEvent: false,
    });
  }

  deleteDock(data: any) {
    let dialogRef = this.dialog.open(ComfirmationDialogComponent, {
      position: { top: `70px` },
      disableClose: true,
      data: { message: this.EM16, YES: 'YES', NO: 'NO' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'YES') {
        this.mainService.deleteFilesMaster(data.id).subscribe((res: any) => {
          if (res && res.status) {
            var info = JSON.stringify(data);
            this.mainService
              .removeDocumentOrImagesForEMS(info)
              .subscribe((result: any) => { });
            // this.mainService.removeDocumentOrImagesForEMS(data).subscribe(result => {})
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
              data: this.EM15,
            });
            this.getDocumentsEMS();
          } else {
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
              data: this.EM17,
            });
          }
        });
      }
    });
  }

  fileView(data: any) {
    console.log("fileview",data)
    let info = data;
    this.spinner.show();
    this.mainService.getDocumentOrImagesForEMS(info).subscribe((imageData) => {
      console.log("imageData",imageData)
      if (imageData.success) {
        this.spinner.hide();

        let TYPED_ARRAY = new Uint8Array(imageData.image.data);
        const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
          return data + String.fromCharCode(byte);
        }, '');
        let base64String = btoa(STRING_CHAR);
        var documentName = data.fname.split('.');

        if (documentName[documentName.length - 1] == 'pdf') {
          const file = new Blob([TYPED_ARRAY], { type: 'application/pdf' });
          this.fileURL = URL.createObjectURL(file);
          window.open(this.fileURL);
        } else {
          this.fileURL = new Blob([TYPED_ARRAY], { type: 'image/png' });
          let url = URL.createObjectURL(this.fileURL);
          window.open(url, '_blank');
        }
      }
    });
  }

  validateDocument() {
    this.createValidatorForDocument();
    if (this.documentsForm.valid) {
      if (this.documentsForm.controls.attachedFile.value || this.editDockinfo) {
        if (this.isFile) {
          var valid = true;
          var ReplaceDocument: any;
          if (this.documentDetails.length != 0 && !this.editDockinfo) {
            for (let i = 0; i < this.documentDetails.length; i++) {
              if (
                this.documentsForm.controls.documentName.value ==
                this.documentDetails[i].file_category
              ) {
                valid = false;
                ReplaceDocument = this.documentDetails[i];
                break;
              }
            }
          }
          if (!valid) {
            let dialogRef = this.dialog.open(ComfirmationDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
              data: {
                message: ReplaceDocument.description + ' ' + this.EM21,
                YES: 'YES',
                NO: 'NO',
              },
            });
            dialogRef.afterClosed().subscribe((result) => {
              if (result == 'YES') {
                this.documentsForm.controls.documentId.setValue(
                  ReplaceDocument.id,
                  { emitEvent: false }
                );
                this.editDockinfo = JSON.stringify(ReplaceDocument);
                this.saveDocument();
              }
            });
          } else {
            this.saveDocument();
          }
        } else {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: this.EM13,
          });
        }
      } else {
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
          data: this.EM18,
        });
      }
    }
  }

  saveDocument() {
    // if(this.documentsForm.controls.attachedFile.value || this.editDockinfo){
    // if(this.isFile){
    //   if(this.validateDocument()){
    this.mainService.getFilepathsMasterForEMS(1).subscribe((resultData) => {
      if (resultData && resultData.status) {
        let obj = {
          id: this.documentsForm.controls.documentId.value
            ? this.documentsForm.controls.documentId.value
            : null,
          employeeId: this.empId,
          candidateId: 0,
          filecategory: this.documentsForm.controls.documentName.value,
          moduleId: 1,
          documentnumber: this.documentsForm.controls.documentNumber.value,
          fileName: this.file ? this.file.name : this.editFileName,
          modulecode: resultData.data[0].module_code,
          requestId: null,
          status: 'Submitted',
        };
        this.mainService.setFilesMasterForEMS(obj).subscribe((data) => {
          if (data && data.status) {
            this.formData = new FormData();
            if (obj.fileName != this.editFileName) {
              let info = JSON.stringify(data.data[0]);
              let email = JSON.stringify(this.employeeEmailData);
              this.formData.append('info', info);
              this.formData.append('file', this.file, this.file.name);
              this.formData.append('email', email);
               this.mainService
                .setDocumentOrImageForEMS(this.formData)
                .subscribe((data) => {
                  this.formData.delete('file');
                  this.formData.delete('info');
                  // this.spinner.hide()
                  if (data && data.status) {
                    if (this.editDockinfo) {
                      this.mainService
                        .removeDocumentOrImagesForEMS(this.editDockinfo)
                        .subscribe((data) => { });
                    }
                    let dialogRef = this.dialog.open(ReusableDialogComponent, {
                      position: { top: `70px` },
                      disableClose: true,
                      data: this.EM11,
                    });
                    this.getDocumentsEMS();
                    this.clearDock();
                    this.selectedtab.setValue(0);
                  } else {
                    let dialogRef = this.dialog.open(ReusableDialogComponent, {
                      position: { top: `70px` },
                      disableClose: true,
                      data: this.EM12,
                    });
                    // this.open(result.isLeaveUpdated ? this.msgLM76 : this.msgLM79,'8%','500px','250px',false,"/LeaveManagement/UserDashboard")
                  }
                  this.file = null;

                  this.editDockinfo = null;
                  this.editFileName = null;
                });
            } else {
              this.getDocumentsEMS();
              this.clearDock();
              this.editDockinfo = null;
              this.editFileName = null;
              this.file = null;
              let dialogRef = this.dialog.open(ReusableDialogComponent, {
                position: { top: `70px` },
                disableClose: true,
                data: this.EM19,
              });
            }
          } else {
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
              data: this.EM17,
            });
          }
        });
      }
    });
  }

  onSelectFile(event: any) {
    if (event.target.files.length != 0) {
      if (event.target.files[0].size <= 2097152) {
        this.file = event.target.files[0];
        var pdf = this.file.name.split('.');
        if (
          pdf[pdf.length - 1] == 'pdf' ||
          pdf[pdf.length - 1] == 'jpg' ||
          pdf[pdf.length - 1] == 'png'
        ) {
          this.isFile = true;
        } else {
          this.isFile = false;
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: this.EM13,
          });
        }
      } else {
        this.isFile = false;
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
          data: this.EM14,
        });
      }
    } else {
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position: { top: `70px` },
        disableClose: true,
        data: this.EM18,
      });
      // th
    }
  }
  getFilecategoryMasterForEMS() {
    let input = {
      id: null,
      moduleId: 1,
    };
    this.mainService
      .getFilecategoryMasterForEMS(input)
      .subscribe((result: any) => {
        if (result && result.status) {
          this.documentTypeList = [];
          for (let i = 0; i < result.data.length; i++){
            if (result.data[i].category != "PROFILE") {
              this.documentTypeList.push(result.data[i])
            }
          }
        }
      });
  }

  clearDock() {
    // this.documentsForm.resetForm({resetType:ResetFormType.ControlsOnly})
    this.editFileName = '';
    this.isedit = false;
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
  delete() {
    this.isedit = false;
  }
  deleteIcon() {
    this.documentsForm.controls.attachedFile.setValue('');
  }
  createValidatorForDocument() {
    this.documentsForm.controls.documentNumber.setValidators([
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(14),
    ]);
    this.documentsForm.controls.documentName.setValidators([
      Validators.required,
    ]);
    this.documentsForm.get('documentNumber').updateValueAndValidity();
    this.documentsForm.get('documentName').updateValueAndValidity();
  }

  onSelectImage(event: any) {
    this.isRemoveImage = false;
    this.imageurls = [];
    this.file = null;
    this.file = event.target.files[0];
    this.fileImageToggler();
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.imageurls.push({ base64String: event.target.result });
        };
        reader.readAsDataURL(event.target.files[i]);
      }
      this.saveImage(true);
    }
  }

  fileImageToggler() {
    this.isFileImage = !this.isFileImage;
  }

  getEmployeeImage() {
    let input = {
      employeeId: this.empId,
      candidateId: null,
      moduleId: 1,
      filecategory: 'PROFILE',
      requestId: null,
      status: null,
    };
    this.mainService.getDocumentsForEMS(input).subscribe((result: any) => {
      if (result && result.status) {
        if (result.data.length > 0) {
          this.profileId = result.data[0].id;
          this.profileInfo = JSON.stringify(result.data[0]);
          this.mainService
            .getDocumentOrImagesForEMS(result.data[0])
            .subscribe((imageData) => {
              if (imageData.success) {
                let TYPED_ARRAY = new Uint8Array(imageData.image.data);
                const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
                  return data + String.fromCharCode(byte);
                }, '');

                let base64String = btoa(STRING_CHAR);
                this.imageurls[0].base64String =
                  'data:image/png;base64,' + base64String;
              } else {
                this.isRemoveImage = false;
                this.imageurls = [
                  {
                    base64String: 'assets/img/profile.jpg',
                  },
                ];
              }
            });
        }
      }
    });
  }

  saveImage(flag: boolean) {
    if (this.file) {
      if (this.file.size <= 1024000) {
        this.editProfile();
      } else {
      }
    } else {
    }
  }
  editProfile() {
    this.spinner.show();
    {
      this.LM.getFilepathsMaster(1).subscribe((result) => {
        if (result && result.status) {
          let data = {
            id: this.profileId ? this.profileId : null,
            employeeId: this.empId,
            candidateId: 0,
            filecategory: 'PROFILE',
            moduleId: 1,
            documentnumber: '',
            fileName: this.file.name,
            modulecode: result.data[0].module_code,
            requestId: null,
            status: 'Submitted',
          };
          this.mainService.setFilesMasterForEMS(data).subscribe((res) => {
            if (res && res.status) {
              let info = JSON.stringify(res.data[0]);
              this.formData.append('info', info);
              this.formData.append('file', this.file);
              this.LM.setProfileImage(this.formData).subscribe((res) => {
                this.formData.delete('file');
                this.formData.delete('info');
                this.spinner.hide();
                if (res && res.status) {
                  if (this.profileId) {
                    this.companyService
                      .removeImage(this.profileInfo)
                      .subscribe((res) => { });
                  }
                  let dialogRef = this.dialog.open(ReusableDialogComponent, {
                    position: { top: `70px` },
                    disableClose: true,
                    data: 'Image uploaded successfully',
                  });
                } else {
                  let dialogRef = this.dialog.open(ReusableDialogComponent, {
                    position: { top: `70px` },
                    disableClose: true,
                    data: 'Image uploading failed',
                  });
                }
                this.file = null;
                this.getEmployeeImage();
                this.isRemoveImage = true;
              });
            } else {
              this.spinner.hide();
              this.LM.deleteFilesMaster(result.data[0].id).subscribe(
                (data) => { }
              );
              this.getEmployeeImage();
              let dialogRef = this.dialog.open(ReusableDialogComponent, {
                position: { top: `70px` },
                disableClose: true,
                data: 'Image uploading failed',
              });
            }
          });
        } else {
          this.spinner.hide();
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: 'Image uploading failed',
          });
        }
      });
    }
  }
  getEmployeeEmailData() {
    this.employeeEmailData = [];
    this.emsService
      .getEmployeeEmailDataByEmpid(this.employeeId)
      .subscribe((res: any) => {
        this.employeeEmailData = JSON.parse(res.data[0].jsonvalu)[0];
      });
  }
}
