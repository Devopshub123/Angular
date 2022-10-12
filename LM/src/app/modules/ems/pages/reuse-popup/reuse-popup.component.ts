import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {DialogComponent} from "../../../attendance/dialog/dialog.component";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-reuse-popup',
  templateUrl: './reuse-popup.component.html',
  styleUrls: ['./reuse-popup.component.scss']
})
export class ReusePopupComponent implements OnInit {
  form:any=FormGroup;
  pipe = new DatePipe('en-US');
  mindate:any=new Date();
  maxdate:any=new Date();

  constructor(private formBuilder: FormBuilder,public dialogRef: MatDialogRef<DialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any) {
    this.mindate = new Date(this.data.appliedDate);
    this.maxdate = new Date(this.data.releivingDate);
console.log(this.data.appliedDate,this.data.releivingDate)
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      'requestdate':[this.data.releivingDate],
      'approvedate':[new Date(this.data.requestedDate)],
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
