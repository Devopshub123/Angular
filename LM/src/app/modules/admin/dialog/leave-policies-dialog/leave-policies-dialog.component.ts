import { Component,Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-leave-policies-dialog',
  templateUrl: './leave-policies-dialog.component.html',
  styleUrls: ['./leave-policies-dialog.component.scss']
})
export class LeavePoliciesDialogComponent implements OnInit {

  status!:boolean;
  constructor(
    public dialogRef: MatDialogRef<LeavePoliciesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    
  }
}
