import {Component, OnInit, ViewChild} from '@angular/core';
import {LeavesService} from "../../leaves.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {DatePipe} from "@angular/common";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {UserData} from "../../../attendance/models/EmployeeData";
import * as XLSX from "xlsx";
import { NgxSpinnerService } from 'ngx-spinner';
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
  selector: 'app-detailed-report-for-manager',
  templateUrl: './detailed-report-for-manager.component.html',
  styleUrls: ['./detailed-report-for-manager.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class DetailedReportForManagerComponent implements OnInit {

  constructor(private LM:LeavesService,public formBuilder: FormBuilder,public spinner :NgxSpinnerService) {
   // var date = new Date();
   // // date.setDate(date.getDate()-7)

  }
  searchForm!: FormGroup;
  displayedColumns: string[] = ['employeeName','employeeId' ,'leaveType','designation', 'appliedDate','startDate','toDate','noOfDays','status','approvedBy'];
  dataSource: MatTableDataSource<UserData>=<any>[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  pageLoading = true;

  arrayList:any=[];
  userSession:any;
  leaveTypes:any=[];
  ishide:boolean=true;
  onchangeflag:boolean=false;
  // leaveStatus:any=[];
  designations:any=[];
  employeeDetails:any = [];
  page = 1;
  count = 0;
  tableSize = 5;
  tableSizes = [5, 25, 50, 'All'];
  pipe = new DatePipe('en-US');
  onTableDataChange(event:any){
    this.onchangeflag = true;
    this.page = event;
    this.Searchform();
    // this.getHolidays(this.year?this.year:null,this.locationId?this.locationId:null);
  }
  onTableSizeChange(event:any){
    this.tableSize = event.target.value;
    this.onchangeflag = true;
    this.page = 1;
    this.Searchform();

    // this.getHolidays(this.year?this.year:null,this.locationId?this.locationId:null);

  }
  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({ leaveType: ['All'] ,leaveStatus:['All'],designation:['All'],fromDate: [new Date()], toDate: [new Date()],DateFormate:['currentWeek'],employeeId:['All'] });
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.getLeaveTypes();
    this.getDesignation();
    this.getEmployeesForReportingManager();

    const today = new Date();
    let fromdate =new Date(today.setDate(today.getDate() - today.getDay()))
    let toDate = new Date(today.setDate(today.getDate() - today.getDay()));
    this.searchForm.controls.fromDate.setValue(fromdate)
    this.searchForm.controls.toDate.setValue(new Date(toDate.setDate(toDate.getDate()+6)))

    this.searchForm.get('DateFormate')?.valueChanges.subscribe((selectedValue:any) => {
      switch (selectedValue) {
        case 'currentWeek':
          var fromdate =new Date(today.setDate(today.getDate() - today.getDay()))
          this.searchForm.controls.fromDate.setValue(fromdate)
          this.searchForm.controls.toDate.setValue(new Date(fromdate.setDate(fromdate.getDate()+6)));
          break;
        case 'lastWeek':
          var fromdate =new Date(today.setDate(today.getDate() - today.getDay()))
          this.searchForm.controls.fromDate.setValue(new Date(fromdate.setDate(fromdate.getDate()-7)));
          this.searchForm.controls.toDate.setValue(new Date(fromdate.setDate(fromdate.getDate()+6)));
          break;
        case 'currentMonth':
          this.searchForm.controls.fromDate.setValue(new Date(today.getFullYear(), today.getMonth(), 1));
          this.searchForm.controls.toDate.setValue(new Date(today.getFullYear(), today.getMonth() + 1, 0));
          break;
        case 'lastMonth':
          this.searchForm.controls.fromDate.setValue(new Date(today.getFullYear(), today.getMonth() - 1, 1));
          this.searchForm.controls.toDate.setValue(new Date(today.getFullYear(), today.getMonth(), 0));
          break;
        case 'quaterOne':
          this.searchForm.controls.fromDate.setValue(new Date('01-01-'+today.getFullYear().toString()));
          this.searchForm.controls.toDate.setValue(new Date('03-31-'+today.getFullYear().toString()));
          break;
        case 'quaterTwo':
          this.searchForm.controls.fromDate.setValue(new Date('04-01-'+today.getFullYear().toString()));
          this.searchForm.controls.toDate.setValue(new Date('06-30-'+today.getFullYear().toString()));
          break;
        case 'quaterThree':
          this.searchForm.controls.fromDate.setValue(new Date('07-01-'+today.getFullYear().toString()));
          this.searchForm.controls.toDate.setValue(new Date('09-30-'+today.getFullYear().toString()));
          break;
        case 'quaterFour':
          this.searchForm.controls.fromDate.setValue(new Date('10-01-'+today.getFullYear().toString()));
          this.searchForm.controls.toDate.setValue(new Date('12-31-'+today.getFullYear().toString()));
          break;
      }
      // if(selectedValue == 'currentWeek'){
      //   var fromdate =new Date(today.setDate(today.getDate() - today.getDay()))
      //   this.searchForm.controls.fromDate.setValue(fromdate)
      //   this.searchForm.controls.toDate.setValue(new Date(fromdate.setDate(fromdate.getDate()+6)))
      // }else if (selectedValue == 'lastWeek'){
      //   var fromdate =new Date(today.setDate(today.getDate() - today.getDay()))
      //   this.searchForm.controls.fromDate.setValue(new Date(fromdate.setDate(fromdate.getDate()-7)));
      //   this.searchForm.controls.toDate.setValue(new Date(fromdate.setDate(fromdate.getDate()+6)));
      //
      // } else if (selectedValue == 'currentMonth'){
      //   this.searchForm.controls.fromDate.setValue(new Date(today.getFullYear(), today.getMonth(), 1));
      //   this.searchForm.controls.toDate.setValue(new Date(today.getFullYear(), today.getMonth() + 1, 0));
      // }else if (selectedValue == 'lastMonth'){
      //   this.searchForm.controls.fromDate.setValue(new Date(today.getFullYear(), today.getMonth() - 1, 1));
      //   this.searchForm.controls.toDate.setValue(new Date(today.getFullYear(), today.getMonth(), 0));
      //
      //
      // }else if (selectedValue == 'quaterOne'){
      //
      //   this.searchForm.controls.fromDate.setValue(new Date('01-01-'+today.getFullYear().toString()));
      //   this.searchForm.controls.toDate.setValue(new Date('03-31-'+today.getFullYear().toString()));
      //
      // }else if (selectedValue == 'quaterTwo'){
      //   this.searchForm.controls.fromDate.setValue(new Date('04-01-'+today.getFullYear().toString()));
      //   this.searchForm.controls.toDate.setValue(new Date('06-30-'+today.getFullYear().toString()));
      //
      //
      // }else if (selectedValue == 'quaterThree'){
      //   this.searchForm.controls.fromDate.setValue(new Date('07-01-'+today.getFullYear().toString()));
      //   this.searchForm.controls.toDate.setValue(new Date('09-30-'+today.getFullYear().toString()));
      //
      //
      // }else if (selectedValue == 'quaterFour'){
      //   this.searchForm.controls.fromDate.setValue(new Date('10-01-'+today.getFullYear().toString()));
      //   this.searchForm.controls.toDate.setValue(new Date('12-31-'+today.getFullYear().toString()));
      //
      //
      // }

    })
    this.searchForm.get('designation')?.valueChanges.subscribe((selectedValue:any) => {
      this.searchForm.controls.employeeId.setValue('All');
      this.getEmployeesForReportingManager()
    })
    this.Searchform();
    }


  getLeaveTypes(){
    let obj={
      tableName:'lm_leavesmaster',
      status:'Active',
      pageNumber:1,
      pageSize:1000,
      databaseName:'keerthi_hospitals'
    }
    this.LM.getMastertable(obj).subscribe(result=>{
      if(result && result.status){
        this.leaveTypes = result.data;
      }
    })

  }


  getDesignation(){
    let obj={
      tableName:'designationsmaster',
      status:'Active',
      pageNumber:1,
      pageSize:1000,
      databaseName:'keerthi_hospitals'
    }
    this.LM.getMastertable(obj).subscribe(result=>{
      if(result && result.status){
        this.designations = result.data;
      }
    })
  }

  getEmployeesForReportingManager(){
    let input ={
      'managerId' : this.userSession.id,
      'departmentId':this.searchForm.controls.designation.value
    }
    this.LM.getEmployeesForReportingManager(input).subscribe(result=>{
      if(result && result.status){
        this.employeeDetails = result.data;
        if(this.employeeDetails.length>0){
          this.ishide = true;
        }
        else{
          this.ishide = false;
        }
      }
    })

  }
  Searchform(){

    this.arrayList = [];
    this.dataSource = new MatTableDataSource(this.arrayList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageLoading = true;
        // this.paginator.firstPage();
    this.getPageSizes()
    this.spinner.show();
    let obj = {
      'employeeId':this.searchForm.controls.employeeId.value,
      'managerId':this.userSession.id,
      'leaveType':this.searchForm.controls.leaveType.value,
      'leaveStatus':this.searchForm.controls.leaveStatus.value,
      'designation':this.searchForm.controls.designation.value,
      'fromDate':this.pipe.transform(this.searchForm.controls.fromDate.value, 'yyyy-MM-dd'),
      'toDate':this.pipe.transform(this.searchForm.controls.toDate.value, 'yyyy-MM-dd'),
      'pageNumber':1,
      'pageSize':1000

    };
    this.LM.getEmployeeLeaveDetailedReportForManager(obj).subscribe(result =>{

      this.spinner.hide();
      if (result.status) {
        this.arrayList = result.data;
        // this.count = this.arrayList[0].total;
        this.dataSource = new MatTableDataSource(this.arrayList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator.pageSize=5;
        this.dataSource.sort = this.sort;
        this.pageLoading = false;
      } else {
        this.arrayList = [];
        this.dataSource = new MatTableDataSource(this.arrayList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.paginator.pageSize=5;
        this.dataSource.sort = this.sort;
      }

    })


  }
  resetform(){
  this.ngOnInit();


  }

  exportAsXLSX() {
    const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(document.getElementById('table'));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Detailed_Report');

    /* save to file */
    XLSX.writeFile(wb, 'Detailed_Report.xlsx');

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
