import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { AttendanceService } from '../../attendance.service';
import { Location } from '@angular/common';
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
  minFromDate: Date;
  maxFromDate: Date|null ;
  minToDate: Date | null;
  maxToDate: Date;
  currentDate:Date =new Date();
  pipe = new DatePipe('en-US');
  todayWithPipe: any;
  displayedColumns: string[] = ['id', 'worktype', 'fromdate', 'todate', 'reason', 'status'];
  dataSource: MatTableDataSource<any>=<any>[];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  arrayList: any = [];

  workTypeData: any;
  userSession: any;
  shiftData: any;
  employeesData: any;
  userData: any;
  constructor(private formBuilder: FormBuilder, private attendanceService: AttendanceService,
    public dialog: MatDialog, public datePipe: DatePipe, private router: Router,
    private location:Location) {
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
    this.userData = this.location.getState();
    this.todayWithPipe = this.pipe.transform(Date.now(), 'dd/MM/yyyy');
    this.requestform = this.formBuilder.group(
      {
        appliedDate: [this.todayWithPipe, Validators.required],
        shift: ['', Validators.required],
        fromDate: ['', Validators.required],
        toDate: ['', Validators.required],
        employeeName: ['', Validators.required],
        workType: ['', Validators.required],
        reason: ['', Validators.required],

      });
    this.userSession = JSON.parse(sessionStorage.getItem('user') ?? '');
    console.log(this.userSession)
    console.log(this.userSession.id)
    this.getWorkypeList();
    this.getEmployeeListByManagerId()
    this.getAttendanceRequestListByEmpId();
    this.requestform.get("employeeName")?.valueChanges.subscribe(selectedValue => {
      console.log(selectedValue)
      this.getEmployeeShiftDetails(selectedValue);

    })
    if(this.userData.userData!=undefined){
      this.requestform.controls.fromDate.setValue(new Date(this.userData.userData.attendancedate));
      this.requestform.controls.toDate.setValue(new Date(this.userData.userData.attendancedate)); 
      this.requestform.controls.employeeName.setValue(this.userData.userData.empid);
    }

  }
  ngAfterViewInit() {

  }
  get f(): { [key: string]: AbstractControl } {
    return this.requestform.controls;
  }
  fromDateChange(type: string, event: MatDatepickerInputEvent<Date>) {
    console.log(`${type}: ${event.value}`);
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
  getEmployeeListByManagerId() {
    this.attendanceService.getgetemployeesByMangerId(this.userSession.id).subscribe((res) => {
      if (res) {
        this.employeesData = res.data;

      }
    })
  }

  getEmployeeShiftDetails(selectedValue: any) {
    //
    this.attendanceService.getShiftDetailsByEmpId(selectedValue).subscribe((res) => {
      if (res.status) {
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
    this.attendanceService.getAttendanceRegularizationByManagerId(this.userSession.id).subscribe((res) => {
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
    if (this.requestform.invalid) {
      return;
    } else {
      let obj = {
        "empid": this.requestform.controls.employeeName.value,
        "shiftid": this.shiftData.shiftid,
        "worktype": this.requestform.controls.workType.value,
        "fromdate": this.pipe.transform(new Date(this.requestform.controls.fromDate.value ?? ''), 'yyyy-MM-dd'),//this.datePipe.transform(this.requestform.controls.fromDate.value, "y-MM-d"),
        "todate": this.pipe.transform(new Date(this.requestform.controls.toDate.value ?? ''), 'yyyy-MM-dd'),//this.requestform.controls.toDate.value,
        "logintime": this.shiftData.fromtime,
        "logouttime": this.shiftData.totime,
        "reason": this.requestform.controls.reason.value,
        "raisedby": this.userSession.id ?? '',
        "approvercomments": '',
        "actionby": this.userSession.id ?? '',
        "status": 'Approved'

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
  }
  resetform() {
    //this.requestform.reset();
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/Attendance/RequestofEmployee"]));
  }
}

