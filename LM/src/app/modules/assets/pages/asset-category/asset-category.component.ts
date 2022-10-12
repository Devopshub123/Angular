import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { Location } from '@angular/common';
import { AdminService } from 'src/app/modules/admin/admin.service';
import { AttendanceService } from 'src/app/modules/attendance/attendance.service';


export interface PeriodicElement {
  id: number;
  name: string;
  mobile: number;
  email: string;
  address: string;
  type: string;
}

@Component({
  selector: 'app-asset-category',
  templateUrl: './asset-category.component.html',
  styleUrls: ['./asset-category.component.scss']
  
})
export class AssetCategoryComponent implements OnInit {
  assetCategoryForm!: FormGroup;
  pipe = new DatePipe('en-US');
  todayWithPipe: any;
  displayedColumns = ['sno','type','action'];
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
  constructor(private formBuilder: FormBuilder, private attendanceService: AttendanceService,
    public dialog: MatDialog, public datePipe: DatePipe, private router: Router,
    private location: Location,private adminService: AdminService) {
  }

  ngOnInit(): void {
  this.dataSource.paginator = this.paginator;
    this.assetCategoryForm = this.formBuilder.group(
      {
        assetCategory: [, Validators.required],
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
  saveRequest() {
  }
  resetform() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    this.router.navigate(["/Asset/AssetCategory"]));
  }

  editRequest(event: any) {
  }
  updateRequest(){

  }
  deleteRequest(event: any) {
  }

  requestView(event: any) {
  }

}

const Sample_Data: PeriodicElement[] = [
  {id: 1, name: 'Sreeb Tech', mobile: 9666313001, email: 'sreeb@gmail.com',address:'Hitech city',type:'Software'},
  {id: 1, name: 'Sanela', mobile: 966666666, email: 'sanela@gmail.com',address:'Kondapur',type:'Hardware'},
  {id: 1, name: 'Sriram Hardwaress', mobile: 898989898, email: 'ram@gmail.com',address:'Madhapor',type:'Network'},
  {id: 1, name: 'ABC Tech', mobile: 568975698, email: 'abc@gmail.com',address:'Gachibowli',type:'Stationary'},
  {id: 1, name: 'Soft Soluntions', mobile: 9638527415, email: 'soft@gmail.com',address:'Gachibowli',type:'Software'},
  {id: 1, name: 'Dell ', mobile: 1478963255, email: 'dell@gmail.com',address:'Gachibowli',type:'Software'},
  {id: 1, name: 'Tech Mahindra', mobile: 1234569874, email: 'techm@gmail.com',address:'Hitech city',type:'Hardware'},
  {id: 1, name: 'Wipro', mobile: 8745693215, email: 'wipro@gmail.com',address:'Hyderabad',type:'Hardware'},
  {id: 1, name: 'Accenture', mobile: 7896541236, email: 'accenture@gmail.com',address:'Kondapur',type:'Network'},
  {id: 1, name: 'TATA Consultency', mobile: 6589471230, email: 'tcs@gmail.com',address:'Kondapur',type:'Hardware'},
  {id: 1, name: 'Cognizent', mobile: 3269857410, email: 'cognizent@gmail.com',address:'Hyderabad',type:'Network'},
];
