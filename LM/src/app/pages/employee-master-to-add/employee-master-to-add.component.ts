import { Component, OnInit,ViewChild} from '@angular/core';
import { changePassword } from 'src/app/models/changepassword';
import { FormGroup,FormControl,Validators, FormBuilder, AbstractControl} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PopupComponent,PopupConfig } from '../popup/popup.component';
import { MatDialog } from '@angular/material/dialog'; 
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeMasterService } from 'src/app/services/employee-master-service';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import {MatTableModule} from '@angular/material/table';
@Component({
  selector: 'app-employee-master-to-add',
  templateUrl: './employee-master-to-add.component.html',
  styleUrls: ['./employee-master-to-add.component.scss']
})
export class EmployeeMasterToAddComponent implements OnInit {
  employeeAddForm!: FormGroup;
  isview:boolean=true;
  maxBirthDate:any;
  dateofbirth:any;
  efromdate:any;
  etodate:any;
  wfromdate:any;
  wtodate:any;
  states:any;
  bloodGroupdetails:any[]=[];
  genderDetails:any[]=[];
  employeeRelationship:any=[];
  familyDetails:any=[];
  EmploymentTypeDetails:any=[];
  availableDesignations:any = [];
  availableDepartments:any = [];
  availableRole:any=[];
  availableShifts:any=[];
  locationDetails:any = [];
  employeeInformation:any = [];
  worklocationDetails:any[]=[];
  availablereportingmanagers:any[]=[];
  maritalStatusDetails:any[]=[];
  permanentStateDetails:any=[];
  permanentCityDetails:any=[];
  permanentCountryDetails:any=[];
  stateDetails:any=[];
  CountryDetails:any=[];
  cityDetails:any=[];
  relations:any=[];
  familyindex:any;
  minDate=new Date('1950/01/01'); 
  maxDate = new Date();
  work:boolean=false;
  family:boolean=false;
  emp:boolean=true;
  isfamilyedit:boolean=false;
  displayedColumns: string[] = ['position','name','relation','gender','contact','status','action'];
  dataSource: MatTableDataSource<any>;

  

  constructor(private formBuilder: FormBuilder,private LMS:CompanySettingService,private LM:EmployeeMasterService,private dialog: MatDialog,private router: Router) {
    this.dataSource = new MatTableDataSource(this.familyDetails);
   }

  ngOnInit(): void {
    let auxDate = this.substractYearsToDate(new Date(), 18);
    this.maxBirthDate = this.getDateFormateForSearch(auxDate);
    this.getBloodgroups();
    this.getGender();
    this.getCountry();
    // this.getstatedetails();
    // this.getcityDetails()
    this.getShifts();
    this.getRoles();
    this.getMaritalStatusMaster();
    this.getRelationshipMaster();
    this.getEmploymentTypeMaster();
    this.getDesignationsMaster();
    this.getDepartmentsMaster();
    // this.getEmployeeDetails(null,null);
    this.getWorkLocation();
    // this.getReportingManagers();
    this.employeeAddForm=this.formBuilder.group(
      {
        firstname:["rakesh",],
        lastname: ["thallapelly",],
        middlename: [""],
        contactnumber:[""],
        personalemail:[""],
        dateofbitrh:[""],
        bloodgroup:[""],
        gender:[""],
        emergencycontact:[""],
        officeemail: [""],
        dateofbirth: [""],
        maritalstatus: [""],
        usertype: [""],
        designation: [""],
        department: [""],
        employmenttype: [""],
        dateofjoin: [""],
        companylocation: [""],
        reportingmanager: [""],
        emergencycontactnumber: [""],
        emergencycontactrelation: [""],
        emergencycontactname: [""],
        city: [""],
        state: [""],
        pincode: [""],
        country: [""],
        paddress: [""],
        address:[""],
        pcity: [""],
        pstate: [""],
        ppincode: [""],
        pcountry: [""],
        aadharnumber: [""],
        passport: [""],
        bankname: [""],
        ifsccode: [""],
        nameasperbankaccount: [""],
        branchname: [""],
        bankaccountnumber: [""],
        uanumber: [""],
        pfaccountnumber: [""],
        pan: [""],
        status: [""],
        esi: [""],
        shift: [""],
        relations: [""],
        education: [""],
        experience: [""],
        familyfirstname:[""],
        familylastname:[""],
        familydateofbirth:[""],
        familystatus:[""],
        familycontact:[""],
        familygender:[""],
        relation:[""],
        efromdate:[""],
        etodate:[""],
        wfromdate:[""],
        wtodate:[""],
        course:[""],
        institutename:[""],
        companyname:[""],
       

      },
       
      );
     
      this.employeeAddForm.get('country')?.valueChanges.subscribe(selectedValue => {
        this.stateDetails= [];
        this.LMS.getStatesc(selectedValue).subscribe((data)=>{
          this.stateDetails=data[0]
        })
      
         
      })
      this.employeeAddForm.get('state')?.valueChanges.subscribe(selectedValue => {
        this.cityDetails=[];
        this.LMS.getCities(selectedValue).subscribe((data)=>{
          this.cityDetails=data[0]
      // this.availablecities=data
        })
      
         
      })
      this.employeeAddForm.get('pcountry')?.valueChanges.subscribe(selectedValue => {
        this.permanentStateDetails=[];
        this.LMS.getStatesc(selectedValue).subscribe((data)=>{
          this.permanentStateDetails=data[0]
        })
      
         
      })
      this.employeeAddForm.get('pstate')?.valueChanges.subscribe(selectedValue => {
        this.permanentCityDetails=[];
        this.LMS.getCities(selectedValue).subscribe((data)=>{
          this.permanentCityDetails=data[0]
        })
        
      })
      this.employeeAddForm.get('department')?.valueChanges.subscribe(selectedValue => { 
        this.availablereportingmanagers=[]
        let data = {
          id:selectedValue
        }
        this.LMS.getReportingManagers(data).subscribe(data=>{
          this.availablereportingmanagers=data[0]
          console.log('availablereportingmanagers',this.availablereportingmanagers)
        })
      })
  }
  
