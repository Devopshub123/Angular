import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {DialogComponent} from "../../../attendance/dialog/dialog.component";
@Component({
  selector: 'app-review-and-approvals',
  templateUrl: './review-and-approvals.component.html',
  styleUrls: ['./review-and-approvals.component.scss']
})
export class ReviewAndApprovalsComponent implements OnInit {
   form:any=FormGroup;


  constructor(private formBuilder: FormBuilder,public dialogRef: MatDialogRef<DialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      'reason':['',Validators.maxLength(250)], });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onOkClick(){
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