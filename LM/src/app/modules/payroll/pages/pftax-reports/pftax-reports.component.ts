
import {Component, OnInit, ViewChild,ElementRef} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {DatePipe} from "@angular/common";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import { Router, RouterModule } from '@angular/router';
import {MatTable, MatTableDataSource} from "@angular/material/table";
import * as XLSX from "xlsx";
import { NgxSpinnerService } from 'ngx-spinner';
import { ReportsService } from 'src/app/modules/reports/reports.service';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import { PayrollService } from '../../payroll.service';
import { Moment} from 'moment';
import * as _moment from 'moment';
// import {default as _rollupMoment} from 'moment';
const moment =  _moment;
import jsPDF from "jspdf";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
const htmlToPdfmake = require("html-to-pdfmake");

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};


@Component({
  selector: 'app-pftax-reports',
  templateUrl: './pftax-reports.component.html',
  styleUrls: ['./pftax-reports.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class PftaxReportsComponent implements OnInit {
  date = new FormControl(moment());
  statehide:boolean = false;
  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
    this.getStatesForProfessionalTax()
  }
  searchForm!: FormGroup;
  displayedColumns: string[] = ['sno','state','payrange','tax','employees'];
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
  monthdata: any;
  stateslist:any=[{state_id:null,state:"ALL"}];

  constructor(private router: Router,public formBuilder: FormBuilder,private PR:PayrollService,public spinner :NgxSpinnerService,private RS:ReportsService) { }
  @ViewChild('table') table!: ElementRef;

  ngOnInit(): void {
    // this.getallEmployeesList();
    
    this.searchForm = this.formBuilder.group({
      fromDate:[new Date()],
      state:[""]
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
    XLSX.writeFile(wb, 'Prefessionaltax_report_for_financeteam_'+this.monthdata+'_'+this.year+'.xlsx');

  }

  Searchform(){
    let data ={
      date:this.pipe.transform( this.date.value._d, 'yyyy-MM-dd')
    }
    this.spinner.show();
    this.getProfessionalTaxValuesForChallan()
   

  }
  resetform(){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/LeaveManagement/payrollreport"]));
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
        title: "Professional Tax Report",
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
          text: "Professional tax Report\n\n",
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
        html
      ],
      pageOrientation: 'landscape'//'portrait'
    }).download("Pfofessional tax challan Report.pdf");

  }
  getProfessionalTaxValuesForChallan(){
    let data ={
      year:"2023",
      month:"1",
      state:null
    }
    console.log(this.date.value._d)
    this.PR.getProfessionalTaxValuesForChallan(data).subscribe((result:any)=>{
      console.log("result",result)
     if(result.status){
      this.dataSource = result.data
     }
       
      
    })
  }
  getStatesForProfessionalTax(){
    let data ={
      year:this.date.value._d.getFullYear(),
      month:this.date.value._d.getMonth(),
     
    }
    console.log(this.date.value._d)
    this.PR.getStatesForProfessionalTax(data).subscribe((result:any)=>{
      console.log("result",result)
     if(result.status){
      this.stateslist = result.data;
      if(result.data[0].status == 0){
        this.statehide= false;

      }else{
        this.statehide= true;
      }
      
     }
       
      
    })
  }

}

