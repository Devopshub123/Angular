import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { AttendanceService } from '../attendance.service';

interface IdName {
  id: string;
  name: string;
}
@Component({
  selector: 'app-attendance-request-behalf',
  templateUrl: './attendance-request-behalf.component.html',
  styleUrls: ['./attendance-request-behalf.component.scss']
})
export class AttendanceRequestBehalfComponent implements OnInit {

  requestform!: FormGroup;
  fromDate: any;
  toDate: any;
  today: Date = new Date();
  minDate = new Date('1950/01/01'); maxDate = new Date('2050/01/01'); 
  pipe = new DatePipe('en-US');
  todayWithPipe: any;
  displayedColumns: string[] = ['id', 'worktype', 'fromdate', 'todate', 'reason', 'status'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
 
  arrayList: any=[];

  workTypeData: any;
  userSession: any;
  shiftData: any;
  constructor(private formBuilder: FormBuilder, private attendanceService: AttendanceService,
     public dialog: MatDialog, public datePipe: DatePipe,private router: Router) {
    // Create 100 users

    // Assign the data to the data source for the table to render
 
  }

  ngOnInit(): void {
    this.todayWithPipe = this.pipe.transform(Date.now(), 'dd/MM/yyyy');
    this.requestform = this.formBuilder.group(
      {
        appliedDate: [this.todayWithPipe, Validators.required],
        employeeName:['',Validators.required],
        shift: ['', Validators.required],
        fromDate: ['', Validators.required],
        toDate: ['', Validators.required],
        workType: ['', Validators.required],
        reason: ['', Validators.required],

      });
    this.userSession = JSON.parse(sessionStorage.getItem('user') ?? '');
    console.log(this.userSession)
    console.log(this.userSession.id)
    this.getWorkypeList();
    this.getEmployeeShiftDetails()
    this.getAttendanceRequestListByEmpId();

  }
  ngAfterViewInit() {
 
  }
  getEmployeeShiftDetails() {
    this.attendanceService.getShiftDetailsByEmpId(this.userSession.id).subscribe((res) => {
      if (res) {
        this.shiftData = res.data[0];
        this.requestform.controls.shift.setValue(this.shiftData.shiftname);
      }
    })
  }
  getWorkypeList() {
    this.attendanceService.getWorkypeList('attendancetypesmaster', 'active', 1, 100, 'boon_client').subscribe((info) => {
      if (info.status && info.data.length != 0) {

        this.workTypeData = info.data;

      }

    })

  }
  getAttendanceRequestListByEmpId() {
    this.arrayList = [];
    this.attendanceService.getAttendanceRequestListByEmpId(this.userSession.id).subscribe((res) => {
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
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  saveConsultation() {
    let obj = {
      "empid": this.userSession.id ?? '',
      "shiftid": this.shiftData.shiftid,
      "worktype": this.requestform.controls.workType.value,
      "fromdate": this.pipe.transform(new Date(this.requestform.controls.fromDate.value??''), 'yyyy-MM-dd'),//this.datePipe.transform(this.requestform.controls.fromDate.value, "y-MM-d"),
      "todate": this.pipe.transform(new Date(this.requestform.controls.toDate.value??''), 'yyyy-MM-dd'),//this.requestform.controls.toDate.value,
      "logintime": this.shiftData.fromtime,
      "logouttime": this.shiftData.totime,
      "reason": this.requestform.controls.reason.value,
      "raisedby": this.requestform.controls.employeeName.value,
      "approvercomments": '',
      "actionby": null,
      "status": 'Submitted'

    };


    this.attendanceService.setemployeeattendanceregularization(obj).subscribe((res) => {
      if (res.status) {
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          disableClose: true,
          data: res.message
        });
        this.resetform();
        // this. getAttendanceRequestListByEmpId();
      }
    })
  }
  resetform() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    this.router.navigate(["/Attendance/AttendanceRequest"]));
  }
}

