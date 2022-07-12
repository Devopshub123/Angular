import {Component, OnInit, ViewChild} from '@angular/core';
import {UserData} from "../../../attendance/models/EmployeeData";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {LeavesService} from '../../leaves.service'
import {Router} from "@angular/router";
import {ReviewAndApprovalsComponent} from "../../dialog/review-and-approvals/review-and-approvals.component";
import {MatDialog} from "@angular/material/dialog";
import {ReusableDialogComponent} from "../../../../pages/reusable-dialog/reusable-dialog.component";
import {DatePipe} from "@angular/common";
import {ConfirmationComponent} from "../../dialog/confirmation/confirmation.component";

@Component({
  selector: 'app-pending-approvals',
  templateUrl: './pending-approvals.component.html',
  styleUrls: ['./pending-approvals.component.scss']
})
export class PendingApprovalsComponent implements OnInit {
  displayedColumns: string[] = ['appliedOn','empId' ,'empName','leaveType','fromDate', 'toDate', 'noOfDays','pendingSince','action'];
  dataSource: MatTableDataSource<UserData>=<any>[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  // @Input() search: search;

  titleName:any;
  reason:any;
  LM113:any;
  LM114:any;
  pipe = new DatePipe('en-US');
  userSession:any;
  arrayList:any=[];

  constructor(private LM:LeavesService, private router: Router,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    console.log("hello0",this.userSession)
    this.getLeavesForApprovals();
    this.getErrorMessages('LM113')
    this.getErrorMessages('LM114')

  }

  /**
   * get all pending leave for approvals
   * **/
  getLeavesForApprovals(){
    this.LM.getLeavesForApprovals(this.userSession.id).subscribe((res: any) => {
      if (res.status) {
        // this.arrayList = res.data;
        for(let i = 0; i<res.data.length;i++){
          var date = new Date();
          var appliedDate = new Date(res.data[i].appliedon)
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

  applyFilter(event: Event) {
    // const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    //
    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }
/**
 * on click review and approve
 * **/

leaveReview(leave:any){
    this.router.navigate(["/LeaveManagement/ReviewAndApprovals"], { state: { leaveData: leave ,isleave:true} });
  }

  leaveApprove(leave:any,status:any,approverId:any){
    let obj = {
      "id":leave.id,
      "leaveId": leave.leave_id,
      "empId":leave.empid,
      "approverId":approverId?approverId:this.userSession.id,
      "leaveStatus":status,
      "reason":status == 'Approved' ? null:leave.action_reason ? leave.action_reason:this.reason,
    };

    this.LM.setApproveOrReject(obj).subscribe((res: any) => {
      if(res && res.status){
        if(res.leaveStatus == 'Approved'){
          this.dialog.open(ConfirmationComponent, {width: '500px',height:'250px',
            position:{top:`70px`},
            disableClose: true,
            data: this.LM113
          });
          this.getLeavesForApprovals();
        }else {
          this.dialog.open(ConfirmationComponent, {width: '500px',height:'250px',
            position:{top:`70px`},
            disableClose: true,
            data: this.LM114
          });
          this.getLeavesForApprovals();
        }
        }else {
        this.dialog.open(ConfirmationComponent, {width: '500px',height:'250px',
          position:{top:`70px`},
          disableClose: true,
          data: 'Please try again later'
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
          this.leaveApprove(leave,'Rejected',null);
        }
      }
    });
  }

  getErrorMessages(errorCode:any) {
    this.LM.getErrorMessages(errorCode,1,1).subscribe((result)=>{
      if(result.status && errorCode == 'LM113')
      {
        this.LM113 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM114')
      {
        this.LM114 = result.data[0].errormessage
      }

    })
  }

}