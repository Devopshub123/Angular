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
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
const htmlToPdfmake = require("html-to-pdfmake");


import * as _moment from 'moment';
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

@Component({
  selector: 'app-late-attendance-report',
  templateUrl: './late-attendance-report.component.html',
  styleUrls: ['./late-attendance-report.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
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
  @ViewChild('table') table!: ElementRef;
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
        this.searchForm.controls.user.setValue('0');
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

  public exportPDF(): void {
    const pdfTable = this.table.nativeElement;
    var html = htmlToPdfmake(pdfTable.innerHTML);
    pdfMake.createPdf({
      info: {
        title: "Late Attendance Report",
        author:'Sreeb tech',
        subject:'Theme',
            keywords:'Report'
      },
      footer: function (currentPage, pageCount) {
        return {
          margin: 10,
          columns: [
            {
              fontSize: 9,
              text: [
                {
                  text: 'Page ' + currentPage.toString() + ' of ' + pageCount,
                }
              ],
              alignment: 'center'
            }
          ]
        };
      },
      content: [ 
        {
          text: "Late Attendance Report\n\n",
          style: 'header',
          alignment: 'center',
          fontSize: 14
        },
        // {
        //   text:
        //     "Designation :  " + this.designationForPdf +"\n" +
        //     "Employee Name and Id:  " + this.employeeNameForPdf + "\n" +
        //     "Year:  " + this.searchForm.controls.calenderYear.value+ "\n",
        //   fontSize: 10,
        //   margin: [0, 0, 0, 20],
        //   alignment: 'left'
        // },
        html,
        
        
      ],defaultStyle: {
        alignment: "justify",
      },
      pageOrientation: 'landscape'//'portrait'
    }).download("Late Attendance Report.pdf");

  }

}

