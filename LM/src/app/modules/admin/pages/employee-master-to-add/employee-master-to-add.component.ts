import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeMasterService } from 'src/app/services/employee-master-service';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { AdminService } from '../../admin.service';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
@Component({
  selector: 'app-employee-master-to-add',
  templateUrl: './employee-master-to-add.component.html',
  styleUrls: ['./employee-master-to-add.component.scss']
})
export class EmployeeMasterToAddComponent implements OnInit {
  employeeAddForm!: FormGroup;
  employeefamilyAddForm: any = FormGroup;
  employeeworkAddForm!: FormGroup;
  workForm!: FormGroup;
  educationForm!: FormGroup;
  isview: boolean = true;
  maxBirthDate: any;
  dateofbirth: any;
  efromdate: any;
  etodate: any;
  wfromdate: any;
  wtodate: any;
  states: any;
  add: boolean = false;
  isself: boolean = false;
  isviewemployee: boolean = false;
  pipe = new DatePipe('en-US');
  bloodGroupdetails: any[] = [];
  genderDetails: any[] = [];
  employeeRelationship: any = [];
  familyDetails: any = [];
  Experience: any = [];
  Educations: any = [];
  EmploymentTypeDetails: any = [];
  availableDesignations: any = [];
  availableDepartments: any = [];
  availableRole: any = [];
  availableShifts: any = [];
  locationDetails: any = [];
  employeeInformation: any = [];
  worklocationDetails: any[] = [];
  availablereportingmanagers: any[] = [];
  maritalStatusDetails: any[] = [];
  permanentStateDetails: any = [];
  permanentCityDetails: any = [];
  permanentCountryDetails: any = [];
  stateDetails: any = [];
  CountryDetails: any = [];
  cityDetails: any = [];
  relations: any = [];
  familyindex: any;
  minDate = new Date('1950/01/01');
  maxDate = new Date();
  minwtodate: any;
  minetodate: any;
  wemaxDate = new Date();
  edmaxDate = new Date();
  eduDisableFromDates:any = [];
  eduDisableToDates:any = [];
  workDisableFromDates:any = [];
  workDisableToDates:any = [];
  empid: any;
  mindatofjoin: any;
  work: boolean = false;
  family: boolean = false;
  emp: boolean = true;
  isfamilyedit: boolean = false;
  selectAll: boolean = false;
  editemployee: boolean = false;
  addemployee: boolean = true;
  ischecked: any;
  displayedColumns: string[] = ['position', 'name', 'relation', 'gender', 'contact', 'status', 'action'];
  dataSource: MatTableDataSource<any> = <any>[];
  dsFamily: MatTableDataSource<any> = <any>[];
  employeedata: any = [];
  empdisplayedColumns: string[] = ['employeeid', 'firstname', 'middlename', 'lastname', 'status', 'Action'];
  employeedetails: any = [];
  page = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [10, 25, 50, 'All'];
  addempdetails: boolean = false;
  viewdetails: boolean = true;
  msgLM1: any = '';
  msgLM2: any = '';
  msgLM3: any = '';
  msgLM54: any = '';
  msgLM38: any = '';
  msgLM39: any = '';
  msgLM63: any;
  msgLM64: any;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  paddress: any;
  pcity: any;
  pstate: any;
  ppincode: any;
  pcountry: any;
  empdataa: any = [];
  maxall: number = 10;
  pageLoading = true;
  constructor(private formBuilder: FormBuilder, private LMS: CompanySettingService,
    private LM: EmployeeMasterService, private dialog: MatDialog, private router: Router
    , private adminService: AdminService) {

  }
  ngOnInit(): void {
    let auxDate = this.substractYearsToDate(new Date(), 18);
    this.maxBirthDate = this.getDateFormateForSearch(auxDate);
    this.getBloodgroups();
    this.getGender();
    this.getCountry();
    // this.getShifts();
    this.getRoles();
    this.getMaritalStatusMaster();
    this.getRelationshipMaster();
    this.getEmploymentTypeMaster();
    this.getDesignationsMaster();
    this.getDepartmentsMaster();
    this.getWorkLocation();
    this.getEmployeeDetails(null, null);
    this.getErrorMessages('LM1');
    this.getErrorMessages('LM2');
    this.getErrorMessages('LM3');
    this.getErrorMessages('LM54');
    this.getErrorMessages('LM38');
    this.getErrorMessages('LM39');
    this.getErrorMessages('LM63');
    this.getErrorMessages('LM64');
    /**page 1 form */
    this.employeeAddForm = this.formBuilder.group(
      {
        firstname: ["", Validators.required],
        lastname: ["", Validators.required],
        middlename: [""],
        contactnumber: ["", Validators.required],
        personalemail: ["", [Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        bloodgroup: [""],
        gender: ["", Validators.required],
        emergencycontact: [""],
        dateofbirth: ["", Validators.required],
        city: ["", Validators.required],
        state: ["", Validators.required],
        pincode: ["", Validators.required],
        country: ["", Validators.required],
        paddress: [""],
        address: ["", Validators.required],
        maritalstatus: ["", Validators.required],
        pcity: [""],
        pstate: [""],
        ppincode: [""],
        pcountry: [""],
        aadharnumber: [""],
        passport: [""],
        uanumber: [""],
        pfaccountnumber: [""],
        pan: [""],
        esi: [""],
        checked: [false],
        emergencycontactnumber: [""],
        emergencycontactrelation: [""],
        emergencycontactname: [""],

      }),
      /**page 2 form */
      this.employeefamilyAddForm = this.formBuilder.group(
        {
          familyfirstname: ["", Validators.required],
          familylastname: ["", Validators.required],
          familydateofbirth: [""],
          familystatus: ["Alive", Validators.required],
          familycontact: [""],
          familygender: ["", Validators.required],
          relation: ["", Validators.required],
          bankname: [""],
          ifsccode: [""],
          nameasperbankaccount: [""],
          branchname: [""],

          bankaccountnumber: [""],
        }),
      /**page 3 form */
      this.employeeworkAddForm = this.formBuilder.group(
        {
          officeemail: ["", [Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')]],
          usertype: ["", Validators.required],
          designation: ["", Validators.required],
          department: ["", Validators.required],
          employmenttype: ["", Validators.required],
          dateofjoin: ["", Validators.required],
          companylocation: ["", Validators.required],
          reportingmanager: ["", Validators.required],
          status: ["Active"],
          shift: [""],
          relations: [""],

          efromdate: [""],
          etodate: [""],
          wfromdate: [""],
          wtodate: [""],
          course: [""],
          institutename: [""],
          companyname: [""],
          empid: [""],
          edu: this.formBuilder.array([]),
          exp: this.formBuilder.array([]),
        });
    /**same as present address checkbox */
    this.employeeAddForm.get('checked')?.valueChanges.subscribe(selectedValue => {
      if (selectedValue != '') {
        this.employeeAddForm.get('pcountry')?.valueChanges.subscribe(selectedStateValue => {
          this.permanentStateDetails = [];
          if(selectedStateValue != '') {
            this.LMS.getStatesc(selectedStateValue).subscribe((data) => {
              this.permanentStateDetails = data[0]
              if (this.employeeAddForm.controls.state.value != null) {
                this.employeeAddForm.controls.pstate.setValue(this.employeeAddForm.controls.state.value);
              }
            })
          }
        })
        this.employeeAddForm.get('pstate')?.valueChanges.subscribe(selectedCityValue => {
          this.permanentCityDetails = [];
          if(selectedCityValue != '') {
            this.LMS.getCities(selectedCityValue).subscribe((data) => {
              this.permanentCityDetails = data[0]
              if (this.employeeAddForm.controls.city.value != null) {
                this.employeeAddForm.controls.pcity.setValue(this.employeeAddForm.controls.city.value);
              }
            });
          }
        })

        this.employeeAddForm.controls.paddress.setValue(this.employeeAddForm.controls.address.value),
          this.employeeAddForm.controls.pcountry.setValue(this.employeeAddForm.controls.country.value),
          this.employeeAddForm.controls.ppincode.setValue(this.employeeAddForm.controls.pincode.value)
        this.employeeAddForm.controls.paddress.disable();
        this.employeeAddForm.controls.pcountry.disable();
        this.employeeAddForm.controls.pstate.disable();
        this.employeeAddForm.controls.pstate.disable();
        this.employeeAddForm.controls.pcity.disable();
        this.employeeAddForm.controls.ppincode.disable();
      }
      else {
        this.employeeAddForm.controls.paddress.setValue('')
        this.employeeAddForm.controls.pcountry.setValue('')
        this.employeeAddForm.controls.pstate.setValue('')
        this.employeeAddForm.controls.pstate.setValue('')
        this.employeeAddForm.controls.pcity.setValue('')
        this.employeeAddForm.controls.ppincode.setValue('')
      }
    })

    /**get state details for residance address */
    this.employeeAddForm.get('country')?.valueChanges.subscribe(selectedResidenceStateValue => {
      this.stateDetails = [];
      if (selectedResidenceStateValue != '') {
         this.LMS.getStatesc(selectedResidenceStateValue).subscribe((data) => {
           this.stateDetails = data[0];
           if (this.employeedata != null) {
             this.employeeAddForm.controls.state.setValue(this.employeedata.state);
           }
         })
      }
    })
    /**get city details for residance address */
    this.employeeAddForm.get('state')?.valueChanges.subscribe(selectedResidenceCityValue => {
      this.cityDetails = [];
      if (selectedResidenceCityValue != '') {
        this.LMS.getCities(selectedResidenceCityValue).subscribe((data) => {
          this.cityDetails = data[0]
          if (this.employeedata != null) {
            this.employeeAddForm.controls.city.setValue(this.employeedata.city);
          }
        })
      }
    })
    /**get state details for present address*/
    this.employeeAddForm.get('pcountry')?.valueChanges.subscribe(selectedPresentStateValue => {
      this.permanentStateDetails = [];
      if (selectedPresentStateValue != '') {
        this.LMS.getStatesc(selectedPresentStateValue).subscribe((data) => {
          this.permanentStateDetails = data[0]
          if (this.employeedata != null) {
            this.employeeAddForm.controls.pstate.setValue(this.employeedata.pstate);
          }
        })
      }
    })
    /**get city details for present address */
    this.employeeAddForm.get('pstate')?.valueChanges.subscribe(selectedPresentCityValue => {
      this.permanentCityDetails = [];
      if (selectedPresentCityValue != '') {
        this.LMS.getCities(selectedPresentCityValue).subscribe((data) => {
          this.permanentCityDetails = data[0]
          if (this.employeedata != null) {
            this.employeeAddForm.controls.pcity.setValue(this.employeedata.pcity);

          }
        })
      }
    })
    this.employeeworkAddForm.get('dateofjoin')?.valueChanges.subscribe(selectedValue => {
      this.wemaxDate = new Date(
        selectedValue.getFullYear(),
        selectedValue.getMonth(),
        selectedValue.getDate() - 1
      )
      this.edmaxDate = new Date(
        selectedValue.getFullYear(),
        selectedValue.getMonth(),
        selectedValue.getDate() - 1
      )

    })


    this.employeeAddForm.get('dateofbirth')?.valueChanges.subscribe(selectedValue => {
      this.dateofjonupdate(selectedValue)

    })
    this.employeeworkAddForm.get('usertype')?.valueChanges.subscribe(selectedValue => {
      if (selectedValue == 2) {
        this.isself = true;
      }
      else {
        this.isself = false;
      }


    })


    this.employeeworkAddForm.get('efromdate')?.valueChanges.subscribe(selectedValue => {
      this.minetodate = selectedValue;
    })

    console.log(this.employeeworkAddForm.get('edu'),this.employeeworkAddForm.get('efromdate'));
    // this.employeeAddForm.get('paddress')?.valueChanges.subscribe(selectedValue => {
    //   this.minetodate = selectedValue;
    //   if(this.employeeAddForm.controls.address == selectedValue){
    //     this.employeeAddForm.controls.checked.setValue(true)
    //   }
    //   else{
    //     this.employeeAddForm.controls.checked.setValue(false)
    //   }

    // })
    /**get reporting managers */
    this.employeeworkAddForm.get('department')?.valueChanges.subscribe(selectedValue => {
      this.availablereportingmanagers = []
      let data = {
        id: selectedValue
      }
      this.LMS.getReportingManagers(data).subscribe(data => {
        this.availablereportingmanagers = data[0]
        if (this.employeedata.length > 0) {
          if ((this.employeedata.id).toString() === (this.employeedata.reportingmanager).toString()) {
            this.employeeworkAddForm.controls.reportingmanager.setValue("Self");
          } else {
            this.employeeworkAddForm.controls.reportingmanager.setValue(this.employeedata.reportingmanager);
          }
          //   this.employeeworkAddForm.controls.reportingmanager.setValue(this.employeedata.reportingmanager);

        }
      })
    })
  }

  // closeDatePicker(event:any,efromdate:any){
  //     efromdate.close();
  // }

  dateofjonupdate(data: any) {
    this.mindatofjoin = new Date()
    this.mindatofjoin.setFullYear(data.getFullYear() + 18);
  }

  /**Search functionality */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  edu(): FormArray {
    return this.employeeworkAddForm.get("edu") as FormArray
  }
  exp(): FormArray {
    return this.employeeworkAddForm.get("exp") as FormArray
  }
  newEducation(): FormGroup {
    return this.formBuilder.group({
      course: '',
      institutename: '',
      efromdate: '',
      etodate: ''

    })
  }
  newExperince(): FormGroup {
    return this.formBuilder.group({
      companyname: '',
      wfromdate: '',
      wtodate: ''

    })
  }

  addexperience() {
    if (this.exp().controls.length > 0) {
      for (let i = 0; i < this.exp().controls.length; i++) {
        this.workDisableFromDates[i]=this.workDisableFromDates[i]||this.maxDate;
        this.wemaxDate = this.exp().controls[i].value.wfromdate;
      }
      this.workDisableFromDates[this.exp().controls.length]=this.maxDate;
    }
    else this.workDisableFromDates[0]=this.maxDate;

    this.exp().push(this.newExperince());
  }

  addexperiencedetils() {
    for (let i = 0; i < this.exp().controls.length; i++) {
      this.Experience.push({
        companyname: this.exp().controls[i].value.companyname,
        skills: 'test',
        fromdate: this.pipe.transform(this.exp().controls[i].value.wfromdate, 'yyyy-MM-dd'),
        todate: this.pipe.transform(this.exp().controls[i].value.wtodate, 'yyyy-MM-dd')
      });

    }

  }

  addeducation() {
    if (this.edu().controls.length > 0) {
      for (let i = 0; i < this.edu().controls.length; i++) {
        this.eduDisableFromDates[i]=this.eduDisableFromDates[i]||this.maxDate;
        if (this.edu().controls[i].value.efromdate != null) {
          this.edmaxDate = this.edu().controls[i].value.efromdate
        }
      }
      this.eduDisableFromDates[this.edu().controls.length]=this.maxDate;
    } else {
      this.eduDisableFromDates[0]=this.maxDate;
      if (this.exp().controls.length > 0) {
        for (let i = 0; i < this.exp().controls.length; i++) {
          this.edmaxDate = this.exp().controls[i].value.wfromdate;
        }
      }
    }
    this.edu().push(this.newEducation());

  }
  addeducationdetails() {
    for (let i = 0; i < this.edu().controls.length; i++) {
      if (this.edu().controls[i].value.efromdate != null) {
        this.Educations.push({
          course: this.edu().controls[i].value.course,
          institutename: this.edu().controls[i].value.institutename,
          fromdate: this.pipe.transform(this.edu().controls[i].value.efromdate, 'yyyy-MM-dd'),
          todate: this.pipe.transform(this.edu().controls[i].value.etodate, 'yyyy-MM-dd')
        });


      }

    }
  }
  removeWork(workIndex: number) {
    this.exp().removeAt(workIndex);
  }


  removeeducation(empIndex: number) {
    this.edu().removeAt(empIndex);
  }

  addemp() {
    this.add = true;
    this.addempdetails = true;
    this.viewdetails = false;
    this.editemployee = false;
  }
  getEmployeeDetails(employeeId: any, employeeName: any) {

    var search = {
      employeeId: employeeId,
      employeeName: employeeName,
      page: this.page,
      tableSize: 1000
    };

    this.LM.getEmployeeDetails(search).subscribe((result: any) => {

      this.employeedetails = result.data[0];
      this.dataSource = new MatTableDataSource(this.employeedetails);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.pageLoading = false;
    })
  }
  editEmployee(data: any) {
    this.add = false;
    this.addempdetails = true;
    this.viewdetails = false;
    this.editemployee = true;
    this.addemployee = false;
    this.LM.getEmployeeMaster(data).subscribe((result) => {
      this.employeedata = JSON.parse(result.data[0][0].json)[0];
      let a = this.employeedata;
      if (a.country == a.pcountry && a.state == a.pstate && a.city == a.pcity && a.address == a.paddress && a.pincode == a.ppincode) {
        this.employeeAddForm.controls.checked.setValue(true)
      }
      this.employeeAddForm.controls.aadharnumber.setValue(this.employeedata.aadharnumber);
      this.employeeAddForm.controls.address.setValue(this.employeedata.address);
      this.employeefamilyAddForm.controls.bankaccountnumber.setValue(this.employeedata.bankaccountnumber);
      this.employeefamilyAddForm.controls.bankname.setValue(this.employeedata.bankname);
      this.employeeAddForm.controls.bloodgroup.setValue(this.employeedata.bloodgroup);
      this.employeefamilyAddForm.controls.branchname.setValue(this.employeedata.branchname);
      this.employeeAddForm.controls.contactnumber.setValue(this.employeedata.contactnumber);
      this.employeeAddForm.controls.dateofbirth.setValue(new Date(this.employeedata.dateofbirth));
      this.employeeworkAddForm.controls.dateofjoin.setValue(new Date(this.employeedata.dateofjoin));
      this.employeeworkAddForm.controls.designation.setValue(this.employeedata.designation);
      this.employeeworkAddForm.controls.empid.setValue(this.employeedata.empid);
      this.employeeworkAddForm.controls.usertype.setValue(this.employeedata.usertype);
      this.employeeAddForm.controls.esi.setValue(this.employeedata.esi);
      this.employeeAddForm.controls.firstname.setValue(this.employeedata.firstname);
      this.employeeAddForm.controls.gender.setValue(this.employeedata.gender);
      this.employeefamilyAddForm.controls.ifsccode.setValue(this.employeedata.ifsccode);
      this.employeeAddForm.controls.lastname.setValue(this.employeedata.lastname);
      this.employeeAddForm.controls.maritalstatus.setValue(this.employeedata.maritalstatus);
      this.employeeAddForm.controls.middlename.setValue(this.employeedata.middlename);
      this.employeefamilyAddForm.controls.nameasperbankaccount.setValue(this.employeedata.nameasperbankaccount);
      this.employeeworkAddForm.controls.officeemail.setValue(this.employeedata.officeemail);
      this.employeeAddForm.controls.paddress.setValue(this.employeedata.paddress);
      this.employeeAddForm.controls.pan.setValue(this.employeedata.pan);
      this.employeeAddForm.controls.passport.setValue(this.employeedata.passport);
      this.employeeAddForm.controls.personalemail.setValue(this.employeedata.personalemail);
      this.employeeAddForm.controls.pfaccountnumber.setValue(this.employeedata.pfaccountnumber);
      this.employeeAddForm.controls.pincode.setValue(this.employeedata.pincode);
      this.employeeAddForm.controls.ppincode.setValue(this.employeedata.ppincode);
      this.employeeworkAddForm.controls.shift.setValue(this.employeedata.shift ?? '');
      this.employeeworkAddForm.controls.status.setValue(this.employeedata.status);
      this.employeeAddForm.controls.uanumber.setValue(this.employeedata.uanumber);
      this.employeeworkAddForm.controls.employmenttype.setValue(this.employeedata.employmenttype);
      this.employeeworkAddForm.controls.usertype.setValue(this.employeedata.usertype);
      this.employeeworkAddForm.controls.companylocation.setValue(this.employeedata.worklocation);
      if ((this.employeedata.id).toString() === (this.employeedata.reportingmanager).toString()) {
        this.employeeworkAddForm.controls.reportingmanager.setValue("Self");
      } else {
        this.employeeworkAddForm.controls.reportingmanager.setValue(this.employeedata.reportingmanager);
      }
      this.employeeAddForm.controls.country.setValue(this.employeedata.country);
      this.employeeAddForm.controls.pcountry.setValue(this.employeedata.pcountry);
      this.employeeAddForm.controls.state.setValue(this.employeedata.state);
      this.employeeAddForm.controls.pstate.setValue(this.employeedata.pstate);
      this.employeeAddForm.controls.city.setValue(this.employeedata.city);
      this.employeeAddForm.controls.pcity.setValue(this.employeedata.pcity);
      this.employeeworkAddForm.controls.department.setValue(this.employeedata.department);
      let x = JSON.parse((this.employeedata.education))
      let y = JSON.parse((this.employeedata.experience))
      let familydata = JSON.parse((this.employeedata.relations))
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
            contactnumber: familydata[i].contactnumber!= 'null'?familydata[i].contactnumber:'',
            status: familydata[i].status,
            relationship: relationship,
            relationshipname: relationshipname,
            dateofbirth: familydata[i].dateofbirth != "null" ? this.pipe.transform(familydata[i].dateofbirth, 'yyyy-MM-dd') : '',
          });
        }
        this.dsFamily = new MatTableDataSource(this.familyDetails);
      }

      let education = JSON.parse(this.employeedata.education)
      if (education != null) {
        education.forEach((e: any) => {
          this.edu().push(this.formBuilder.group({
            course: e.course,
            institutename: e.institutename,
            efromdate: new Date(e.fromdate),
            etodate: new Date(e.todate)

          }));
        });
        if (this.edu().controls.length > 0) {
          for (let i = 0; i < this.edu().controls.length; i++) {
              this.eduDisableFromDates[i]=this.eduDisableFromDates[i]||this.maxDate;
              if (this.edu().controls[i].value.efromdate != null)
                  this.edmaxDate = this.edu().controls[i].value.efromdate
          }
        }
      }
      let experience = JSON.parse(this.employeedata.experience)
      if (experience != null) {
        experience.forEach((e: any) => {
          this.exp().push(this.formBuilder.group({
            companyname: e.companyname,
            wfromdate: new Date(e.fromdate),
            wtodate: new Date(e.todate)

          }));
        });

        if (this.exp().controls.length > 0) {
          for (let i = 0; i < this.exp().controls.length; i++) {
            this.workDisableFromDates[i] = this.workDisableFromDates[i] || this.maxDate;
            this.wemaxDate = this.exp().controls[i].value.wfromdate;
          }
        }
      }
    });

  }

