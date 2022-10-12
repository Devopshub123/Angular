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
import { CompanySettingService } from 'src/app/services/companysetting.service';
import { AssetService } from '../../asset.service';


export interface PeriodicElement {
  id: number;
  name: string;
  mobile: number;
  email: string;
  address: string;
  type: string;
}

@Component({
  selector: 'app-request-asset-behalf',
  templateUrl: './request-asset-behalf.component.html',
  styleUrls: ['./request-asset-behalf.component.scss']
})
export class RequestAssetBehalfComponent implements OnInit {
  requestAssetForm!: FormGroup;
  displayedColumns = ['sno','cname','mobile','email','type','address','status','action'];
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
  assetTypeList: any = ['Router','Softwares','Laptop'];
  assetNameList: any = ['ACT Fiber','Office 360','Lenovo'];
  employeeList: any = ['Sreeb','Sanela'];
  isAdd:boolean=false;
  isdata: boolean = true;
  constructor(private formBuilder: FormBuilder,private router: Router,private assetService: AssetService) {
  }

  ngOnInit(): void {
  this.dataSource.paginator = this.paginator;
    this.requestAssetForm = this.formBuilder.group(
      {
        appliedDate: [],
        reportManager: [],
        empName: [],
        assetType: [],
        assetName: [],
        reason: [],

      });
      this.requestAssetForm.controls.appliedDate.setValue(new Date());
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

  }

  editRequest(event: any) {
  }
  updateRequest(){

  }
  deleteRequest(event: any) {
  }

  requestView(event: any) {
  }
  Add(){
   // this.requestAssetForm.controls.companyName.setValue('');
    this.isAdd = true;
    this.isdata = false;
  }
  cancel(){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/Asset/RequestAssetBehalf"]));
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

