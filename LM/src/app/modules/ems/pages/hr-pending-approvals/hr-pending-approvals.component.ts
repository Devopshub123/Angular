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
  EM24:any;
  EM25:any;
  EM26:any;
  EM27:any;
  messagesDataList:any=[];

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
  view(event:any,data:any){
    this.ishide = false;
    this.isview = true;
    this.pendingapprovalForm.controls.regId.setValue(data.id)
    this.pendingapprovalForm.controls.employeeId.setValue(data.empid)
    this.pendingapprovalForm.controls.empid.setValue(data.empcode)
    this.pendingapprovalForm.controls.empname.setValue(data.empname)
    this.pendingapprovalForm.controls.appliedDate.setValue(this.pipe.transform(data.applied_date,'dd-MM-yyyy'))
    this.pendingapprovalForm.controls.actualRelievingDate.setValue(this.pipe.transform(data.actual_relieving_date,'dd-MM-yyyy'))
    this.pendingapprovalForm.controls.releivingdate.setValue(this.pipe.transform(data.original_relieving_date,'dd-MM-yyyy'))
    this.pendingapprovalForm.controls.requestedDate.setValue(this.pipe.transform(data.requested_relieving_date,'dd-MM-yyyy'))
    this.pendingapprovalForm.controls.noticeperiod.setValue(data.notice_period)
    this.pendingapprovalForm.controls.reason.setValue(data.reason);
    this.pendingapprovalForm.controls.reasonId.setValue(data.reason_id);
    this.pendingapprovalForm.controls.approverReason.setValue(data.approver_comment);
    this.pendingapprovalForm.controls.status.setValue(data.status)

    // this.pendingapprovalForm.controls.notes.setValue(data.notes)
  }
  approve(){
    this.openDialogapprove();
  }
  openDialogapprove():void{
    const dialogRef = this.dialog.open(ReusePopupComponent, {
      width: '565px',position:{top:`70px`},
      data: {name: 'Approve Resignation',appliedDate:this.pendingapprovalForm.controls.appliedDate.value, releivingDate:this.pendingapprovalForm.controls.releivingdate.value, requestedDate:this.pendingapprovalForm.controls.requestedDate.value,EM1:this.EM1}
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

      }

    })

  }

  setApproveOrReject(){
    let data = {
      resgid:this.pendingapprovalForm.controls.regId.value,
      empid:this.pendingapprovalForm.controls.employeeId.value,
      applied_date:this.pipe.transform(this.pendingapprovalForm.controls.appliedDate.value,'yyyy-MM-dd')+' '+this.pipe.transform(this.pendingapprovalForm.controls.appliedDate.value, 'HH:mm:ss'),
      notice_period:this.pendingapprovalForm.controls.noticeperiod.value,
      original_relieving_date:this.pipe.transform(this.pendingapprovalForm.controls.releivingdate.value,'yyyy-MM-dd')+' '+this.pipe.transform(this.pendingapprovalForm.controls.releivingdate.value, 'HH:mm:ss'),
      actual_relieving_date:this.pipe.transform(this.pendingapprovalForm.controls.actualRelievingDate.value,'yyyy-MM-dd')+' '+this.pipe.transform(this.pendingapprovalForm.controls.actualRelievingDate.value, 'HH:mm:ss'),
      requested_relieving_date:this.pipe.transform(this.pendingapprovalForm.controls.requestedDate.value,'yyyy-MM-dd')+' '+this.pipe.transform(this.pendingapprovalForm.controls.requestedDate.value, 'HH:mm:ss'),
      reason_id:this.pendingapprovalForm.controls.reasonId.value,
      resg_comment:'',
      resg_status:this.pendingapprovalForm.controls.status.value,
      approver_comment:this.pendingapprovalForm.controls.approverReason.value,
      actionby:this.userSession.id
    }

    this.emsService.setEmployeeResignation(data).subscribe((res: any) => {

      if(res.status && res.data == 0){
        this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
          data: res.statusCode == 'Approved'?this.EM24:this.EM25
        });
      }else{
        this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
          data: res.statusCode == 'Approved'?this.EM26:this.EM27
        });
      }
    })
  }

  getMessagesList() {
    let data =
      {
        "code": null,
        "pagenumber": 1,
        "pagesize": 100
      }
    this.emsService.getMessagesListApi(data).subscribe((res: any) => {
      if (res.status) {
        this.messagesDataList = res.data;
        this.messagesDataList.forEach((e: any) => {
          if (e.code == "EM1") {
            this.EM1 = e.message
          }else if (e.code == "EM24") {
            this.EM24 = e.message
          }else if (e.code == "EM25") {
            this.EM25 = e.message
          }else if (e.code == "EM26") {
            this.EM26 = e.message
          }else if (e.code == "EM27") {
            this.EM27 = e.message
          }
        })
      }
  })
  }

  Cancel(){
    console.log("jhvfjdhs")
    this.ishide=true;
    this.isview=false;
  }
}
