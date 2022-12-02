import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/modules/admin/admin.service';
import { ConfirmationComponent } from 'src/app/modules/leaves/dialog/confirmation/confirmation.component';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import { EmsService } from '../../ems.service';
import { MainService } from '../../../../services/main.service'
import { ComfirmationDialogComponent } from '../../../../pages/comfirmation-dialog/comfirmation-dialog.component'
import { NgxSpinnerService } from "ngx-spinner";
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { environment } from 'src/environments/environment';
import * as _moment from 'moment';
import { LeavesService } from 'src/app/modules/leaves/leaves.service';
import { DecryptPipe } from 'src/app/custom-directive/encrypt-decrypt.pipe';
// import {default as _rollupMoment} from 'moment';
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
  selector: 'app-employee-info',
  templateUrl: './employee-info.component.html',
  styleUrls: ['./employee-info.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class EmployeeInfoComponent implements OnInit {
  minEducationDate: any;
  minExperienceDate: any;


  constructor(private formBuilder: FormBuilder, private companyService: CompanySettingService,
    private dialog: MatDialog, private mainService: MainService, private router: Router, private activeroute: ActivatedRoute,
    private adminService: AdminService, private spinner: NgxSpinnerService,
    private LM: LeavesService,private activatedRoute: ActivatedRoute, private emsService: EmsService) {
    this.formData = new FormData();
  }
  personalInfoForm: any = FormGroup;
  candidateFamilyForm: any = FormGroup;
  employeeJobForm: any = FormGroup;
  promotionsForm: any = FormGroup;
  employementForm!: FormGroup;
  experienceForm: any = FormGroup;
  educationForm: any = FormGroup;
  documentsForm: any = FormGroup;
  documentTypeList: any;

  displayedColumns = ['position', 'name', 'relation', 'gender', 'contact', 'status', 'action'];
  familyTableColumns = ['position', 'name', 'relation', 'gender', 'contact', 'status', 'action'];
  documentTableColumns = ['position', 'category', 'number', 'name', 'action'];
  promotionsTableColumns = ['sno', 'salary', 'fromDate'];
  workTableColumns = ['sno', 'company', 'desig', 'fromDate', 'toDate', 'action'];
  educationTableColumns = ['sno', 'course', 'college', 'fromDate', 'toDate', 'action'];
  familyDataSource: MatTableDataSource<any> = <any>[];
  promotionsDataSource: MatTableDataSource<any> = <any>[];
  documentDataSource: MatTableDataSource<any> = <any>[];
  workExperienceDataSource: MatTableDataSource<any> = <any>[];
  educationDataSource: MatTableDataSource<any> = <any>[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isedit: boolean = false;
  minDate = new Date('1950/01/01');
  maxBirthDate = new Date();
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
  isEducationEdit: boolean = false;
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
  documentDetails: any = [];
  expFromDate: any;
  expToDate: any;
  maxDate : any;
  minetodate: any;

  edmaxDate = new Date();
  expmaxDate = new Date();
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
  promotionsGetList: any = [];
  promotionList: any = [];
  params: any;
  empId: any;
  editFileName: any;
  editDockinfo: any
  EM11: any
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
  EM1: any;
  EM2: any;
  EM61: any;
  EM42: any;
  EM43: any;

  fileURL: any;
  file: any;
  familyindex: any;
  educationIndex: any;
  experienceIndex: any;
  isExperienceEdit: boolean = false;
  mincontarctDate: any;
  isContractData: boolean = false;
  profileId:any=null;
  profileInfo:any=null;
  imageurls = [{
    base64String: "assets/img/profile.jpg"
  }];
  base64String: any;
  name: any;
  imagePath: any;
  isFileImage:boolean=false;
  progressInfos:any=[];
  selectedFiles:any;
  previews: any = [];
  isRemoveImage: boolean = true;
  isPromotionsOnly:boolean=true;
  companyDBName: any = environment.dbName;
  issubmit: boolean = false;
  submitsavepersonal: boolean = false;
  isNewEmployee: boolean = true;
  decryptPipe = new DecryptPipe();
  joinDateDisable: boolean = false;
  ngOnInit(): void {
    this.params = this.activatedRoute.snapshot.params;
    if (this.params) {

      this.empId =this.decryptPipe.transform(this.params.empId);
    }
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
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
    this.getnoticeperiods();

    /** through new hired list */
    if (this.activeroute.snapshot.params.candId != 0 && this.activeroute.snapshot.params.candId != null) {
      this.candidateId = this.decryptPipe.transform(this.activeroute.snapshot.params.candId)
      this.getLoginCandidateData();
    }
    /** through employee directory */
    if (this.activeroute.snapshot.params.empId != 0 && this.activeroute.snapshot.params.empId != null) {
      this.employeeId = this.decryptPipe.transform(this.activeroute.snapshot.params.empId)
      this.getEmployeeInformationList();
      this.getEmployeeJobList();
      this.getEmployeeEmploymentList();
      this.getEmployeeEducationList();
    }

    /**get state details for residance address */
    this.personalInfoForm.get('rcountry')?.valueChanges.subscribe((selectedResidenceStateValue: any) => {
      this.stateDetails = [];
      this.spinner.show();
      if (selectedResidenceStateValue != '' ) {
         this.companyService.getStatesc(selectedResidenceStateValue).subscribe((data) => {
           this.stateDetails = data[0];
            if (this.employeeCode != null || this.employeeCode !=undefined) {
              this.personalInfoForm.controls.rstate.setValue(this.employeeInformationData.state);
            } else {
             this.personalInfoForm.controls.rstate.setValue(this.loginData.state);
           }
         })
      }
      this.spinner.hide();
    })
    /**get city details for residance address */
    this.personalInfoForm.get('rstate')?.valueChanges.subscribe((selectedResidenceCityValue: any) => {
      this.spinner.show();
      this.cityDetails = [];
       if (selectedResidenceCityValue != '') {
        this.companyService.getCities(selectedResidenceCityValue).subscribe((data) => {
          this.cityDetails = data[0]
           if (this.employeeCode != null || this.employeeCode !=undefined) {
            this.personalInfoForm.controls.rcity.setValue(this.employeeInformationData.city);
          } else {
            this.personalInfoForm.controls.rcity.setValue(this.loginData.city);
          }
        })
      }
      this.spinner.hide();
    })

    /**get state details for present address*/
    this.personalInfoForm.get('pcountry')?.valueChanges.subscribe((selectedPresentStateValue: any) => {
      this.spinner.show();
      this.permanentStateDetails = [];
      if (selectedPresentStateValue != '') {
        this.companyService.getStatesc(selectedPresentStateValue).subscribe((data) => {
          this.permanentStateDetails = data[0]
          if (this.employeeCode != null || this.employeeCode !=undefined) {
            this.personalInfoForm.controls.pstate.setValue(this.employeeInformationData.pstate);
          } else {
            this.personalInfoForm.controls.pstate.setValue(this.loginData.pstate);
          }
        })
      }
      this.spinner.hide();
    })

    /**get city details for present address */
    this.personalInfoForm.get('pstate')?.valueChanges.subscribe((selectedPresentCityValue: any) => {
      this.spinner.show();
      this.permanentCityDetails = [];
      if (selectedPresentCityValue != '') {
        this.companyService.getCities(selectedPresentCityValue).subscribe((data) => {
          this.permanentCityDetails = data[0]
          if (this.employeeCode != null || this.employeeCode !=undefined) {
            this.personalInfoForm.controls.pcity.setValue(this.employeeInformationData.pcity);
          } else {
            this.personalInfoForm.controls.pcity.setValue(this.loginData.pcity);
          }
        })
      }
      this.spinner.hide();
    })
    /**same as present address checkbox */
    this.personalInfoForm.get('checked')?.valueChanges.subscribe((selectedValue: any) => {
      if (selectedValue != '') {

        this.personalInfoForm.get('pcountry')?.valueChanges.subscribe((selectedStateValue: any) => {
          this.spinner.show();
          this.permanentStateDetails = [];
          if(selectedStateValue != '') {
            this.companyService.getStatesc(selectedStateValue).subscribe((data) => {
              this.permanentStateDetails = data[0]
              if (this.personalInfoForm.controls.rstate.value != null) {
                this.personalInfoForm.controls.pstate.setValue(this.personalInfoForm.controls.rstate.value);
              }
            })
          }
          this.spinner.hide();
        })
        this.personalInfoForm.get('pstate')?.valueChanges.subscribe((selectedCityValue: any) => {
          this.spinner.show();
          this.permanentCityDetails = [];
          if(selectedCityValue != '') {
            this.companyService.getCities(selectedCityValue).subscribe((data) => {
              this.permanentCityDetails = data[0]
              if (this.personalInfoForm.controls.rcity.value != null) {
                this.personalInfoForm.controls.pcity.setValue(this.personalInfoForm.controls.rcity.value);
              }
            });
          }
          this.spinner.hide();
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
        this.spinner.hide();
      }
      else {
        this.personalInfoForm.controls.paddress.setValue('')
        this.personalInfoForm.controls.pcountry.setValue('')
        this.personalInfoForm.controls.pstate.setValue('')
        this.personalInfoForm.controls.pstate.setValue('')
        this.personalInfoForm.controls.pcity.setValue('')
        this.personalInfoForm.controls.ppincode.setValue('')
      }
    })

    this.employeeJobForm.get('contractStartDate')?.valueChanges.subscribe((selectedValue: any) => {
      this.mincontarctDate = selectedValue._d;
    })
    this.experienceForm.get('expFromDate')?.valueChanges.subscribe((selectedValue: any) => {
      this.minExperienceDate = selectedValue._d;
    })
    this.educationForm.get('eduFromDate')?.valueChanges.subscribe((selectedValue: any) => {
      this.minEducationDate = selectedValue._d;
    })
    /////////

    this.personalInfoForm.get('usertype')?.valueChanges.subscribe((selectedValue: number) => {
      if (selectedValue == 2 || selectedValue == 6) {
        this.isself = true;
      }
      else {
        this.isself = false;
      }
    })

    this.personalInfoForm.get('employmentType')?.valueChanges.subscribe((selectedValue: number) => {
      if (selectedValue == 3) {
        this.isContractData = true;
        this.isPromotionsOnly = false;
      }
      else {
        this.isContractData = false;
        this.isPromotionsOnly = true;
      }
    })

    this.personalInfoForm.get('department')?.valueChanges.subscribe((selectedValue: any) => {
      this.availablereportingmanagers = []
      let data = {
        id: selectedValue
      }
      this.companyService.getReportingManagers(data).subscribe(data => {
        this.availablereportingmanagers = data[0]
      })
    })
    this.getEmployeeImage();
   }

  getnoticeperiods() {
    this.emsService.getnoticeperiods().subscribe((res: any) => {
      if (res.status) {
        this.personalInfoForm.controls.noticePeriod.setValue(res.data[0].value)
      }
    });
  }
  //////////
  getLoginCandidateData() {
    this.spinner.show();

    this.loginData = [];
    this.emsService.getPreonboardCandidateData(this.candidateId).subscribe((res: any) => {
      this.loginData = JSON.parse(res.data[0].json)[0];
      this.isNewEmployee = false;
      if (this.loginData.id != null) {
        this.preOnboardId = this.loginData.id;
      }
      let a = this.loginData;
      if (a.rcountry == null) {
        this.personalInfoForm.controls.checked.setValue(false)
      }
      else if (a.rcountry == a.pcountry && a.rstate == a.pstate && a.rcity == a.pcity && a.raddress == a.paddress && a.rpincode == a.ppincode) {
        this.personalInfoForm.controls.checked.setValue(true)
      }
      this.loginCandidateId = this.loginData.candidateid;
      this.employeeNameh = this.loginData.firstname + ' ' + this.loginData.middlename + ' '+this.loginData.lastname;
      this.employeeCode = this.loginData.empid;
      this.availableDesignations.forEach((e: any) => {
        if (e.id == this.loginData.designation) {
          this.employeeDesignation = e.designation;
        }
      });
      this.employeeJoinDate = this.loginData.dateofjoin;
      this.employeeMobile = this.loginData.contact_number;
      this.designationId = this.loginData.designation;
      ////////////
      this.personalInfoForm.controls.firstname.setValue(this.loginData.firstname);
      this.personalInfoForm.controls.middlename.setValue(this.loginData.middlename);
      this.personalInfoForm.controls.lastname.setValue(this.loginData.lastname);
      if (this.loginData.dateofbirth != null)
        this.personalInfoForm.controls.dateofbirth.setValue(new Date(this.loginData.dateofbirth));
      this.personalInfoForm.controls.bloodgroup.setValue(this.loginData.bloodgroup);
      this.personalInfoForm.controls.designation.setValue(this.loginData.designation);
      this.personalInfoForm.controls.gender.setValue(this.loginData.gender);
      this.personalInfoForm.controls.maritalstatus.setValue(this.loginData.maritalstatus);

      this.loginData.aadharnumber != 'null' ? this.personalInfoForm.controls.aadharNumber.setValue(this.loginData.aadharnumber) : this.personalInfoForm.controls.aadharNumber.setValue(''),
      this.personalInfoForm.controls.raddress.setValue(this.loginData.address);
      this.personalInfoForm.controls.rcountry.setValue(this.loginData.country);
     // this.personalInfoForm.controls.rstate.setValue(this.loginData.state);
      //this.personalInfoForm.controls.rcity.setValue(this.loginData.city);
      this.personalInfoForm.controls.rpincode.setValue(this.loginData.pincode);
      this.personalInfoForm.controls.personalemail.setValue(this.loginData.personal_email);
      this.personalInfoForm.controls.spokenLanguages.setValue(this.loginData.languages_spoken=='null' || null?'':this.loginData.languages_spoken);
      this.personalInfoForm.controls.paddress.setValue(this.loginData.paddress=='null' || null?'':this.loginData.paddress);
      this.personalInfoForm.controls.pcountry.setValue(this.loginData.pcountry);
     // this.personalInfoForm.controls.pstate.setValue(this.loginData.pstate);
      //this.personalInfoForm.controls.pcity.setValue(this.loginData.pcity);
      if (this.loginData.ppincode != 'null')
      this.personalInfoForm.controls.ppincode.setValue(this.loginData.ppincode);
      this.personalInfoForm.controls.mobileNo.setValue(this.loginData.contact_number);
      if (this.loginData.emergencycontact_number != 'null')
        this.personalInfoForm.controls.alternateMobileNo.setValue(this.loginData.emergencycontact_number);
      this.personalInfoForm.controls.hireDate.setValue(new Date(this.loginData.hired_date));
      this.personalInfoForm.controls.joinDate.setValue(new Date(this.loginData.dateofjoin));

      if (this.loginData.relations != null) {
        let familydata = JSON.parse((this.loginData.relations))
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
              gender: gender != null || 'null' ? gender :null,
              gendername: gendername,
              contactnumber: familydata[i].contactnumber,
              status: familydata[i].status,
              relationship: relationship != null || 'null' ? relationship :null,
              relationshipname: relationshipname,
              dateofbirth: familydata[i].dateofbirth != "null" ? this.pipe.transform(familydata[i].dateofbirth, 'yyyy-MM-dd') : '',
            });
          }
          this.familyDataSource = new MatTableDataSource(this.familyDetails);
        }
      }
      ///////
      if (this.loginData.experience != null) {
        let workExperiencedata = JSON.parse((this.loginData.experience))
        for (let i = 0; i < workExperiencedata.length; i++) {
          this.workExperienceDetails.push({
            companyname: workExperiencedata[i].companyname,
            designation: workExperiencedata[i].designation,
            skills: workExperiencedata[i].skills,
            fromdate: workExperiencedata[i].fromdate != "null" ? this.pipe.transform(workExperiencedata[i].fromdate, 'yyyy-MM-dd') : '',
            todate: workExperiencedata[i].todate != "null" ? this.pipe.transform(workExperiencedata[i].todate, 'yyyy-MM-dd') : '',
          });
        }
        this.workExperienceDataSource = new MatTableDataSource(this.workExperienceDetails);
      }
      ////////
      if (this.loginData.education != null) {
        let educationdata = JSON.parse((this.loginData.education))
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
    this.spinner.hide();
  }

  /** through employee directory login data  */
  getEmployeeInformationList() {
    this.spinner.show();
    this.employeeInformationData = [];
    this.familyDetails = [];
    this.emsService.getEmployeeInformationData(this.employeeId).subscribe((res: any) => {
      this.employeeInformationData = JSON.parse(res.data[0].json)[0];
      this.isNewEmployee = false;
      this.joinDateDisable = true;
      if (this.employeeInformationData.id != null) {
        this.preOnboardId = this.employeeInformationData.id;
      }
      let a = this.employeeInformationData;
      if (a.country == a.pcountry && a.state == a.pstate && a.city == a.pcity && a.address == a.paddress && a.pincode == a.ppincode) {
        this.personalInfoForm.controls.checked.setValue(true)
      }
      this.employeeNameh = this.employeeInformationData.firstname + ' ' + this.employeeInformationData.middlename  + ' ' + this.employeeInformationData.lastname;
      this.employeeCode = this.employeeInformationData.empid;
      this.availableDesignations.forEach((e: any) => {
        if (e.id == this.employeeInformationData.designation) {
          this.employeeDesignation = e.designation;
        }
      });
      this.employeeJoinDate = this.employeeInformationData.dateofjoin;
      this.employeeMobile = this.employeeInformationData.contactnumber;
      this.designationId = this.employeeInformationData.designation;
      if (this.employeeInformationData.employmenttype == 3) {
        this.isContractData = true;
        this.isPromotionsOnly = false;
      }


      this.personalInfoForm.controls.firstname.setValue(this.employeeInformationData.firstname);
      this.personalInfoForm.controls.middlename.setValue(this.employeeInformationData.middlename);
      this.personalInfoForm.controls.lastname.setValue(this.employeeInformationData.lastname);
      this.personalInfoForm.controls.dateofbirth.setValue(new Date(this.employeeInformationData.dateofbirth));
      this.personalInfoForm.controls.bloodgroup.setValue(this.employeeInformationData.bloodgroup);
      this.personalInfoForm.controls.gender.setValue(this.employeeInformationData.gender);
      this.personalInfoForm.controls.maritalstatus.setValue(this.employeeInformationData.maritalstatus);
      this.employeeInformationData.aadharnumber != 'null' ? this.personalInfoForm.controls.aadharNumber.setValue(this.employeeInformationData.aadharnumber) : this.personalInfoForm.controls.aadharNumber.setValue(''),
        this.personalInfoForm.controls.raddress.setValue(this.employeeInformationData.address);
      this.personalInfoForm.controls.rcountry.setValue(this.employeeInformationData.country);
     // this.personalInfoForm.controls.rstate.setValue(this.employeeInformationData.state);
     // this.personalInfoForm.controls.rcity.setValue(this.employeeInformationData.city);
      this.personalInfoForm.controls.rpincode.setValue(this.employeeInformationData.pincode);

      this.personalInfoForm.controls.personalemail.setValue(this.employeeInformationData.personalemail);
      if (this.employeeInformationData.languages_spoken != 'null' || this.employeeInformationData.languages_spoken != "null")
        this.personalInfoForm.controls.spokenLanguages.setValue(this.employeeInformationData.languages_spoken);
       this.personalInfoForm.controls.paddress.setValue(this.employeeInformationData.paddress == 'null' || null ? '' : this.employeeInformationData.paddress);
    this.personalInfoForm.controls.pcountry.setValue(this.employeeInformationData.pcountry);
      this.personalInfoForm.controls.pstate.setValue(this.employeeInformationData.pstate);
      this.personalInfoForm.controls.pcity.setValue(this.employeeInformationData.pcity);
      if (this.employeeInformationData.ppincode != 'null')
      this.personalInfoForm.controls.ppincode.setValue(this.employeeInformationData.ppincode);
      this.personalInfoForm.controls.mobileNo.setValue(this.employeeInformationData.contactnumber);
      this.employeeInformationData.emergencycontactnumber != 'null' ? this.personalInfoForm.controls.alternateMobileNo.setValue(this.employeeInformationData.emergencycontactnumber) : this.personalInfoForm.controls.alternateMobileNo.setValue(''),
        this.personalInfoForm.controls.hireDate.setValue(new Date(this.employeeInformationData.hired_date));
      this.personalInfoForm.controls.joinDate.setValue(new Date(this.employeeInformationData.dateofjoin));
      // /**work information */
      this.personalInfoForm.controls.empid.setValue(this.employeeInformationData.empid);
      this.personalInfoForm.controls.officeemail.setValue(this.employeeInformationData.officeemail);
      this.personalInfoForm.controls.empStatus.setValue(this.employeeInformationData.status);
      this.personalInfoForm.controls.employmentType.setValue(this.employeeInformationData.employmenttype);
      this.personalInfoForm.controls.usertype.setValue(this.employeeInformationData.usertype);
      this.personalInfoForm.controls.companylocation.setValue(this.employeeInformationData.worklocation);
      this.personalInfoForm.controls.designation.setValue(this.employeeInformationData.designation);
      this.personalInfoForm.controls.department.setValue(this.employeeInformationData.department);
      if (this.employeeInformationData.reportingmanager == 77) {
        this.personalInfoForm.controls.reportingmanager.setValue("Self")
      } else {
        this.personalInfoForm.controls.reportingmanager.setValue(this.employeeInformationData.reportingmanager);
      }
      //this.personalInfoForm.controls.noticePeriod.setValue(this.employeeInformationData.noticeperiod);

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
    this.spinner.hide();
  }

  /** through employee directory login data  */
  getEmployeeJobList() {
    this.employeeJobData = [];
    this.promotionsGetList = [];
    this.emsService.getEmployeeJobData(this.employeeId).subscribe((res: any) => {
      this.employeeJobData = JSON.parse(res.data[0].json)[0];
      if (this.employeeJobData.contractname != 'null')
        this.employeeJobForm.controls.contractName.setValue(this.employeeJobData.contractname);
      this.employeeJobForm.controls.contractFile.setValue(this.employeeJobData.fileid);
      if (this.employeeJobData.notes != 'null')
        this.employeeJobForm.controls.contractNotes.setValue(this.employeeJobData.notes);
      if (this.employeeJobData.startdate != null)
        this.employeeJobForm.controls.contractStartDate.setValue(new Date(this.employeeJobData.startdate));
      if (this.employeeJobData.enddate != null)
        this.employeeJobForm.controls.contractEndDate.setValue(new Date(this.employeeJobData.enddate));

      if (this.employeeJobData.promotions != null) {
        let promotionsdata = JSON.parse((this.employeeJobData.promotions))
        if (promotionsdata != null) {
          for (let i = 0; i < promotionsdata.length; i++) {
            this.promotionsGetList.push({
              newsalary: promotionsdata[i].salary,
              newdescription: promotionsdata[i].description,
              effectivedate: promotionsdata[i].effectivedate != "null" ? this.pipe.transform(promotionsdata[i].effectivedate, 'yyyy-MM-dd') : '',
              annualsalary: promotionsdata[i].annualsalary,
            });
          }
          this.promotionsDataSource = new MatTableDataSource(this.promotionsGetList);
        }
      }
    })
  }
  /** through employee directory login data  */
  getEmployeeEmploymentList() {
    this.employeeEmployementData = [];
    this.workExperienceDetails = [];
    this.emsService.getEmployeeEmployement(this.employeeId).subscribe((res: any) => {
      this.employeeEmployementData = JSON.parse(res.data[0].json)[0];
      if (this.employeeEmployementData.bankname != 'null')
        this.employementForm.controls.bankName.setValue(this.employeeEmployementData.bankname);
        if (this.employeeEmployementData.nameasperbankaccount != 'null')
      this.employementForm.controls.bankAccountName.setValue(this.employeeEmployementData.nameasperbankaccount);
      if (this.employeeEmployementData.bankaccountnumber != 'null')
      this.employementForm.controls.bankAccountNumber.setValue(this.employeeEmployementData.bankaccountnumber);
      if (this.employeeEmployementData.ifsccode != 'null')
        this.employementForm.controls.ifscCode.setValue(this.employeeEmployementData.ifsccode);
        if (this.employeeEmployementData.branchname != 'null')
        this.employementForm.controls.branchName.setValue(this.employeeEmployementData.branchname);
        if (this.employeeEmployementData.uanumber != 'null')
        this.employementForm.controls.uanNumber.setValue(this.employeeEmployementData.uanumber);
        if (this.employeeEmployementData.pan != 'null')
      this.employementForm.controls.panNumber.setValue(this.employeeEmployementData.pan);

      if (this.employeeEmployementData.experience != null) {
        let employementdata = JSON.parse((this.employeeEmployementData.experience))
        if (employementdata != null) {
          for (let i = 0; i < employementdata.length; i++) {
            this.workExperienceDetails.push({
              companyname: employementdata[i].companyname,
              designation: employementdata[i].designation,
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
    this.educationDetails = [];
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
    this.companyService.getCountry('countrymaster', null, 1, 10, this.companyDBName).subscribe(result => {
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
        aadharNumber: ["", [Validators.minLength(12), Validators.maxLength(12)]],
        panNumber: [""],
        uanNumber: ["", Validators.maxLength(12)],
        /// address controls
        raddress: ["",],
        rcountry: ["",],
        rstate: ["",],
        rcity: ["",],
        rpincode: ["", [Validators.minLength(6), Validators.maxLength(6)]],
        personalemail: ["", [Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        spokenLanguages: [""],
        checked: [false],
        paddress: ["",],
        pcountry: ["",],
        pstate: ["",],
        pcity: ["",],
        ppincode: ["", [Validators.minLength(6), Validators.maxLength(6)]],
        mobileNo: ["",[Validators.minLength(10), Validators.maxLength(10),Validators.pattern('^(91)?[4-9][0-9]{9}')]],
        alternateMobileNo: ["",[Validators.minLength(10), Validators.maxLength(10),Validators.pattern('^(91)?[4-9][0-9]{9}')]],
        officeemail: ["", [Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')]],
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
        joinDate: [""],

      })
  }
  createFamilyForm() {
    this.candidateFamilyForm = this.formBuilder.group(
      {
        familyfirstname: ["",],
        familycontact: ["",[Validators.minLength(10), Validators.maxLength(10),Validators.pattern('^(91)?[4-9][0-9]{9}')]],
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
        documentName: ["", Validators.required],
        documentNumber: ["", Validators.required],
        attachedFile: [""],

      });
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
  getEmploymentTypeMaster() {
    this.companyService.getMastertable('employmenttypemaster', null, 1, 1000, this.companyDBName).subscribe(data => {
      this.EmploymentTypeDetails = data.data;
    })
  }
  getDesignationsMaster() {
    this.companyService.getMastertable('designationsmaster', 1, 1, 1000, this.companyDBName).subscribe(data => {
      if (data.status) {
        this.availableDesignations = data.data;
      }
    })
  }
  getDepartmentsMaster() {
    this.companyService.getMastertable('departmentsmaster', 1, 1, 1000, this.companyDBName).subscribe(data => {
      if (data.status) {
        this.availableDepartments = data.data;
      }
    })
  }
  getWorkLocation() {
    this.companyService.getactiveWorkLocation({ id: null, companyName: this.companyDBName }).subscribe((result) => {
      this.worklocationDetails = result.data;
    })

  }
  getRoles() {
    this.companyService.getMastertable('rolesmaster', null, 1, 1000, this.companyDBName).subscribe(data => {
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
  // get personalForm(): { [key: string]: AbstractControl } {
  //   return this.personalInfoForm.controls;
  // }
  savePersonalInfo() {
    this.submitsavepersonal = true;
   // this.addPersonalInfoValidators();
    let hiredDate;
    let joinDate;
    if (this.personalInfoForm.controls.hireDate.value == undefined ||
      this.personalInfoForm.controls.hireDate.value == "")
    {
        hiredDate = this.pipe.transform(new Date, 'yyyy-MM-dd hh:mm:ss')
    } else {
      hiredDate = this.pipe.transform(this.personalInfoForm.controls.hireDate.value, 'yyyy-MM-dd hh:mm:ss')
    }

    if (this.personalInfoForm.controls.joinDate.value == undefined ||
      this.personalInfoForm.controls.joinDate.value == "")
    {
      joinDate = this.pipe.transform(new Date, 'yyyy-MM-dd hh:mm:ss')
    } else {
      joinDate = this.pipe.transform(this.personalInfoForm.controls.joinDate.value, 'yyyy-MM-dd hh:mm:ss')
    }

    if (this.personalInfoForm.valid) {
      this.spinner.show();
      let data = {
        condidateid: this.loginCandidateId !=undefined || this.loginCandidateId !=null ? this.loginCandidateId :null,
        empid: this.employeeCode != undefined || this.employeeCode != null ? this.employeeCode : null,
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
        hiredon: hiredDate ,
        dateofjoin: this.pipe.transform(this.personalInfoForm.controls.joinDate.value, 'yyyy-MM-dd hh:mm:ss'),
        noticeperiod: this.personalInfoForm.controls.noticePeriod.value,
        designation: parseInt(this.personalInfoForm.controls.designation.value),
        emergencycontactnumber: this.personalInfoForm.controls.alternateMobileNo.value,
        emergencycontactrelation: null,
        emergencycontactname: null,
        relations: this.familyDetails,
        education: this.educationDetails.length > 0 ? this.educationDetails : null,
        experience: this.workExperienceDetails.length > 0 ? this.workExperienceDetails : null,
        status: 1,
        actionby: parseInt(this.userSession.id),
        ///////
        officeemail: this.personalInfoForm.controls.officeemail.value,
        usertype: this.personalInfoForm.controls.usertype.value,
        department: this.personalInfoForm.controls.department.value,
        employmenttype: this.personalInfoForm.controls.employmentType.value,
        companylocation: this.personalInfoForm.controls.companylocation.value,
        reportingmanager: this.personalInfoForm.controls.reportingmanager.value,
      }
      this.emsService.saveEmployeeInformationData(data).subscribe((res: any) => {
        if (res.status) {
          if (res.data.email == null) {
            this.employeeId = res.data.empid;
            this.getEmployeeInformationList();
            this.getEmployeeJobList();
            this.getEmployeeEmploymentList();
            this.getEmployeeEducationList();
            this.getEmployeeImage();
            this.spinner.hide();
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
              data: this.EM42
            });
            this.isNewEmployee !=true ? this.selectedtab.setValue(1): this.selectedtab.setValue(0);
            //this.selectedtab.setValue(1);
          } else {
            this.spinner.hide();
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: res.data.email
          });
          }
        } else {
          this.spinner.hide();
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: this.EM43
          });
        }
      });
    }
  }

  addingFamilyView() {
    this.addFamilyView = true

  }
  addfamily() {
    this.addValidators();
    if (this.isfamilyedit) {
      this.isfamilyedit = false;
      this.familyDetails[this.familyindex].firstname = this.candidateFamilyForm.controls.familyfirstname.value;
      //this.familyDetails[this.familyindex].lastname = this.candidateFamilyForm.controls.familylastname.value;
      this.familyDetails[this.familyindex].gender = this.candidateFamilyForm.controls.familygender.value.id;
      this.familyDetails[this.familyindex].gendername = this.candidateFamilyForm.controls.familygender.value.gender;
      this.familyDetails[this.familyindex].contactnumber = this.candidateFamilyForm.controls.familycontact.value;
      this.familyDetails[this.familyindex].status = this.candidateFamilyForm.controls.familystatus.value;
      this.familyDetails[this.familyindex].relationship = this.candidateFamilyForm.controls.relation.value.id;
      this.familyDetails[this.familyindex].relationshipname = this.candidateFamilyForm.controls.relation.value.relationship;
      //this.familyDetails[this.familyindex].dateofbirth = this.candidateFamilyForm.controls.familydateofbirth.value != "" ? this.pipe.transform(this.candidateFamilyForm.controls.familydateofbirth.value, 'yyyy-MM-dd') : ''
      this.clearValidators();
      this.clearfamily();
    } else {
      if (this.candidateFamilyForm.valid) {
        this.familyDetails.push({
          firstname: this.candidateFamilyForm.controls.familyfirstname.value,
          lastname: null,
          gender: this.candidateFamilyForm.controls.familygender.value.id,
          gendername: this.candidateFamilyForm.controls.familygender.value.gender,
          contactnumber: this.candidateFamilyForm.controls.familycontact.value,
          status: this.candidateFamilyForm.controls.familystatus.value,
          relationship: this.candidateFamilyForm.controls.relation.value.id,
          relationshipname: this.candidateFamilyForm.controls.relation.value.relationship,
          dateofbirth: null
        });
        this.familyDataSource = new MatTableDataSource(this.familyDetails);
        this.clearValidators();
        this.clearfamily();

      }
    }
  }
  clearValidators() {
    this.candidateFamilyForm.get("familyfirstname").clearValidators();
    this.candidateFamilyForm.get("familyfirstname").updateValueAndValidity();

    this.candidateFamilyForm.get("relation").clearValidators();
    this.candidateFamilyForm.get("relation").updateValueAndValidity();

    this.candidateFamilyForm.get("familycontact").clearValidators();
    this.candidateFamilyForm.get("familycontact").updateValueAndValidity();

    this.candidateFamilyForm.get("familygender").clearValidators();
    this.candidateFamilyForm.get("familygender").updateValueAndValidity();
  }

  addValidators() {
    this.candidateFamilyForm.get("familyfirstname").setValidators(Validators.required);
    this.candidateFamilyForm.get("familyfirstname").updateValueAndValidity();

    this.candidateFamilyForm.get("relation").setValidators(Validators.required);
    this.candidateFamilyForm.get("relation").updateValueAndValidity();

    this.candidateFamilyForm.get("familygender").setValidators(Validators.required);
    this.candidateFamilyForm.get("familygender").updateValueAndValidity();
  }
  clearfamily() {
    this.candidateFamilyForm.controls.familyfirstname.setValue('');
    this.candidateFamilyForm.controls.relation.setValue('');
    this.candidateFamilyForm.controls.familycontact.setValue('');
    this.candidateFamilyForm.controls.familygender.setValue('');
    this.isfamilyedit = false;
    //this.candidateFamilyForm.valid = true;
  }

  editfamily(i: any) {
    this.familyindex = i;
    this.isfamilyedit = true;
    this.addFamilyView = true
    this.candidateFamilyForm.controls.familyfirstname.setValue(this.familyDetails[i].firstname);
    //this.candidateFamilyForm.controls.familylastname.setValue(this.familyDetails[i].lastname);
    //this.candidateFamilyForm.controls.familydateofbirth.setValue(new Date(this.familyDetails[i].dateofbirth));
    this.candidateFamilyForm.controls.familystatus.setValue(this.familyDetails[i].status);
    if (this.familyDetails[i].contactnumber != 'null')
      this.candidateFamilyForm.controls.familycontact.setValue(this.familyDetails[i].contactnumber);
    this.employeeRelationship.forEach((e: any) => {
      if (e.id == this.familyDetails[i].relationship) {
        this.candidateFamilyForm.controls.relation.setValue(e);
      }
    })
    this.genderDetails.forEach((e: any) => {
      if (e.id == this.familyDetails[i].gender) {
        this.candidateFamilyForm.controls.familygender.setValue(e);
      }
    })

  }
  deleteFamilyPopup(event: any) {
    let dialogRef = this.dialog.open(ComfirmationDialogComponent, {
      position: { top: `70px` },
      disableClose: true,
      data: { message: this.EM61, YES: 'YES', NO: 'NO' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'YES') {
        this.deletefamily(event)
      }
    });
  }
  deletefamily(index: any) {
    this.familyDetails.splice(index, 1);
    this.familyDataSource = new MatTableDataSource(this.familyDetails);
    this.isfamilyedit = false;
  }
//////////////
  clearContract() {
    this.clearContractValidators();
  this.employeeJobForm.controls.contractName.reset();
  this.employeeJobForm.controls.contractStartDate.reset();
  this.employeeJobForm.controls.contractEndDate.reset();
    this.employeeJobForm.controls.contractNotes.reset();
 this.clearPromotions();

  }
  clearContractValidators() {
    this.employeeJobForm.get("contractName").clearValidators();
    this.employeeJobForm.get("contractName").updateValueAndValidity();

    this.employeeJobForm.get("contractStartDate").clearValidators();
    this.employeeJobForm.get("contractStartDate").updateValueAndValidity();

    this.employeeJobForm.get("contractEndDate").clearValidators();
    this.employeeJobForm.get("contractEndDate").updateValueAndValidity();

    this.employeeJobForm.get("contractNotes").clearValidators();
    this.employeeJobForm.get("contractNotes").updateValueAndValidity();
  }
  addPromotions() {
    if (this.promotionsForm.valid) {
      this.promotionsGetList.push({
        newsalary: this.promotionsForm.controls.newSalary.value,
        newdescription: this.promotionsForm.controls.newDescription.value,
        effectivedate: this.pipe.transform(this.promotionsForm.controls.effectiveDate.value, 'yyyy-MM-dd'),
        annualsalary: this.promotionsForm.controls.annualSalary.value,
      });
      this.promotionsDataSource = new MatTableDataSource(this.promotionsGetList);
      this.clearPromotions();
    } else { }
  }
  clearPromotions() {
    this.clearPromotionValidators();
    this.promotionsForm.controls.newSalary.reset();
    this.promotionsForm.controls.newDescription.reset();
    this.promotionsForm.controls.effectiveDate.reset();
    this.promotionsForm.controls.annualSalary.reset();

  }
  addPromotionValidators() {
    this.promotionsForm.get("newSalary").setValidators(Validators.required);
    this.promotionsForm.get("newSalary").updateValueAndValidity();

    this.promotionsForm.get("newDescription").setValidators(Validators.required);
    this.promotionsForm.get("newDescription").updateValueAndValidity();

    this.promotionsForm.get("effectiveDate").setValidators(Validators.required);
    this.promotionsForm.get("effectiveDate").updateValueAndValidity();

    this.promotionsForm.get("annualSalary").setValidators(Validators.required);
    this.promotionsForm.get("annualSalary").updateValueAndValidity();

  }
  clearPromotionValidators() {
    this.promotionsForm.get("newSalary").clearValidators();
    this.promotionsForm.get("newSalary").updateValueAndValidity();

    this.promotionsForm.get("newDescription").clearValidators();
    this.promotionsForm.get("newDescription").updateValueAndValidity();

    this.promotionsForm.get("effectiveDate").clearValidators();
    this.promotionsForm.get("effectiveDate").updateValueAndValidity();

    this.promotionsForm.get("annualSalary").clearValidators();
    this.promotionsForm.get("annualSalary").updateValueAndValidity();
  }
  deletePromotions(index: any) {
    this.promotionsGetList.splice(index, 1);
    this.promotionsDataSource = new MatTableDataSource(this.promotionsGetList);
  }
  //** */
  saveJobDetails() {
    this.issubmit= true;
    if (this.employeeCode != undefined || this.employeeCode != null) {
      if (this.isPromotionsOnly == true) {
        let isValid = false;
        this.addPromotionValidators();
         if (this.promotionsForm.valid) {
          this.promotionList.push({
            newsalary: this.promotionsForm.controls.newSalary.value,
            newdescription: this.promotionsForm.controls.newDescription.value,
            effectivedate: this.pipe.transform(this.promotionsForm.controls.effectiveDate.value, 'yyyy-MM-dd'),
            annualsalary: this.promotionsForm.controls.annualSalary.value,
          });
          this.addPromotionValidators();
           this.clearPromotions();
           isValid = true;

         }
        if ( isValid == true) {
          this.spinner.show();
          let data = {
            empid: this.employeeCode,
            contractname: this.employeeJobForm.controls.contractName.value,
            notes: this.employeeJobForm.controls.contractNotes.value,
            //fileid: this.employeeJobForm.controls.contractFile.value,
            fileid: null,
            startdate: this.pipe.transform(this.employeeJobForm.controls.contractStartDate.value, 'yyyy-MM-dd'),
            enddate: this.pipe.transform(this.employeeJobForm.controls.contractEndDate.value, 'yyyy-MM-dd'),
            promotions: this.promotionList,
          }
          this.emsService.saveEmployeeJobDetailsData(data).subscribe((res: any) => {
            if (res.status && res.data[0].statuscode == 0) {
              this.spinner.hide();
              this.promotionList = [];
              this.getEmployeeJobList();
              let dialogRef = this.dialog.open(ReusableDialogComponent, {
                position: { top: `70px` },
                disableClose: true,
                data: this.EM42

              });
              this.selectedtab.setValue(2);
              this.issubmit= false;
            } else {
              this.spinner.hide();
              let dialogRef = this.dialog.open(ReusableDialogComponent, {
                position: { top: `70px` },
                disableClose: true,
                data: this.EM43
              });
            }
          });
        }

      }else {
         let isValid = false;
        if (this.employeeJobForm.valid) {

          this.promotionList = [];
          if (this.promotionsForm.controls.newSalary.value != "" &&
            this.promotionsForm.controls.newDescription.value != "" &&
            this.promotionsForm.controls.effectiveDate.value != "" &&
            this.promotionsForm.controls.annualSalary.value != ""
            ) {
            this.promotionList.push({
                newsalary: this.promotionsForm.controls.newSalary.value,
                newdescription: this.promotionsForm.controls.newDescription.value,
                effectivedate: this.pipe.transform(this.promotionsForm.controls.effectiveDate.value, 'yyyy-MM-dd'),
                annualsalary: this.promotionsForm.controls.annualSalary.value,
            });
            }

        isValid = true;
        }
        if (isValid == true) {
          this.spinner.show();
          let data = {
            empid: this.employeeCode,
            contractname: this.employeeJobForm.controls.contractName.value,
            notes: this.employeeJobForm.controls.contractNotes.value,
            //fileid: this.employeeJobForm.controls.contractFile.value,
            fileid: null,
            startdate: this.pipe.transform(this.employeeJobForm.controls.contractStartDate.value, 'yyyy-MM-dd'),
            enddate: this.pipe.transform(this.employeeJobForm.controls.contractEndDate.value, 'yyyy-MM-dd'),
            promotions: this.promotionList,
          }
          this.emsService.saveEmployeeJobDetailsData(data).subscribe((res: any) => {
            if (res.status && res.data[0].statuscode == 0) {
              this.spinner.hide();
              this.promotionList = [];
              this.clearContract();
              this.getEmployeeJobList();
              let dialogRef = this.dialog.open(ReusableDialogComponent, {
                position: { top: `70px` },
                disableClose: true,
                data: this.EM42
              });
              this.selectedtab.setValue(2);
            } else {
              this.spinner.hide();
              let dialogRef = this.dialog.open(ReusableDialogComponent, {
                position: { top: `70px` },
                disableClose: true,
                data: this.EM43
              });
            }
          });
        }  }
    } else {
      this.spinner.hide();
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position: { top: `70px` },
        disableClose: true,
        data: "Please complete personal details first"
      });
    }


  }

  //** */
  addWorkExperience() {
    this.addExperienceValidators();
    if (this.isExperienceEdit) {
      this.isExperienceEdit = false;
      this.workExperienceDetails[this.experienceIndex].companyname = this.experienceForm.controls.companyName.value;
      this.workExperienceDetails[this.experienceIndex].designation = this.experienceForm.controls.designation.value;
      this.workExperienceDetails[this.experienceIndex].skills = this.experienceForm.controls.jobDescription.value;
      this.workExperienceDetails[this.experienceIndex].fromdate = this.pipe.transform(this.experienceForm.controls.expFromDate.value, 'yyyy-MM-dd'),
        this.workExperienceDetails[this.experienceIndex].todate = this.pipe.transform(this.experienceForm.controls.expToDate.value, 'yyyy-MM-dd'),
        this.clearExperienceValidators();
      this.clearWorkExperience();
      this.saveWorkExperience();
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
        this.saveWorkExperience();
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
    //this.experienceForm.valid = true;
  }
  deleteExperiencePopup(event: any) {
    let dialogRef = this.dialog.open(ComfirmationDialogComponent, {
      position: { top: `70px` },
      disableClose: true,
      data: { message: this.EM61, YES: 'YES', NO: 'NO' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'YES') {
        this.deleteExperience(event)
      }
    });
  }
  deleteExperience(index: any) {
    this.workExperienceDetails.splice(index, 1);
    this.workExperienceDataSource = new MatTableDataSource(this.workExperienceDetails);
  }
  saveWorkExperience() {

    if (this.employeeCode != undefined || this.employeeCode != null) {
      if (this.workExperienceDetails.length > 0) {
        this.spinner.show();
        let data = {
          empid: this.employeeCode,
          experience: this.workExperienceDetails,
        }

        this.emsService.saveEmployeeEmployementData(data).subscribe((res: any) => {
          if (res.status && res.data[0].statuscode == 0) {
            this.spinner.hide();
            this.getEmployeeEmploymentList();
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
              data: this.EM42
            });
            this.selectedtab.setValue(3);
          } else {
            this.spinner.hide();
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
              data: this.EM43
            });
          }
        });
     }

    } else {
      this.spinner.hide();
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position: { top: `70px` },
        disableClose: true,
        data: "Please complete personal details first"
      });
    }

  }
  saveBankDetails() {

    if (this.employeeCode != undefined || this.employeeCode != null) {
    if(this.employementForm.valid){
      this.spinner.show();
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
      }

      this.emsService.saveEmployeeEmployementData(data).subscribe((res: any) => {
        if (res.status && res.data[0].statuscode == 0) {
          this.spinner.hide();
          this.getEmployeeEmploymentList();
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: this.EM42
          });
          this.selectedtab.setValue(4);
        } else {
          this.spinner.hide();
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: this.EM43
          });
        }
      });
    }

    } else {
      this.spinner.hide();
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position: { top: `70px` },
        disableClose: true,
        data: "Please complete personal details first"
      });
    }

  }

  //** */
  saveEducation() {

    if (this.employeeCode != undefined || this.employeeCode != null) {
      if (this.educationForm.valid) {
        this.spinner.show();
        let data = {
          empid: this.employeeCode,
          education: this.educationDetails,
        }

        this.emsService.saveEmployeeEducationData(data).subscribe((res: any) => {
          if (res.status && res.data[0].statuscode == 0) {
            this.getEmployeeEducationList();
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
              data: this.EM42
            });
            this.spinner.hide();
            this.selectedtab.setValue(5);
          } else {
            this.spinner.hide();
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
              data: this.EM43
            });
          }
        });
      } else {
        this.spinner.hide();
      }

    } else {
      this.spinner.hide();
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position: { top: `70px` },
        disableClose: true,
        data: "Please complete personal details first"
      });
    }

  }

  addEducation() {
    this.addEducationValidators();
    if (this.isEducationEdit) {
      this.isEducationEdit = false;
      this.educationDetails[this.educationIndex].course = this.educationForm.controls.course.value;
      this.educationDetails[this.educationIndex].institutename = this.educationForm.controls.instituteName.value;
      this.educationDetails[this.educationIndex].fromdate = this.pipe.transform(this.educationForm.controls.eduFromDate.value, 'yyyy-MM-dd'),
        this.educationDetails[this.educationIndex].todate = this.pipe.transform(this.educationForm.controls.eduToDate.value, 'yyyy-MM-dd'),
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
      }
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
  }
  deleteEducationPopup(event: any) {
    let dialogRef = this.dialog.open(ComfirmationDialogComponent, {
      position: { top: `70px` },
      disableClose: true,
      data: { message: this.EM61, YES: 'YES', NO: 'NO' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'YES') {
        this.deleteEducation(event)
      }
    });
  }
  deleteEducation(index: any) {
    this.educationDetails.splice(index, 1);
    this.educationDataSource = new MatTableDataSource(this.educationDetails);
  }


  // saveDocument() {

  // }

  // onSelectFile(event: any) {
  //   if (event.target.files[0].size <= 15728640) {
  //     this.isFile = true;
  //     const file: File = event.target.files[0];
  //     this.formData.append('file', file, file.name);
  //   } else {
  //     this.isFile = false;
  //     this.open('File size is must be less than 15MB', '8%', '500px', '250px', false, "/LeaveManagement/LeaveRequest")
  //   }
  // }

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
    } else if(event.index == 3){
      //this.createDocumentsForm();
    }  else if(event.index == 4){
      //this.createDocumentsForm();
    }

  }

  getMessagesList() {
    let data =
    {
      "code": null,
      "pagenumber": 1,
      "pagesize": 100
    }
    this.emsService.getMessagesListApi(data).subscribe((res: any) => {
      if (res.status) {
        this.messagesDataList = res.data;
        this.messagesDataList.forEach((e: any) => {
          if (e.code == "EM15") {
            this.EM15 = e.message
          } else if (e.code == "EM11") {
            this.EM11 = e.message
          } else if (e.code == "EM12") {
            this.EM12 = e.message
          } else if (e.code == "EM13") {
            this.EM13 = e.message
          } else if (e.code == "EM14") {
            this.EM14 = e.message
          }
          else if (e.code == "EM16") {
            this.EM16 = e.message
          } else if (e.code == "EM17") {
            this.EM17 = e.message
          } else if (e.code == "EM18") {
            this.EM18 = e.message
          } else if (e.code == "EM19") {
            this.EM19 = e.message
          } else if (e.code == "EM20") {
            this.EM20 = e.message
          } else if (e.code == "EM21") {
            this.EM21 = e.message
          } else if (e.code == "EM1") {
            this.EM1 = e.message
          } else if (e.code == "EM22") {
            this.EM22 = e.message
          } else if (e.code == "EM2") {
            this.EM2 = e.message
          } else if (e.code == "EM61") {
            this.EM61 = e.message
          }else if (e.code == "EM42") {
            this.EM42 = e.message
          }else if (e.code == "EM43") {
            this.EM43 = e.message
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
  numberOnly(event: any): boolean {
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
  alphaNumberOnly(e: any) {  // Accept only alpha numerics, not special characters
    var regex = new RegExp("^[a-zA-Z0-9 ]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
      return true;
    }

    e.preventDefault();
    return false;
  }


  getDocumentsEMS() {
    let input = {
      'employeeId': this.empId,
      "candidateId": null,
      "moduleId": 1,
      "filecategory": null,
      "requestId": null,
      'status': null
    }
    this.mainService.getDocumentsForEMS(input).subscribe((result: any) => {
      this.documentDetails = [];
      if (result && result.status) {
        // for (let k = 0; k < result.data.length; k++) {
        //   let documentName = result.data[k].filename.split('_')
        //   var docArray = [];
        //   var pdfName;
        //   for (let i = 0; i <= documentName.length; i++) {
        //     if (i > 2) {
        //       docArray.push(documentName[i])
        //     }
        //   }
        //   pdfName = docArray.join('')
        //   result.data[k].pdfName = pdfName
        // }
        this.documentDetails = result.data
        this.documentDataSource = new MatTableDataSource(this.documentDetails)
      }


    })
  }

  editDock(data: any) {
    this.isedit = true;
    this.editFileName = data.fname;
    this.editDockinfo = JSON.stringify(data)
    this.documentsForm.controls.documentId.setValue(data.id, { emitEvent: false });
    this.documentsForm.controls.documentName.setValue(data.file_category, { emitEvent: false });
    this.documentsForm.controls.documentNumber.setValue(data.document_number, { emitEvent: false });
  }

  deleteDock(data: any) {
    let dialogRef = this.dialog.open(ComfirmationDialogComponent, {
      position: { top: `70px` },
      disableClose: true,
      data: { message: this.EM16, YES: 'YES', NO: 'NO' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'YES') {
        this.mainService.deleteFilesMaster(data.id).subscribe((res: any) => {
          if (res && res.status) {
            var info = JSON.stringify(data)
            this.mainService.removeDocumentOrImagesForEMS(info).subscribe((result: any) => { })
            // this.mainService.removeDocumentOrImagesForEMS(data).subscribe(result => {})
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
              data: this.EM15
            });
            this.getDocumentsEMS()

          } else {
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
              data: this.EM17
            });
          }

        });

      }
    });




  }


  fileView(data: any) {

    let info = data
    this.spinner.show()
    this.mainService.getDocumentOrImagesForEMS(info).subscribe((imageData) => {

      if (imageData.success) {


        this.spinner.hide();

        let TYPED_ARRAY = new Uint8Array(imageData.image.data);
        const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
          return data + String.fromCharCode(byte);
        }, '');
        let base64String = btoa(STRING_CHAR)
        var documentName = data.fname.split('.')

        if (documentName[documentName.length - 1] == 'pdf') {
          const file = new Blob([TYPED_ARRAY], { type: "application/pdf" });
          this.fileURL = URL.createObjectURL(file);
          window.open(this.fileURL);

        } else {
          this.fileURL = new Blob([TYPED_ARRAY], { type: "image/png" })
          let url = URL.createObjectURL(this.fileURL)
          window.open(url, '_blank');

        }

      }
    })
    this.createValidatorForDocument();
    this.clearDock();
  }


  validateDocument() {
    this.createValidatorForDocument();
    if (this.documentsForm.valid) {
      if (this.documentsForm.controls.attachedFile.value || this.editDockinfo) {
        if (this.isFile) {
          var valid = true
          var ReplaceDocument: any;
          if (this.documentDetails.length != 0 && !this.editDockinfo) {
            for (let i = 0; i < this.documentDetails.length; i++) {
              if (this.documentsForm.controls.documentName.value == this.documentDetails[i].file_category) {
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
              data: { message: ReplaceDocument.description + ' ' + this.EM21, YES: 'YES', NO: 'NO' }
            });
            dialogRef.afterClosed().subscribe(result => {
              if (result == 'YES') {
                this.documentsForm.controls.documentId.setValue(ReplaceDocument.id, { emitEvent: false });
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
            data: this.EM13
          });
        }
      }
      else {
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
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
    this.spinner.show();
    this.mainService.getFilepathsMasterForEMS(1).subscribe((resultData) => {
      if (resultData && resultData.status) {
        let obj = {
          'id': this.documentsForm.controls.documentId.value ? this.documentsForm.controls.documentId.value : null,
          'employeeId': this.empId,
          'candidateId': 0,
          'filecategory': this.documentsForm.controls.documentName.value,
          'moduleId': 1,
          'documentnumber': this.documentsForm.controls.documentNumber.value,
          'fileName': this.file ? this.file.name : this.editFileName,
          'modulecode': resultData.data[0].module_code,
          'requestId': null,
          'status': 'Approved'
        }
        this.mainService.setFilesMasterForEMS(obj).subscribe((data) => {
          if (data && data.status) {
            if (obj.fileName != this.editFileName) {
              let info = JSON.stringify(data.data[0])
              this.formData.append('file', this.file, this.file.name);
              this.formData.append('info',info);
              this.mainService.setDocumentOrImageForEMS(this.formData).subscribe((data) => {
                // this.spinner.hide()
                this.formData.delete('file');
                this.formData.delete('info');
                if (data && data.status) {
                  if (this.editDockinfo) {
                    this.mainService.removeDocumentOrImagesForEMS(this.editDockinfo).subscribe((data) => { })
                  }
                  let dialogRef = this.dialog.open(ReusableDialogComponent, {
                    position: { top: `70px` },
                    disableClose: true,
                    data: this.EM11
                  });
                  this.spinner.hide();
                  this.getDocumentsEMS();
                  this.clearDock();
                  this.selectedtab.setValue(0);
                } else {
                  this.spinner.hide();
                  let dialogRef = this.dialog.open(ReusableDialogComponent, {
                    position: { top: `70px` },
                    disableClose: true,
                    data: this.EM12
                  });
                  // this.open(result.isLeaveUpdated ? this.msgLM76 : this.msgLM79,'8%','500px','250px',false,"/LeaveManagement/UserDashboard")

                }
                this.file = null;

                this.editDockinfo = null;
                this.editFileName = null;

              });
            } else {
              this.spinner.hide();
              this.getDocumentsEMS();
              this.clearDock();
              this.editDockinfo = null;
              this.editFileName = null;
              this.file = null;
              let dialogRef = this.dialog.open(ReusableDialogComponent, {
                position: { top: `70px` },
                disableClose: true,
                data: this.EM19
              });
            }
          } else {
            this.spinner.hide();
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
              data: this.EM17
            });
          }
        });
        this.spinner.hide();
      }
    });
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

  onSelectFile(event: any) {
    if (event.target.files.length != 0) {
      if (event.target.files[0].size <= 2097152) {
        this.file = event.target.files[0];
        var pdf = this.file.name.split('.');
        if (pdf[pdf.length - 1] == 'pdf' || pdf[pdf.length - 1] == 'jpg' || pdf[pdf.length - 1] == 'png') {
          this.isFile = true;
        } else {
          this.isFile = false;
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: this.EM13
          });
          // this.open(this.msgLM141,'8%','500px','250px',false,"/LeaveManagement/LeaveRequest")


        }
      } else {
        this.isFile = false;
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
          data: this.EM14
        });
      }
    } else {
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position: { top: `70px` },
        disableClose: true,
        data: this.EM18
      });
      // th
    }
  }
  getFilecategoryMasterForEMS() {
    let input = {
      'id': null,
      "moduleId": 1,
    }
    this.mainService.getFilecategoryMasterForEMS(input).subscribe((result: any) => {
      if (result && result.status) {

        this.documentTypeList = result.data;

      }
    })
  }

  clearDock() {
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
  deleteIcon(){
    this.isedit = false;
    this.documentsForm.controls.attachedFile.setValue('')
  }
  delete() {
    this.isedit = false;
  }
  createValidatorForDocument() {
    this.documentsForm.controls.documentNumber.setValidators([Validators.required, Validators.minLength(6), Validators.maxLength(30)])
    this.documentsForm.controls.documentName.setValidators([Validators.required])
    this.documentsForm.get('documentNumber').updateValueAndValidity();
    this.documentsForm.get('documentName').updateValueAndValidity();

  }
  educationClear() { }
  workClear() { }
  jobClear() { }
  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }


  getEmployeeImage() {
    let input = {
      'employeeId': this.empId,
      "candidateId": null,
      "moduleId": 1,
      "filecategory": 'PROFILE',
      "requestId": null,
      'status': null
    }
    this.mainService.getDocumentsForEMS(input).subscribe((result: any) => {
      if (result.data.length > 0 && result.status) {
                this.profileId = result.data[0].id;
                this.profileInfo = JSON.stringify(result.data[0]);
               this.mainService.getDocumentOrImagesForEMS(result.data[0]).subscribe((imageData) => {
                 if(imageData.success){
                            let TYPED_ARRAY = new Uint8Array(imageData.image.data);
                            const STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
                              return data + String.fromCharCode(byte);
                            }, '');
                            let base64String= btoa(STRING_CHAR)
                            this.imageurls[0].base64String='data:image/png;base64,'+base64String;
                          }
                          else{
                            this.isRemoveImage=false;
                            this.imageurls =[{base64String:"assets/img/profile.jpg" }];
                          }
        })
      }
    })
  }

  addPersonalInfoValidators() {
    this.personalInfoForm.get("firstname").setValidators(Validators.required);
    this.personalInfoForm.get("firstname").updateValueAndValidity();

    this.personalInfoForm.get("lastname").setValidators(Validators.required);
    this.personalInfoForm.get("lastname").updateValueAndValidity();

    this.personalInfoForm.get("dateofbirth").setValidators(Validators.required);
    this.personalInfoForm.get("dateofbirth").updateValueAndValidity();

    this.personalInfoForm.get("gender").setValidators(Validators.required);
    this.personalInfoForm.get("gender").updateValueAndValidity();

    this.personalInfoForm.get("maritalstatus").setValidators(Validators.required);
    this.personalInfoForm.get("maritalstatus").updateValueAndValidity();

    this.personalInfoForm.get("mobileNo").setValidators(Validators.required);
    this.personalInfoForm.get("mobileNo").updateValueAndValidity();

    this.personalInfoForm.get("alternateMobileNo").setValidators(Validators.required);
    this.personalInfoForm.get("alternateMobileNo").updateValueAndValidity();

    this.personalInfoForm.get("employmentType").setValidators(Validators.required);
    this.personalInfoForm.get("employmentType").updateValueAndValidity();

    this.personalInfoForm.get("usertype").setValidators(Validators.required);
    this.personalInfoForm.get("usertype").updateValueAndValidity();

    this.personalInfoForm.get("companylocation").setValidators(Validators.required);
    this.personalInfoForm.get("companylocation").updateValueAndValidity();

    this.personalInfoForm.get("designation").setValidators(Validators.required);
    this.personalInfoForm.get("designation").updateValueAndValidity();

    this.personalInfoForm.get("department").setValidators(Validators.required);
    this.personalInfoForm.get("department").updateValueAndValidity();

    this.personalInfoForm.get("reportingmanager").setValidators(Validators.required);
    this.personalInfoForm.get("reportingmanager").updateValueAndValidity();

    this.personalInfoForm.get("raddress").setValidators(Validators.required);
    this.personalInfoForm.get("raddress").updateValueAndValidity();

    this.personalInfoForm.get("rcountry").setValidators(Validators.required);
    this.personalInfoForm.get("rcountry").updateValueAndValidity();

    this.personalInfoForm.get("rstate").setValidators(Validators.required);
    this.personalInfoForm.get("rstate").updateValueAndValidity();

    this.personalInfoForm.get("rcity").setValidators(Validators.required);
    this.personalInfoForm.get("rcity").updateValueAndValidity();

    this.personalInfoForm.get("rpincode").setValidators(Validators.required);
    this.personalInfoForm.get("rpincode").updateValueAndValidity();

  }

  backArrow() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    this.router.navigate(["/ems/employeeDirectory"]));
  }
}

