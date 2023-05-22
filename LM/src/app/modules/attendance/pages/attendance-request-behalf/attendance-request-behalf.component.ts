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
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { environment } from 'src/environments/environment';

import * as _moment from 'moment';
import { EmsService } from 'src/app/modules/ems/ems.service';
// import {default as _rollupMoment} from 'moment';
const moment =  _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
interface IdName {
  id: string;
  name: string;
}
@Component({
  selector: 'app-attendance-request-behalf',
  templateUrl: './attendance-request-behalf.component.html',
  styleUrls: ['./attendance-request-behalf.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
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
  employeeEmailData: any = [];
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
  workeddays:any;
  regularizationdays:any;
  myDateFilter: any;
  ATT75:any;
  companyDBName:any = environment.dbName;
  constructor(private formBuilder: FormBuilder, private attendanceService: AttendanceService,
    public dialog: MatDialog, public datePipe: DatePipe, private router: Router,
    private location: Location,private adminService: AdminService,private emsService: EmsService) {
    this.minFromDate = new Date();
    this.minFromDate.setDate(this.currentDate.getDate() - 31);
    this.maxFromDate = new Date();
    this.maxFromDate.setDate(this.currentDate.getDate());
    this.minToDate = new Date();
    this.minToDate.setDate(this.currentDate.getDate() - 31);
    this.maxToDate = new Date();
    this.maxToDate.setDate(this.currentDate.getDate());
  }

  ngOnInit(): void {
    this.getMessagesList()
    this.userData = this.location.getState();
    this.todayWithPipe = this.pipe.transform(Date.now(), 'dd-MM-yyyy');
    this.requestform = this.formBuilder.group(
      {
        appliedDate: [{ value: this.todayWithPipe, disabled: true }, Validators.required],
        shift: ['', Validators.required],
        fromDate: [{ value: '', disabled: true }, Validators.required],
        toDate: [{ value: '', disabled: true }, Validators.required],
        employeeName: ['', Validators.required],
        workType: [{ value: '', disabled: true }, Validators.required],
        reason: ['', Validators.required],

      });
    this.userSession = JSON.parse(sessionStorage.getItem('user') ?? '');
    this.getWorkypeList();
    this.getEmployeeListByManagerId()
    this.getAttendanceRequestListByEmpId();

    this.requestform.get("employeeName")?.valueChanges.subscribe(selectedValue => {
     this.getEmployeeEmailData(selectedValue);
     this.getEmployeeInformation(selectedValue)
     this.requestform.get('workType')?.enable();
     this.getEmployeeWeekoffsHolidaysForAttendance();

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
        this.minToDate=new Date(this.userData.userData.absent_date);
      this.requestform.controls.employeeName.setValue(this.userData.userData.emp_id);
      this.getEmployeeWeekoffsHolidaysForAttendance();
      this.getEmployeeShiftDetailsByIdWithDates();
    } else {

    }
    this.requestform.get('workType')?.valueChanges.subscribe(selectedValue => {
      if (selectedValue) {
        if (this.userData.userData != undefined) {
          this.requestform.get('fromDate')?.disable()
        }
        else{
          this.requestform.get('fromDate')?.enable()
        }

        if (selectedValue == "2") {
         // this.requestform.get('toDate')?.enable();
        } else {
          this.requestform.get('toDate')?.disable();
          this.requestform.get('toDate')?.setValue(this.requestform.get('fromDate')?.value);
        //  this.getEmployeeShiftDetailsByIdWithDates();
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
      this.requestform.get('toDate')?.enable();
    } else {
      this.requestform.get('toDate')?.setValue(event.value);
      this.getEmployeeShiftDetailsByIdWithDates();
    }
  }

  toDateChange(type: string, event: any) {
    this.maxFromDate = event.value;
    if (event.value !== null) {
      this.minFromDate = new Date(
        event.value['_i'].year,
        event.value['_i'].month,
        event.value['_i'].date - 31
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
                data: this.ATT75

                // data: "Unable to request. please check the configure shift."
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
          this.requestform.controls.fromDate.reset();
          return;
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
          this.workeddays = JSON.parse(this.datesList[0].workeddays);
          this.regularizationdays = JSON.parse(this.datesList[0].regularizationdays);
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
          if (this.workeddays.length > 0) {
            this.workeddays.forEach((i: any) => {
              let date = i + ' ' + '00:00:00'
              this.disableDates.push(new Date(date));
            });
          }
          if (this.regularizationdays.length > 0) {
            this.regularizationdays.forEach((i: any) => {
              let date = i + ' ' + '00:00:00'
              this.disableDates.push(new Date(date));
            });
          }

          this.myDateFilter = (d: Date): boolean => {
            let isValid=true;
          this.disableDates.forEach((e:any) => {
            if(this.pipe.transform(e, 'yyyy/MM/dd') == this.pipe.transform(d, 'yyyy/MM/dd')){
              isValid=false;
            }
          });

            return isValid;


           }
        }
      }
    });
  }
  getWorkypeList() {
    this.attendanceService.getWorkypeList('attendancetypesmaster', 'active', 1, 100, this.companyDBName).subscribe((info) => {
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
        "status": 'Approved',
        "emails": this.employeeEmailData,
        "isBehalf":true

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
  getEmployeeEmailData(userid:any) {
    this.employeeEmailData = [];
    this.emsService.getEmployeeEmailDataByEmpid(userid)
      .subscribe((res: any) => {
        this.employeeEmailData = JSON.parse(res.data[0].jsonvalu)[0];
      })
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

  var customPageSizeArray = [];
  if (this.dataSource.data.length > 5) {
    customPageSizeArray.push(5);
  }
  if (this.dataSource.data.length > 10) {
    customPageSizeArray.push(10);
  }
  if (this.dataSource.data.length > 20) {
    customPageSizeArray.push(20);
  }
  customPageSizeArray.push(this.dataSource.data.length);
  return customPageSizeArray;
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
        } else if (e.code == "ATT75") {
          this.ATT75 =e.message
        }
      })
     }
     else {
       this.messagesDataList = [];
     }

   })
 }
 getEmployeeInformation(id:any){
  this.attendanceService.getEmployeeInformationforlogindate(id).subscribe((res) => {
    if(res.status){
      var userinfo=res.data[0];
      if(userinfo.dateofjoin !=null){
        const dateofjoin = new Date(userinfo.dateofjoin);
        const mindate = new Date(this.minFromDate);
        if (mindate < dateofjoin) {
           this.minFromDate=dateofjoin;
        }
      }

    }


  })

 }
}

