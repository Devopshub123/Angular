import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ApproveAssetDialogComponent } from '../approve-asset-dialog/approve-asset-dialog.component';

export interface PeriodicElement {
  id: number;
  name: string;
  mobile: number;
  email: string;
  address: string;
  type: string;
}

@Component({
  selector: 'app-approve-asset-change-request-level1',
  templateUrl: './approve-asset-change-request-level1.component.html',
  styleUrls: ['./approve-asset-change-request-level1.component.scss']
})
export class ApproveAssetChangeRequestLevel1Component implements OnInit {
  approveAssetForm!: FormGroup;
  displayedColumns = ['sno','cname','email','aname','type','address','action'];
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
  isAdd:boolean=false;
  isdata: boolean = true;
  assetCategoryList: any = ['Software','Hardware','Stationary'];
  assetTypeList: any = ['Router', 'Softwares', 'Laptop'];
  assetNameList: any = ['ACT Fiber', 'Office 360', 'Lenovo'];
  isReject: boolean = false;
  constructor(private formBuilder: FormBuilder,private router: Router, public dialog: MatDialog,) {
  }

  ngOnInit(): void {
  this.dataSource.paginator = this.paginator;
    this.approveAssetForm = this.formBuilder.group(
      {
        appliedDate: [],
        reportManager: [, Validators.required],
        empName: [, Validators.required],
        assetCategory: [],
        assetName: [],
        assetType: [],
        existingId: [],
        reason: [],

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
  approveRequest() {
    this.isReject = false;
    this.dialog.open(ApproveAssetDialogComponent, {
      disableClose:true,
      data: this.isReject,
    });
  }
  rejectAsset() {
    this.isReject = true;
    this.dialog.open(ApproveAssetDialogComponent, {
      height: '40%',
      width: '30%',
      disableClose:true,
      data: this.isReject
    });
  }

  editRequest(event: any) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/Asset/ApproveAssetChangeRequestL2"]));
  }
  updateRequest(){

  }
  deleteRequest(event: any) {
  }

  requestView(event: any) {
    this.isAdd = true;
    this.isdata = false;
  }
  Add(){
    //this.approveAssetForm.controls.companyName.setValue('');
    this.isAdd = true;
    this.isdata = false;
  }
  cancel(){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/Asset/ApproveAssetChangeRequestL1"]));
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