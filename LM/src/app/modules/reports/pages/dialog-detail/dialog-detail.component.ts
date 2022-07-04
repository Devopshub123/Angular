import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReportsService } from '../../reports.service';

@Component({
  selector: 'app-dialog-detail',
  templateUrl: './dialog-detail.component.html',
  styleUrls: ['./dialog-detail.component.scss']
})
export class DialogDetailComponent implements OnInit {

  constructor( private reportsService: ReportsService,
    public dialogRef: MatDialogRef<DialogDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }
  list: any
  ngOnInit(): void {
  }
  onOkClick(): void {
    this.dialogRef.close();
  }
  getAttendanceDetailsByAttendanceId() {
    let obj = {
      'attendanceid': this.data.attendanceid
    }
    this.reportsService.getAttendanceDetailsByAttendanceId(obj).subscribe((res: any)=>{
      if (res.status) {

      }
    })
  }
}
