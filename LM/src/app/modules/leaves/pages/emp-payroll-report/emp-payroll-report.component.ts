import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {DatePipe} from "@angular/common";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import { Router, RouterModule } from '@angular/router';
import {MatTable, MatTableDataSource} from "@angular/material/table";
import * as XLSX from "xlsx";
import { NgxSpinnerService } from 'ngx-spinner';
import { LeavesService } from '../../leaves.service';
import { ReportsService } from 'src/app/modules/reports/reports.service';
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
  selector: 'app-emp-payroll-report',
  templateUrl: './emp-payroll-report.component.html',
  styleUrls: ['./emp-payroll-report.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class EmpPayrollReportComponent implements OnInit {
  searchForm!: FormGroup;
  displayedColumns: string[] = ['sno','empid','empname','lossofpay','totalleaves','totalleavebalance'];
  dataSource: MatTableDataSource<any>=<any>[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  pageLoading = true;
  arrayList:any=[];
  pipe = new DatePipe('en-US');
  userSession:any;
  employeeDetails: any;
  year:any;
  max = new Date()
  months=[{id:0,month:'Jan'},{id:1,month:'Feb'},{id:2,month:'Mar'},{id:3,month:'Apr'},{id:4,month:'May'},{id:5,month:'Jun'},{id:6,month:'Jul'},{id:7,month:'Aug'},{id:8,month:'Sep'},{id:9,month:'Oct'},{id:10,month:'Nov'},{id:11,month:'Dec'}]
  monthdata: any;;

  constructor(private LM:LeavesService,private router: Router,public formBuilder: FormBuilder,public spinner :NgxSpinnerService,private RS:ReportsService) { }

  ngOnInit(): void {
    this.getallEmployeesList();
    
    this.searchForm = this.formBuilder.group({
      fromDate:[new Date()],
      employeeId:['All']
    });
    this.Searchform();
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.dataSource = new MatTableDataSource(this.arrayList)
  }
  exportAsXLSX() {
    this.year=this.searchForm.controls.fromDate.value.getFullYear();
    for(let i =0;i<this.months.length;i++){
      if((this.searchForm.controls.fromDate.value).getMonth()==this.months[i].id){
       this.monthdata = this.months[i].month;
       break;
      }
    }
    // var ws:XLSX.WorkSheet=XLSX.utils.table_to_sheet('Payroll_report_for_financeteam_');
    var ws:XLSX.WorkSheet=XLSX.utils.table_to_sheet(document.getElementById('table'));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Payroll_report');

    /* save to file */
    // XLSX.writeFile('Payroll_report_for_financeteam_'+this.monthdata,'Payroll_report_for_financeteam_'+this.monthdata+'_'+this.year+'.xlsx')
    XLSX.writeFile(wb, 'Payroll_report_for_financeteam_'+this.monthdata+'_'+this.year+'.xlsx');

  }
  getallEmployeesList(){
    this.RS.getTotalEmployeslist().subscribe((res:any)=>{
      if(res.status && res.data.length>0){
        this.employeeDetails = res.data;
      }

    })
  }
  Searchform(){
    let data ={
      empid:this.searchForm.controls.employeeId.value=="All"?null:this.searchForm.controls.employeeId.value,
      date:this.pipe.transform(this.searchForm.controls.fromDate.value, 'yyyy-MM-dd')
    }
    this.LM.getReportForPayrollProcessing(data).subscribe((res:any)=>{
      console.log(res)
      if(res.status && res.data.length>0){
        this.arrayList = res.data;
        this.dataSource = new MatTableDataSource(this.arrayList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator.pageSize=5;
        this.dataSource.sort = this.sort;
        this.pageLoading = false;
      }
      else {
        this.arrayList = [];
        this.dataSource = new MatTableDataSource(this.arrayList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator.pageSize=5;
        this.dataSource.sort = this.sort;
      }
    })

  }
  resetform(){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/LeaveManagement/payrollreport"]));
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
