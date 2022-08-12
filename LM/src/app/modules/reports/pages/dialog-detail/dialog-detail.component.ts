import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ReportsService } from '../../reports.service';

@Component({
  selector: 'app-dialog-detail',
  templateUrl: './dialog-detail.component.html',
  styleUrls: ['./dialog-detail.component.scss']
})
export class DialogDetailComponent implements OnInit {
  arrString: any;

  constructor( private reportsService: ReportsService,
    public dialogRef: MatDialogRef<DialogDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }
  List: any[] = [
    
  ];
  @ViewChild(MatTable) table: MatTable<any> = <any>[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sorter!: MatSort;
  dataSource: MatTableDataSource<any> = <any>[];
  displayedColumns: string[] = ['sno','empname', 'attendancedate', 'firstlogintime', 
  'lastlogouttime', 'totalhours', 'breaks', 'breaktime', 'productivehours'];
  isLoading = false;
  ngOnInit(): void {
    this.getAttendanceDetailsByAttendanceId()
  }
  onOkClick(): void {
    this.dialogRef.close();
  }
  getAttendanceDetailsByAttendanceId() {
    let obj = {
      'attendanceid': this.data.attendanceid
    }
    this.List = [];
    this.dataSource = new MatTableDataSource(this.List);
    this.reportsService.getAttendanceDetailsByAttendanceId(obj).subscribe((res: any)=>{
      if (res.status) {
        this.List=res.data;
        if(this.List[0].breaks!=null){
          this.arrString=this.List[0].breaks.split(',')
        }

        this.isLoading = false;
        this.dataSource = new MatTableDataSource(this.List);
  
      }
    })
  }
}
