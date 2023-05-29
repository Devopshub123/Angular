import {SelectionModel} from '@angular/cdk/collections';
import {Component,OnInit,ViewChild,ElementRef} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {FormBuilder,FormGroup,FormArray,FormControl,ValidatorFn,Validators} from '@angular/forms';
import { PayrollService } from '../../payroll.service';
import { MatDialog } from '@angular/material/dialog'; 
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { ignoreElements } from 'rxjs/operators';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
const htmlToPdfmake = require("html-to-pdfmake");
import { MatRadioChange } from '@angular/material/radio';
/**
 * @title Table with selection
 */

@Component({
  selector: 'app-monthly-payroll',
  templateUrl: './monthly-payroll.component.html',
  styleUrls: ['./monthly-payroll.component.scss']
})
export class MonthlyPayrollComponent implements OnInit {
  monthlyPayrollForm!: FormGroup;
  userSession: any;
  financeyears:any=[];
  monthyear:any=[];
  year_value:any;
  month_value:any;
  monthforemplist:any;
  yearforemplist:any;
  pageLoading = true;
  arrdata:any=[];
  hide:boolean=false;
  messagesList:any=[];
  PR27:any;
  PR28:any;
  PR46:any;
  generate:boolean=true;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  @ViewChild('table') table!: ElementRef;
  messageflag:boolean=true;
  message:any;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // displayedColumns: string[] = ['select','position','empid',  'name', 'designation', 'worklocation'];
  displayedColumns: string[] = ['select','empid',  'name', 'designation', 'worklocation'];
  displayedColumns2: string[] = ['sno','empid','empname','amount','accountnumber','bank','ifsc'];
  dataSource = new MatTableDataSource<any>();
  dataSource2 = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);

  constructor(private router: Router,private formBuilder: FormBuilder,private PR:PayrollService,private dialog: MatDialog,) {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
   }

  ngOnInit(): void {
    this.getFinancialYears();
    this.getMessagesList();
    this.monthlyPayrollForm = this.formBuilder.group(
      {
        Month_year: ["",],
        financial_year:  ["", ],
      });
      this.monthlyPayrollForm.get('financial_year')?.valueChanges.subscribe((selectedValue:any) => {
        this.yearforemplist = selectedValue;
        this.Month_Year(selectedValue);
      })
      this.monthlyPayrollForm.get('Month_year')?.valueChanges.subscribe((selectedValue:any) => {
        this.month_value = selectedValue;
        for(let m=0;this.monthyear.length;m++){
          if(this.monthyear[m].month_value ==  this.month_value ){
            this.yearforemplist = this.monthyear[m].year_value;
            break;
          }
        }
        if(this.generate){
          this.getEmployeeListForSalaryProcessing(this.yearforemplist,this.month_value);
        }
        else{
          console.log("SGAAAAAAAAAAAAA")
          this.getsalaryProcessedEmployeesList(this.yearforemplist,this.month_value)
          
        }
        
      })
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  logSelection() {
    this.selection.selected.forEach((s:any) => console.log(s.employee_code));
  }
  /** getFinancialYears Data*/
  getFinancialYears(){
    this.PR.getFinancialYears().subscribe((result:any)=>{
      console.log("hgdshg",this.financeyears)
      if(result.status && result.data.length>0){
        this.financeyears = result.data;
      }
      else{
        this.financeyears=[]
      }
    })
  }
  /**Month and Year Data */
  Month_Year(data:any){
    // this.monthyear=[{"month_year":"October-2022","return_value":"1"},{"month_year":"November-2022","return_value":"2"}]
    this.PR.Month_Year(data).subscribe((result:any)=>{
      if(result.status && result.data.length>0){
        this.monthyear = result.data;
      }
      else{
        this.monthyear=[]
      }
    })
  }  

  validateSalaryProcessingDate(){
    this.selection.selected.forEach((s:any) => this.arrdata.push(s.id));
 if(this.arrdata.length>0){
    if(this.monthlyPayrollForm.valid){
      for(let i=0;i<this.monthyear.length;i++){
        if(this.monthyear[i].month_value == this.month_value){
          this.year_value = this.monthyear[i].year_value;
        }
      }
      let year = Number(this.year_value);
      let month = this.month_value;
      this.PR.getValidateSalaryProcessingDate(year,month).subscribe((result:any)=>{
        if (result.data) {
         if (result.data[0].validity == 1) {
            this.caluculateMonthlySalary()
            
          }
          else {
            let date =(new Date(result.data[0].end_date).getDate()<10?"0"+new Date(result.data[0].end_date).getDate():new Date(result.data[0].end_date).getDate())+'-'+((new Date(result.data[0].end_date).getMonth()+1)<10?"0"+(new Date(result.data[0].end_date).getMonth()+1):(new Date(result.data[0].end_date).getMonth()+1) )+'-'+new Date(result.data[0].end_date).getFullYear();
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position:{top:`10%`},
              disableClose: true,
              data: 'Please processing your salary after'+' '+ date
            });
           }
        }
        else{
           let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: this.PR28
          });
        }
      
      })
  
    }
  }
  else{
    let dialogRef = this.dialog.open(ReusableDialogComponent, {
      position:{top:`70px`},
      disableClose: true,
      data:this.PR46
    });
   }
   
    
  }
