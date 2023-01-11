import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
    public form:FormGroup;
 
  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.form = this.formBuilder.group({ 
        'reason':['',Validators.maxLength(250)], });
    }
rejectreason='';
  ngOnInit(): void {
    // this.requestform = this.formBuilder.group(
    //   {
    //     reason: ['',[Validators.required]],
    //   });
  }
  // get f(): { [key: string]: AbstractControl } {
  //   return this.form.controls;
  // }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onOkClick(){
    if(this.data.name == "Reject"){
        this.form.get('reason')!.setValidators([Validators.required]);
        this.form.get('reason')!.updateValueAndValidity();
        this.rejectreason=this.form.controls.reason.value;
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
