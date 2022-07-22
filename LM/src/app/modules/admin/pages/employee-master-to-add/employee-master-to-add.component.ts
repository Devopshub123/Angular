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
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { PopupComponent, PopupConfig } from '../../../../pages/popup/popup.component';
@Component({
  selector: 'app-employee-master-to-add',
  templateUrl: './employee-master-to-add.component.html',
  styleUrls: ['./employee-master-to-add.component.scss']
})
export class EmployeeMasterToAddComponent implements OnInit {
  employeeAddForm!: FormGroup;
  employeefamilyAddForm :any=FormGroup;
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
  add:boolean=false;
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
  maxall : number=100;
  minetodate:any;
  empid:any;
  mindatofjoin:any;
  work:boolean=false;
  family:boolean=false;
  emp:boolean=true;
  isfamilyedit:boolean=false;
  selectAll:boolean=false;
  editemployee:boolean=false;
  addemployee:boolean=true;
  ischecked:any;
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

   }
  ngOnInit(): void {
    let auxDate = this.substractYearsToDate(new Date(), 18);
    this.maxBirthDate = this.getDateFormateForSearch(auxDate);
    this.getBloodgroups();
    this.getGender();
    this.getCountry();
    this.getShifts();
    this.getRoles();
    this.getMaritalStatusMaster();
    this.getRelationshipMaster();
    this.getEmploymentTypeMaster();
    this.getDesignationsMaster();
    this.getDepartmentsMaster();
    this.getWorkLocation();
    this.getEmployeeDetails(null,null);
    this.getErrorMessages('LM1');
    this.getErrorMessages('LM2');
    this.getErrorMessages('LM3');
    this.getErrorMessages('LM54');
    this.getErrorMessages('LM38');
    this.getErrorMessages('LM39');
    /**page 1 form */
    this.employeeAddForm=this.formBuilder.group(
      {
        firstname:["",Validators.required],
        lastname: ["",Validators.required],
        middlename: [""],
        contactnumber:["",Validators.required],
        personalemail:["",[Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
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
        checked:[false],
        emergencycontactnumber: [""],
        emergencycontactrelation: [""],
        emergencycontactname: [""],

      }) ,
      /**page 2 form */
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
          
          bankaccountnumber: [""],
        }),
      /**page 3 form */
      this.employeeworkAddForm=this.formBuilder.group(
        {
        officeemail: ["",[Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')]],        
        usertype: ["",Validators.required],
        designation: ["",Validators.required],
        department: ["",Validators.required],
        employmenttype: ["",Validators.required],
        dateofjoin: ["",Validators.required],
        companylocation: ["",Validators.required],
        reportingmanager: ["",Validators.required],        
        status: [""],
        shift: ["",Validators.required],
        relations: [""],       
        efromdate:[""],
        etodate:[""],
        wfromdate:[""],
        wtodate:[""],
        course:[""],
        institutename:[""],
        companyname:[""],
        empid:[""],
        edu: this.formBuilder.array([]) ,
        exp:this.formBuilder.array([]),
      });
      /**same as present address checkbox */
      this.employeeAddForm.get('checked')?.valueChanges.subscribe(selectedValue => {
        if(selectedValue){
          this.employeeAddForm.get('pcountry')?.valueChanges.subscribe(selectedValue => {
            this.permanentStateDetails=[];
            this.LMS.getStatesc(selectedValue).subscribe((data)=>{
              this.permanentStateDetails=data[0]
              if(this.employeeAddForm.controls.state.value != null)
              {
                this.employeeAddForm.controls.pstate.setValue(this.employeeAddForm.controls.state.value);
    
              }
             
            })
          })
          this.employeeAddForm.get('pstate')?.valueChanges.subscribe(selectedValue => {
            this.permanentCityDetails=[];
            this.LMS.getCities(selectedValue).subscribe((data)=>{
              this.permanentCityDetails=data[0]
              if(this.employeeAddForm.controls.city.value != null)
              {
                this.employeeAddForm.controls.pcity.setValue(this.employeeAddForm.controls.city.value);
    
              }

            })            
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
        else{
          this.employeeAddForm.controls.paddress.setValue('')
          this.employeeAddForm.controls.pcountry.setValue('')
          this.employeeAddForm.controls.pstate.setValue('')
          this.employeeAddForm.controls.pstate.setValue('')
          this.employeeAddForm.controls.pcity.setValue('')
          this.employeeAddForm.controls.ppincode.setValue('')
        }        
      })
      this.employeeAddForm.get('paddress')?.valueChanges.subscribe(selectedValue=>{
        
      })
     /**get state details for residance address */
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
      /**get city details for residance address */
      this.employeeAddForm.get('state')?.valueChanges.subscribe(selectedValue => {
        this.cityDetails=[];
        this.LMS.getCities(selectedValue).subscribe((data)=>{
          this.cityDetails=data[0]
          if(this.employeedata != null)
          {
            this.employeeAddForm.controls.city.setValue(this.employeedata.city);
          }
        })
      })
      /**get state details for present address*/
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
      /**get city details for present address */
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
        this.dateofjonupdate(selectedValue)
        
        
      })
      
      
      this.employeeworkAddForm.get('efromdate')?.valueChanges.subscribe(selectedValue => {
        this.minetodate = selectedValue;
      })
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
        this.availablereportingmanagers=[]
        let data = {
          id:selectedValue
        }
        this.LMS.getReportingManagers(data).subscribe(data=>{
          this.availablereportingmanagers=data[0]         
          if(this.employeedata != null)
          {
            this.employeeworkAddForm.controls.reportingmanager.setValue(this.employeedata.reportingmanager);

          }
        })
      })      
  }

  // closeDatePicker(event:any,efromdate:any){
  //     efromdate.close();
  // }

  dateofjonupdate(data:any){
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
      efromdate:'',
      etodate:''
      
    })
  }
  newExperince(): FormGroup {
    return this.formBuilder.group({
      companyname:'',
      wfromdate:'',
      wtodate:''
      
    })
  }

  addexperience() {
    this.exp().push(this.newExperince());
    
  }
  addexperiencedetils(){
    for(let i =0;i<this.exp().controls.length;i++){
      this.Experience.push({
        companyname:this.exp().controls[i].value.companyname,
        skills:'test',
        fromdate:this.pipe.transform(this.exp().controls[i].value.wfromdate, 'yyyy-MM-dd'),
        todate:this.pipe.transform(this.exp().controls[i].value.wtodate, 'yyyy-MM-dd')
      });

    }
   
  }
 
  addeducation() {
    this.edu().push(this.newEducation());

  }
   addeducationdetails(){
    for(let i =0;i<this.edu().controls.length;i++){
      if(this.edu().controls[i].value.efromdate != null){
        this.Educations.push({
          course:this.edu().controls[i].value.course,
          institutename:this.edu().controls[i].value.institutename,
          fromdate:this.pipe.transform(this.edu().controls[i].value.efromdate, 'yyyy-MM-dd'),
          todate:this.pipe.transform(this.edu().controls[i].value.etodate, 'yyyy-MM-dd')
        });
  

      }
     
    } 
  }
  removeWork(workIndex:number) {
    this.exp().removeAt(workIndex);
  }

 
  removeeducation(empIndex:number) {
    this.edu().removeAt(empIndex);
  }

  addemp(){
    this.add = true;
    this.addempdetails= true;
    this.viewdetails = false;
    this.editemployee = false;
    // this.edu().push(this.newEducation());
    // this.exp().push(this.newExperince());
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
  editEmployee(data:any){
    this.add = false;
    this.addempdetails= true;
    this.viewdetails = false;
    this.editemployee=true;
    this.addemployee=false;
    this.LM.getEmployeeMaster(data).subscribe((result)=>{
      this.employeedata = JSON.parse(result.data[0][0].json)[0];
      let a = this.employeedata;
      if(a.country == a.pcountry && a.state == a.pstate && a.city == a.pcity && a.address == a.paddress && a.pincode == a.ppincode ){
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
      let familydata = JSON.parse((this.employeedata.relations))
      if(familydata != null){
        for(let i = 0;i<familydata.length;i++){
          this.familyDetails.push({
            firstname: familydata[i].firstname,
            lastname: familydata[i].lastname,
            gender: familydata[i].gender,
            contactnumber: familydata[i].contactnumber,
            status: familydata[i].status,
            relationship: familydata[i].relationship,
            dateofbirth: familydata[i].dateofbirth!="null"?this.pipe.transform(familydata[i].dateofbirth, 'yyyy-MM-dd'):'',
          });
        }
        this.dsFamily = new MatTableDataSource(this.familyDetails);
      }
      
     let education = JSON.parse(this.employeedata.education)
     if(education !=null){
      education.forEach((e:any) => {
        this.edu().push(this.formBuilder.group({
          course: e.course,
          institutename: e.institutename,
          efromdate:new Date(e.fromdate),
          etodate:new Date(e.todate)
          
        }));
      });

     }
     let experience = JSON.parse(this.employeedata.experience)
     if(experience != null){
      experience.forEach((e:any) => {
        this.exp().push(this.formBuilder.group({
          companyname: e.companyname,
          wfromdate:new Date(e.fromdate),
          wtodate:new Date(e.todate)
          
        }));
      });  

     }
     
      
         
    });

  }
  getPageSizeOptions(): number[] {
    if (this.dataSource.paginator!.length > this.maxall)
      return [5, 10, 20,100,this.dataSource.paginator!.length];
  
    
    
    else
      return [5, 10, 20,100,this.maxall];
    
     
  }
  addfamily(){
    if(this.isfamilyedit){
        this.isfamilyedit = false;
        this.familyDetails[this.familyindex].firstname =this.employeefamilyAddForm.controls.familyfirstname.value;
        this.familyDetails[this.familyindex].lastname = this.employeefamilyAddForm.controls.familylastname.value;
        this.familyDetails[this.familyindex].gender = this.employeefamilyAddForm.controls.familygender.value;
        this.familyDetails[this.familyindex].contactnumber =  this.employeefamilyAddForm.controls.familycontact.value;
        this.familyDetails[this.familyindex].status = "Alive";
        this.familyDetails[this.familyindex].relationship = this.employeefamilyAddForm.controls.relation.value;
        this.familyDetails[this.familyindex].dateofbirth = this.employeefamilyAddForm.controls.familydateofbirth.value!=""?this.pipe.transform(this.employeefamilyAddForm.controls.familydateofbirth.value, 'yyyy-MM-dd'):''
        this.clearfamily();
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
        this.clearfamily();
      }
  }
  
  }

  save(){
    this.addexperiencedetils();
    this.addeducationdetails();
    if(this.addemployee){
      this.empid=null;
    }
    else{
      this.empid=this.employeedata.empid;

    }
    let paddress:any;
    let pcity:any;
    let pstate:any;
    let ppincode:any;
    let pcountry:any;
    if(this.employeeAddForm.controls.checked.value==true){
      paddress:this.employeeAddForm.controls.address.value;
      pcity:this.employeeAddForm.controls.city.value;
      pstate:this.employeeAddForm.controls.state.value;
      ppincode:this.employeeAddForm.controls.pincode.value;
      pcountry:this.employeeAddForm.controls.country.value;
    }else{
      paddress:this.employeeAddForm.controls.paddress.value;
      pcity:this.employeeAddForm.controls.pcity.value;
      pstate:this.employeeAddForm.controls.pstate.value;
      ppincode:this.employeeAddForm.controls.ppincode.value;
      pcountry:this.employeeAddForm.controls.pcountry.value;
    }
    let employeeinformation = {
      empid:this.empid,
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
      paddress:paddress,
      pcity:pcity,
      pstate:pstate,
      ppincode:ppincode,
      pcountry:pcountry,
      aadharnumber:this.employeeAddForm.controls.aadharnumber.value,
      passport:this.employeeAddForm.controls.passport.value,
      bankname:this.employeefamilyAddForm.controls.bankname.value,
      ifsccode:this.employeefamilyAddForm.controls.ifsccode.value,
      nameasperbankaccount:this.employeefamilyAddForm.controls.nameasperbankaccount.value,
      branchname:this.employeefamilyAddForm.controls.branchname.value,
      bankaccountnumber:this.employeefamilyAddForm.controls.bankaccountnumber.value,
      uanumber:this.employeeAddForm.controls.uanumber.value,
      pfaccountnumber:this.employeeAddForm.controls.pfaccountnumber.value,
      pan:this.employeeAddForm.controls.pan.value,
      status: 'Active',
      esi:this.employeeAddForm.controls.esi.value,
      shift:this.employeeworkAddForm.controls.shift.value,
      relations:this.familyDetails,
      education:this.Educations,
      experience:this.Experience,
    } 
      
      this.LM.setEmployeeMaster(employeeinformation).subscribe((data) => {
        /**For add employee */
        if(this.addemployee){
          if(data.status){
            this.addemployee=true;
            this.addempdetails= false;
            this.viewdetails = true;
            this.work=false;
            this.emp = true;
            this.family = false;
            this.familyDetails=[];
            this.Experience=[];
            this.Educations=[];
            this.employeedata=[];  
            this.ngOnInit();
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position:{top:`70px`},
              disableClose: true,
              data: 'Employee added successfully'
            });  
                   
          }
          else{
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position:{top:`70px`},
              disableClose: true,
              data: 'Unable to insert employee'
            });
           }
                   
                  

        }
        /**For edit employee */
        else{
          if(data.status){   
            this.addemployee=true;
            this.addempdetails= false;
            this.viewdetails = true;
            this.work=false;
            this.emp = true;
            this.family = false;
            this.familyDetails=[];
            this.Experience=[];
            this.Educations=[];
            this.employeedata=[];
            this.ngOnInit(); 
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position:{top:`70px`},
              disableClose: true,
              data: 'Employee updated successfully'
            });
           }
           else{
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position:{top:`70px`},
              disableClose: true,
              data: 'Unable to update employee'
            });
           }

        }
          
      })

  }
  firstcancel(){
    this.addemployee=true;
    this.addempdetails= false;
    this.viewdetails = true;
    this.work=false;
    this.emp = true;
    this.family = false;
    this.familyDetails=[];
    this.Experience=[];
    this.Educations=[];
    this.employeedata=[];
    this.ngOnInit();

  }
  editfamily(i:any){
    this.familyindex = i;
    this.isfamilyedit = true;   
    this.employeefamilyAddForm.controls.familyfirstname.setValue(this.familyDetails[i].firstname);
    this.employeefamilyAddForm.controls.familylastname.setValue(this.familyDetails[i].lastname);
    this.employeefamilyAddForm.controls.familydateofbirth.setValue(new Date(this.familyDetails[i].dateofbirth));
    this.employeefamilyAddForm.controls.relation.setValue(this.familyDetails[i].relationship);
    this.employeefamilyAddForm.controls.familystatus.setValue(this.familyDetails[i].status);
    this.employeefamilyAddForm.controls.familycontact.setValue(this.familyDetails[i].contactnumber);
    this.employeefamilyAddForm.controls.familygender.setValue(this.familyDetails[i].gender);
  }
  clearfamily(){
    this.employeefamilyAddForm.controls.familyfirstname.reset();
    this.employeefamilyAddForm.controls.familylastname.reset();
    this.employeefamilyAddForm.controls.relation.reset();
    this.employeefamilyAddForm.controls.familystatus.reset();
    this.employeefamilyAddForm.controls.familycontact.reset();
    this.employeefamilyAddForm.controls.familydateofbirth.reset();
    this.employeefamilyAddForm.controls.familygender.reset();
    this.employeefamilyAddForm.valid = true;
  }
  deletefamily(index:any){
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
    })

  }

  getReportingManagers(id:any){
    let data = {
      id:id
    }
    this.LMS.getReportingManagers(data).subscribe(data=>{
      this.availablereportingmanagers=data[0]
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
    })
  }
  getEmploymentTypeMaster(){
    this.LMS.getMastertable('employmenttypemaster',null,1,1000,'boon_client').subscribe(data=>{
      this.EmploymentTypeDetails = data.data;
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

      for(let i=0;i<roledata.length;i++){
        if(roledata[i].isEditable == 0){
          this.availableRole.push(roledata[i])
        }

      }
    })
  }
  getShifts(){
    this.LMS.getMastertable('shiftsmaster',1,1,1000,'boon_client').subscribe(data=>{
      this.availableShifts = data.data;
    })
  }

  firstNext(){
    if(this.employeeAddForm.valid){
      this.family = true;
      this.emp=false;

    }

  }
  secondnext(){
      this.family = false;
      this.work = true;
      this.emp=false;
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
    this.addemployee=true;
    this.addempdetails= false;
    this.viewdetails = true;
    this.work=false;
    this.emp = true;
    this.family = false;
    this.familyDetails=[];
    this.Experience=[];
    this.Educations=[];
    this.employeedata=[];
    this.ngOnInit();
  }
  getErrorMessages(errorCode:any) {

    this.LMS.getErrorMessages(errorCode,1,100).subscribe((result)=>{

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
  countryChange(Id:any){
    this.permanentStateDetails=[];
    this.LMS.getStatesc(Id).subscribe((data)=>{
      this.permanentStateDetails=data[0]
    })
  }

  stateChange(Id:any){
  
    this.permanentCityDetails=[];
    this.LMS.getCities(Id).subscribe((data)=>{
      this.permanentCityDetails=data[0]
    })
  }
  sameAsAddress(event: MatCheckboxChange,checked:any){
 
  }

}
