import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AttendanceService } from 'src/app/modules/attendance/attendance.service';

@Component({
  selector: 'app-detail-report',
  templateUrl: './detail-report.component.html',
  styleUrls: ['./detail-report.component.scss']
})
export class DetailReportComponent implements OnInit {
  
  pipe = new DatePipe('en-US');
  todayWithPipe: any;
  displayedColumns: string[] = ['id', 'worktype', 'fromdate', 'todate', 'reason', 'status'];
  dataSource: MatTableDataSource<any>=<any>[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  arrayList: any = [];
  minFromDate: Date;
  maxFromDate: Date|null ;
  minToDate: Date | null;
  maxToDate: Date;
  currentDate:Date =new Date();
  userSession: any;
  searchForm = this.formBuilder.group({ fromDate: [new Date()], toDate: [new Date()],Users:['0'] });
 
  constructor(private formBuilder: FormBuilder, private attendanceService: AttendanceService,
    public dialog: MatDialog, public datePipe: DatePipe, private router: Router,
    ) {
      this.minFromDate = new Date();
      this.minFromDate.setDate(this.currentDate.getDate()-30);
      this.maxFromDate = new Date();
      this.maxFromDate.setDate(this.currentDate.getDate()+30);
      this.minToDate = new Date();
      this.minToDate.setDate(this.currentDate.getDate()-30);
      this.maxToDate = new Date();
      this.maxToDate.setDate(this.currentDate.getDate()+30);
  }
  ngOnInit(): void {

    this.userSession = JSON.parse(sessionStorage.getItem('user') ?? '');
   
  
  }

  getAttendanceRequestListByEmpId() {
    this.arrayList = [];
    this.attendanceService.getAttendanceRequestListByEmpId(this.userSession.id).subscribe((res: any) => {
      if (res.status) {
        this.arrayList = res.data;
        this.dataSource = new MatTableDataSource(this.arrayList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.arrayList = [];
        this.dataSource = new MatTableDataSource(this.arrayList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  };
  Searchform() {
    this.arrayList=[];
    this.dataSource = new MatTableDataSource( this.arrayList);
    let fromDate = this.datePipe.transform(this.searchForm.controls.fromDate.value, "y-MM-d");
    let toDate = this.datePipe.transform(this.searchForm.controls.toDate.value, "y-MM-d");
    this.arrayList = [];
    this.attendanceService.getAttendanceRequestListByEmpId(this.userSession.id).subscribe((res: any) => {
      if (res.status) {
        this.arrayList = res.data;
        this.dataSource = new MatTableDataSource(this.arrayList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.arrayList = [];
        this.dataSource = new MatTableDataSource(this.arrayList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
 
  }

  

 resetform() {
  this.dataSource.data = [];
  this.searchForm.reset();
  this.searchForm.controls.fromDate.setValue(new Date());
    this.searchForm.controls.toDate.setValue(new Date());
    this.searchForm.controls.Users.setValue('0');
    this.Searchform();
  
   
   
  }
  fromDateChange(type: string, event: MatDatepickerInputEvent<Date>) {
    this.minToDate = event.value;
    if (event.value !== null) {
      this.maxToDate = new Date(
        event!.value.getFullYear(),
        event!.value.getMonth(),
        event!.value.getDate() + 30
      );
    }
  }

  toDateChange(type: string, event: MatDatepickerInputEvent<Date>) {
    this.maxFromDate = event.value;
    if (event.value !== null) {
      this.minFromDate = new Date(
        event!.value.getFullYear(),
        event!.value.getMonth(),
        event!.value.getDate() - 30
      );
    }
  }
}
