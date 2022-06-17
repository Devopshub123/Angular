import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-reusable-dialog',
  templateUrl: './reusable-dialog.component.html',
  styleUrls: ['./reusable-dialog.component.scss']
})
export class ReusableDialogComponent implements OnInit {
  status!:boolean;
  constructor(
    public dialogRef: MatDialogRef<ReusableDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    
  }

}
