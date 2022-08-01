import { Component, OnInit,ViewChild } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {LeavesService} from "../../leaves.service";
import {MatTableDataSource} from "@angular/material/table";
import {UserData} from "../../../attendance/models/EmployeeData";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ConfirmationComponent} from "../../dialog/confirmation/confirmation.component";
import {ReviewAndApprovalsComponent} from "../../dialog/review-and-approvals/review-and-approvals.component";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-leaves-for-cancellation',
  templateUrl: './leaves-for-cancellation.component.html',
  styleUrls: ['./leaves-for-cancellation.component.scss']
})
export class LeavesForCancellationComponent implements OnInit {
  displayedColumns: string[] = ['appliedOn','empId' ,'empName','leaveType','fromDate', 'toDate', 'noOfDays','pendingSince','action'];
  dataSource: MatTableDataSource<UserData>=<any>[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  titleName:any;
  reason:any;
  LM113:any;
  LM114:any;
  pipe = new DatePipe('en-US');
  userSession:any;
  arrayList:any=[];
  LM120:any;
  LM121:any;
  LM119:any;
  constructor(private LM:LeavesService, private router: Router,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.getLeavesForCancellation()

  }

  /**
   * get all pending leave for Cancellation
   * **/
  getLeavesForCancellation(){
    this.arrayList= [];
    this.LM.getLeavesForCancellation(this.userSession.id).subscribe((res: any) => {
      if (res.status) {
        // this.arrayList = res.data;
        for(let i = 0; i<res.data.length;i++){
          var date = new Date();
          var appliedDate = new Date(res.data[i].updatedon)
          // appliedDate.setHours(0);
          // appliedDate.setMinutes(0);
          // appliedDate.setSeconds(0);
          res.data[i].pendingSince = date.getDate() - appliedDate.getDate();
          this.arrayList.push(res.data[i])
        }
        console.log(this.arrayList,'this.arrayList')

        this.dataSource = new MatTableDataSource(this.arrayList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.arrayList = [];
        this.dataSource = new MatTableDataSource(this.arrayList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }

  /**
   * on click review and approve
   * **/

  leaveReview(leave:any){
    leave.url = '/LeaveManagement/ManagerDashboard'
    this.router.navigate(["/LeaveManagement/ReviewAndApprovals"], { state: { leaveData: leave ,isleave:true,isCancellation:true} });
  }

  leaveCancellationApprove(leave:any,status:any,approverId:any){
    let obj = {
      "id":leave.id,
      "leaveId": leave.leave_id,
      "empId":leave.empid,
      "approverId":approverId?approverId:this.userSession.id,
      "leaveStatus":status,
      "reason":status == 'Cancel Approved' ? null:leave.action_reason ? leave.action_reason:this.reason,
      "detail":leave.bereavement_id?leave.bereavement_id:leave.worked_date?leave.worked_date:null
    };

    this.LM.setApproveOrReject(obj).subscribe((res: any) => {
      if(res && res.status){
        if(res.leaveStatus == 'Cancel Approved'){
          this.dialog.open(ConfirmationComponent, {width: '500px',height:'250px',
            position:{top:`70px`},
            disableClose: true,
            data: {Message:this.LM120,url: '/LeaveManagement/ManagerDashboard'}
          });
          this.getLeavesForCancellation();
        }else {
          this.dialog.open(ConfirmationComponent, {width: '500px',height:'250px',
            position:{top:`70px`},
            disableClose: true,
            data: {Message:this.LM121,url: '/LeaveManagement/ManagerDashboard'}
          });
          this.getLeavesForCancellation();
        }
      }else {
        this.dialog.open(ConfirmationComponent, {width: '500px',height:'250px',
          position:{top:`70px`},
          disableClose: true,
          data: {Message:this.LM119,url: '/LeaveManagement/ManagerDashboard'}
        });

      }


    })

  }
  leaveReject(leave:any){

    this.titleName="Reject"
    this.openDialog(leave)
  }

  openDialog(leave:any): void {
    const dialogRef = this.dialog.open(ReviewAndApprovalsComponent, {
      width: '500px',position:{top:`70px`},
      data: {name: this.titleName, reason: this.reason,}
    });

    dialogRef.afterClosed().subscribe(result => {

      if(result!=undefined ){
        if(result !==true){
          this.reason = result.reason;
          this.leaveCancellationApprove(leave,'Cancel Rejected',null);
        }
      }
    });
  }

  getErrorMessages(errorCode:any) {
    this.LM.getErrorMessages(errorCode,1,1).subscribe((result)=>{
      if(result.status && errorCode == 'LM120')
      {
        this.LM120 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM121')
      {
        this.LM121 = result.data[0].errormessage
      }else if(result.status && errorCode == 'LM119')
      {
        this.LM119 = result.data[0].errormessage
      }

    })
  }

}