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
import { NgxSpinnerService } from 'ngx-spinner';
import { EmsService } from 'src/app/modules/ems/ems.service';

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
  LM119:any;
  pageLoading=true;
  employeeEmailData: any = [];
  employeeId: any;
  constructor(private LM: LeavesService, private router: Router, public dialog: MatDialog,
    public spinner: NgxSpinnerService,private emsService: EmsService) { }

  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.getLeavesForApprovals();
    this.getErrorMessages('LM113')
    this.getErrorMessages('LM114')
    this.getErrorMessages('LM119')
    

  }

  /**
   * get all pending leave for approvals
   * **/
  getLeavesForApprovals(){
    this.spinner.show();
    this.arrayList= [];
    this.LM.getLeavesForApprovals(this.userSession.id).subscribe((res: any) => {
      this.spinner.hide();
      if (res.status) {
        this.arrayList = res.data;
        // for(let i = 0; i<res.data.length;i++){
        //   var date = new Date();
        //   var appliedDate = new Date(res.data[i].appliedon)
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

  leaveReview(leave: any) {
  leave.url = '/LeaveManagement/ManagerDashboard'
  this.router.navigate(["/LeaveManagement/ReviewAndApprovals"], { state: { leaveData: leave ,isleave:true} });
  }
  submit(leave: any, status: any, approverId: any) {
    this.employeeId = leave.empid;
    this.getEmployeeEmailData(leave ,status,approverId);
  }
  leaveApprove(leave: any, status: any, approverId: any) {
    if(this.employeeEmailData.length==0){
      this.getEmployeeEmailData(leave ,status,approverId);
    }
    else{
    let obj = {
      "id":leave.id,
      "leaveId": leave.leave_id,
      "empId":leave.empid,
      "approverId":approverId?approverId:this.userSession.id,
      "leaveStatus":status,
      "reason":status == 'Approved' ? null:leave.action_reason ? leave.action_reason:this.reason,
      "detail": leave.bereavement_id ? leave.bereavement_id : leave.comp_off_worked_date ? leave.comp_off_worked_date : null,
      /// email data
      "leavedata": leave,
      "emaildata": this.employeeEmailData,
      
    };

 this.LM.setApproveOrReject(obj).subscribe((res: any) => {
      this.spinner.hide();
      if(res && res.status){
        if(res.leaveStatus == 'Approved'){
          this.dialog.open(ConfirmationComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: {Message:this.LM113,url: '/LeaveManagement/ManagerDashboard'}
          });
          this.getLeavesForApprovals();
        }else {
          this.dialog.open(ConfirmationComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: {Message:this.LM114,url: '/LeaveManagement/ManagerDashboard'}
          });
          this.getLeavesForApprovals();
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>

        this.router.navigate(["/LeaveManagement/ManagerDashboard"]));
          
        }
        }else {
        this.dialog.open(ConfirmationComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: {Message:this.LM119,url: '/LeaveManagement/ManagerDashboard'}
        });

      }


    })
  }
  }
  leaveReject(leave: any, status: any, rejectId: any) {
    this.titleName="Reject"
    this.openDialog(leave)
  }

  openDialog(leave:any): void {
    const dialogRef = this.dialog.open(ReviewAndApprovalsComponent, {
      width: '600px',position:{top:`100px`},
      data: {name: this.titleName, reason: this.reason,}
    });

    dialogRef.afterClosed().subscribe(result => {

      if(result!=undefined ){
        if(result !==true){
          this.reason = result.reason;
        //  this.leaveApprove(leave, 'Rejected', null);
        this.employeeId = leave.empid;
          this.getEmployeeEmailData(leave ,'Rejected',null);
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
      else if(result.status && errorCode == 'LM119')
      {
        this.LM119 = result.data[0].errormessage
      }
    })
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
  getEmployeeEmailData(leave: any, status: any, approverId: any) {
     this.employeeEmailData = [];
     this.employeeId = leave.empid;
    this.emsService.getEmployeeEmailDataByEmpid(this.employeeId)
      .subscribe((res: any) => {
        this.employeeEmailData = JSON.parse(res.data[0].jsonvalu)[0];
        this.leaveApprove(leave,status,approverId)
      })
    
}
  
}
