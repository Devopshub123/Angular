import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidatorFn,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EmsService } from 'src/app/modules/ems/ems.service';
import { ReportsService } from 'src/app/modules/reports/reports.service';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-shift-master',
  templateUrl: './shift-master.component.html',
  styleUrls: ['./shift-master.component.scss'],
})
export class ShiftMasterComponent implements OnInit {
  shiftForm!: FormGroup;
  pipe = new DatePipe('en-US');
  todayWithPipe: any;
  displayedColumns: string[] = [
    'id',
    'shiftname',
    'starttime',
    'endtime',
    'workinghours',
    'status',
    'action',
  ];
  dataSource: MatTableDataSource<any> = <any>[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  arrayList: any = [];
  workTypeData: any;
  userSession: any;
  shifDetails: any;
  arrayValue: any;
  starttime: any;
  endtime: any;
  ishide:boolean=true;
  overTimeList = [
    { id: '00:30:00', name: '00:30' },
    { id: '01:00:00', name: '01:00' },
    { id: '01:30:00', name: '01:30' },
    { id: '02:00:00', name: '02:00' },
    { id: '02:30:00', name: '02:30' },
    { id: '03:00:00', name: '03:00' },
    { id: '03:30:00', name: '03:30' },
    { id: '04:00:00', name: '04:00' },
    { id: '04:30:00', name: '04:30' },
    { id: '05:00:00', name: '05:00' },
    { id: '05:30:00', name: '05:30' },
    { id: '06:00:00', name: '06:00' },
    { id: '06:30:00', name: '06:30' },
  ];
  daysList = ['0.5', '1', '2', '3', '4', '5'];
  isEdit: boolean = false;
  pageLoading = true;
  messagesDataList: any = [];
  requiredField: any;
  requiredOption: any;
  dataSave: any;
  dataNotSave: any;
  recordExist: any;
  starttimeflag:boolean=false;

  EM120: any;
  EM121: any;
  EM122: any;
  EM123: any;
  statusEmployeExist: any;
  mintime: any;
  isdata: boolean = true;
  isAdd: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private router: Router,
    public reportsService: ReportsService,
    public emsService:EmsService
  ) {}
  employeelist: any;
  ngOnInit(): void {
    // this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.getstatuslist();
    this.getMessagesList();
    this.todayWithPipe = this.pipe.transform(Date.now(), 'yyyy/MM/dd');
    this.shiftForm = this.formBuilder.group({
      shift: ['', [Validators.required, this.noWhitespaceValidator()]],
      description: [''],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      totalHours: [{ value: '', disabled: true }, Validators.required],
      graceInTime: ['', Validators.required],
      graceOutTime: ['', Validators.required],
      noofTimes: ['', Validators.required],
      noofDays: ['', Validators.required],
      leaveType: ['Leave', Validators.required],
      overTime: ['', Validators.required],
    });
    this.shiftForm.controls.endTime.disable();
    this.userSession = JSON.parse(sessionStorage.getItem('user') ?? '');
    this.getAllShifts();
    this.shiftForm.get('startTime')?.valueChanges.subscribe((selectedValue) => {
      this.mintime = selectedValue;
      // this.starttimeflag=true;
      this.starttime = this.pipe.transform(
        selectedValue,
        'dd/MM/yyyy, HH:mm:ss'
      );
      this.shiftForm.controls.endTime.enable();

    });
    // this.shiftForm.get('endTime')?.valueChanges.subscribe((selectedValue) => {
    //   this.endtime = this.pipe.transform(selectedValue, 'dd/MM/yyyy, HH:mm:ss');
    //   this.getDifference(this.starttime, this.endtime);
    // });
    this.shiftForm.get('endTime')?.valueChanges.subscribe((selectedValue) => {
      if(selectedValue!=''){
      if (this.mintime == selectedValue) {
        selectedValue = '';
        this.shiftForm.get('endTime')?.setValue('');
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
          data: 'Please change endtime',
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.shiftForm.get('endTime')?.setValue('');
        });
      } else if (
        this.pipe.transform(this.mintime, 'HH:mm') ==
        this.pipe.transform(selectedValue, 'HH:mm')
      ) {
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
          data: 'Please change endtime',
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.shiftForm.get('endTime')?.setValue('');
        });
      } else {
        this.endtime = this.pipe.transform(
          selectedValue,
          'dd/MM/yyyy, HH:mm:ss'
        );
        this.getDifference(this.starttime, this.endtime);
      }
    }
    });
  }
  Add() {
    this.isAdd = true;
    this.isdata = false;
  }
  ngAfterViewInit() {}
  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }
  getDifference(start: any, stop: any) {
    // getting startTime timestamp:
     let startTimestamp = this.getTimestamp(start);
    // getting stopTime timestamp:
    let stopTimestamp = this.getTimestamp(stop);
    // getting the difference in various formats:
    // hh:mm:ss
    let differenceInSecs = stopTimestamp - startTimestamp;
    let inHhMmSsFormat = new Date(differenceInSecs * 1000)
      .toISOString()
      .slice(11, 19);
    this.shiftForm.controls.totalHours.setValue(inHhMmSsFormat);
  }

  getTimestamp(time: any) {
    let timeFirst = time.split(', ')[0].split('/');
    let timeY = timeFirst[2];
    let timeM = timeFirst[1];
    let timeD = timeFirst[0];
    let timeSecond = time.split(', ')[1];
    let timestamp =
      new Date(
        Date.parse(
          timeY + '-' + timeM + '-' + timeD + ' ' + timeSecond + '+0000'
        )
      ).getTime() / 1000;
    return timestamp;
  }
  getAllShifts() {
    this.arrayList = [];
    this.adminService.getAllShifts().subscribe((res: any) => {
      if (res.status) {
        this.arrayList = res.data;
        this.dataSource = new MatTableDataSource(this.arrayList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageLoading = false;
      } else {
        this.arrayList = [];
        this.dataSource = new MatTableDataSource(this.arrayList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  changeEndTime(event: any) {
  }
  saveShiftData() {
    if (this.shiftForm.invalid) {
      return;
    } else {
      if (this.arrayList.length > 0) {
        let index = this.arrayList.findIndex(
          (e: any) => e.shiftname === this.shiftForm.controls.shift.value
        );
        if (index == 0) {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: this.recordExist,
          });
        } else {
          let startTime = this.pipe.transform(
            new Date(this.shiftForm.controls.startTime.value),
            'HH:mm:ss'
          );
          let endTime = this.pipe.transform(
            new Date(this.shiftForm.controls.endTime.value),
            'HH:mm:ss'
          );
          let graceInTime = this.pipe.transform(
            new Date(this.shiftForm.controls.graceInTime.value),
            'HH:mm:ss'
          );
          let graceOutTime = this.pipe.transform(
            new Date(this.shiftForm.controls.graceOutTime.value),
            'HH:mm:ss'
          );
          let overTime = this.shiftForm.controls.overTime.value;

          let obj = {
            shift_name: this.shiftForm.controls.shift.value,
            shiftdescription: this.shiftForm.controls.description.value,
            from_time: startTime,
            to_time: endTime,
            total_hours: this.shiftForm.controls.totalHours.value,
            grace_intime: graceInTime,
            grace_outtime: graceOutTime,
            max_lates: this.shiftForm.controls.noofTimes.value,
            leave_deduction_count: this.shiftForm.controls.noofDays.value,
            leavetype_for_deduction: this.shiftForm.controls.leaveType.value,
            overtimeduration: overTime,
            status: 1,
            created_by: this.userSession.id,
          };

          this.adminService.setShiftMaster(obj).subscribe((res: any) => {
            if (res.status) {
              let resMessage: any;
              if (res.message == 'dataSave') {
                resMessage = this.dataSave;
              } else {
                resMessage = this.dataNotSave;
              }
              let dialogRef = this.dialog.open(ReusableDialogComponent, {
                position: { top: `70px` },
                disableClose: true,
                data: resMessage,
              });
              this.resetform();
              // this. getAttendanceRequestListByEmpId();
            }
          });
        }
      } else {
        let startTime = this.pipe.transform(
          new Date(this.shiftForm.controls.startTime.value),
          'HH:mm:ss'
        );
        let endTime = this.pipe.transform(
          new Date(this.shiftForm.controls.endTime.value),
          'HH:mm:ss'
        );
        let graceInTime = this.pipe.transform(
          new Date(this.shiftForm.controls.graceInTime.value),
          'HH:mm:ss'
        );
        let graceOutTime = this.pipe.transform(
          new Date(this.shiftForm.controls.graceOutTime.value),
          'HH:mm:ss'
        );
        let overTime = this.shiftForm.controls.overTime.value;

        let obj = {
          shift_name: this.shiftForm.controls.shift.value,
          shiftdescription: this.shiftForm.controls.description.value,
          from_time: startTime,
          to_time: endTime,
          total_hours: this.shiftForm.controls.totalHours.value,
          grace_intime: graceInTime,
          grace_outtime: graceOutTime,
          max_lates: this.shiftForm.controls.noofTimes.value,
          leave_deduction_count: this.shiftForm.controls.noofDays.value,
          leavetype_for_deduction: this.shiftForm.controls.leaveType.value,
          overtimeduration: overTime,
          status: 1,
          created_by: this.userSession.id,
        };

        this.adminService.setShiftMaster(obj).subscribe((res: any) => {
          if (res.status) {
            let resMessage: any;
            if (res.message == 'dataSave') {
              resMessage = this.dataSave;
            } else {
              resMessage = this.dataNotSave;
            }
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
              data: resMessage,
            });
            this.resetform();
            // this. getAttendanceRequestListByEmpId();
          }
        });
      }
    }
  }
  resetform() {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/Admin/Shift']));
  }
  status(status: any, shiftid: any) {
     let data = {
      shift_id: shiftid,
      status_value: status,
    };
    let resMessage: any;
    if (status == '1') {
      resMessage = this.EM120;
    } else {
      resMessage = this.EM122;
    }
    this.adminService.updateShiftStatus(data).subscribe((result: any) => {
      if (result.status) {
        let response: any;
        if (result.message == 'statusUpdated') {
          response = resMessage;
        }
        this.ngOnInit();
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
          data: response,
        });
        this.resetform();
      } else {
        this.resetform();
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
          data: this.EM123,
        });
      }
    });
  }
  getstatuslist() {
    this.adminService.getstatuslists().subscribe((result: any) => {
      if (result.status) {
        this.arrayValue = result.data;
      }
    });
  }
  view(data: any) {
    this.isAdd = true;
    this.isdata = false;
    this.adminService
      .getShiftsDetailsById(data.shiftid)
      .subscribe((res: any) => {
        if (res.status) {
          this.isEdit = true;
          this.shifDetails = res.data[0];
          this.shiftForm.controls.shift.setValue(this.shifDetails.shiftname);
          this.shiftForm.controls.shift.disable();
          this.shiftForm.controls.description.setValue(
            this.shifDetails.shift_description
          );
          this.shiftForm.controls.description.disable();
          let fromtime = this.todayWithPipe + ' ' + this.shifDetails.fromtime;
          this.shiftForm.controls.startTime.setValue(new Date(fromtime));
          this.shiftForm.controls.startTime.disable();
          let totime = this.todayWithPipe + ' ' + this.shifDetails.totime;
          this.shiftForm.controls.endTime.setValue(new Date(totime));
          this.shiftForm.controls.endTime.disable();
          this.shiftForm.controls.totalHours.setValue(
            this.shifDetails.totalhours
          );
          this.shiftForm.controls.totalHours.disable();
          let intime =
            this.todayWithPipe + ' ' + this.shifDetails.graceperiod_intime;
          this.shiftForm.controls.graceInTime.setValue(new Date(intime));
          this.shiftForm.controls.graceInTime.disable();
          let outtime =
            this.todayWithPipe + ' ' + this.shifDetails.graceperiod_outtime;
          this.shiftForm.controls.graceOutTime.setValue(new Date(outtime));
          this.shiftForm.controls.graceOutTime.disable();
          this.shiftForm.controls.noofTimes.setValue(
            this.shifDetails.max_lates_count_per_month
          );
          this.shiftForm.controls.noofTimes.disable();
          this.shiftForm.controls.noofDays.setValue(
            this.shifDetails.leave_deduction_amount_post_lates_limit.toString()
          );
          this.shiftForm.controls.noofDays.disable();
          let overtime = this.shifDetails.min_duration_for_overtime;
          this.shiftForm.controls.overTime.setValue(overtime);
          this.shiftForm.controls.overTime.disable();
        }
      });
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
    let data = {
      code: null,
      pagenumber: 1,
      pagesize: 1000,
    };
    this.emsService.getMessagesListApi(data).subscribe((res: any) => {
      if (res.status) {
        this.messagesDataList = res.data;
        this.messagesDataList.forEach((e: any) => {
          if (e.code == 'EM2') {
            this.requiredOption = e.message;
          } else if (e.code == 'EM1') {
            this.requiredField = e.message;
          } else if (e.code == 'EM5') {
            this.recordExist = e.message;
          } else if (e.code == 'EM117') {
            this.dataSave = e.message;
          } else if (e.code == 'EM119') {
            this.dataNotSave = e.message;
          } else if (e.code == 'EM120') {
            this.EM120 = e.message;
          } else if (e.code == 'EM121') {
            this.EM121 = e.message;
          } else if (e.code == 'EM122') {
            this.EM122 = e.message;
          } else if (e.code == 'EM123') {
            this.EM123 = e.message;
          }
        });
      } else {
        this.messagesDataList = [];
      }
    });
  }
}
