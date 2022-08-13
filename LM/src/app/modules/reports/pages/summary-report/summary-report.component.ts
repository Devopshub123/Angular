import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ExcelServiceService } from '../../excel-service.service';
import { ReportsService } from '../../reports.service';
import { DialogDetailComponent } from '../dialog-detail/dialog-detail.component';

@Component({
  selector: 'app-summary-report',
  templateUrl: './summary-report.component.html',
  styleUrls: ['./summary-report.component.scss']
})
export class SummaryReportComponent implements OnInit {
  List: any[] = [
    
  ];
  employeelist: any;
  Users: any;
  minDate = new Date('1950/01/01'); maxDate = new Date();
  pageLoading=true;
  constructor(public reportsService: ReportsService, public datePipe: DatePipe, public formBuilder: FormBuilder,
    public dialog: MatDialog, private excelService: ExcelServiceService) { }
  @ViewChild(MatTable) table: MatTable<any> = <any>[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  filter = new FormControl();
  userSession: any;
  searchForm = this.formBuilder.group({ fromDate: [new Date()], toDate: [new Date()], Users: ['0'] });
  dataSource: MatTableDataSource<any> = <any>[];
  displayedColumns: string[] = ['sno','empname', 'attendancedate', 'firstlogintime', 
  'lastlogouttime', 'totalhours', 'breaks', 'breaktime', 'productivehours', 'action'];
  isLoading = false;
  ngOnInit() {
    this.userSession = JSON.parse(sessionStorage.getItem('user') ?? '');
     this.Searchform();
    this.getEmployeelist();
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

    let fromDate = this.datePipe.transform(this.searchForm.controls.fromDate.value, "y-MM-d");
    let toDate = this.datePipe.transform(this.searchForm.controls.toDate.value, "y-MM-d");
    let userId = this.searchForm.controls.Users.value;
    if (userId == '0') {
      userId=null;
    } 
    let data = {
      "manager_empid":this.userSession.id,
      'employee': userId,
      'fromdate': fromDate,
      'todate': toDate
    }
    this.isLoading = true;
    this.reportsService.getAttendanceSummaryReport(data).subscribe((res: any) => {
      this.List=res.data;
      this.List.forEach((e:any)=>{
        if(e.breaks!=null){
          e.breaks=e.breaks.split(',')
        }
      })
      
      this.isLoading = false;
      this.dataSource = new MatTableDataSource(this.List);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.pageLoading=false;
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
      width: '1000px',position:{top:`70px`},
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
  getPageSizes(): number[] {
    if (this.dataSource.data.length > 20) {
      return [5, 10, 20, this.dataSource.data.length];
    }
    else {
      return [5, 10, 20];
    }
  }
}

