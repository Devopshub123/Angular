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
import { Moment} from 'moment';
import * as _moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { MatDialog } from '@angular/material/dialog';
// import {default as _rollupMoment} from 'moment';
const moment =  _moment;
import jsPDF from "jspdf";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
const htmlToPdfmake = require("html-to-pdfmake");
import { PayrollService } from '../../payroll.service';

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
  selector: 'app-epf-reports',
  templateUrl: './epf-reports.component.html',
  styleUrls: ['./epf-reports.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class EpfReportsComponent implements OnInit {
  date = new FormControl(moment());
  datadata:any;
  financeyears:any;
  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    this.getEpfValuesForChallan();
    datepicker.close();
  }
  searchForm!: FormGroup;
  displayedColumns: string[] = ['uan','empname','gross','epf','eps','edil','epsvalue','ee','er','ncp','refunds'];
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
  messageflag:boolean=true;
  message:any;
  months=[{id:0,month:'Jan'},{id:1,month:'Feb'},{id:2,month:'Mar'},{id:3,month:'Apr'},{id:4,month:'May'},{id:5,month:'Jun'},{id:6,month:'Jul'},{id:7,month:'Aug'},{id:8,month:'Sep'},{id:9,month:'Oct'},{id:10,month:'Nov'},{id:11,month:'Dec'}]
  monthdata: any;
  datadatas:any=[];
  maxDate:any=new Date();
  minDate:any= new Date('2022-01-01');

  constructor(private router: Router,public formBuilder: FormBuilder,private PR:PayrollService,public spinner :NgxSpinnerService,private RS:ReportsService,private sanitizer: DomSanitizer,private dialog: MatDialog,) {
   }
  @ViewChild('table') table!: ElementRef;

  ngOnInit(): void {
    this.searchForm = this.formBuilder.group({
      fromDate:[new Date()],
    });
  }
  exportAsXLSX() {
    if(true){
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
    XLSX.utils.book_append_sheet(wb, ws, 'EPF_challan_report');

    /* save to file */
    // XLSX.writeFile('Payroll_report_for_financeteam_'+this.monthdata,'Payroll_report_for_financeteam_'+this.monthdata+'_'+this.year+'.xlsx')
    XLSX.writeFile(wb, 'epf_report_for_financeteam_'+this.monthdata+'_'+this.year+'.xlsx');
  }
  else{
    let dialogRef = this.dialog.open(ReusableDialogComponent, {
      position:{top:`70px`},
      disableClose: true,
      data:this.message
    });

  }

  }
 
  Searchform(){
    let data ={
      date:this.pipe.transform( this.date.value._d, 'yyyy-MM-dd')
    }
    // this.spinner.show();
   this.getEpfValuesForChallan();

  }
  resetform(){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/Payroll/epfreports"]));
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
  public exportText(): void {
    if(true){
    const data = this.datadatas.toString().replace(/\,/g,'');
    const blob = new Blob([data], { type: 'application/octet-stream' });
    let urls:any = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'EPF.txt');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // window.open(url);
    }
    else{
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position:{top:`70px`},
        disableClose: true,
        data:this.message
      });
    }

  }
  getEpfValuesForChallan(){
    let data ={
      year:this.date.value._d.getFullYear(),
      month:this.date.value._d.getMonth()+1
    }
    this.PR.getEpfValuesForChallan(data).subscribe((result:any)=>{
     if(result.status){
      this.dataSource = result.data;
      this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
      this.validateEpfChallanDownload()
    //  this.dataSource = 
    //  [{Employee_Name: "Rakesh Goud  Thallapelly",Gross_Salary:50000,UAN:"2357625",employee_epf_value: 4500,employer_admin_charges_value: 187.5,employer_edli_value
    //  : 75,employer_epf_value: 3250.5,employer_eps_value: 1249.5},
    //  {Employee_Name: "Rakesh",Gross_Salary:50000,UAN:"5647765",employee_epf_value: 4500,employer_admin_charges_value: 187.5,employer_edli_value
    //  : 75,employer_epf_value: 3250.5,employer_eps_value: 1249.5}]
    this.datadata=this.dataSource;
    for(let i = 0;i<this.datadata.length;i++){
      // this.datadatas[i] = this.datadata[i].UAN +'#~#'+this.datadata[i].Employee_Name+'#~#'+this.datadata[i].gross_salary+'#~#'+this.datadata[i].employee_epf_wage+'#~#'+this.datadata[i].eps_wage+this.datadata[i].edli_wage+'#~#'+this.datadata[i].employer_eps_value+'#~#'+this.datadata[i]. epf_eps_difference+'#~#'+(this.datadata[i].ncp_days==null?0:this.datadata[i].ncp_days)+'\n'
        this.datadatas[i] = this.datadata[i].UAN +'#~#'+this.datadata[i].Employee_Name+'#~#'+this.datadata[i].gross_salary+'#~#'+this.datadata[i].employee_epf_wage+'#~#'+this.datadata[i].eps_wage+'#~#'+this.datadata[i].edli_wage+'#~#'+this.datadata[i].employer_eps_value+'#~#'+this.datadata[i]. epf_eps_difference+'#~#'+(this.datadata[i].ncp_days==null?0:this.datadata[i].ncp_days)+'#~#'+(this.datadata[i].refund_of_advance==null?0:this.datadata[i].refund_of_advance)+'\n'
    }
   
 
     }
 
      
    })
  }

  /**getFinancialYears */
  getFinancialYears(){
    this.PR.getFinancialYears().subscribe((result:any)=>{
      if(result.status && result.data.length>0){
      
        for(let i=0;i<result.data.length;i++){
          this.financeyears = result[i].financial_year
        }
        // console.log("financial years",   this.financeyears)
      }
    })
  }
  /**to Download validation for Exceland text formats */
  validateEpfChallanDownload(){
    // let data = {
    //   month:4 ,  //this.date.value._d,
    //   year:2023  //this.date.value._d
    // }
    let data ={
      year:this.date.value._d.getFullYear(),
      month:this.date.value._d.getMonth()+1
    }
    this.PR.validateEpfChallanDownload(data).subscribe((result:any)=>{
      if(result.status&&result.data[0].validity == 0){
        this.messageflag = false;
        this.message = result.data[0].message
        
      }
      else{
        this.messageflag = true;
        this.message =''
      }
  
    })
   }

}
