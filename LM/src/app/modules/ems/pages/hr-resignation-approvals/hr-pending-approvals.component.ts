import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup,FormControl,Validators, FormBuilder, AbstractControl, FormArray} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ReusePopupComponent } from '../reuse-popup/reuse-popup.component';
import { ReviewAndApprovalsComponent } from 'src/app/modules/leaves/dialog/review-and-approvals/review-and-approvals.component';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';

import {EmsService} from '../../ems.service'
import { DatePipe } from "@angular/common";
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
export interface PeriodicElement {
  id: number;
  name: string;
  empid: string;
  status: string;
  date: string;
  reason:string;
  noticeperiod:string;
  releivingdate:string;
  requestexitdate:string;
  // notes:string;
}

@Component({
  selector: 'app-hr-pending-approvals',
  templateUrl: './hr-pending-approvals.component.html',
  styleUrls: ['./hr-pending-approvals.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class HrPendingApprovalsComponent implements OnInit {
  pendingapprovalForm:any= FormGroup;
  deletedata:any;
  titleName:any;
  reason:any;
  ishide:boolean=true;
  isview:boolean=false;
  displayedColumns: string[] = ['sno','name','status','Action'];
  dataSource = new MatTableDataSource;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  arrayList:any=[];
  pipe = new DatePipe('en-US');
  userSession:any;
  EM1:any;
  EM46:any;
  EM47:any;
  EM48:any;
  EM49:any;
  messagesDataList:any=[];
  sendrelivingdate: any;
  sendrequestdate: any;
  mindate:any=new Date();
  maxdate: any = new Date();
  pageLoading = true;
  constructor(private formBuilder: FormBuilder,private router: Router,public dialog: MatDialog,private emsService:EmsService) { }

  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.getEmployeesResignationForHr();
    this.getMessagesList();
    this.pendingapprovalForm = this.formBuilder.group(
      {
        regId:[''],
        employeeId:[''],
        empname: [""],
        empid:[""],
        appliedDate:[""],
        noticeperiod:[""],
        releivingdate:[""],
        requestedDate:[""],
        actualRelievingDate:[''],
        reason:[""],
        approverReason:[''],
        status:[''],
        reasonId:[''],
      });
  }
  view(event: any, data: any) {
    this.ishide = false;
    this.isview = true;
    this.pendingapprovalForm.controls.regId.setValue(data.id)
    this.pendingapprovalForm.controls.employeeId.setValue(data.empid)
    this.pendingapprovalForm.controls.empid.setValue(data.empcode)
    this.pendingapprovalForm.controls.empname.setValue(data.empname)
    this.pendingapprovalForm.controls.appliedDate.setValue(data.applied_date)
    this.pendingapprovalForm.controls.actualRelievingDate.setValue(data.actual_relieving_date)
    this.pendingapprovalForm.controls.releivingdate.setValue(data.original_relieving_date)
    this.pendingapprovalForm.controls.requestedDate.setValue(data.requested_relieving_date)
    this.pendingapprovalForm.controls.noticeperiod.setValue(data.notice_period)
    this.pendingapprovalForm.controls.reason.setValue(data.reason);
    this.pendingapprovalForm.controls.reasonId.setValue(data.reason_id);
    this.pendingapprovalForm.controls.approverReason.setValue(data.approver_comment);
    this.pendingapprovalForm.controls.status.setValue(data.status)
    this.sendrelivingdate = data.original_relieving_date;
    this.sendrequestdate =data.requested_relieving_date

    // this.pendingapprovalForm.controls.notes.setValue(data.notes)
  }
  approve(){
    this.openDialogapprove();
  }
  openDialogapprove():void{
    const dialogRef = this.dialog.open(ReusePopupComponent, {
      width: '565px',position:{top:`70px`},
      data: {name: 'Approve Separation',appliedDate:this.pendingapprovalForm.controls.appliedDate.value, releivingDate:this.sendrequestdate, requestedDate:this.sendrelivingdate,EM1:this.EM1}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.pendingapprovalForm.controls.status.setValue('Approved')
        this.pendingapprovalForm.controls.releivingdate.setValue(result.requestdate);
        this.pendingapprovalForm.controls.actualRelievingDate.setValue(result.approvedate);
        this.pendingapprovalForm.controls.approverReason.setValue(result.reason)
        this.setApproveOrReject();
      }
    });
  }
  reject(){
    // this.deletedata = data;
    // this.titleName="Do you really want to delete the leave?"
    this.openDialogreject();
  }
  openDialogreject(): void {
    const dialogRef = this.dialog.open(ReviewAndApprovalsComponent, {
      width: '500px',position:{top:`70px`},
      data: {name: this.titleName, reason: this.reason,EM1:this.EM1}
    });

    dialogRef.afterClosed().subscribe(result => {
    // this.deletedata.actionreason =result.reason;
      if(result) {
        this.pendingapprovalForm.controls.approverReason.setValue(result.reason)
        this.pendingapprovalForm.controls.status.setValue('Rejected')
        this.setApproveOrReject()

      }
    });
  }

  getEmployeesResignationForHr(){
    let input= {
      'regId':null,
      'empId':null,
      'rmId':null
    }
    this.emsService.getEmployeesResignationForHr(input).subscribe((res: any) => {
      this.arrayList=[]
      if(res && res.status){
        this.arrayList = res.data;
        this.dataSource = new MatTableDataSource(this.arrayList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageLoading = false;

      }

    })

  }

  setApproveOrReject() {
     let data = {
      resgid:this.pendingapprovalForm.controls.regId.value,
      empid:this.pendingapprovalForm.controls.employeeId.value,
      applied_date:this.pipe.transform(this.pendingapprovalForm.controls.appliedDate.value,'yyyy-MM-dd HH:mm:ss'),
      notice_period:this.pendingapprovalForm.controls.noticeperiod.value,
      original_relieving_date:this.pipe.transform(this.pendingapprovalForm.controls.releivingdate.value,'yyyy-MM-dd HH:mm:ss'),
      actual_relieving_date:this.pipe.transform(this.pendingapprovalForm.controls.actualRelievingDate.value,'yyyy-MM-dd HH:mm:ss'),
      requested_relieving_date:this.pipe.transform(this.pendingapprovalForm.controls.requestedDate.value,'yyyy-MM-dd HH:mm:ss'),
      reason_id:this.pendingapprovalForm.controls.reasonId.value,
      resg_comment:'',
      resg_status:this.pendingapprovalForm.controls.status.value,
      approver_comment:this.pendingapprovalForm.controls.approverReason.value,
      actionby:this.userSession.id
    }
     this.emsService.setEmployeeResignation(data).subscribe((res: any) => {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/ems/hr-pending-approval"]));

      if(res.status && res.data == 0){
        this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
          data: res.statusCode == 'Approved'?this.EM46:this.EM47
        });
      }else{
        this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
          data: res.statusCode == 'Approved'?this.EM48:this.EM49
        });
      }
    })
  }

  getMessagesList() {
    let data =
      {
        "code": null,
        "pagenumber": 1,
        "pagesize": 1000
      }
    this.emsService.getMessagesListApi(data).subscribe((res: any) => {
      if (res.status) {
        this.messagesDataList = res.data;
        this.messagesDataList.forEach((e: any) => {
          if (e.code == "EM1") {
            this.EM1 = e.message
          }else if (e.code == "EM46") {
            this.EM46 = e.message
          }else if (e.code == "EM47") {
            this.EM47 = e.message
          }else if (e.code == "EM48") {
            this.EM48 = e.message
          }else if (e.code == "EM49") {
            this.EM49 = e.message
          }
        })
      }
  })
  }

  Cancel() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/ems/hr-pending-approval"]));
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
}
