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
  constructor(private LM:LeavesService,public dialog: MatDialog,private router: Router) { }

  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.getCompoffForApprovals();
    this.getErrorMessages('LM115')
    this.getErrorMessages('LM116')


  }


  getCompoffForApprovals() {
    this.LM.getCompoffForApprovals(this.userSession.id).subscribe((res: any) => {
      if (res.status) {
        // this.arrayList = res.data;
        for(let i = 0; i<res.data.length;i++){
          var date = new Date();
          var appliedDate = new Date(res.data[i].applied_date)
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

    });
  }

  compoffApprove(compoff:any,status:any,approverId :any){

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
    compoff.remarks = compoff.remarks ?compoff.remarks: null;

    this.LM.setCompoffForApproveOrReject(compoff).subscribe((res: any) => {
      if(res && res.status){
        if(res.compoffStatus == 'Approved'){
          this.dialog.open(ConfirmationComponent, {width: '500px',height:'250px',
            position:{top:`70px`},
            disableClose: true,
            data: this.LM115
          });
          this.getCompoffForApprovals();
        }else {
          this.dialog.open(ConfirmationComponent, {width: '500px',height:'250px',
            position:{top:`70px`},
            disableClose: true,
            data: this.LM116
          });
          this.getCompoffForApprovals();
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
  compoffReject(compoff:any){
    this.titleName="Reject"
    this.openDialog(compoff)

  }

  compoffReview(compoff:any){
    this.router.navigate(["/LeaveManagement/ReviewAndApprovals"], { state: { leaveData: compoff ,isleave:false} });

  }


  openDialog(compoff:any): void {
    const dialogRef = this.dialog.open(ReviewAndApprovalsComponent, {
      width: '500px',position:{top:`70px`},
      data: {name: this.titleName, reason: this.reason,}
    });

    dialogRef.afterClosed().subscribe(result => {

      if(result!=undefined ){
        if(result !==true){
          compoff.remarks = result.reason;
          this.compoffApprove(compoff,'Rejected',null);
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

    })
  }

}