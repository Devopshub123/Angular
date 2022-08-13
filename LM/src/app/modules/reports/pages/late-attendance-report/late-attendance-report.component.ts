import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ExcelServiceService } from '../../excel-service.service';
import { ReportsService } from '../../reports.service';
import { DialogDetailComponent } from '../dialog-detail/dialog-detail.component';
import * as XLSX from 'xlsx';
import { AttendanceService } from 'src/app/modules/attendance/attendance.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
@Component({
  selector: 'app-late-attendance-report',
  templateUrl: './late-attendance-report.component.html',
  styleUrls: ['./late-attendance-report.component.scss']
})
export class LateAttendanceReportComponent implements OnInit {

  List: any[] = [
  ];
  employeelist: any;
  Users: any;
  minDate = new Date('2020/01/01'); maxDate = new Date();
  userSession: any;
  date = new Date();
  firstDay: any;
  lastDay: any;
  startDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
  endDate = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
  dateDayArray: any = [];
  obj: any;
  headersList: any = [];
  @ViewChild('TABLE') table!: ElementRef;
  shiftDataList: any;
  minFromDate: Date;
  maxFromDate: Date | null;
  minToDate: Date | null;
  maxToDate: Date;
  currentDate: Date = new Date();
  pageLoading = true;
  constructor(public reportsService: ReportsService, public datePipe: DatePipe, public formBuilder: FormBuilder,
    public dialog: MatDialog, private excelService: ExcelServiceService, private attendanceService: AttendanceService) {
    this.minFromDate = new Date();
    this.minFromDate.setDate(this.currentDate.getDate() - 90);
    this.maxFromDate = new Date();
    this.minToDate = new Date();
    this.minToDate.setDate(this.currentDate.getDate() - 90);
    this.maxToDate = new Date();
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sorter!: MatSort;
  filter = new FormControl();
  searchForm = this.formBuilder.group({ fromDate: [new Date()], toDate: [new Date()], user: ['0'], shift: ['0'] });
  dataSource: MatTableDataSource<any> = <any>[];
  displayedColumns: string[] = ['sno', 'empid', 'empname', 'shift', 'fromdate',
    'todate', 'intime', 'latehours'];
  isLoading = false;
  ngOnInit() {
    this.userSession = JSON.parse(sessionStorage.getItem('user') ?? '');
    this.getEmployeelist();
    this.getActiveShiftIds();
    this.Searchform();
  }
  getActiveShiftIds() {
    this.attendanceService.getActiveShiftIds().subscribe((res) => {
      if (res.status) {
        this.shiftDataList = res.data;
        this.searchForm.controls.shift.setValue('0');
      }
    })
  }
  
  
  getEmployeelist() {
    let obj = {
      "rm_id": this.userSession.id,
    };
    
    this.reportsService.getTotalEmployeslistByManagerId(obj).subscribe((res: any) => {
      if (res.status) {
        this.employeelist = [];
        this.employeelist = res.data;
        this.searchForm.controls.Users.setValue('0');
      }

    });
  }
  //All Employees API
  Searchform() {
    this.List = [];
    this.dataSource = new MatTableDataSource(this.List);
    let fromDate = this.datePipe.transform(this.searchForm.controls.fromDate.value, "y-MM-dd");
    let toDate = this.datePipe.transform(this.searchForm.controls.toDate.value, "y-MM-dd");
    let userId = this.searchForm.controls.user.value == '0' ? null : this.searchForm.controls.user.value;
    let shift = this.searchForm.controls.shift.value == '0' ? null : this.searchForm.controls.shift.value;

    let data = {};
    data = {
      "manager_empid":this.userSession.id,
      'employee_id': userId,
      'shift_id': shift,
      'from_date': fromDate,
      'to_date': toDate
    }


    this.isLoading = true;
    this.reportsService.getEmployeeLateAttendanceReport(data).subscribe((res: any) => {
      this.headersList = [];
      this.List = [];
      if (res.status) {
        let i = 0;
        this.List = res.data
        this.isLoading = false;
        this.dataSource = new MatTableDataSource(this.List);
        this.dataSource.paginator = this.paginator;
        this.pageLoading = false;
      }


    }, error => {
      this.isLoading = false;
      error.error.text
    });
  }




  resetform() {
    this.dataSource.data = [];
    this.searchForm.reset();
    this.searchForm.controls.fromDate.setValue(new Date());
    this.searchForm.controls.toDate.setValue(new Date());
    this.searchForm.controls.user.setValue('0');
    this.searchForm.controls.shift.setValue('0');
    this.Searchform();



  }


  exportAsXLSX() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Late_attendance_Report');

    /* save to file */
    XLSX.writeFile(wb, 'Late_attendance_Report.xlsx');

  }
  fromDateChange(type: string, event: MatDatepickerInputEvent<Date>) {
    this.minToDate = event.value;
    if (event.value !== null) {
      this.maxToDate = new Date(
        // event!.value.getFullYear(),
        // event!.value.getMonth(),
        // event!.value.getDate() + 30
      );
    }
  }

  toDateChange(type: string, event: MatDatepickerInputEvent<Date>) {
    this.maxFromDate = event.value;
    // if (event.value !== null) {
    //   this.minFromDate = new Date(
    //     event!.value.getFullYear(),
    //     event!.value.getMonth(),
    //     event!.value.getDate() - 30
    //   );
    // }
  }
  getPageSizes(): number[] {
    if (this.dataSource.data.length > 20) {
      return [5, 10, 20, this.dataSource.data.length];
    }
    else {
      return [5, 10, 20];
    }
  }
}

