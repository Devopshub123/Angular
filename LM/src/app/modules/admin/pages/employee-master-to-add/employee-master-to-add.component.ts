import { Component, OnInit,ViewChild} from '@angular/core';
import { changePassword } from 'src/app/models/changepassword';
import { FormGroup,FormControl,Validators, FormBuilder,FormArray, AbstractControl} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'; 
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeMasterService } from 'src/app/services/employee-master-service';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import {MatTableModule} from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { OnlyNumberDirective } from 'src/app/custom-directive/only-number.directive';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PopupComponent, PopupConfig } from '../../../../pages/popup/popup.component';
@Component({
  selector: 'app-employee-master-to-add',
  templateUrl: './employee-master-to-add.component.html',
  styleUrls: ['./employee-master-to-add.component.scss']
})
export class EmployeeMasterToAddComponent implements OnInit {
  employeeAddForm!: FormGroup;
  employeefamilyAddForm! :FormGroup;
  employeeworkAddForm! :FormGroup;
  workForm!:FormGroup;
  educationForm!:FormGroup;
  isview:boolean=true;
  maxBirthDate:any;
  dateofbirth:any;
  efromdate:any;
  etodate:any;
  wfromdate:any;
  wtodate:any;
  states:any;
  pipe = new DatePipe('en-US');
  bloodGroupdetails:any[]=[];
  genderDetails:any[]=[];
  employeeRelationship:any=[];
  familyDetails:any=[];
  Experience:any=[];
  Educations:any=[];
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
  minwtodate:any;
  minetodate:any;
  mindatofjoin:any;
  work:boolean=false;
  family:boolean=false;
  emp:boolean=true;
  isfamilyedit:boolean=false;
  selectAll:boolean=false;
  editemployee:boolean=false;
  addemployee:boolean=true;
  displayedColumns: string[] = ['position','name','relation','gender','contact','status','action'];
  dataSource: MatTableDataSource<any>=<any>[];
  dsFamily: MatTableDataSource<any>=<any>[];
  employeedata:any=[];
  empdisplayedColumns: string[] = ['employeeid','employeename','status','Action'];
  employeedetails:any;
  page = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [10, 25, 50, 'All'];
  addempdetails:boolean=false;
  viewdetails:boolean =true;
  msgLM1:any='';
  msgLM2:any='';
  msgLM3:any='';
  msgLM54:any='';
  msgLM38:any='';
  msgLM39:any='';
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
 

  
  empdataa:any = [];
  constructor(private formBuilder: FormBuilder,private LMS:CompanySettingService,private LM:EmployeeMasterService,private dialog: MatDialog,private router: Router) {
    // this.dataSource = new MatTableDataSource(this.familyDetails);
    // this.employeeAddForm=this.formBuilder.group({
    //   works: this.formBuilder.array([]) ,
    // })
   }
  //  works(): FormArray {
  //   return this.employeeAddForm.get("works") as FormArray
  // }
  // newWork(): FormGroup {
  //   return this.formBuilder.group({
  //     compamyname: '',
  //     fromdate: '',
  //     todate:''
      
