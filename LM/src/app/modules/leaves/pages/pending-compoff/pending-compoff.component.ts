import {Component, OnInit, ViewChild} from '@angular/core';
import {LeavesService} from "../../leaves.service";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UserData} from "../../../attendance/models/EmployeeData";
import {ReviewAndApprovalsComponent} from "../../dialog/review-and-approvals/review-and-approvals.component";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmationComponent} from "../../dialog/confirmation/confirmation.component";
import {Router} from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';
import { EmsService } from 'src/app/modules/ems/ems.service';


@Component({
  selector: 'app-pending-compoff',
  templateUrl: './pending-compoff.component.html',
  styleUrls: ['./pending-compoff.component.scss']
})
export class PendingCompoffComponent implements OnInit {

  userSession:any;
  displayedColumns: string[] = ['appliedOn','empId' ,'empName','fromDate', 'noOfHours','pendingSince','reason','action'];
  dataSource: MatTableDataSource<UserData>=<any>[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  arrayList:any=[];
  reason:any;
  titleName:any;
  LM115:any;
  LM116:any;
  LM119:any;
  pageLoading=true;
  constructor(private LM: LeavesService, public dialog: MatDialog, private router: Router,
    private spinner: NgxSpinnerService,private EMS: EmsService) { }
  employeeEmailData: any = [];
  employeeId: any;
  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.getCompoffForApprovals();
    this.getErrorMessages('LM115')
    this.getErrorMessages('LM116')
    this.getErrorMessages('LM119')


  }


  getCompoffForApprovals() {
    this.spinner.show()

    this.arrayList= [];

    this.LM.getCompoffForApprovals(this.userSession.id).subscribe((res: any) => {
      this.spinner.hide();

      if (res.status) {
        this.arrayList = res.data;
        // for(let i = 0; i<res.data.length;i++){
        //   var date = new Date();
        //   var appliedDate = new Date(res.data[i].applied_date)
        //   res.data[i].pendingSince = date.getDate() - appliedDate.getDate();
        //   this.arrayList.push(res.data[i])
        // }

        this.dataSource = new MatTableDataSource(this.arrayList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageLoading=false;
      } else {
        this.arrayList = [];
        this.dataSource = new MatTableDataSource(this.arrayList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }

    });
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

  submit(compoff:any,status:any,approverId :any) {
    this.employeeId = compoff.empid;
    this.getEmployeeEmailData(compoff,status,approverId );
  }
  compoffApprove(compoff:any,status:any,approverId :any){
    this.spinner.show();

    // let obj = {
    //   "id":compoff.id,
    //   "leaveId": compoff.leave_id,
    //   "empId":compoff.empid,
    //   "approverId":approverId?approverId:this.userSession.id,
    //   "leaveStatus":status,
    //   "reason":status == 'Approved' ? null:compoff.action_reason ? compoff.action_reason:this.reason,
    // };
    compoff.rmid = this.userSession.id;
    compoff.status = status;
    compoff.remarks = compoff.remarks ? compoff.remarks : null;
    compoff.emaildata = this.employeeEmailData;

    this.LM.setCompoffForApproveOrReject(compoff).subscribe((res: any) => {
      this.spinner.hide();
      if(res && res.status){
        if(res.compoffStatus == 'Approved'){
          this.dialog.open(ConfirmationComponent, {
            position:{top:`70px`},
            disableClose: true,
            data:{Message:this.LM115,url: '/LeaveManagement/ManagerDashboard'}
          });
          this.getCompoffForApprovals();
        }else {
          this.dialog.open(ConfirmationComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: {Message:this.LM116,url: '/LeaveManagement/ManagerDashboard'}
          });
          this.getCompoffForApprovals();
        }
      }else {
        this.dialog.open(ConfirmationComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: {Message:'Please try again later',url: '/LeaveManagement/ManagerDashboard'}
        });

      }


    })


  }
  compoffReject(compoff:any,status:any,approverId :any){
    this.titleName="Reject"
    this.openDialog(compoff)

  }

  compoffReview(compoff:any){
    compoff.leavestatus = compoff.status;
    compoff.url = '/LeaveManagement/ManagerDashboard'

    this.router.navigate(["/LeaveManagement/ReviewAndApprovals"], { state: { leaveData: compoff ,isleave:false} });

  }


  openDialog(compoff:any): void {
    const dialogRef = this.dialog.open(ReviewAndApprovalsComponent, {
      position:{top:`70px`},
      data: {name: this.titleName, reason: this.reason,}
    });

    dialogRef.afterClosed().subscribe(result => {

      if(result!=undefined ){
        if(result !==true){
          compoff.remarks = result.reason;
          this.employeeId = compoff.empid;
          this.getEmployeeEmailData(compoff,'Rejected',null)
        }
      }
    });
  }


  getErrorMessages(errorCode:any) {
    this.LM.getErrorMessages(errorCode,1,1).subscribe((result)=>{
      if(result.status && errorCode == 'LM115')
      {
        this.LM115 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM116')
      {
        this.LM116 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM119')
      {
        this.LM119 = result.data[0].errormessage
      }

    })
  }
  getEmployeeEmailData(compoff:any,status:any,approverId :any) {
    this.employeeEmailData = [];
    this.EMS.getEmployeeEmailDataByEmpid(this.employeeId)
      .subscribe((res: any) => {
        this.employeeEmailData = JSON.parse(res.data[0].jsonvalu)[0];

        this.compoffApprove(compoff,status,approverId)
      })
}
}
