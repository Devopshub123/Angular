import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AttendanceService } from 'src/app/modules/attendance/attendance.service';
import { ExcelServiceService } from '../../excel-service.service';
import { ReportsService } from '../../reports.service';
import { DialogDetailComponent } from '../dialog-detail/dialog-detail.component';

@Component({
  selector: 'app-detail-report',
  templateUrl: './detail-report.component.html',
  styleUrls: ['./detail-report.component.scss']
})
export class DetailReportComponent implements OnInit {
  
  List: any[] =  [
    {'empname':'Balu','attendancedata':[
          {'attendancedate': '2022-07-01','present_or_absent': 'A'},
          {'attendancedate': '2022-07-02','present_or_absent': 'P'},
          {'attendancedate': '2022-07-03','present_or_absent': 'P'},
          {'attendancedate': '2022-07-04','present_or_absent': 'P'},			
          {'attendancedate': '2022-07-05','present_or_absent': 'A'},
          {'attendancedate': '2022-07-06','present_or_absent': 'P'},
          {'attendancedate': '2022-07-07','present_or_absent': 'P'},
          {'attendancedate': '2022-07-08','present_or_absent': 'P'},
          {'attendancedate': '2022-07-09','present_or_absent': 'P'},			
          {'attendancedate': '2022-07-10','present_or_absent': 'A'},
          {'attendancedate': '2022-07-01','present_or_absent': 'A'},
          {'attendancedate': '2022-07-02','present_or_absent': 'P'},
          {'attendancedate': '2022-07-03','present_or_absent': 'P'},
          {'attendancedate': '2022-07-04','present_or_absent': 'P'},			
          {'attendancedate': '2022-07-05','present_or_absent': 'A'},
          {'attendancedate': '2022-07-06','present_or_absent': 'P'},
          {'attendancedate': '2022-07-07','present_or_absent': 'P'},
          {'attendancedate': '2022-07-08','present_or_absent': 'P'},
          {'attendancedate': '2022-07-09','present_or_absent': 'P'},			
          {'attendancedate': '2022-07-10','present_or_absent': 'A'},
          {'attendancedate': '2022-07-01','present_or_absent': 'A'},
          {'attendancedate': '2022-07-02','present_or_absent': 'P'},
          {'attendancedate': '2022-07-03','present_or_absent': 'P'},
          {'attendancedate': '2022-07-04','present_or_absent': 'P'},			
          {'attendancedate': '2022-07-05','present_or_absent': 'A'},
          {'attendancedate': '2022-07-06','present_or_absent': 'P'},
          {'attendancedate': '2022-07-07','present_or_absent': 'P'},
          {'attendancedate': '2022-07-08','present_or_absent': 'P'},
          {'attendancedate': '2022-07-09','present_or_absent': 'P'},			
          {'attendancedate': '2022-07-10','present_or_absent': 'A'},
           ]},
    {'empname':'Krishna','attendancedata':[
          {'attendancedate': '2022-07-01','present_or_absent': 'A'},
          {'attendancedate': '2022-07-02','present_or_absent': 'P'},
          {'attendancedate': '2022-07-03','present_or_absent': 'P'},
          {'attendancedate': '2022-07-04','present_or_absent': 'P'},			
          {'attendancedate': '2022-07-05','present_or_absent': 'A'},
          {'attendancedate': '2022-07-06','present_or_absent': 'P'},
          {'attendancedate': '2022-07-07','present_or_absent': 'P'},
          {'attendancedate': '2022-07-08','present_or_absent': 'P'},
          {'attendancedate': '2022-07-09','present_or_absent': 'P'},			
          {'attendancedate': '2022-07-10','present_or_absent': 'A'},
          {'attendancedate': '2022-07-11','present_or_absent': 'A'},
          {'attendancedate': '2022-07-12','present_or_absent': 'P'},
          {'attendancedate': '2022-07-13','present_or_absent': 'P'},
          {'attendancedate': '2022-07-14','present_or_absent': 'P'},			
          {'attendancedate': '2022-07-15','present_or_absent': 'A'},
          {'attendancedate': '2022-07-16','present_or_absent': 'P'},
          {'attendancedate': '2022-07-17','present_or_absent': 'P'},
          {'attendancedate': '2022-07-18','present_or_absent': 'P'},
          {'attendancedate': '2022-07-19','present_or_absent': 'P'},			
          {'attendancedate': '2022-07-20','present_or_absent': 'A'},
          {'attendancedate': '2022-07-01','present_or_absent': 'A'},
          {'attendancedate': '2022-07-02','present_or_absent': 'P'},
          {'attendancedate': '2022-07-03','present_or_absent': 'P'},
          {'attendancedate': '2022-07-04','present_or_absent': 'P'},			
          {'attendancedate': '2022-07-05','present_or_absent': 'A'},
          {'attendancedate': '2022-07-06','present_or_absent': 'P'},
          {'attendancedate': '2022-07-07','present_or_absent': 'P'},
          {'attendancedate': '2022-07-08','present_or_absent': 'P'},
          {'attendancedate': '2022-07-09','present_or_absent': 'P'},			
          {'attendancedate': '2022-07-10','present_or_absent': 'A'},
           ]},
    
    {'empname':'Raju','attendancedata':[
          {'attendancedate': '2022-07-01','present_or_absent': 'A'},
          {'attendancedate': '2022-07-02','present_or_absent': 'P'},
          {'attendancedate': '2022-07-03','present_or_absent': 'P'},
          {'attendancedate': '2022-07-04','present_or_absent': 'P'},			
          {'attendancedate': '2022-07-05','present_or_absent': 'A'},
          {'attendancedate': '2022-07-06','present_or_absent': 'P'},
          {'attendancedate': '2022-07-07','present_or_absent': 'P'},
          {'attendancedate': '2022-07-08','present_or_absent': 'P'},
          {'attendancedate': '2022-07-09','present_or_absent': 'P'},			
          {'attendancedate': '2022-07-10','present_or_absent': 'A'},
          {'attendancedate': '2022-07-11','present_or_absent': 'A'},
          {'attendancedate': '2022-07-12','present_or_absent': 'P'},
          {'attendancedate': '2022-07-13','present_or_absent': 'P'},
          {'attendancedate': '2022-07-14','present_or_absent': 'P'},			
          {'attendancedate': '2022-07-15','present_or_absent': 'A'},
          {'attendancedate': '2022-07-16','present_or_absent': 'P'},
          {'attendancedate': '2022-07-17','present_or_absent': 'P'},
          {'attendancedate': '2022-07-18','present_or_absent': 'P'},
          {'attendancedate': '2022-07-19','present_or_absent': 'P'},			
          {'attendancedate': '2022-07-20','present_or_absent': 'A'},
          {'attendancedate': '2022-07-01','present_or_absent': 'A'},
          {'attendancedate': '2022-07-02','present_or_absent': 'P'},
          {'attendancedate': '2022-07-03','present_or_absent': 'P'},
          {'attendancedate': '2022-07-04','present_or_absent': 'P'},			
          {'attendancedate': '2022-07-05','present_or_absent': 'A'},
          {'attendancedate': '2022-07-06','present_or_absent': 'P'},
          {'attendancedate': '2022-07-07','present_or_absent': 'P'},
          {'attendancedate': '2022-07-08','present_or_absent': 'P'},
          {'attendancedate': '2022-07-09','present_or_absent': 'P'},			
          {'attendancedate': '2022-07-10','present_or_absent': 'A'},
           ]},
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
   dateDayArray:any = [];
  obj:any;
  constructor(public reportsService: ReportsService, public datePipe: DatePipe, public formBuilder: FormBuilder,
    public dialog: MatDialog, private excelService: ExcelServiceService) { }
  @ViewChild(MatTable) table: MatTable<any> = <any>[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sorter!: MatSort;
  filter = new FormControl();
  searchForm = this.formBuilder.group({ fromDate: [new Date()], toDate: [new Date()], Users: ['0'] });
  dataSource: MatTableDataSource<any> = <any>[];
  displayedColumns: string[] = ['sno','empname', 'attendancedate', 'firstlogintime', 
  'lastlogouttime', 'totalhours', 'breaks', 'breaktime', 'productivehours', 'action'];
  isLoading = false;
  ngOnInit() {
    this.userSession = JSON.parse(sessionStorage.getItem('user') ?? '');
 //    this.Searchform();
    this.getEmployeelist();
    
    this.getDateArray(this.startDate, this.endDate);
  }
  getDateArray(start:any, end:any) {
    const arr = [];
    const dt = new Date(start);
    while (dt <= end) {
      arr.push(new Date(dt));
      dt.setDate(dt.getDate() + 1);
    }
    // console.log(arr);

    for (const val of arr) {

       this.obj = {
        date: val,
        day: val.toLocaleDateString('en-US', { weekday: 'short' }),
      };

      this.dateDayArray.push(this.obj);
    }
    console.log(this.dateDayArray);
  }
  getEmployeelist() {

    this.reportsService.getTotalEmployeslist().subscribe((res: any) => {
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
    let fromDate = this.datePipe.transform(this.searchForm.controls.fromDate.value, "y-MM-d");
    let userId = this.searchForm.controls.Users.value;
    if (userId == '0') {
      userId=null;
    } 
    let data = {
      'manager_employee_id':this.userSession.id,
      'employee_id': userId,
      'date': fromDate,
      
    }
    this.isLoading = true;
    this.reportsService.getAttendanceMonthlyReport(data).subscribe((res: any) => {
      if(res.status){
        res.data.forEach((e:any)=>{
       //   this.List.push(JSON.parse(e.result));
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
  openDialog(item:any): void {
    const dialogRef = this.dialog.open(DialogDetailComponent, {
    //  width: '500px',position:{top:`70px`},
      data: {attendanceid:item.attendanceid ,}
    });

    dialogRef.afterClosed().subscribe(result => {
          
      
    });
  }
 
  exportAsXLSX() {
    let edata: any = [];
    let i = 1;
    this.dataSource.data.map(a => {
      let e: any = {};
      e['Sno'] = i++;
      e['Employee Name'] = a.empname;
      e['Attendance Date'] = a.attendancedate;
      e['First In'] = a.firstlogintime;
      e['Last Out'] = a.lastlogouttime;
      e['Total Hours'] = a.totalhours;
      e['breaks'] = a.breaks;
      e['Break Time'] = a.breaktime;
      e['Production Hours'] = a.productivehours;
      edata.push(e);
    })
    this.excelService.exportAsExcelFile(edata, '');
  }

}

