import { Component, OnInit,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-emp-validation-pop-up',
  templateUrl: './emp-validation-pop-up.component.html',
  styleUrls: ['./emp-validation-pop-up.component.scss']
})
export class EmpValidationPopUpComponent implements OnInit {
  status!:boolean;
  constructor(
    public dialogRef: MatDialogRef<EmpValidationPopUpComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    
  }


}
