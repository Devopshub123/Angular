import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup,  Validators, FormBuilder, ValidationErrors, ValidatorFn, AbstractControl,  } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EmsService } from '../../ems.service';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import * as _moment from 'moment';
import { AdminService } from 'src/app/modules/admin/admin.service';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { EncryptPipe } from 'src/app/custom-directive/encrypt-decrypt.pipe';
import { MatRadioChange } from '@angular/material/radio';
import { EmpValidationPopUpComponent } from '../emp-validation-pop-up/emp-validation-pop-up.component';
// import {default as _rollupMoment} from 'moment';
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
  selector: 'app-new-hire-list',
  templateUrl: './new-hire-list.component.html',
  styleUrls: ['./new-hire-list.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class NewHireListComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private router: Router,
    private adminService: AdminService, private companyService: CompanySettingService,
    private dialog: MatDialog, private emsService: EmsService,public spinner:NgxSpinnerService) {
     
      this.getActiveEmployeesCount();
     }
  hireForm: any = FormGroup;
  userSession: any;
  pipe = new DatePipe('en-US');
  joinDate :any;
  maxDate = new Date();
  minDate: any;
  designationsList: any = [];
  messagesDataList: any = [];
  requiredField: any;
  requiredOption: any;
  dataSave: any;
  dataNotSave: any;
  isvalid: boolean = false;
  minHireDate: any;
  EM43: any;
  EM55: any;
  companyDBName: any = environment.dbName;
  newHiredList: any = [];
  hiredList: any = [];
  hired: boolean = true;
  joinedList: any = [];
  joined: boolean = false;
  subscriptionflag:boolean=true;
  //constructor(private emsService:EmsService,private router: Router) { }

  displayedColumns: string[] = ['sno','name','email','hireDate','joinDate','mobile','status','action'];
  dataSource : MatTableDataSource<any> = <any>[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  pageLoading = true;
  isNewhire: boolean = false;
  isNewhireList: boolean = true;
  isUpdate: boolean = false;
  candidateId: any;
  encriptPipe = new EncryptPipe();
  companyNameDetails: any = [];
  loginToken: any;
  activeemployeecount:any
  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.loginToken = JSON.parse(JSON.stringify(sessionStorage.getItem('token') || '')),
    this.hireForm=this.formBuilder.group(
      {
      firstname: ["",[Validators.required,this.noWhitespaceValidator()]],
      lastname: ["",[Validators.required,this.noWhitespaceValidator()]],
      middlename:[""],
      email:["",[Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      dateofjoin:["",[Validators.required,]],
      hiredon:["",[Validators.required,]],
      designation:["",[Validators.required,]],
      mobile:["",[Validators.required, Validators.pattern('[4-9]\\d{9}')]],
      alternatenumber:["",[Validators.pattern('[4-9]\\d{9}')]]

      });
    this.getCompanyInformation();
    this.getNewHiredList();
     this.getDesignationsMaster();
    this.getMessagesList();
    this.hireForm.get('hiredon')?.valueChanges.subscribe((selectedValue: any) => {
      this.hireForm.get('dateofjoin').reset()
      this.minHireDate = selectedValue._d;
    })
    //
  }
  getDesignationsMaster() {
    this.companyService.getMastertable('designationsmaster', '1', 1, 1000, this.companyDBName).subscribe(data => {
      this.designationsList = data.data;
    })
  }
  newHire() {
    if(!this.subscriptionflag){
      let dialogRef = this.dialog.open(EmpValidationPopUpComponent, {
        width: '800px',position: { top: `100px` },
        disableClose: true,
        
        data: "Attention! Please note that you are no longer authorized to add new employees. If you want to add new employees, please upgrade your plan or increase the user count in your current plan. For further assistance, please contact your admistrator. Thank you!"
      });

    }
    else{
      this.candidateId =null
      this.isNewhire = true;
      this.isNewhireList = false;
      this.isUpdate = false;

    }
   
  }
  submit() {

    this.saveNewHireData()
  }
  saveNewHireData() {
    if (this.hireForm.valid) {
     this.spinner.show()
      let data = {
        candidate_id:this.candidateId,
        firstname: this.hireForm.controls.firstname.value,
        middlename: this.hireForm.controls.middlename.value,
        lastname: this.hireForm.controls.lastname.value,
        personal_email: this.hireForm.controls.email.value,
        dateofjoin: this.pipe.transform(this.hireForm.controls.dateofjoin.value, 'yyyy-MM-dd'),
        hired_date: this.pipe.transform(this.hireForm.controls.hiredon.value, 'yyyy-MM-dd'),
        designation: this.hireForm.controls.designation.value,
        contact_number: this.hireForm.controls.mobile.value,
        alternatecontact_number: this.hireForm.controls.alternatenumber.value,
        status:3,
        actionby: this.userSession.id,
        loginToken: this.loginToken,
        hremail:this.userSession.officeemail
       };
     
      this.emsService.saveNewHireData(data).subscribe((res: any) => {
        if (res.status) {
          if (res.data.email == null) { 
            this.spinner.hide();
            if (this.candidateId ==null) {
              let dialogRef = this.dialog.open(ReusableDialogComponent, {
                position: { top: `70px` },
                disableClose: true,
                data:this.EM55
              });
            } else {
              let dialogRef = this.dialog.open(ReusableDialogComponent, {
                position: { top: `70px` },
                disableClose: true,
                data:"Data updated successfully."
              });
            }
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/ems/new-hired-list"]));
          } else {
            this.spinner.hide();
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
             data:  res.data.email
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


    } else {
      this.spinner.hide();
      }
    
  }
  editEmployee(id: any, data: any) {
    if(!this.subscriptionflag){
      let dialogRef = this.dialog.open(EmpValidationPopUpComponent, {
        width: '800px',position: { top: `100px` },
        disableClose: true,
        data: "Attention! Please note that you are no longer authorized to add new employees. If you want to add new employees, please upgrade your plan or increase the user count in your current plan. For further assistance, please contact your admistrator. Thank you!"
      });

    }
    else { 
      
    this.isNewhire = true;
    this.isNewhireList = false;
    this.isUpdate = true;
    this.candidateId = data.id;
    
    let fname = data.firstname;
    fname = fname ? fname.charAt(0).toUpperCase() + fname.substr(1).toLowerCase() : '';
    this.hireForm.controls.firstname.setValue(fname);

    let mname = data.middlename;
    mname = mname ? mname.charAt(0).toUpperCase() + mname.substr(1).toLowerCase() : '';
    this.hireForm.controls.middlename.setValue(mname);

    let lname = data.lastname;
    lname = lname ? lname.charAt(0).toUpperCase() + lname.substr(1).toLowerCase() : '';
    this.hireForm.controls.lastname.setValue(lname);

    this.hireForm.controls.email.setValue(data.personal_email);
    this.hireForm.controls.hiredon.setValue(data.hired_date);
    this.minHireDate = new Date(data.hired_date);
    this.hireForm.controls.dateofjoin.setValue(data.dateofjoin);
    this.hireForm.controls.designation.setValue(data.designation);
    this.hireForm.controls.mobile.setValue(data.contact_number);
    this.hireForm.controls.alternatenumber.setValue(data.alternatecontact_number);
    }
  }
/**get new hired  list data */
  getNewHiredList() {
   this.hiredList = [];
    this.joinedList = [];
    this.emsService.getNewHiredEmployeeList(null).subscribe((res: any) => {
      if (res.status && res.data.length != 0) {
        this.newHiredList = res.data;
        this.newHiredList.forEach((e: any) => {
          if (e.status == "Hired") {
            this.hiredList.push(e);
          } else if (e.status == "Joined") {
            this.joinedList.push(e);
          }
        })
        if (this.hired == true) {
          this.dataSource = new MatTableDataSource(this.hiredList);
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.spinner.hide();
          }, 500);
        
        } else {
          this.dataSource = new MatTableDataSource(this.joinedList);
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.spinner.hide();
          }, 500)
        }
      }
    })
  }
  
  getHiredList() {
    this.spinner.show();
    this.hired = true;
    this.getNewHiredList()
  }
  
  getjoinedList() {
    this.spinner.show();
    this.hired = false;
    this.getNewHiredList();
  }
  radioChange(event: MatRadioChange) {
     if (event.value == 1) {
      this.getHiredList();
     
      } else if(event.value == 2){
      this.getjoinedList();
      } 
  }
  
  editCandidateData(id:any, data:any) {
    if(!this.subscriptionflag){
      let dialogRef = this.dialog.open(EmpValidationPopUpComponent, {
        width: '800px',position: { top: `100px` },
        disableClose: true,
        data: "Attention! Please note that you are no longer authorized to add new employees. If you want to add new employees, please upgrade your plan or increase the user count in your current plan. For further assistance, please contact your admistrator. Thank you!"
      });

    }
    else{
    // dateofjoin
    const dateOne = new Date(data.dateofjoin);
   const dateTwo = new Date();
    // Greater than check
    if (dateOne > dateTwo) {
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position: { top: `70px` },
        disableClose: true,
        data: "Joining date should not greater than today."
      });
    } else {
      let candId=this.encriptPipe.transform(data.candidate_id.toString());
      this.router.navigate(["/ems/empInformation",{candId}])
    }
  }
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
     if (this.dataSource.paginator) {
       this.dataSource.paginator.firstPage();
    }
  }
  cancel() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    this.router.navigate(["/ems/new-hired-list"]));
  }

  getMessagesList() {
    let data =
     {
       "code": null,
       "pagenumber":1,
       "pagesize":1000
    }

   this.adminService.getEMSMessagesList(data).subscribe((res:any)=>{
     if(res.status) {
       this.messagesDataList = res.data;
       this.messagesDataList.forEach((e: any) => {
        if (e.code == "EM1") {
         this.requiredField = e.message
        } else if (e.code == "EM2") {
          this.requiredOption =e.message
        }else if (e.code == "EM43") {
          this.EM43 =e.message
        }else if (e.code == "EM55") {
          this.EM55 =e.message
        }
         })
     } else {
       this.messagesDataList = [];
     }

   })


  }

  alphabetKeyPress(event: any,) {
    const pattern = /[a-zA-Z ]/;
      let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
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
  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }
  // 

  getPageSizes(): number[] {
    var customPageSizeArray = [];
    
      if (this.dataSource.data.length > 5) {
        customPageSizeArray.push(5);
      }
      if (this.dataSource.data.length > 10) {
        customPageSizeArray.push(10);
      }
      if (this.dataSource.data.length > 20) {
        customPageSizeArray.push(20);
       
      }
      customPageSizeArray.push(this.dataSource.data.length);
      return customPageSizeArray;
 }
  getCompanyInformation(){
    this.companyService.getCompanyInformation('companyinformation',null,1,10,this.companyDBName).subscribe((data:any)=>{
      if (data.status && data.data.length != 0) {
        this.minDate = new Date(data.data[0].established_date);
        this.minHireDate = new Date(data.data[0].established_date);
      }
    })
  }
  
  getClientSubscriptionDetails(){
    this.companyService.getClientSubscriptionDetails().subscribe((data: any) => {
      if (data.status && data.data.length != 0) {
        if(data.data[0].user_count>this.activeemployeecount){
          
          this.subscriptionflag =true;
          
        }
        else{
          this.subscriptionflag =false;
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: "Attention! Please note that you are no longer authorized to add new employees. If you want to add new employees, please upgrade your plan or increase the user count in your current plan. For further assistance, please contact your supervisor or HR representative. Thank you!"
          });
          
        }
      }
    })
  }

  getActiveEmployeesCount(){
    this.companyService.getActiveEmployeesCount().subscribe((data: any) => {
      if (data.status && data.data.length != 0) {
        this.getClientSubscriptionDetails();
        this.activeemployeecount = data.data[0].active_employees_count;
      }
    });
  }
}

