import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ExcelServiceService } from 'src/app/modules/reports/excel-service.service';
import * as XLSX from 'xlsx';
export interface PeriodicElement {
  id: number;
  name: string;
  mobile: number;
  email: string;
  address: string;
  type: string;
}

@Component({
  selector: 'app-all-assets-report',
  templateUrl: './all-assets-report.component.html',
  styleUrls: ['./all-assets-report.component.scss']
})
export class AllAssetsReportComponent implements OnInit {
  approveCabinForm!: FormGroup;
  displayedColumns = ['sno','cname','mobile','email','status','action'];
  dataSource = new MatTableDataSource<PeriodicElement>(Sample_Data);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  pageLoading = true;
  isRequestView = false;
  isEditView=false;
  uniqueId: any = '';
  messagesDataList: any = [];
  requiredField: any;
  requiredOption: any;
  dataSave: any;
  dataNotSave: any;
  ///////////

  checklist = [
    { id: 1, value: 'Assigned', isSelected: false },
    { id: 2, value: 'Unassigned', isSelected: false },
    { id: 3, value: 'Expiry Date', isSelected: false },
    { id: 4, value: 'Warranty Date', isSelected: false },
  ];
  employeeList: any = ['Sreeb','Sanela'];
  cabinsList: any = ['Cabin 1','Cabin 2','Cabin 3'];
  isAdd:boolean=false;
  isdata: boolean = true;
  isReject: boolean = false;
  isAssigned:any=false;
  isUnAssigned:any=false;
  isExpiryDate:any=false;
  isWarrantyDate: any = false;
  @ViewChild('TABLE') table!: ElementRef;
  constructor(private formBuilder: FormBuilder, private router: Router,
    public dialog: MatDialog, private excelService: ExcelServiceService) {
  }

  ngOnInit(): void {
  this.dataSource.paginator = this.paginator;
    this.approveCabinForm = this.formBuilder.group(
      {
        appliedDate: [],
        reportManager: [],
        empName: [],
        cabinId: [],
        newCabinId: [],
        remarks: [],
 });
  }
  onChange($event:any){

  }
  isAllSelected(item : any) {
    this.checklist.forEach((val) => {
      if (val.id == item.id) val.isSelected = !val.isSelected;
      else {
        val.isSelected = false;
      }
      console.log(item.value);
    });
  }
ngAfterViewInit() {
     this.dataSource.paginator = this.paginator;
}

applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  exportAsXLSX() {
    const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Late_attendance_Report');
    
    /* save to file */
    XLSX.writeFile(wb, 'Late_attendance_Report.xlsx');
    
  }

  editRequest(event: any) {
    // this.isAdd = true;
    // this.isdata = false;
  }
  updateRequest(){

  }
  deleteRequest(event: any) {
  }

  requestView(event: any) {
  }
  Add(){
   // this.approveCabinForm.controls.companyName.setValue('');
    this.isAdd = true;
    this.isdata = false;
  }
  cancel(){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/Asset/Reports/AllAssets"]));
  }
}

const Sample_Data: PeriodicElement[] = [
  {id: 1, name: 'Sreeb Tech', mobile: 9666313001, email: 'sreeb@gmail.com',address:'Hitech city',type:'Software'},
  {id: 2, name: 'Sanela', mobile: 966666666, email: 'sanela@gmail.com',address:'Kondapur',type:'Hardware'},
  {id: 3, name: 'Sriram Hardwaress', mobile: 898989898, email: 'ram@gmail.com',address:'Madhapor',type:'Network'},
  {id: 4, name: 'ABC Tech', mobile: 568975698, email: 'abc@gmail.com',address:'Gachibowli',type:'Stationary'},
  {id: 5, name: 'Soft Soluntions', mobile: 9638527415, email: 'soft@gmail.com',address:'Gachibowli',type:'Software'},
  {id: 6, name: 'Dell ', mobile: 1478963255, email: 'dell@gmail.com',address:'Gachibowli',type:'Software'},
  {id: 7, name: 'Tech Mahindra', mobile: 1234569874, email: 'techm@gmail.com',address:'Hitech city',type:'Hardware'},
  {id: 8, name: 'Wipro', mobile: 8745693215, email: 'wipro@gmail.com',address:'Hyderabad',type:'Hardware'},
  {id: 9, name: 'Accenture', mobile: 7896541236, email: 'accenture@gmail.com',address:'Kondapur',type:'Network'},
  {id: 10, name: 'TATA Consultency', mobile: 6589471230, email: 'tcs@gmail.com',address:'Kondapur',type:'Hardware'},
  {id: 11, name: 'Cognizent', mobile: 3269857410, email: 'cognizent@gmail.com',address:'Hyderabad',type:'Network'},
];