  addfamily() {
    if (this.isfamilyedit) {
      this.isfamilyedit = false;
      this.familyDetails[this.familyindex].firstname = this.employeefamilyAddForm.controls.familyfirstname.value;
      this.familyDetails[this.familyindex].lastname = this.employeefamilyAddForm.controls.familylastname.value;
      this.familyDetails[this.familyindex].gender = this.employeefamilyAddForm.controls.familygender.value.id;
      this.familyDetails[this.familyindex].gendername = this.employeefamilyAddForm.controls.familygender.value.gender;
      this.familyDetails[this.familyindex].contactnumber = this.employeefamilyAddForm.controls.familycontact.value;
      this.familyDetails[this.familyindex].status = this.employeefamilyAddForm.controls.familystatus.value;
      this.familyDetails[this.familyindex].relationship = this.employeefamilyAddForm.controls.relation.value.id;
      this.familyDetails[this.familyindex].relationshipname = this.employeefamilyAddForm.controls.relation.value.relationship;
      this.familyDetails[this.familyindex].dateofbirth = this.employeefamilyAddForm.controls.familydateofbirth.value != "" ? this.pipe.transform(this.employeefamilyAddForm.controls.familydateofbirth.value, 'yyyy-MM-dd') : ''
      this.clearfamily();
    }
    else {
      if (this.employeefamilyAddForm.valid) {
        this.familyDetails.push({
          firstname: this.employeefamilyAddForm.controls.familyfirstname.value,
          lastname: this.employeefamilyAddForm.controls.familylastname.value,
          gender: this.employeefamilyAddForm.controls.familygender.value.id,
          gendername: this.employeefamilyAddForm.controls.familygender.value.gender,
          contactnumber: this.employeefamilyAddForm.controls.familycontact.value,
          status: this.employeefamilyAddForm.controls.familystatus.value,
          relationship: this.employeefamilyAddForm.controls.relation.value.id,
          relationshipname: this.employeefamilyAddForm.controls.relation.value.relationship,
          dateofbirth: this.pipe.transform(this.employeefamilyAddForm.controls.familydateofbirth.value, 'yyyy-MM-dd')
        });
        this.dsFamily = new MatTableDataSource(this.familyDetails);
        this.clearfamily();
      }
    }

  }

