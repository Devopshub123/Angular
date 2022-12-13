import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ExcelServiceService } from '../../excel-service.service';
import { ReportsService } from '../../reports.service';
import { DialogDetailComponent } from '../dialog-detail/dialog-detail.component';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as XLSX from 'xlsx';


import * as _moment from 'moment';
// import {default as _rollupMoment} from 'moment';
const moment =  _moment;
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
const htmlToPdfmake = require("html-to-pdfmake");

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
  selector: 'app-summary-report',
  templateUrl: './summary-report.component.html',
  styleUrls: ['./summary-report.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class SummaryReportComponent implements OnInit {
  List: any[] = [
    
  ];
  @ViewChild('table') table!: ElementRef;

  employeelist: any;
  Users: any;
  minDate = new Date('1950/01/01'); maxDate = new Date();
  pageLoading=true;
  constructor(public reportsService: ReportsService, public datePipe: DatePipe, public formBuilder: FormBuilder,
    public dialog: MatDialog, private excelService: ExcelServiceService) { }
  @ViewChild(MatTable) tableOne: MatTable<any> = <any>[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  filter = new FormControl();
  userSession: any;
  monthdata:any;
  year:any;
  months=[{id:0,month:'Jan'},{id:1,month:'Feb'},{id:2,month:'Mar'},{id:3,month:'Apr'},{id:4,month:'May'},{id:5,month:'Jun'},{id:6,month:'Jul'},{id:7,month:'Aug'},{id:8,month:'Sep'},{id:9,month:'Oct'},{id:10,month:'Nov'},{id:11,month:'Dec'}]
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
 
  // exportAsXLSX() {
  //   console.log("hi")
  //   let edata: any = [];
  //   let i = 1;
  //   this.dataSource.data.map(a => {
  //     let e: any = {};
  //     e['Sno'] = i++;
  //     e['Employee Name'] = a.empname;
  //     e['Attendance Date'] = a.attendancedate;
  //     e['First In'] = a.firstlogintime;
  //     e['Last Out'] = a.lastlogouttime;
  //     e['Total Hours'] = a.totalhours;
  //     e['breaks'] = a.breaks;
  //     e['Break Time'] = a.breaktime;
  //     e['Production Hours'] = a.productivehours;
  //     edata.push(e);
  //   })
  //   console.log(edata)
  //   this.excelService.exportAsExcelFile(edata, '');
  // }
  exportAsXLSX() {
    // this.year=this.searchForm.controls.fromDate.value
    // for(let i =0;i<this.months.length;i++){
    //   if((this.searchForm.controls.fromDate.value).getMonth()==this.months[i].id){
    //    this.monthdata = this.months[i].month;
    //    break;
    //   }
    // }
    console.log('hi')
    const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(document.getElementById('table'));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance_Summary_Report');
    /* save to file */
    XLSX.writeFile(wb, 'Attendance_Summary_Report.xlsx');

  }
  getPageSizes(): number[] {
    if (this.dataSource.data.length > 20) {
      return [5, 10, 20, this.dataSource.data.length];
    }
    else {
      return [5, 10, 20];
    }
  }
  
  public exportPDF(): void {
    const pdfTable = this.table.nativeElement;
    var html = htmlToPdfmake(pdfTable.innerHTML);
    pdfMake.createPdf({
      info: {
        title: "Attendance Summary Report",
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
          text: "Attendance Summary Report\n\n",
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
        
      ],
      pageOrientation: 'landscape'//'portrait'
    }).download("Attendance Summary Report.pdf");

  }

}