  //   })
  // }
  // addWork() {
  //   console.log("Adding a employee");
  //   this.works().push(this.newWork());
  // }
 
 
  // removeWork(workIndex:number) {
  //   this.works().removeAt(workIndex);
  // }
  // this.empdataa = {
  //   empid: 'st40',
  //   firstname: 'rakesh',
  //   id: 200,
  //   lastname: 'thallapelly',
  //   middlename: '',
  //   status: 'Active',
  //   total: 123
  // };
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
    this.getEmployeeDetails(null,null);
    this.getErrorMessages('LM1');
    this.getErrorMessages('LM2');
    this.getErrorMessages('LM3');
    this.getErrorMessages('LM54');
    this.getErrorMessages('LM38');
    this.getErrorMessages('LM39');
    // this.editemployee();
    // this.getReportingManagers();
    this.employeeAddForm=this.formBuilder.group(
      {
        firstname:["",Validators.required],
        lastname: ["",Validators.required],
        middlename: [""],
        contactnumber:["",Validators.required],
        personalemail:["",[Validators.required,Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        bloodgroup:[""],
        gender:["",Validators.required],
        emergencycontact:[""],
        dateofbirth: ["",Validators.required],
        city: ["",Validators.required],
        state: ["",Validators.required],
        pincode: ["",Validators.required],
        country: ["",Validators.required],
        paddress: [""],
        address:["",Validators.required],
        maritalstatus: ["",Validators.required],
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

      }) ,
      this.employeefamilyAddForm=this.formBuilder.group(
        {
          familyfirstname:["",Validators.required],
          familylastname:["",Validators.required],
          familydateofbirth:[""],
          familystatus:["",Validators.required],
          familycontact:[""],
          familygender:["",Validators.required],
          relation:["",Validators.required],
          bankname: [""],
          ifsccode: [""],
          nameasperbankaccount: [""],
          branchname: [""],
          bankaccountnumber: [""],})
      this.employeeworkAddForm=this.formBuilder.group(
        {
        officeemail: ["",[Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')]],
        maritalstatus: ["",Validators.required],
        usertype: ["",Validators.required],
        designation: ["",Validators.required],
        department: ["",Validators.required],
        employmenttype: ["",Validators.required],
        dateofjoin: ["",Validators.required],
        companylocation: ["",Validators.required],
        reportingmanager: ["",Validators.required],
        emergencycontactnumber: [""],
        emergencycontactrelation: [""],
        emergencycontactname: [""],
        status: [""],
        shift: ["",Validators.required],
        relations: [""],
        education: [""],
        experience: [""],
        
        efromdate:[""],
        etodate:[""],
        wfromdate:[""],
        wtodate:[""],
        course:[""],
        institutename:[""],
        companyname:[""],
        empid:[""],
        edu: this.formBuilder.array([]) ,
       

      });
     
      this.employeeAddForm.get('country')?.valueChanges.subscribe(selectedValue => {
        this.stateDetails= [];
        this.LMS.getStatesc(selectedValue).subscribe((data)=>{
          this.stateDetails=data[0];
          if(this.employeedata != null)
          {
            this.employeeAddForm.controls.state.setValue(this.employeedata.state);

          }
        })
      
         
      })
      this.employeeAddForm.get('state')?.valueChanges.subscribe(selectedValue => {
        this.cityDetails=[];
        this.LMS.getCities(selectedValue).subscribe((data)=>{
          this.cityDetails=data[0]
          if(this.employeedata != null)
          {
            this.employeeAddForm.controls.city.setValue(this.employeedata.city);

          }
      // this.availablecities=data
        })
      })
      this.employeeAddForm.get('pcountry')?.valueChanges.subscribe(selectedValue => {
        this.permanentStateDetails=[];
        this.LMS.getStatesc(selectedValue).subscribe((data)=>{
          this.permanentStateDetails=data[0]
          if(this.employeedata != null)
          {
            this.employeeAddForm.controls.pstate.setValue(this.employeedata.pstate);

          }
        })
      
         
      })
      this.employeeAddForm.get('pstate')?.valueChanges.subscribe(selectedValue => {
        this.permanentCityDetails=[];
        this.LMS.getCities(selectedValue).subscribe((data)=>{
          this.permanentCityDetails=data[0]
          if(this.employeedata != null)
          {
            this.employeeAddForm.controls.pcity.setValue(this.employeedata.pcity);

          }
        })
        
      })
      this.employeeworkAddForm.get('wfromdate')?.valueChanges.subscribe(selectedValue => {
        
        this.minwtodate = selectedValue;
      })
      this.employeeAddForm.get('dateofbirth')?.valueChanges.subscribe(selectedValue => {
        console.log(selectedValue)
        this.dateofjonupdate(selectedValue)
        
        
      })
      
      this.employeeworkAddForm.get('efromdate')?.valueChanges.subscribe(selectedValue => {
        
        this.minetodate = selectedValue;
      })
      this.employeeworkAddForm.get('department')?.valueChanges.subscribe(selectedValue => { 
        this.availablereportingmanagers=[]
        let data = {
          id:selectedValue
        }
        this.LMS.getReportingManagers(data).subscribe(data=>{
          this.availablereportingmanagers=data[0]
          console.log('availablereportingmanagers',this.availablereportingmanagers)
          
          if(this.employeedata != null)
          {
            this.employeeworkAddForm.controls.reportingmanager.setValue(this.employeedata.reportingmanager);

          }
        })
      })
  }
  dateofjonupdate(data:any){
    this.mindatofjoin = new Date()
    this.mindatofjoin.setFullYear(data.getFullYear() + 18);
  }
  applyFilter(event: Event) {
    console.log("hjh",event)
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  edu(): FormArray {
    return this.employeeAddForm.get("edu") as FormArray
  }
 
 
  newEmployee(): FormGroup {
    return this.formBuilder.group({
      course: '',
      institutename: '',
      efromdate:'',
      etodate:''
      
    })
  }
 
 
  // addeducation() {
  //   console.log("Adding a employee");
  //   this.edu().push(this.newEmployee());
  // }
 
 
  // removeeducation(empIndex:number) {
  //   this.edu().removeAt(empIndex);
  // }
  removeeducation(){}
  addexperience(){
    this.Experience.push({
      companyname:this.employeeworkAddForm.controls.companyname.value,
      skills:'test',
      fromdate:this.pipe.transform(this.employeeAddForm.controls.wfromdate.value, 'yyyy-MM-dd'),
      todate:this.pipe.transform(this.employeeAddForm.controls.wtomdate.value, 'yyyy-MM-dd')
    });
  }
  
  addeducation(){
    this.Educations.push({
      course:this.employeeworkAddForm.controls.course.value,
      institutename:this.employeeAddForm.controls.institutename.value,
      fromdate:this.pipe.transform(this.employeeworkAddForm.controls.efromdate.value, 'yyyy-MM-dd'),
      todate:this.pipe.transform(this.employeeworkAddForm.controls.etomdate.value, 'yyyy-MM-dd')
    });
  }
 
  addemp(){
    this.addempdetails= true;
    this.viewdetails = false;
    this.editemployee = false;
  }
  getEmployeeDetails(employeeId:any,employeeName:any)
  {

    var search = {
      employeeId:employeeId,
      employeeName:employeeName,
      page:this.page,
      tableSize:1000
    };
  
    this.LM.getEmployeeDetails(search).subscribe(result=>{
      
      this.employeedetails = result.data[0];
   
      this.dataSource = new MatTableDataSource(this.employeedetails);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }
  // employeeview(data:any){
  //   this.addempdetails= true;
  //   this.viewdetails = false;
  //   this.isview=true;
  //   this.LM.getEmployeeMaster(data).subscribe((result)=>{
  //     this.employeedata = JSON.parse(result.data[0][0].json)[0];
  //     console.log("empfulldata",this.employeedata)
  //     this.employeeAddForm.controls.aadharnumber.setValue(this.employeedata.aadharnumber);
  //     this.employeeAddForm.controls.address.setValue(this.employeedata.address);
  //     this.employeeAddForm.controls.bankaccountnumber.setValue(this.employeedata.bankaccountnumber);
  //     this.employeeAddForm.controls.bankname.setValue(this.employeedata.bankname);
  //     this.employeeAddForm.controls.bloodgroup.setValue(this.employeedata.bloodgroup);
  //     this.employeeAddForm.controls.branchname.setValue(this.employeedata.branchname);
  //     this.employeeAddForm.controls.contactnumber.setValue(this.employeedata.contactnumber);
  //     this.employeeAddForm.controls.dateofbirth.setValue(new Date(this.employeedata.dateofbirth));
  //     this.employeeAddForm.controls.dateofjoin.setValue(new Date(this.employeedata.dateofjoin));
  //     this.employeeAddForm.controls.designation.setValue(this.employeedata.designation);
  //     this.employeeAddForm.controls.empid.setValue(this.employeedata.empid);
  //     this.employeeAddForm.controls.employmenttype.setValue(this.employeedata.usertype);
  //     this.employeeAddForm.controls.esi.setValue(this.employeedata.esi);
  //     this.employeeAddForm.controls.firstname.setValue(this.employeedata.firstname);
  //     this.employeeAddForm.controls.gender.setValue(this.employeedata.gender);
  //     this.employeeAddForm.controls.ifsccode.setValue(this.employeedata.ifsccode);
  //     this.employeeAddForm.controls.lastname.setValue(this.employeedata.lastname);
  //     this.employeeAddForm.controls.maritalstatus.setValue(this.employeedata.maritalstatus);
  //     this.employeeAddForm.controls.middlename.setValue(this.employeedata.middlename);
  //     this.employeeAddForm.controls.nameasperbankaccount.setValue(this.employeedata.nameasperbankaccount);
  //     this.employeeAddForm.controls.officeemail.setValue(this.employeedata.officeemail);
  //     this.employeeAddForm.controls.paddress.setValue(this.employeedata.paddress);
  //     this.employeeAddForm.controls.pan.setValue(this.employeedata.pan);
  //     this.employeeAddForm.controls.passport.setValue(this.employeedata.passport);
  //     this.employeeAddForm.controls.personalemail.setValue(this.employeedata.personalemail);
  //     this.employeeAddForm.controls.pfaccountnumber.setValue(this.employeedata.pfaccountnumber);
  //     this.employeeAddForm.controls.pincode.setValue(this.employeedata.pincode);
  //     this.employeeAddForm.controls.ppincode.setValue(this.employeedata.ppincode);
  //     this.employeeAddForm.controls.shift.setValue(this.employeedata.shift);
  //     this.employeeAddForm.controls.status.setValue(this.employeedata.status);
  //     this.employeeAddForm.controls.uanumber.setValue(this.employeedata.uanumber);
  //     this.employeeAddForm.controls.usertype.setValue(this.employeedata.usertype);
  //     this.employeeAddForm.controls.companylocation.setValue(this.employeedata.worklocation);
  //     this.employeeAddForm.controls.reportingmanager.setValue(this.employeedata.reportingmanager);
  //     this.employeeAddForm.controls.country.setValue(this.employeedata.country);
  //     this.employeeAddForm.controls.pcountry.setValue(this.employeedata.pcountry);
  //     this.employeeAddForm.controls.state.setValue(this.employeedata.state);
  //     this.employeeAddForm.controls.pstate.setValue(this.employeedata.pstate);
  //     this.employeeAddForm.controls.city.setValue(this.employeedata.city);
  //     this.employeeAddForm.controls.pcity.setValue(this.employeedata.pcity);
  //     this.employeeAddForm.controls.department.setValue(this.employeedata.department);
  //     let x = JSON.parse((this.employeedata.education))
  //     let y = JSON.parse((this.employeedata.experience))
  //     let z = JSON.parse(JSON.stringify(this.employeedata.relations))
  //     // console.log("education",x,x.length)
  //     // console.log("work",y,y.length)
  //     // console.log("relations",z,z.length)
  //     // this.familyDetails = z;
  //     // for(let i = 0; i<z.length;i++){

  //     // }
  //     // this.dataSource = new MatTableDataSource(this.familyDetails);

  //     this.employeeAddForm.controls.course.setValue(x[0].course);
  //     this.employeeAddForm.controls.institutename.setValue(x[0].institutename);
  //     this.employeeAddForm.controls.efromdate.setValue(new Date(x[0].fromdate));
  //     this.employeeAddForm.controls.etodate.setValue(new Date(x[0].todate));
  //     this.employeeAddForm.controls.companyname.setValue(y[0].companyname);
  //     this.employeeAddForm.controls.wfromdate.setValue(new Date(y[0].fromdate));
  //     this.employeeAddForm.controls.wtodate.setValue(new Date(y[0].todate));


  //     for(let i = 0;i<z.length;i++){
  //       this.familyDetails.push({
  //         firstname: z[i].firstname,
  //         lastname: z[i].lastname,
  //         gender: z[i].gender,
  //         contactnumber: z[i].contactnumber,
  //         status: z[i].status,
  //         relationship: z[i].relationship,
  //         dateofbirth: this.pipe.transform(z[i].dateofbirth, 'yyyy-MM-dd')
  //       });
  //     }
  //     this.dataSource = new MatTableDataSource(this.familyDetails);
      
  //   });
        

  // }
  editEmployee(data:any){
    this.addempdetails= true;
    this.viewdetails = false;
    this.editemployee=true;
    this.addemployee=false;
    this.LM.getEmployeeMaster(data).subscribe((result)=>{
      this.employeedata = JSON.parse(result.data[0][0].json)[0];
      console.log("empfulldata",this.employeedata)
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
      this.employeeworkAddForm.controls.employmenttype.setValue(this.employeedata.usertype);
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
      let x = JSON.parse((this.employeedata.education))
      let y = JSON.parse((this.employeedata.experience))
      let z = JSON.parse((this.employeedata.relations))
      // console.log("education",x,x.length)
      // console.log("work",y,y.length)
      console.log("relations",z)
      for(let i = 0;i<z.length;i++){
        this.familyDetails.push({
          firstname: z[i].firstname,
          lastname: z[i].lastname,
          gender: z[i].gender,
          contactnumber: z[i].contactnumber,
          status: z[i].status,
          relationship: z[i].relationship,
          dateofbirth: this.pipe.transform(z[i].dateofbirth, 'yyyy-MM-dd')
        });
        

      }
      // this.familyDetails = z;
      // for(let i = 0; i<z.length;i++){

      // }
      // this.dataSource = new MatTableDataSource(this.familyDetails);

      this.employeeworkAddForm.controls.course.setValue(x[0].course);
      this.employeeworkAddForm.controls.institutename.setValue(x[0].institutename);
      this.employeeworkAddForm.controls.efromdate.setValue(new Date(x[0].fromdate));
      this.employeeworkAddForm.controls.etodate.setValue(new Date(x[0].todate));
      this.employeeworkAddForm.controls.companyname.setValue(y[0].companyname);
      this.employeeworkAddForm.controls.wfromdate.setValue(new Date(y[0].fromdate));
      this.employeeworkAddForm.controls.wtodate.setValue(new Date(y[0].todate));


  
      console.log("family",this.familyDetails)
      this.dsFamily = new MatTableDataSource(this.familyDetails);
      
    });

  }
 
  addfamily(){
    if(this.isfamilyedit){
        this.familyDetails[this.familyindex].firstname =this.employeefamilyAddForm.controls.familyfirstname.value;
        this.familyDetails[this.familyindex].lastname = this.employeefamilyAddForm.controls.familylastname.value;
        this.familyDetails[this.familyindex].gender = this.employeefamilyAddForm.controls.familygender.value;
        this.familyDetails[this.familyindex].contactnumber =  this.employeefamilyAddForm.controls.familycontact.value;
        this.familyDetails[this.familyindex].status = "Alive";
        this.familyDetails[this.familyindex].relationship = this.employeefamilyAddForm.controls.relation.value;
        this.familyDetails[this.familyindex].dateofbirth = this.pipe.transform(this.employeeAddForm.controls.familydateofbirth.value, 'yyyy-MM-dd');
        this.isfamilyedit = false;
        

    }
    else{
      if(this.employeefamilyAddForm.valid){
        this.familyDetails.push({
          firstname: this.employeefamilyAddForm.controls.familyfirstname.value,
          lastname: this.employeefamilyAddForm.controls.familylastname.value,
          gender: this.employeefamilyAddForm.controls.familygender.value,
          contactnumber: this.employeefamilyAddForm.controls.familycontact.value,
          status: "Alive",
          relationship: this.employeefamilyAddForm.controls.relation.value,
          dateofbirth: this.pipe.transform(this.employeefamilyAddForm.controls.familydateofbirth.value, 'yyyy-MM-dd')
        });
        this.dsFamily = new MatTableDataSource(this.familyDetails);

      }
  }
    console.log("jkj", this.familyDetails)
  
  }

  save(){
    let employeeinformation = {
      firstname:this.employeeAddForm.controls.firstname.value,
      middlename:this.employeeAddForm.controls.middlename.value,
      lastname:this.employeeAddForm.controls.lastname.value,
      personalemail:this.employeeAddForm.controls.personalemail.value,
      officeemail:this.employeeworkAddForm.controls.officeemail.value,
      dateofbirth:this.pipe.transform(this.employeeAddForm.controls.dateofbirth.value, 'yyyy-MM-dd'),
      gender:this.employeeAddForm.controls.gender.value,
      maritalstatus:this.employeeAddForm.controls.maritalstatus.value,
      usertype:this.employeeworkAddForm.controls.usertype.value,
      designation:this.employeeworkAddForm.controls.designation.value,
      department: this.employeeworkAddForm.controls.department.value,
      employmenttype:this.employeeworkAddForm.controls.employmenttype.value,
      dateofjoin: this.pipe.transform(this.employeeworkAddForm.controls.dateofjoin.value, 'yyyy-MM-dd'),
      companylocation:this.employeeworkAddForm.controls.companylocation.value,
      reportingmanager:this.employeeworkAddForm.controls.reportingmanager.value,
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
      bankname:this.employeefamilyAddForm.controls.bankname.value,
      ifsccode:this.employeefamilyAddForm.controls.ifsccode.value,
      nameasperbankaccount:this.employeefamilyAddForm.controls.nameasperbankaccount.value,
      branchname:this.employeefamilyAddForm.controls.branchname.value,
      bankaccountnumber:this.employeeAddForm.controls.bankaccountnumber.value,
      uanumber:this.employeeAddForm.controls.uanumber.value,
      pfaccountnumber:this.employeeAddForm.controls.pfaccountnumber.value,
      pan:this.employeeAddForm.controls.pan.value,
      status: 'Active',
      esi:this.employeeworkAddForm.controls.esi.value,
      shift:this.employeeAddForm.controls.shift.value,
      relations:this.familyDetails,
      education:this.Educations,
      experience:this.Experience
      // education: {
      //   course:this.employeeAddForm.controls.course.value,
      //   institutename:this.employeeAddForm.controls.institutename.value,
      //   fromdate:this.pipe.transform(this.employeeAddForm.controls.efromdate.value,'yyyy-MM'),
      //   todate:this.pipe.transform(this.employeeAddForm.controls.etodate.value,'yyyy-MM'),
      // },
      // experience:{
      //   companyname:this.employeeAddForm.controls.companyname.value,
      //   fromdate:this.pipe.transform(this.employeeAddForm.controls.wfromdate.value,'yyyy-MM-dd'),
      //   todate:this.pipe.transform(this.employeeAddForm.controls.wtodate.value,'yyyy-MM-dd'),

      // },
      // relations:this.employeeAddForm.controls.relations,
      // education:this.employeeAddForm.controls.education,
      // experience:this.employeeAddForm.controls.experience
    }
    this.LM.setEmployeeMaster(employeeinformation).subscribe((data) => {
         if(data.status){
          const dialog: PopupConfig = {
            title: 'Employee Added Successfully',
            close: 'OK',
            
          };
          this.dialog.open(PopupComponent, { width: '600px', data: dialog });
         }
         else{
          const dialog: PopupConfig = {
            title: 'Unable to insert Employee',
            close: 'OK',
            
          };
          this.dialog.open(PopupComponent, { width: '600px', data: dialog });

         }
    })
  }
  editfamily(i:any){
    console.log("edit",i)
    this.familyindex = i;
    console.log("data",this.familyDetails[i].firstname)
    this.isfamilyedit = true;
   
    this.employeefamilyAddForm.controls.familyfirstname.setValue(this.familyDetails[i].firstname);
    this.employeefamilyAddForm.controls.familylastname.setValue(this.familyDetails[i].lastname);
    this.employeefamilyAddForm.controls.familydateofbirth.setValue(new Date(this.familyDetails[i].dateofbirth));
    this.employeefamilyAddForm.controls.relation.setValue(this.familyDetails[i].relationship);
    this.employeefamilyAddForm.controls.familystatus.setValue(this.familyDetails[i].status);
    this.employeefamilyAddForm.controls.familycontact.setValue(this.familyDetails[i].contactnumber);
    this.employeefamilyAddForm.controls.familygender.setValue(this.familyDetails[i].gender);

    

    // this.employeeAddForm.controls.familyfirstname = ;

  }
  clearfamily(){
    this.employeefamilyAddForm.reset();
    // this.employeeAddForm.controls.familyfirstname.reset();
    // this.employeeAddForm.controls.familylastname.reset();
    // this.employeeAddForm.controls.relation.reset();
    // this.employeeAddForm.controls.familystatus.reset();
    // this.employeeAddForm.controls.familycontact.reset();
    // this.employeeAddForm.controls.familydateofbirth.reset();
    // this.employeeAddForm.controls.familygender.reset();
  }
  deletefamily(index:any){
    console.log("ff",index)
    // this.familyDetails.removeAt(index);
    this.familyDetails.splice(index,1);
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
    if(this.employeeAddForm.valid){
      this.family = true;
      this.emp=false;

    }

  }
  secondnext(){
    if(this.familyDetails.length>0){
      this.family = false;
      this.work = true;
      this.emp=false;
    }
    

  }
  firstprev(){
    this.emp=true;
    this.family = false;
    this.work=false;
  }
  secondprev(){
    this.work=false;
    this.emp = false;
    this.family = true;
  }
  close(){

    this.addempdetails= false;
    this.viewdetails = true;
    this.work=false;
    this.emp = true;
    this.family = false;
    this.ngOnInit();
  }
  getErrorMessages(errorCode:any) {

    this.LMS.getErrorMessages(errorCode,1,1).subscribe((result)=>{

      if(result.status && errorCode == 'LM1')
      {
        this.msgLM1 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM2')
      {
        this.msgLM2 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM3')
      {
        this.msgLM3 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM54')
      {
        this.msgLM54 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM38')
      {
        this.msgLM38 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM39')
      {
        this.msgLM39 = result.data[0].errormessage
      }
    })
  }
  sameAsAddress(){
    this.employeeAddForm.controls.paddress.setValue(this.employeeAddForm.controls.address.value),
    this.employeeAddForm.controls.pcountry.setValue(this.employeeAddForm.controls.country.value),
    this.employeeAddForm.controls.pstate.setValue(this.employeeAddForm.controls.state.value),
    this.employeeAddForm.controls.pcity.setValue(this.employeeAddForm.controls.city.value),
    this.employeeAddForm.controls.ppincode.setValue(this.employeeAddForm.controls.pincode.value)

    
    // if(this.employeeDetails.isChecked){
    //   this.employeeDetails.pAddress='';
    //   this.employeeDetails.pCountry='';
    //   this.employeeDetails.pState='';
    //   this.employeeDetails.pCity='';
    //   this.employeeDetails.pPincode='';

    // }else {
    //   this.employeeDetails.pAddress=this.employeeDetails.address;
    //   this.employeeDetails.pCountry=this.employeeDetails.country;
    //   this.employeeDetails.pPincode=this.employeeDetails.pincode;
    //   this.permanentCountryChange(this.employeeDetails.country)
    //   this.employeeDetails.pState=this.employeeDetails.state;
    //   this.permanentStateChange(this.employeeDetails.state)
    //   this.employeeDetails.pCity=this.employeeDetails.city;
    //   }

  }
  
  



  
}