  save() {
    this.addexperiencedetils();
    this.addeducationdetails();
    if (this.addemployee) {
      this.empid = null;
    }
    else {
      this.empid = this.employeedata.empid;

    }

    if (this.employeeAddForm.controls.checked.value == true) {
      this.paddress = this.employeeAddForm.controls.address.value;
      this.pcity = this.employeeAddForm.controls.city.value;
      this.pstate = this.employeeAddForm.controls.state.value;
      this.ppincode = this.employeeAddForm.controls.pincode.value;
      this.pcountry = this.employeeAddForm.controls.country.value;
    } else {
      this.paddress = this.employeeAddForm.controls.paddress.value;
      this.pcity = this.employeeAddForm.controls.pcity.value;
      this.pstate = this.employeeAddForm.controls.pstate.value;
      this.ppincode = this.employeeAddForm.controls.ppincode.value;
      this.pcountry = this.employeeAddForm.controls.pcountry.value;
    }

    let familyDetailsList: { firstname: any; lastname: any; gender: any; contactnumber: any; status: any; relationship: any; dateofbirth: any; }[]=[];
    this.familyDetails.forEach((e:any) => {
      familyDetailsList.push({
        firstname: e.firstname,
        lastname: e.lastname,
        gender: e.gender,
        contactnumber: e.contactnumber,
        status: e.status,
        relationship: e.relationship,
        dateofbirth: e.dateofbirth,
      });
    });
    let employeeinformation = {
      empid: this.empid,
      firstname: this.employeeAddForm.controls.firstname.value,
      middlename: this.employeeAddForm.controls.middlename.value,
      lastname: this.employeeAddForm.controls.lastname.value,
      personalemail: this.employeeAddForm.controls.personalemail.value,
      officeemail: this.employeeworkAddForm.controls.officeemail.value,
      dateofbirth: this.pipe.transform(this.employeeAddForm.controls.dateofbirth.value, 'yyyy-MM-dd'),
      gender: this.employeeAddForm.controls.gender.value,
      maritalstatus: this.employeeAddForm.controls.maritalstatus.value,
      usertype: this.employeeworkAddForm.controls.usertype.value,
      designation: this.employeeworkAddForm.controls.designation.value,
      department: this.employeeworkAddForm.controls.department.value,
      employmenttype: this.employeeworkAddForm.controls.employmenttype.value,
      dateofjoin: this.pipe.transform(this.employeeworkAddForm.controls.dateofjoin.value, 'yyyy-MM-dd'),
      companylocation: this.employeeworkAddForm.controls.companylocation.value,
      reportingmanager: this.employeeworkAddForm.controls.reportingmanager.value,
      bloodgroup: this.employeeAddForm.controls.bloodgroup.value,
      contactnumber: this.employeeAddForm.controls.contactnumber.value,
      emergencycontactnumber: this.employeeAddForm.controls.emergencycontactnumber.value,
      emergencycontactrelation: this.employeeAddForm.controls.emergencycontactrelation.value,
      emergencycontactname: this.employeeAddForm.controls.emergencycontactname.value,

      address: this.employeeAddForm.controls.address.value,
      city: this.employeeAddForm.controls.city.value,
      state: this.employeeAddForm.controls.state.value,
      pincode: this.employeeAddForm.controls.pincode.value,
      country: this.employeeAddForm.controls.country.value,
      paddress: this.paddress,
      pcity: this.pcity,
      pstate: this.pstate,
      ppincode: this.ppincode,
      pcountry: this.pcountry,
      aadharnumber: this.employeeAddForm.controls.aadharnumber.value,
      passport: this.employeeAddForm.controls.passport.value,
      bankname: this.employeefamilyAddForm.controls.bankname.value,
      ifsccode: this.employeefamilyAddForm.controls.ifsccode.value,
      nameasperbankaccount: this.employeefamilyAddForm.controls.nameasperbankaccount.value,
      branchname: this.employeefamilyAddForm.controls.branchname.value,
      bankaccountnumber: this.employeefamilyAddForm.controls.bankaccountnumber.value,
      uanumber: this.employeeAddForm.controls.uanumber.value,
      pfaccountnumber: this.employeeAddForm.controls.pfaccountnumber.value,
      pan: this.employeeAddForm.controls.pan.value,
      status: this.employeeworkAddForm.controls.status.value,
      esi: this.employeeAddForm.controls.esi.value,
      shift: this.employeeworkAddForm.controls.shift.value ?? '',
      relations: familyDetailsList,
      education: this.Educations,
      experience: this.Experience,
    }
    let index=0;
    if(this.empid == null){
      index = this.employeedetails.findIndex((e: any) => (e.officeemail).toLowerCase() === (this.employeeworkAddForm.controls.officeemail.value).toLowerCase());
    }else{
      index = this.employeedetails.findIndex((e: any) => (e.officeemail).toLowerCase() === (this.employeeworkAddForm.controls.officeemail.value).toLowerCase()
       && this.empid != e.empid );
    }

    if (index > 0) {
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position: { top: `70px` },
        disableClose: true,
        data: "Office email already exist."
      });
    } else {

      this.LM.setEmployeeMaster(employeeinformation).subscribe((data) => {
        /**For add employee */
        if (this.addemployee) {
          if (data.status) {
            this.addemployee = true;
            this.addempdetails = false;
            this.viewdetails = true;
            this.work = false;
            this.emp = true;
            this.family = false;
            this.familyDetails = [];
            this.Experience = [];
            this.Educations = [];
            this.employeedata = [];
            this.ngOnInit();
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
              data: this.msgLM63
            });

          }
          else {
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
              data: this.msgLM38
            });
          }



        }
        /**For edit employee */
        else {
          if (data.status) {
            this.addemployee = true;
            this.addempdetails = false;
            this.viewdetails = true;
            this.work = false;
            this.emp = true;
            this.family = false;
            this.familyDetails = [];
            this.Experience = [];
            this.Educations = [];
            this.employeedata = [];
            this.ngOnInit();
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
              data: this.msgLM64
            });
          }
          else {
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
              data: this.msgLM39
            });
          }

        }

      })
    }
  }
  firstcancel() {
    this.addemployee = true;
    this.addempdetails = false;
    this.viewdetails = true;
    this.work = false;
    this.emp = true;
    this.family = false;
    this.familyDetails = [];
    this.Experience = [];
    this.Educations = [];
    this.employeedata = [];
    this.ngOnInit();

  }
  editfamily(i: any) {
    this.familyindex = i;
    this.isfamilyedit = true;
    this.employeefamilyAddForm.controls.familyfirstname.setValue(this.familyDetails[i].firstname);
    this.employeefamilyAddForm.controls.familylastname.setValue(this.familyDetails[i].lastname);
    this.employeefamilyAddForm.controls.familydateofbirth.setValue(new Date(this.familyDetails[i].dateofbirth));
    this.employeefamilyAddForm.controls.familystatus.setValue(this.familyDetails[i].status);
    this.employeefamilyAddForm.controls.familycontact.setValue(this.familyDetails[i].contactnumber);
    this.employeeRelationship.forEach((e: any) => {
      if (e.id == this.familyDetails[i].relationship) {
        this.employeefamilyAddForm.controls.relation.setValue(e);
      }
    })
    this.genderDetails.forEach((e: any) => {
      if (e.id == this.familyDetails[i].gender) {
        this.employeefamilyAddForm.controls.familygender.setValue(e);
      }
    })

  }
  clearfamily() {
    this.employeefamilyAddForm.controls.familyfirstname.reset();
    this.employeefamilyAddForm.controls.familylastname.reset();
    this.employeefamilyAddForm.controls.relation.reset();
    // this.employeefamilyAddForm.controls.familystatus.reset();
    this.employeefamilyAddForm.controls.familycontact.reset();
    this.employeefamilyAddForm.controls.familydateofbirth.reset();
    this.employeefamilyAddForm.controls.familygender.reset();
    this.employeefamilyAddForm.valid = true;
    this.isfamilyedit = false;
  }
  deletefamily(index: any) {
    this.familyDetails.splice(index, 1);
    this.dsFamily = new MatTableDataSource(this.familyDetails);
    this.isfamilyedit = false;

  }
  substractYearsToDate(auxDate: Date, years: number): Date {
    auxDate.setFullYear(auxDate.getFullYear() - years);
    return auxDate;
  }

  getDateFormateForSearch(date: Date): string {
    let year = date.toLocaleDateString('es', { year: 'numeric' });
    let month = date.toLocaleDateString('es', { month: '2-digit' });
    let day = date.toLocaleDateString('es', { day: '2-digit' });
    return `${year}-${month}-${day}`;
  }
  getBloodgroups() {
    this.LMS.getMastertable('bloodgroupmaster', 'Active', 1, 10, 'keerthi_hospitals').subscribe(data => {
      this.bloodGroupdetails = data.data;
    })
  }
  getGender() {
    this.LMS.getMastertable('gendermaster', null, 1, 40, 'keerthi_hospitals').subscribe(data => {
      this.genderDetails = data.data;
    })
  }
  getWorkLocation() {
    this.LMS.getactiveWorkLocation({ id: null, companyName: 'keerthi_hospitals' }).subscribe((result) => {
      this.worklocationDetails = result.data;
    })

  }

  getReportingManagers(id: any) {
    let data = {
      id: id
    }
    this.LMS.getReportingManagers(data).subscribe(data => {
      this.availablereportingmanagers = data[0]
    })

  }

  getMaritalStatusMaster() {
    this.LMS.getMastertable('maritalstatusmaster', null, 1, 10, 'keerthi_hospitals').subscribe(data => {
      this.maritalStatusDetails = data.data;

    })
  }
  getRelationshipMaster() {
    this.LMS.getMastertable('relationshipmaster', 'Active', 1, 30, 'keerthi_hospitals').subscribe(data => {
      this.employeeRelationship = data.data;
    })
  }
  getEmploymentTypeMaster() {
    this.LMS.getMastertable('employmenttypemaster', null, 1, 1000, 'keerthi_hospitals').subscribe(data => {
      this.EmploymentTypeDetails = data.data;
    })
  }
  getDesignationsMaster() {
    this.LMS.getMastertable('designationsmaster', 'Active', 1, 1000, 'keerthi_hospitals').subscribe(data => {
      this.availableDesignations = data.data;
    })
  }
  getDepartmentsMaster() {
    this.LMS.getMastertable('departmentsmaster', 'Active', 1, 1000, 'keerthi_hospitals').subscribe(data => {
      this.availableDepartments = data.data;
    })
  }
  getCountry() {
    this.LMS.getCountry('countrymaster', null, 1, 10, 'keerthi_hospitals').subscribe((results) => {
      this.CountryDetails = results.data;
      this.permanentCountryDetails = results.data;

    })
  }
  getRoles() {

    this.LMS.getMastertable('rolesmaster', null, 1, 1000, 'keerthi_hospitals').subscribe(data => {
      let roledata = data.data;
      this.availableRole = [];
      for (let i = 0; i < roledata.length; i++) {

        if (roledata[i].isEditable == 0) {

          this.availableRole.push(roledata[i])

        }



      }

    })

  }
  getShifts() {
    this.LMS.getMastertable('shiftsmaster', 'Active', 1, 1000, 'keerthi_hospitals').subscribe(data => {
      this.availableShifts = data.data;
    })
  }

  firstNext() {
    if (this.employeeAddForm.valid) {
      this.family = true;
      this.emp = false;

    }

  }
  secondnext() {
    this.family = false;
    this.work = true;
    this.emp = false;
  }
  firstprev() {
    this.emp = true;
    this.family = false;
    this.work = false;
  }
  secondprev() {
    this.work = false;
    this.emp = false;
    this.family = true;
  }
  close() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/Admin/Employee"]));
    // this.addemployee = true;
    // this.addempdetails = false;
    // this.viewdetails = true;
    // this.work = false;
    // this.emp = true;
    // this.family = false;
    // this.familyDetails = [];
    // this.Experience = [];
    // this.Educations = [];
    // this.employeedata = [];
    // this.ngOnInit();
  }
  getErrorMessages(errorCode: any) {

    this.LMS.getErrorMessages(errorCode, 1, 100).subscribe((result) => {

      if (result.status && errorCode == 'LM1') {
        this.msgLM1 = result.data[0].errormessage
      }
      else if (result.status && errorCode == 'LM2') {
        this.msgLM2 = result.data[0].errormessage
      }
      else if (result.status && errorCode == 'LM3') {
        this.msgLM3 = result.data[0].errormessage
      }
      else if (result.status && errorCode == 'LM54') {
        this.msgLM54 = result.data[0].errormessage
      }
      else if (result.status && errorCode == 'LM38') {
        this.msgLM38 = result.data[0].errormessage
      }
      else if (result.status && errorCode == 'LM39') {
        this.msgLM39 = result.data[0].errormessage
      }
      else if (result.status && errorCode == 'LM63') {
        this.msgLM63 = result.data[0].errormessage
      }
      else if (result.status && errorCode == 'LM64') {
        this.msgLM64 = result.data[0].errormessage
      }
    })
  }
  countryChange(Id: any) {
    this.permanentStateDetails = [];
    this.LMS.getStatesc(Id).subscribe((data) => {
      this.permanentStateDetails = data[0]
    })
  }

  stateChange(Id: any) {

    this.permanentCityDetails = [];
    this.LMS.getCities(Id).subscribe((data) => {
      this.permanentCityDetails = data[0]
    })
  }
  // sameAsAddress(event: MatCheckboxChange,checked:any){

  // }
  getPageSizes(): number[] {
    if (this.dataSource.data.length > 20) {
      return [5, 10, 20, this.dataSource.data.length];
    }
    else {

      return [5, 10, 20];
    }
  }
  employeeview(data: any) {
    this.isviewemployee = true;
    this.add = false;
    this.addempdetails = true;
    this.viewdetails = false;
    this.editemployee = false;
    this.addemployee = false;
    this.LM.getEmployeeMaster(data).subscribe((result) => {
      this.employeedata = JSON.parse(result.data[0][0].json)[0];
      let a = this.employeedata;
      if (a.country == a.pcountry && a.state == a.pstate && a.city == a.pcity && a.address == a.paddress && a.pincode == a.ppincode) {
        this.employeeAddForm.controls.checked.setValue(true)
      }
      this.employeeAddForm.controls.checked.disable()

      this.employeeAddForm.controls.aadharnumber.setValue(this.employeedata.aadharnumber);
      this.employeeAddForm.controls.address.setValue(this.employeedata.address);
      this.employeefamilyAddForm.controls.bankaccountnumber.setValue(this.employeedata.bankaccountnumber);
      this.employeefamilyAddForm.controls.bankname.setValue(this.employeedata.bankname);
      this.employeeAddForm.controls.bloodgroup.setValue(this.employeedata.bloodgroup);
      this.employeefamilyAddForm.controls.branchname.setValue(this.employeedata.branchname);
      this.employeeAddForm.controls.contactnumber.setValue(this.employeedata.contactnumber);
      this.employeeAddForm.controls.dateofbirth.setValue(new Date(this.employeedata.dateofbirth));
      this.employeeworkAddForm.controls.dateofjoin.setValue(new Date(this.employeedata.dateofjoin));
      this.employeeworkAddForm.controls.designation.setValue(this.employeedata.designation);
      this.employeeworkAddForm.controls.empid.setValue(this.employeedata.empid);
      this.employeeworkAddForm.controls.usertype.setValue(this.employeedata.usertype);
      this.employeeAddForm.controls.esi.setValue(this.employeedata.esi);
      this.employeeAddForm.controls.firstname.setValue(this.employeedata.firstname);
      this.employeeAddForm.controls.gender.setValue(this.employeedata.gender);
      this.employeefamilyAddForm.controls.ifsccode.setValue(this.employeedata.ifsccode);
      this.employeeAddForm.controls.lastname.setValue(this.employeedata.lastname);
      this.employeeAddForm.controls.maritalstatus.setValue(this.employeedata.maritalstatus);
      this.employeeAddForm.controls.middlename.setValue(this.employeedata.middlename);
      this.employeefamilyAddForm.controls.nameasperbankaccount.setValue(this.employeedata.nameasperbankaccount);
      this.employeeworkAddForm.controls.officeemail.setValue(this.employeedata.officeemail);
      this.employeeAddForm.controls.paddress.setValue(this.employeedata.paddress);
      this.employeeAddForm.controls.pan.setValue(this.employeedata.pan);
      this.employeeAddForm.controls.passport.setValue(this.employeedata.passport);
      this.employeeAddForm.controls.personalemail.setValue(this.employeedata.personalemail);
      this.employeeAddForm.controls.pfaccountnumber.setValue(this.employeedata.pfaccountnumber);
      this.employeeAddForm.controls.pincode.setValue(this.employeedata.pincode);
      this.employeeAddForm.controls.ppincode.setValue(this.employeedata.ppincode);
      this.employeeworkAddForm.controls.shift.setValue(this.employeedata.shift);
      this.employeeworkAddForm.controls.status.setValue(this.employeedata.status);
      this.employeeAddForm.controls.uanumber.setValue(this.employeedata.uanumber);
      this.employeeworkAddForm.controls.employmenttype.setValue(this.employeedata.employmenttype);
      this.employeeworkAddForm.controls.usertype.setValue(this.employeedata.usertype);
      this.employeeworkAddForm.controls.companylocation.setValue(this.employeedata.worklocation);
      this.employeeworkAddForm.controls.reportingmanager.setValue(this.employeedata.reportingmanager);
      this.employeeAddForm.controls.country.setValue(this.employeedata.country);
      this.employeeAddForm.controls.pcountry.setValue(this.employeedata.pcountry);
      this.employeeAddForm.controls.state.setValue(this.employeedata.state);
      this.employeeAddForm.controls.pstate.setValue(this.employeedata.pstate);
      this.employeeAddForm.controls.city.setValue(this.employeedata.city);
      this.employeeAddForm.controls.pcity.setValue(this.employeedata.pcity);
      this.employeeworkAddForm.controls.department.setValue(this.employeedata.department);
      this.employeeAddForm.controls.aadharnumber.disable();
      this.employeeAddForm.controls.address.disable();
      this.employeefamilyAddForm.controls.bankaccountnumber.disable();
      this.employeefamilyAddForm.controls.bankname.disable();
      this.employeeAddForm.controls.bloodgroup.disable();
      this.employeefamilyAddForm.controls.branchname.disable();
      this.employeeAddForm.controls.contactnumber.disable();
      this.employeeAddForm.controls.dateofbirth.disable();
      this.employeeworkAddForm.controls.dateofjoin.disable();
      this.employeeworkAddForm.controls.designation.disable();
      this.employeeworkAddForm.controls.empid.disable();
      this.employeeworkAddForm.controls.usertype.disable();
      this.employeeAddForm.controls.esi.disable();
      this.employeeAddForm.controls.firstname.disable();
      this.employeeAddForm.controls.gender.disable();
      this.employeefamilyAddForm.controls.ifsccode.disable();
      this.employeeAddForm.controls.lastname.disable();
      this.employeeAddForm.controls.maritalstatus.disable();
      this.employeeAddForm.controls.middlename.disable();
      this.employeefamilyAddForm.controls.nameasperbankaccount.disable();
      this.employeeworkAddForm.controls.officeemail.disable();
      this.employeeAddForm.controls.paddress.disable();
      this.employeeAddForm.controls.pan.disable();
      this.employeeAddForm.controls.passport.disable();
      this.employeeAddForm.controls.personalemail.disable();
      this.employeeAddForm.controls.pfaccountnumber.disable();
      this.employeeAddForm.controls.pincode.disable();
      this.employeeAddForm.controls.ppincode.disable();
      this.employeeworkAddForm.controls.shift.disable();
      this.employeeworkAddForm.controls.status.disable();
      this.employeeAddForm.controls.uanumber.disable();
      this.employeeworkAddForm.controls.employmenttype.disable();
      this.employeeworkAddForm.controls.usertype.disable();
      this.employeeworkAddForm.controls.companylocation.disable();
      this.employeeworkAddForm.controls.reportingmanager.disable();
      this.employeeAddForm.controls.country.disable();
      this.employeeAddForm.controls.pcountry.disable();
      this.employeeAddForm.controls.state.disable();
      this.employeeAddForm.controls.pstate.disable();
      this.employeeAddForm.controls.city.disable();
      this.employeeAddForm.controls.pcity.disable();
      this.employeeworkAddForm.controls.department.disable();
      let x = JSON.parse((this.employeedata.education))
      let y = JSON.parse((this.employeedata.experience))
      let familydata = JSON.parse((this.employeedata.relations))
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
            contactnumber: (familydata[i].contactnumber == "null") ? '':familydata[i].contactnumber,
            status: familydata[i].status,
            relationship: relationship,
            relationshipname: relationshipname,
            dateofbirth: familydata[i].dateofbirth != "null" ? this.pipe.transform(familydata[i].dateofbirth, 'yyyy-MM-dd') : '',
          });
        }
        this.dsFamily = new MatTableDataSource(this.familyDetails);
      }

      let education = JSON.parse(this.employeedata.education)
      if (education != null) {
        education.forEach((e: any) => {
          this.edu().push(this.formBuilder.group({
            course: {value: e.course, disabled: true},
            institutename: {value: e.institutename, disabled: true},
            efromdate: {value: new Date(e.fromdate), disabled: true},
            etodate: {value: new Date(e.todate), disabled: true}

          }));
        });
      }
      let experience = JSON.parse(this.employeedata.experience)
      if (experience != null) {
        experience.forEach((e: any) => {
          this.exp().push(this.formBuilder.group({
            companyname: {value: e.companyname, disabled: true},
            wfromdate: {value: new Date(e.fromdate), disabled: true},
            wtodate: {value: new Date(e.todate), disabled: true},
          }));
        });
      }



    });


  }


  dateChange(type: string, event: MatDatepickerInputEvent<Date>,empIndex: any) {
    if(type === 'eduFromDate'){
      this.eduDisableToDates[empIndex] = event.value;
      console.log(this.eduDisableToDates);
    }
    else if(type === 'eduToDate') {
      this.eduDisableFromDates[empIndex] = event.value;
      console.log(this.eduDisableFromDates);
    }
    else if(type === 'workFromDate'){
      this.workDisableToDates[empIndex] = event.value;
    }
    else if(type === 'workToDate') {
      this.workDisableFromDates[empIndex] = event.value;
    }
  }
}