/**Caluculate salary for selected employees */
caluculateMonthlySalary(){
  this.arrdata = []
 this.selection.selected.forEach((s:any) => this.arrdata.push(s.id));
 if(this.arrdata.length>0){
  if(this.monthlyPayrollForm.valid){
    for(let i=0;i<this.monthyear.length;i++){
      if(this.monthyear[i].month_value == this.month_value){
        this.year_value = this.monthyear[i].year_value;
      }
    }
    let data={
      year_value:Number(this.year_value),
      month_value:this.month_value,
      financial_year_value:this.monthlyPayrollForm.controls.financial_year.value,
      created_by_value:this.userSession.id,
      employee_list:this.arrdata
      // employee_list:this.dataSource.data.length == this.arrdata.length?null:this.arrdata
    }

    this.PR.updateMonthlySalary(data).subscribe((result:any)=>{
      if(result.status){
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/Payroll/MonthlyPayroll"])); 
         let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: this.PR27
        });
      }
      else{
         let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: this.PR28
        });
      }
    
    })

  }

 }
 else{
  let dialogRef = this.dialog.open(ReusableDialogComponent, {
    position:{top:`70px`},
    disableClose: true,
    data:this.PR46
  });
 }
  
  
}
/**Cancel requests */
cancel(){
  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    this.router.navigate(["/Payroll/MonthlyPayroll"]));  
}      
/**Success and error messages list */
getMessagesList() {
  let data =
    {
      "code": null,
      "pagenumber":1,
      "pagesize":1000
    }
  this.PR.getErrorMessages(null,1,1000).subscribe((res:any)=>{
    if(res.status && res.data && res.data.length >0) {
      this.messagesList = res.data;
      this.messagesList.forEach((e: any) => {
        if (e.code == "PR27") {
          this.PR27 = e.message
        } else if (e.code == "PR28") {
          this.PR28 =e.message
        }
        else if (e.code == "PR46") {
          this.PR46 =e.message
        }
      })

    }

  })
}
 applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();
     if (this.dataSource2.paginator) {
       this.dataSource2.paginator.firstPage();
    }
  }
 /**getEmployees List for caluculate monthly salary */ 
 getEmployeeListForSalaryProcessing(year:any,month:any){
  this.dataSource = new MatTableDataSource<any>([]);
  this.PR.getEmployeeListForSalaryProcessing(year,month).subscribe((result:any)=>{
    if(result.status && result.data.length>0){
      this.dataSource = new MatTableDataSource<any>(result.data);
      this.hide = true;
    }
    else{
      this.dataSource = new MatTableDataSource<any>([]);
    }
  })
}   
 /**getEmployees List after processing salary */ 
 getsalaryProcessedEmployeesList(year:any,month:any){
  let data ={
    year:year,
    month:month
  }
  this.dataSource2=new MatTableDataSource<any>([])
  this.PR.getSalaryProcessedEmployeeList(data).subscribe((result:any)=>{
    if(result.status && result.data.length>0){
      
      this.dataSource2 = new MatTableDataSource<any>(result.data);
      this.hide = true;
    }
    else{
      this.dataSource2 = new MatTableDataSource<any>([]);
    }
  })
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

  exportAsXLSX() {
    if(this.messageflag){
      // this.year=this.searchForm.controls.fromDate.value.getFullYear();
    // for(let i =0;i<this.months.length;i++){
    //   if((this.searchForm.controls.fromDate.value).getMonth()==this.months[i].id){
    //    this.monthdata = this.months[i].month;
    //    break;
    //   }
    // }
    // var ws:XLSX.WorkSheet=XLSX.utils.table_to_sheet('Payroll_report_for_financeteam_');
    var ws:XLSX.WorkSheet=XLSX.utils.table_to_sheet(document.getElementById('table'));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Payroll_report');

    /* save to file */
    // XLSX.writeFile('Payroll_report_for_financeteam_'+this.monthdata,'Payroll_report_for_financeteam_'+this.monthdata+'_'+this.year+'.xlsx')
    XLSX.writeFile(wb, 'Monthly_Payroll_Report.xlsx');

    }
    else{
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position:{top:`70px`},
        disableClose: true,
        data:this.message
      });

    }
    

  }
  public exportPDF(): void {
    console.log("gggggggggggshk",this.messageflag)
    if(this.messageflag){
    const pdfTable = this.table.nativeElement;
    var html = htmlToPdfmake(pdfTable.innerHTML);
    pdfMake.createPdf({
      info: {
        title: "Monthly Payroll Report",
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
          text: "Monthly Payroll Report\n\n",
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
    }).download("Monthly Payroll Report.pdf");
  }
  else{
    let dialogRef = this.dialog.open(ReusableDialogComponent, {
      position:{top:`70px`},
      disableClose: true,
      data:this.message
    });
  }

  }
  radioChange(event: MatRadioChange) {
    if (event.value == 1) {
     this.generate = true;
     } else if(event.value == 2){
      this.generate = false;
      this.getsalaryProcessedEmployeesList(this.yearforemplist,this.month_value)
      this.validateSalaryChallanDownload()
     } 
 }
 validateSalaryChallanDownload(){
  let data = {
    month:this.month_value,
    year:this.yearforemplist
  }
  this.PR.validateSalaryChallanDownload(data).subscribe((result:any)=>{
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
