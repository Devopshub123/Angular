import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormGroup,FormControl,Validators, FormBuilder, AbstractControl, FormArray} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { AdminService } from 'src/app/modules/admin/admin.service';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import { EmsService } from '../../ems.service';
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
  selector: 'app-newhire',
  templateUrl: './newhire.component.html',
  styleUrls: ['./newhire.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class NewhireComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private router: Router, private adminService: AdminService,
              private companyService: CompanySettingService,private dialog: MatDialog,private emsService: EmsService,) { }
  hireForm: any = FormGroup;
  userSession: any;
  pipe = new DatePipe('en-US');
  minDate = new Date('2000/01/01');  maxDate = new Date();
  designationsList: any = [];
  messagesDataList: any = [];
  requiredField: any;
  requiredOption: any;
  dataSave: any;
  dataNotSave: any;
  isvalid: boolean = false;
  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    // this.userSession.deptid
    this.hireForm=this.formBuilder.group(
      {
      firstname: ["",[Validators.required,]],
      lastname: ["",[Validators.required,]],
      middlename:["",],
      email:["",[Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      dateofjoin:["",[Validators.required,]],
      hiredon:["",[Validators.required,]],
      designation:["",[Validators.required,]],
      mobile:["",[Validators.required, Validators.pattern('[4-9]\\d{9}')]],
      alternatenumber:["",[Validators.pattern('[4-9]\\d{9}')]]

      });
      this.getDesignationsMaster();
      this.getMessagesList();
  }
  getDesignationsMaster() {
    this.companyService.getMastertable('designationsmaster', '1', 1, 1000, 'ems').subscribe(data => {
      this.designationsList = data.data;
    })
  }
  saveNewHireData() {
    const invalid = [];
    const controls = this.hireForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
          invalid.push(name);
      }
    }
    if (this.hireForm.valid) {
      let data = {
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
      };

      this.emsService.saveNewHireData(data).subscribe((res: any) => {
        if (res.status) {
           this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/ems/new-hired-list"]));
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data:"Added new hire sucessfully"
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

  cancel() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    this.router.navigate(["/ems/newHire"]));
  }
  getMessagesList() {
    let data =
     {
       "code": null,
       "pagenumber":1,
       "pagesize":100
    }
 
   this.adminService.getEMSMessagesList(data).subscribe((res:any)=>{
     if(res.status) {
       this.messagesDataList = res.data;
       this.messagesDataList.forEach((e: any) => {
        if (e.code == "EM1") {
         this.requiredField = e.message
        } else if (e.code == "EM2") {
          this.requiredOption =e.message
        }
        // else if (e.code == "ATT11") {
        //   this.dataSave =e.message
        // } else if (e.code == "ATT12") {
        //   this.dataNotSave =e.message
        // }
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
}