  addfamily(){
    if(this.isfamilyedit){
        this.familyDetails[this.familyindex].firstname =this.employeeAddForm.controls.familyfirstname.value;
        this.familyDetails[this.familyindex].lastname = this.employeeAddForm.controls.familylastname.value;
        this.familyDetails[this.familyindex].gender = this.employeeAddForm.controls.familygender.value;
        this.familyDetails[this.familyindex].contactnumber =  this.employeeAddForm.controls.familycontact.value;
        this.familyDetails[this.familyindex].status = "Alive";
        this.familyDetails[this.familyindex].relationship = this.employeeAddForm.controls.relation.value;
        this.familyDetails[this.familyindex].dateofbirth =this.employeeAddForm.controls.familydateofbirth.value;
        this.isfamilyedit = false;

    }
    else{
    this.familyDetails.push({
      firstname: this.employeeAddForm.controls.familyfirstname.value,
      lastname: this.employeeAddForm.controls.familylastname.value,
      gender: this.employeeAddForm.controls.familygender.value,
      contactnumber: this.employeeAddForm.controls.familycontact.value,
      status: "Alive",
      relationship: this.employeeAddForm.controls.relation.value,
      dateofbirth: this.employeeAddForm.controls.familydateofbirth.value
    });
    this.dataSource = new MatTableDataSource(this.familyDetails);
    
  }
    console.log("jkj", this.familyDetails)


  
  }
  save(){

    let employeeinformation = {
      firstname:this.employeeAddForm.controls.firstname.value,
      middlename:this.employeeAddForm.controls.middlename.value,
      lastname:this.employeeAddForm.controls.lastname.value,
      personalemail:this.employeeAddForm.controls.personalemail.value,
      officeemail:this.employeeAddForm.controls.officeemail.value,
      dateofbirth: this.employeeAddForm.controls.dateofbirth.value,
      gender:this.employeeAddForm.controls.gender.value,
      maritalstatus:this.employeeAddForm.controls.maritalstatus.value,
      usertype:this.employeeAddForm.controls.usertype.value,
      designation:this.employeeAddForm.controls.designation.value,
      department: this.employeeAddForm.controls.department.value,
      employmenttype:this.employeeAddForm.controls.employmenttype.value,
      dateofjoin: this.employeeAddForm.controls.dateofjoin.value,
      companylocation:this.employeeAddForm.controls.companylocation.value,
      reportingmanager:this.employeeAddForm.controls.reportingmanager.value,
      bloodgroup:this.employeeAddForm.controls.bloodgroup.value,
      contactnumber:this.employeeAddForm.controls.contactnumber.value,
      emergencycontactnumber:this.employeeAddForm.controls.emergencycontactnumber.value,
      emergencycontactrelation:this.employeeAddForm.controls.emergencycontactrelation.value,
      emergencycontactname:this.employeeAddForm.controls.emergencycontactname.value,
      address:this.employeeAddForm.controls.address.value,
      city:this.employeeAddForm.controls.city.value,
      state:this.employeeAddForm.controls.state.value,
      pincode:this.employeeAddForm.controls.pincode.value,
      country:this.employeeAddForm.controls.country.value,
      paddress:this.employeeAddForm.controls.paddress.value,
      pcity:this.employeeAddForm.controls.pcity.value,
      pstate:this.employeeAddForm.controls.pstate.value,
      ppincode:this.employeeAddForm.controls.ppincode.value,
      pcountry:this.employeeAddForm.controls.pcountry.value,
      aadharnumber:this.employeeAddForm.controls.aadharnumber.value,
      passport:this.employeeAddForm.controls.passport.value,
      bankname:this.employeeAddForm.controls.bankname.value,
      ifsccode:this.employeeAddForm.controls.ifsccode.value,
      nameasperbankaccount:this.employeeAddForm.controls.nameasperbankaccount.value,
      branchname:this.employeeAddForm.controls.branchname.value,
      bankaccountnumber:this.employeeAddForm.controls.bankaccountnumber.value,
      uanumber:this.employeeAddForm.controls.uanumber.value,
      pfaccountnumber:this.employeeAddForm.controls.pfaccountnumber.value,
      pan:this.employeeAddForm.controls.pan.value,
      status: 'Active',
      esi:this.employeeAddForm.controls.esi.value,
      shift:this.employeeAddForm.controls.shift.value,
      relations:this.familyDetails,
      education: {
        course:this.employeeAddForm.controls.course.value,
        institutename:this.employeeAddForm.controls.institutename.value,
        fromdate:this.employeeAddForm.controls.efromdate.value,
        todate:this.employeeAddForm.controls.etodate.value,
      },
      experience:{
        companyname:this.employeeAddForm.controls.companyname.value,
        fromdate:this.employeeAddForm.controls.wfromdate.value,
        todate:this.employeeAddForm.controls.wtodate.value,

      },
      // relations:this.employeeAddForm.controls.relations,
      // education:this.employeeAddForm.controls.education,
      // experience:this.employeeAddForm.controls.experience
    }
    console.log("data",employeeinformation)
  }
  editfamily(i:any){
    console.log("edit",i)
    this.familyindex = i;
    console.log("data",this.familyDetails[i])
    this.isfamilyedit = true;
    this.employeeAddForm.controls.familyfirstname = this.familyDetails[i].firstname;
    // this.employeeAddForm.controls.familyfirstname = ;

  }
  deletefamily(index:any){
    this.familyDetails.splice(index,1);
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
  getBloodgroups(){
    this.LMS.getMastertable('bloodgroupmaster','Active',1,10,'boon_client').subscribe(data=>{
      this.bloodGroupdetails = data.data;
    })
  }
  getGender(){
    this.LMS.getMastertable('gendermaster',null,1,40,'boon_client').subscribe(data=>{
      this.genderDetails = data.data;
    })
  }
  getWorkLocation(){
    this.LMS.getactiveWorkLocation({id:null,companyName:'boon_client'}).subscribe((result)=>{
      this.worklocationDetails=result.data;
      console.log('availablereportingmanagers',this.worklocationDetails)
    })

  }

  getReportingManagers(id:any){
    console.log("dept",id)
    let data = {
      id:id
    }
    this.LMS.getReportingManagers(data).subscribe(data=>{
      this.availablereportingmanagers=data[0]
      console.log('availablereportingmanagers',this.availablereportingmanagers)
    })

  }
 
  getMaritalStatusMaster(){
    this.LMS.getMastertable('maritalstatusmaster',null,1,10,'boon_client').subscribe(data=>{
      this.maritalStatusDetails = data.data;
      
    })
  }
  getRelationshipMaster(){
    this.LMS.getMastertable('relationshipmaster','Active',1,30,'boon_client').subscribe(data=>{
      this.employeeRelationship = data.data;
      console.log("hjjh",data.data )
    })
  }
  getEmploymentTypeMaster(){
    this.LMS.getMastertable('employmenttypemaster',null,1,1000,'boon_client').subscribe(data=>{
      this.EmploymentTypeDetails = data.data;
      console.log("hjjh",this.EmploymentTypeDetails )
    })
  }
  getDesignationsMaster(){
    this.LMS.getMastertable('designationsmaster','Active',1,1000,'boon_client').subscribe(data=>{
      this.availableDesignations = data.data;
    })
  }
  getDepartmentsMaster(){
    this.LMS.getMastertable('departmentsmaster','Active',1,1000,'boon_client').subscribe(data=>{
      this.availableDepartments = data.data;
    })
  }
  getCountry(){
    this.LMS.getCountry('countrymaster',null,1,10,'boon_client').subscribe((results)=>{
      this.CountryDetails=results.data;
      this.permanentCountryDetails=results.data;

    })
  }
  getRoles(){
    this.LMS.getMastertable('rolesmaster',null,1,1000,'boon_client').subscribe(data=>{
      let roledata = data.data;
      console.log(roledata)
      console.log(roledata.length)
      console.log(roledata[0].isEditable)
      for(let i=0;i<roledata.length;i++){
        if(roledata[i].isEditable == 0){
          console.log("ggg")
          this.availableRole.push(roledata[i])
        }

      }
      console.log("Roles,",this.availableRole)
    })
  }
  getShifts(){
    this.LMS.getMastertable('shiftsmaster',1,1,1000,'boon_client').subscribe(data=>{
      this.availableShifts = data.data;
      console.log("shifts", this.availableShifts)
    })
  }

  submit(){
    console.log(this.employeeAddForm.controls.country.value)
  }
  validnumber(pincode:any){
    console.log("hjjh",pincode)
  }
  firstNext(){
    this.family = true;
    this.emp=false;
  }
  secondnext(){
    this.family = false;
    this.work = true;
    this.emp=false;

  }



  
}
