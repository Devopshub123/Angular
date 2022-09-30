import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AttendanceService } from 'src/app/modules/attendance/attendance.service';
import { ExcelServiceService } from '../../excel-service.service';
import { ReportsService } from '../../reports.service';
import { DialogDetailComponent } from '../dialog-detail/dialog-detail.component';
import * as XLSX from 'xlsx';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

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
  selector: 'app-detail-report',
  templateUrl: './detail-report.component.html',
  styleUrls: ['./detail-report.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class DetailReportComponent implements OnInit {

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
  monthdata:any;
  year:any;
  months=[{id:0,month:'Jan'},{id:1,month:'Feb'},{id:2,month:'Mar'},{id:3,month:'Apr'},{id:4,month:'May'},{id:5,month:'Jun'},{id:6,month:'Jul'},{id:7,month:'Aug'},{id:8,month:'Sep'},{id:9,month:'Oct'},{id:10,month:'Nov'},{id:11,month:'Dec'}]
  headersList: any = [];
  @ViewChild('TABLE') table!: ElementRef;
  constructor(public reportsService: ReportsService, public datePipe: DatePipe, public formBuilder: FormBuilder,
    public dialog: MatDialog, private excelService: ExcelServiceService) { }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sorter!: MatSort;
  filter = new FormControl();
  searchForm = this.formBuilder.group({ fromDate: [new Date()], toDate: [new Date()], Users: ['0'] });
  dataSource: MatTableDataSource<any> = <any>[];
  displayedColumns: string[] = ['sno', 'empname', 'attendancedate', 'firstlogintime',
    'lastlogouttime', 'totalhours', 'breaks', 'breaktime', 'productivehours', 'action'];
  isLoading = false;
  ngOnInit() {
    this.userSession = JSON.parse(sessionStorage.getItem('user') ?? '');
    this.Searchform();
    this.getEmployeelist();

    this.getDateArray(this.startDate, this.endDate);
  }
  getDateArray(start: any, end: any) {
    const arr = [];
    const dt = new Date(start);
    while (dt <= end) {
      arr.push(new Date(dt));
      dt.setDate(dt.getDate() + 1);
    }
    for (const val of arr) {

      this.obj = {
        date: val,
        day: val.toLocaleDateString('en-US', { weekday: 'short' }),
      };

      this.dateDayArray.push(this.obj);
    }
  }
  getEmployeelist() {
         let obj={
          "rm_id":this.userSession.id,
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
    let userId = this.searchForm.controls.Users.value;
    let data = {};
    if (userId == '0') {
      userId = null;
      data = {
        'manager_employee_id': this.userSession.id,
        'employee_id': userId,
        'calendar_date': fromDate,

      }
    } else {
      data = {
        'manager_employee_id': null,
        'employee_id': userId,
        'calendar_date': fromDate,

      }
    }

    this.isLoading = true;
    this.reportsService.getAttendanceMonthlyReport(data).subscribe((res: any) => {
      this.headersList = [];
      this.List = [];
      if (res.status) {
        let i = 0;
        res.data.forEach((e: any) => {
          if (i < 2) {
            let header = JSON.parse(e.result);
            this.headersList.push(header);
          } else {
            let header = JSON.parse(e.result);
            this.List.push(header);
          }
          i++;

        });
      }

      this.isLoading = false;
      this.dataSource = new MatTableDataSource(this.List);

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
    this.searchForm.controls.Users.setValue('0');
    this.Searchform();



  }
  openDialog(item: any): void {
    const dialogRef = this.dialog.open(DialogDetailComponent, {
      //  width: '500px',position:{top:`70px`},
      data: { attendanceid: item.attendanceid, }
    });

    dialogRef.afterClosed().subscribe(result => {


    });
  }

  exportAsXLSX() {
    this.year=this.searchForm.controls.fromDate.value.getFullYear();
    for(let i =0;i<this.months.length;i++){
      if((this.searchForm.controls.fromDate.value).getMonth()==this.months[i].id){
       this.monthdata = this.months[i].month;
       break;
      }
    }
    const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Monthly_Detail_Report');

    /* save to file */
    XLSX.writeFile(wb, 'Monthly_Detail_Report_for_manager_'+this.monthdata+'_'+this.year+'.xlsx');

  }

  getColor(i: string): String {
    let color = ''
    if (i == "P") {
      return color = 'green'
    } else if (i == "H") {
      return color = '#800000';
    } else if (i == "W") {
      return color = 'blue';
    } else if (i == "L") {
      return color = 'orange';
    }
     else {
      return color = 'red';
    }
  }

}

