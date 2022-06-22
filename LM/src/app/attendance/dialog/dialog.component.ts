import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  public requestform!:FormGroup;
 
  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.requestform = this.formBuilder.group(
      {
        reason: ['', Validators.required],
      });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onOkClick(){
     this.requestform.get('reason')?.setValidators([Validators.required]);
     this.requestform.get('reason')?.updateValueAndValidity();
    if(this.requestform.valid && this.requestform.value){
      this.dialogRef.close(this.requestform.value);
    }
  }
}
