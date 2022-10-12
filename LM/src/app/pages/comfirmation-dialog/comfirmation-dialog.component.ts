import { Component,Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-comfirmation-dialog',
  templateUrl: './comfirmation-dialog.component.html',
  styleUrls: ['./comfirmation-dialog.component.scss']
})
export class ComfirmationDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ComfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
    onNoClick(): void {
      this.dialogRef.close();
    }
  ngOnInit(): void {
  }

}
