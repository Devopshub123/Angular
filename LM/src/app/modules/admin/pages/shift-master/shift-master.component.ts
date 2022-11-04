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

  ATT65: any;
  ATT66: any;
  ATT67: any;
  ATT68: any;
  statusEmployeExist: any;
  ATT75: any;
  ATT76: any;
  mintime: any;
  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private router: Router,
    public reportsService: ReportsService
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
    this.userSession = JSON.parse(sessionStorage.getItem('user') ?? '');
    this.getAllShifts();
    this.shiftForm.get('startTime')?.valueChanges.subscribe((selectedValue) => {
      this.mintime = selectedValue;
      this.starttime = this.pipe.transform(
        selectedValue,
        'dd/MM/yyyy, HH:mm:ss'
      );
    });
    // this.shiftForm.get('endTime')?.valueChanges.subscribe((selectedValue) => {
    //   this.endtime = this.pipe.transform(selectedValue, 'dd/MM/yyyy, HH:mm:ss');
    //   console.log(this.endtime);
    //   this.getDifference(this.starttime, this.endtime);
    // });
    this.shiftForm.get('endTime')?.valueChanges.subscribe((selectedValue) => {
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
    });
  }
  ngAfterViewInit() {}
  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }
  getDifference(start: string, stop: string) {
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

  getTimestamp(time: string) {
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
      resMessage = this.ATT65;
    } else {
      resMessage = this.ATT67;
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
          data: this.ATT68,
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
    if (this.dataSource.data.length > 20) {
      return [5, 10, 20, this.dataSource.data.length];
    } else {
      return [5, 10, 20];
    }
  }
  getMessagesList() {
    let data = {
      code: null,
      pagenumber: 1,
      pagesize: 100,
    };
    this.adminService.getMessagesListApi(data).subscribe((res: any) => {
      if (res.status) {
        this.messagesDataList = res.data;
        this.messagesDataList.forEach((e: any) => {
          if (e.code == 'ATT2') {
            this.requiredOption = e.message;
          } else if (e.code == 'ATT1') {
            this.requiredField = e.message;
          } else if (e.code == 'ATT62') {
            this.recordExist = e.message;
          } else if (e.code == 'ATT63') {
            this.dataSave = e.message;
          } else if (e.code == 'ATT64') {
            this.dataNotSave = e.message;
          } else if (e.code == 'ATT65') {
            this.ATT65 = e.message;
          } else if (e.code == 'ATT66') {
            this.ATT66 = e.message;
          } else if (e.code == 'ATT67') {
            this.ATT67 = e.message;
          } else if (e.code == 'ATT68') {
            this.ATT68 = e.message;
          }
        });
      } else {
        this.messagesDataList = [];
      }
    });
  }
}
