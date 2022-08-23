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
import { AdminService } from 'src/app/modules/admin/admin.service';
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
  maxFromDate: Date | null;
  minToDate: Date | null;
  maxToDate: Date;
  currentDate: Date = new Date();
  pipe = new DatePipe('en-US');
  todayWithPipe: any;
  displayedColumns: string[] = ['id', 'applieddate', 'worktype', 'raisedbyname', 'shift', 'fromdate', 'todate', 'reason', 'status'];
  dataSource: MatTableDataSource<any> = <any>[];

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
  pageLoading = true;
  messagesDataList: any = [];
requiredField: any;
requiredOption: any;
dataSaved: any;
dataNotSaved: any;
  disableDates:any= [];
  datesList: any;
  weekoffs: any;
  holidays: any;
  leaves: any;
  myDateFilter: any;
  constructor(private formBuilder: FormBuilder, private attendanceService: AttendanceService,
    public dialog: MatDialog, public datePipe: DatePipe, private router: Router,
    private location: Location,private adminService: AdminService) {
    this.minFromDate = new Date();
    this.minFromDate.setDate(this.currentDate.getDate() - 31);
    this.maxFromDate = new Date();
    this.maxFromDate.setDate(this.currentDate.getDate() -1);
    this.minToDate = new Date();
    this.minToDate.setDate(this.currentDate.getDate() - 31);
    this.maxToDate = new Date();
    this.maxToDate.setDate(this.currentDate.getDate() -1);
  }

  ngOnInit(): void {
    this.getMessagesList()
    this.userData = this.location.getState();
    this.todayWithPipe = this.pipe.transform(Date.now(), 'dd/MM/yyyy');
    this.requestform = this.formBuilder.group(
      {
        appliedDate: [{ value: this.todayWithPipe, disabled: true }, Validators.required],
        shift: ['', Validators.required],
        fromDate: ['', Validators.required],
        toDate: ['', Validators.required],
        employeeName: ['', Validators.required],
        workType: ['', Validators.required],
        reason: ['', Validators.required],

      });
    this.userSession = JSON.parse(sessionStorage.getItem('user') ?? '');
    this.getWorkypeList();
    this.getEmployeeListByManagerId()
    this.getAttendanceRequestListByEmpId();

    this.requestform.get("employeeName")?.valueChanges.subscribe(selectedValue => {
     // this.getEmployeeShiftDetails(selectedValue);

    })
    if (this.userData.userData != undefined) {
    //  this.getEmployeeShiftDetails(this.userData.userData.emp_id);

      this.requestform = this.formBuilder.group(
        {
          appliedDate: [{ value: this.todayWithPipe, disabled: true }, Validators.required],
          shift: ['', Validators.required],
          fromDate: [{ value: new Date(this.userData.userData.absent_date), disabled: true }, Validators.required],
          toDate: [{ value: new Date(this.userData.userData.absent_date), disabled: true }, Validators.required],
          employeeName: [{ value: '', disabled: true }, Validators.required],
          workType: ['', Validators.required],
          reason: ['', Validators.required],
        });
      this.requestform.controls.employeeName.setValue(this.userData.userData.emp_id);
      this.getEmployeeWeekoffsHolidaysForAttendance();
      this.getEmployeeShiftDetailsByIdWithDates();
    } else {

    }
    this.requestform.get('workType')?.valueChanges.subscribe(selectedValue => {
      if (selectedValue) {
        if (selectedValue == "2") {
          this.requestform.get('toDate')?.enable();
        } else {
          this.requestform.get('toDate')?.disable();
          this.requestform.get('toDate')?.setValue(this.requestform.get('fromDate')?.value);
          this.getEmployeeShiftDetailsByIdWithDates();
        }
      }
    });
  }
  ngAfterViewInit() {

  }
  get f(): { [key: string]: AbstractControl } {
    return this.requestform.controls;
  }
  fromDateChange(type: string, event: MatDatepickerInputEvent<Date>) {
    this.minToDate = event.value;
    if (event.value !== null) {
      // this.maxToDate = new Date(
      //   event!.value.getFullYear(),
      //   event!.value.getMonth(),
      //   event!.value.getDate() + 30
      // );
    }
    if (this.requestform.get('workType')?.value == "2") {

    } else {
      this.requestform.get('toDate')?.setValue(event.value);
      this.getEmployeeShiftDetailsByIdWithDates();
    }
  }

  toDateChange(type: string, event: MatDatepickerInputEvent<Date>) {
    this.maxFromDate = event.value;
    if (event.value !== null) {
      this.minFromDate = new Date(
        event!.value.getFullYear(),
        event!.value.getMonth(),
        event!.value.getDate() - 31
      );
    }
      this.getEmployeeShiftDetailsByIdWithDates();
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
        this.requestform.controls.shift.disable();
      }
    })
  }
  getEmployeeShiftDetailsByIdWithDates() {
    let data={
      "employee_id":this.requestform.controls.employeeName.value ?? '',
      "fromd_date": this.pipe.transform(new Date(this.requestform.controls.fromDate.value ?? ''), 'yyyy-MM-dd'),
      "to_date": this.pipe.transform(new Date(this.requestform.controls.toDate.value ?? ''), 'yyyy-MM-dd'),    }
    this.attendanceService.getEmployeeShiftByDates(data).subscribe((res:any)=>{
      if (res.status) {

        if(res.data.length>0){
             if(res.data.length>1){
              let dialogRef = this.dialog.open(ReusableDialogComponent, {
                position: { top: `70px` },
                disableClose: true,
                data: "Unable to request. please check the configure shift."
              });
             }else{
              this.shiftData = res.data[0];
              this.requestform.controls.shift.setValue(this.shiftData.shiftname);
             }
        }else{
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: "Unable to request. please configure the shift before request"
          });
        }


      }
    });
  }
  getEmployeeWeekoffsHolidaysForAttendance() {
    let data = {
      "employee_id": this.requestform.controls.employeeName.value ?? '',
    }
    this.attendanceService.getEmployeeWeekoffsHolidaysForAttendance(data).subscribe((res: any) => {
      this.disableDates = [];
      if (res.status) {

        if (res.data.length > 0) {
          this.datesList = res.data;
          this.weekoffs = JSON.parse(this.datesList[0].weekoffs);
          this.holidays = JSON.parse(this.datesList[0].holidays);
          this.leaves = JSON.parse(this.datesList[0].leaves);
          if (this.weekoffs.length > 0) {
            this.weekoffs.forEach((i: any) => {
              let date = i + ' ' + '00:00:00'
              this.disableDates.push(new Date(date));
            });
          }
          if (this.holidays.length > 0) {
            this.holidays.forEach((i: any) => {
              let date = i + ' ' + '00:00:00'
              this.disableDates.push(new Date(date));
            });
          }
          if (this.leaves.length > 0) {
            this.leaves.forEach((i: any) => {
              let date = i + ' ' + '00:00:00'
              this.disableDates.push(new Date(date));
            });
          }
          this.myDateFilter = (d: Date): boolean => {
            let isValid=false;
          this.disableDates.forEach((e:any) => {
            if(this.pipe.transform(e, 'yyyy/MM/dd') == this.pipe.transform(d, 'yyyy/MM/dd')){
              isValid=true
            }
          });

            return isValid;


           }
        }
      }
    });
  }
  getWorkypeList() {
    this.attendanceService.getWorkypeList('attendancetypesmaster', 'active', 1, 100, 'keerthi_hospitals').subscribe((info) => {
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
        this.pageLoading=false;
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
          let resMessage: any;
          if (res.message == "notSave") {
            resMessage = this.dataNotSaved;
          } else if(res.message == "save"){
            resMessage = this.dataSaved;
          } else {
            resMessage = this.dataNotSaved;
          }
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: resMessage
          });
          this.resetform();
          // this. getAttendanceRequestListByEmpId();
        }
      })
    }
  }
  resetform() {
    if (this.userData.userData != undefined) {
      this.router.navigate(["/Attendance/ManagerDashboard"]);
    } else {

      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate(["/Attendance/RequestofEmployee"]));
    }
  }
  getPageSizes(): number[] {
    if (this.dataSource.data.length > 20) {
      return [5, 10, 20, this.dataSource.data.length];
    }
    else {
     return [5, 10, 20];
    }
  }
  getMessagesList() {
    let data =
     {
       "code": null,
       "pagenumber":1,
       "pagesize":100
   }
   this.adminService.getMessagesListApi(data).subscribe((res:any)=>{
     if(res.status) {
       this.messagesDataList = res.data;
       this.messagesDataList.forEach((e: any) => {
        if (e.code == "ATT1") {
         this.requiredField = e.message
        } else if (e.code == "ATT2") {
          this.requiredOption =e.message
        } else if (e.code == "ATT11") {
          this.dataSaved =e.message
        } else if (e.code == "ATT12") {
          this.dataNotSaved =e.message
        }
      })
     }
     else {
       this.messagesDataList = [];
     }

   })
 }
}

