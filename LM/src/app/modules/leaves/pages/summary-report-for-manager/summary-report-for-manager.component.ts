import { Component,ElementRef, OnInit,ViewChild } from '@angular/core';
import {LeavesService} from "../../leaves.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import { NgxSpinnerService } from 'ngx-spinner';
import {ExcelServiceService} from "../../../reports/excel-service.service";
import * as XLSX from 'xlsx';




@Component({
  selector: 'app-summary-report-for-manager',
  templateUrl: './summary-report-for-manager.component.html',
  styleUrls: ['./summary-report-for-manager.component.scss']
})
export class SummaryReportForManagerComponent implements OnInit {
  searchForm!: FormGroup;
  designations:any=[];
  data:any = [];
  datatwo:any = [];
  departments:any=[];
  employeeDetails:any=[];
  userSession:any = [];
  summaryReportTableHeadings:any = [];
  summaryReports:any=[];
  calengerYearsdetails :any=[];
  today:any=new Date();
  ishide:boolean=true;
  constructor(private LM:LeavesService,public formBuilder: FormBuilder,public spinner :NgxSpinnerService, private excelService: ExcelServiceService) {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
  }

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({ employeeId: ['All'] ,designationId:['All'] ,calenderYear:[(new Date()).getFullYear()]});
    this.getDesignation();
    this.getDepartments();
    this.getEmployeesForReportingManager();
    this.calengerYears();
    this.searchForm.get('designationId')?.valueChanges.subscribe((selectedValue:any) => {
      this.searchForm.controls.employeeId.setValue('All');
      this.getEmployeesForReportingManager()

    })
    this.Searchform();
  }
  getDesignation(){
    let obj={
      tableName:'designationsmaster',
      status:'Active',
      pageNumber:0,
      pageSize:0,
      databaseName:'keerthi_hospitals'
    }
    this.LM.getMastertable(obj).subscribe(result=>{
      if(result && result.status){
        this.designations = result.data;
        // console.log("hvdsjhjh",this.designations)
      }
    })
  }
  getDepartments(){
    let obj={
      tableName:'departmentsmaster',
      status:'Active',
      pageNumber:0,
      pageSize:0,
      databaseName:'keerthi_hospitals'
    }
    this.LM.getMastertable(obj).subscribe(result=>{
      if(result && result.status){
        this.departments = result.data;
        // console.log("hvdsjhjhdepartments",this.departments)
      }
    })
  }
  getEmployeesForReportingManager(){
    let info={
      managerId:this.userSession.id,
      departmentId:this.searchForm.controls.designationId.value
    }
    this.LM.getEmployeesForReportingManager(info).subscribe(result=>{
      if(result && result.status){
        this.employeeDetails = result.data;
        console.log("hvdsjhjh",this.employeeDetails.length)
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
    this.spinner.show()
    let obj={
      'managerId':this.userSession.id,
      'employeeId':this.searchForm.controls.employeeId.value,
      'designationId':this.searchForm.controls.designationId.value,
      'departmentId':"All",
      'calenderYear':this.searchForm.controls.calenderYear.value
    };
    this.LM.getSummaryReportForManager(obj).subscribe(result=>{
      this.spinner.hide();

      this.summaryReportTableHeadings=[];
      this.summaryReports = [];
      this.datatwo=[]
      this.data = [];
      if(result && result.status){
        for(let i =0; i<result.data.length;i++){
           this.data =Object.keys(result.data[i]);
           this.datatwo =Object.values(result.data[i])
          var info = {
            'column1':this.datatwo[0],
            'column2':this.datatwo[1],
            'column3':this.datatwo[2],
            'column4':this.datatwo[3],
            'column5':this.datatwo[4],
            'column6':this.datatwo[5],
            'column7':this.datatwo[6],
            'column8':this.datatwo[7],
            'column9':this.datatwo[8],
            'column10':this.datatwo[9],
            'column11':this.datatwo[10],
            'column12':this.datatwo[11],
            'column13':this.datatwo[12],
            'column14':this.datatwo[13]
          }
          this.summaryReports.push(info)
        }
        var obj = {
          'column1':this.data[0].trim(),
          'column2':this.data[1],
          'column3':this.data[2],
          'column4':this.data[3],
          'column5':this.data[4],
          'column6':this.data[5],
          'column7':this.data[6],
          'column8':this.data[7],
          'column9':this.data[8],
          'column10':this.data[9],
          'column11':this.data[10],
          'column12':this.data[11],
          'column13':this.data[12],
          'column14':this.data[13]
        }
        this.summaryReportTableHeadings.push(obj)

      }
    })

  }

  resetform(){
    this.searchForm = this.formBuilder.group({ employeeId: ['All'] ,designationId:['All'] ,calenderYear:[(new Date()).getFullYear()]});
  this.Searchform();
  }
  calengerYears(){
    this.LM.getYearsForReport().subscribe(result=>{
      if(result && result.status){
        this.calengerYearsdetails = result.data;
        console.log("hvdsjhjhcalengerYears",this.calengerYearsdetails)
      }
    })
  }

  exportAsXLSX() {
    const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(document.getElementById('table'));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Summary_Report');

    /* save to file */
    XLSX.writeFile(wb, 'Summary_Report.xlsx');

  }


  //
  // exportAsXLSX() {
  //   let edata: any = [];
  //   let i = 1;
  //   this.summaryReports.map(a=> {
  //     let e: any = {};
  //     e['Sno'] = i++;
  //     e[this.summaryReportTableHeadings[0].column1] = a.column1;
  //     e[this.summaryReportTableHeadings[0].column2] = a.column2;
  //     e[this.summaryReportTableHeadings[0].column3] = a.column3;
  //     e[this.summaryReportTableHeadings[0].column4] = a.column4;
  //     e[this.summaryReportTableHeadings[0].column5] = a.column5;
  //     e[this.summaryReportTableHeadings[0].column6] = a.column6;
  //     e[this.summaryReportTableHeadings[0].column7] = a.column7;
  //     e[this.summaryReportTableHeadings[0].column8] = a.column8;
  //     e[this.summaryReportTableHeadings[0].column9] = a.column9;
  //     e[this.summaryReportTableHeadings[0].column10] = a.column10;
  //     e[this.summaryReportTableHeadings[0].column11] = a.column11;
  //     e[this.summaryReportTableHeadings[0].column12] = a.column12;
  //     e[this.summaryReportTableHeadings[0].column13] = a.column13;
  //     e[this.summaryReportTableHeadings[0].column14] = a.column14;
  //
  //
  //     edata.push(e);
  //   });
  //   this.excelService.exportAsExcelFile(edata, '');
  // }



}
