import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-signup-moreusers-dialog',
  templateUrl: './signup-moreusers-dialog.component.html',
  styleUrls: ['./signup-moreusers-dialog.component.scss']
})
export class SignupMoreusersDialogComponent implements OnInit {

  status!:boolean;
  constructor(
    public dialogRef: MatDialogRef<SignupMoreusersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    
  }

}
