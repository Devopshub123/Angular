import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ExcelServiceService } from '../../excel-service.service';
import { ReportsService } from '../../reports.service';

@Component({
  selector: 'app-summary-report',
  templateUrl: './summary-report.component.html',
  styleUrls: ['./summary-report.component.scss']
})
export class SummaryReportComponent implements OnInit {
  List:any[]=[];
  employeelist:any;
  Users:any;
  minDate=new Date('1950/01/01'); maxDate = new Date();
  constructor(public reportsService: ReportsService, public datePipe: DatePipe, public formBuilder: FormBuilder,private excelService: ExcelServiceService) { }
  @ViewChild(MatTable) table: MatTable<any>=<any>[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sorter!: MatSort;
 filter = new FormControl();
  searchForm = this.formBuilder.group({ fromDate: [new Date()], toDate: [new Date()],Users:['0'] });
  dataSource: MatTableDataSource<any> = <any>[];
  displayedColumns: string[] = ['c1', 'c2', 'c3', 'c4','c8', 'c5', 'c6','c7'];
  isLoading = false;
ngOnInit() {
    this.Searchform();
    this.getEmployeelist();
  }

  getEmployeelist(){
   
    this.reportsService.getTotalEmployeslist().subscribe((res:any) => {
      this.employeelist = [];
      this.employeelist = res
      this.searchForm.controls.Users.setValue('0');
      });
  }
  //All Employees API
  Searchform() {
    this.List=[];
    this.dataSource = new MatTableDataSource( this.List);
    let fromDate = this.datePipe.transform(this.searchForm.controls.fromDate.value, "y-MM-d");
    let toDate = this.datePipe.transform(this.searchForm.controls.toDate.value, "y-MM-d");
    let userId=this.searchForm.controls.Users.value;
     if(userId=='0'){
      this.isLoading = true;
      this.reportsService.allUsersCollectionReport(fromDate, toDate).subscribe((res: any) => {
       
        for(const a in res) {
         this.List.push(res[a]);
         }
         this.isLoading = false;
         
         this.dataSource = new MatTableDataSource(this.List);
        
       },error =>{
        this.isLoading = false;
        error.error.text
      } );
     }
     else{
      this.isLoading = true;
    this.reportsService.employeeCollectionReportByDatesByUserID(fromDate, toDate,userId).subscribe((res: any) => {
    for(const a in res) {
     this.List.push(res[a]);
     }
      this.isLoading = false;
      this.dataSource = new MatTableDataSource(this.List);
     
    },error =>{
      this.isLoading = false;
      error.error.text
    });
     }
    
  }

  

 resetform() {
  this.dataSource.data = [];
  this.searchForm.reset();
  this.searchForm.controls.fromDate.setValue(new Date());
    this.searchForm.controls.toDate.setValue(new Date());
    this.searchForm.controls.Users.setValue('0');
    this.Searchform();
  
   
   
  }
 
  exportAsXLSX(){
    let edata:any = [];
    let i = 1;
    this.dataSource.data.map(a => {
      let e:any = {};
      e['Sno'] = i++;
      e['Bill Type'] = a.label;
      e['Count'] = a.count;
      e['Total Amount'] = a.totalAmount;
      e['Total Discount'] = a.discountAmount;
      e['Net Amount'] = a.netAmount;
      e['Paid Amount'] = a.paidAmount;
      e['Due Amount'] = a.dueAmount;
      edata.push(e);
    })
    this.excelService.exportAsExcelFile(edata,'');
  }

}
