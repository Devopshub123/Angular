import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators,ValidatorFn,ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {DialogComponent} from "../../../attendance/dialog/dialog.component";
import { LeavesService } from '../../leaves.service'
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
  selector: 'app-review-and-approvals',
  templateUrl: './review-and-approvals.component.html',
  styleUrls: ['./review-and-approvals.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ReviewAndApprovalsComponent implements OnInit {
   form:any=FormGroup;
    LM1:any;


  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private LM: LeavesService) { }

  ngOnInit(): void {
    console.log("asdf",this.data)
    this.getErrorMessages('LM1');
    this.form = this.formBuilder.group({
      'reason':['',[Validators.required,this.noWhitespaceValidator()]], });
     
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onOkClick(){
    console.log("this.form.valid0",this.form.valid)
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

  getErrorMessages(errorCode:any) {
    this.LM.getErrorMessages(errorCode,1,1).subscribe((result)=>{
      if(result.status && errorCode == 'LM1')
      {
        this.LM1 = result.data[0].errormessage
      }

    })
  }
  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }
}
