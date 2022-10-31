import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {DialogComponent} from "../../../attendance/dialog/dialog.component";
import { DatePipe } from "@angular/common";

import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import * as _moment from 'moment';
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
  selector: 'app-reuse-popup',
  templateUrl: './reuse-popup.component.html',
  styleUrls: ['./reuse-popup.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ReusePopupComponent implements OnInit {
  form:any=FormGroup;
  pipe = new DatePipe('en-US');
  mindate:any=new Date();
  maxdate:any=new Date();

  constructor(private formBuilder: FormBuilder,public dialogRef: MatDialogRef<DialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any) {
    this.mindate = new Date(this.data.appliedDate);
    this.maxdate = new Date(this.data.requestedDate);
  }

  ngOnInit(): void {
    console.log("approve-",this.data.requestedDate)
    console.log(" request-",this.data.releivingDate)
    this.form = this.formBuilder.group({
      'requestdate':[this.data.releivingDate],
      'approvedate':[this.data.requestedDate],
      'reason':['',Validators.required], });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onOkClick(){
    if(this.form.valid){
      if(this.data.name == "Reject"){
        this.form.get('reason')!.setValidators([Validators.required]);
        this.form.get('reason')!.updateValueAndValidity();
        // this.rejectreason=this.form.controls.reason.value;
        if(this.form.valid && this.form.value){
          this.dialogRef.close(this.form.value);
        }

      }else{
        this.form.get('reason')?.clearValidators();
        this.form.get('reason')!.updateValueAndValidity();

        this.dialogRef.close(this.form.value);
      }

    }

  }

}
