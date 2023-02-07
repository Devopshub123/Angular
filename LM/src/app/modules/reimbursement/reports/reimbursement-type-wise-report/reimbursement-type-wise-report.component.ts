import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as XLSX from 'xlsx';
import * as _moment from 'moment';
import { DialogDetailComponent } from 'src/app/modules/reports/pages/dialog-detail/dialog-detail.component';
import { ReportsService } from 'src/app/modules/reports/reports.service';
import { ExcelServiceService } from 'src/app/modules/reports/excel-service.service';
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
  selector: 'app-reimbursement-type-wise-report',
  templateUrl: './reimbursement-type-wise-report.component.html',
  styleUrls: ['./reimbursement-type-wise-report.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
     {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ReimbursementTypeWiseReportComponent implements OnInit {
  List: any[] = [
    
  ];
  employeelist: any;
  Users: any;
  minDate = new Date('1990/01/01'); maxDate = new Date();
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
  monthdata:any;
  year:any;
  months=[{id:0,month:'Jan'},{id:1,month:'Feb'},{id:2,month:'Mar'},{id:3,month:'Apr'},{id:4,month:'May'},{id:5,month:'Jun'},{id:6,month:'Jul'},{id:7,month:'Aug'},{id:8,month:'Sep'},{id:9,month:'Oct'},{id:10,month:'Nov'},{id:11,month:'Dec'}]
  searchForm = this.formBuilder.group({ fromDate: [new Date()], toDate: [new Date()], Users: ['0'] ,reimbursementTypeList:[""]});
  dataSource: MatTableDataSource<any> = <any>[];
  displayedColumns: string[] = ['sno','adate', 'empname', 'reqAmount','aproveon', 'aprAmount', 'aprBy', 'paidOn'];
  isLoading = false;
  reimbursementTypeList: any = [
    { id: 1, name: "Certificate" },
    { id: 2, name: "Learning" },
    { id: 3, name: "Fuel" },
    { id: 4, name: "Driver" },
    { id: 5, name: "Telephone" },
    { id: 6, name: "Travel Allowance" },
    { id: 7, name: "Vehicle Maintenance" },
    { id: 7, name: "Team Lunch" },
    ];
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
    const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(document.getElementById('table'));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reimbursement_Type_Report');
    /* save to file */
    XLSX.writeFile(wb, 'Reimbursement_Type_Report.xlsx');
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
}
