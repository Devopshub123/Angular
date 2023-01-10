
import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {DialogComponent} from "../../../attendance/dialog/dialog.component";


@Component({
  selector: 'app-investment-reject',
  templateUrl: './investment-reject.component.html',
  styleUrls: ['./investment-reject.component.scss']
})
export class InvestmentRejectComponent implements OnInit {

   form:any=FormGroup;
    LM1:any;


  constructor(private formBuilder: FormBuilder,public dialogRef: MatDialogRef<DialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
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

  // getErrorMessages(errorCode:any) {
  //   this.LM.getErrorMessages(errorCode,1,1).subscribe((result:any)=>{
  //     if(result.status && errorCode == 'LM1')
  //     {
  //       this.LM1 = result.data[0].errormessage
  //     }

  //   })
  // }
}