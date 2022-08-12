import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { AttendanceService } from '../../attendance.service';
import { DialogComponent } from '../../dialog/dialog.component';
import { UserData } from '../../models/EmployeeData';

@Component({
  selector: 'app-approval-history',
  templateUrl: './approval-history.component.html',
  styleUrls: ['./approval-history.component.scss']
})
export class ApprovalHistoryComponent implements OnInit {

  displayedColumns: string[] = ['id','applieddate' ,'worktype','raisedbyname','shift', 'fromdate', 'todate','status','action'];
  dataSource: MatTableDataSource<UserData>=<any>[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  pageLoading=true;
  arrayList: UserData[]=[];
  userSession: any;
  titleName: string='';
  reason: any;
  requestData: any;
  constructor(private router:Router,public dialog: MatDialog,
    private attendanceService:AttendanceService) {
  
   }

  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') ?? '');
    this.getApprovalAttendanceRequestListByEmpId();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
}
getApprovalAttendanceRequestListByEmpId() {
  this.arrayList = [];
  this.attendanceService.getAttendanceRegularizationsHistoryForManager(this.userSession.id).subscribe((res) => {
    if (res.status) {
      this.arrayList = res.data;
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
};
changeTab(elment:UserData){

  this.router.navigate(["/Attendance/Approval"],{state: {userData:elment,url:'ApprovedHistory'}}); 
}
getPageSizes(): number[] {
  if (this.dataSource.data.length > 20) {
    return [5, 10, 20, this.dataSource.data.length];
  }
  else {
   return [5, 10, 20];
  }
}
// acceptApproval(event:any){
//   this.titleName="Approve";
//   this.requestData=event;
//   this.saveApprovalRequest();
// }
// rejectApproval(event:any){
//   this.titleName="Reject";
//   this.requestData=event;
//   this.openDialog();
// }
// saveApprovalRequest(){
//   let obj = {
//   "id":this.requestData.id,
//   "approvercomments": this.reason,
//   "actionby": this.userSession.id,
//   "approvelstatus": this.titleName=="Reject"?'Rejected':'Approved'

// };


// this.attendanceService.updateAttendanceRequest(obj).subscribe((res) => {
//   if (res.status) {
//     let dialogRef = this.dialog.open(ReusableDialogComponent, {
//       position:{top:`70px`},
//       disableClose: true,
//       data: this.titleName=="Reject"?'Attendance request rejected successfully.':'Attendance request approved successfully.'
//     });
//     this.router.navigate(["/Attendance/ApprovalList"],);  
    
//   }
// })
// }

// openDialog(): void {
//   const dialogRef = this.dialog.open(DialogComponent, {
//     width: '500px',position:{top:`70px`},
//     data: {name: this.titleName, reason: this.reason,}
//   });

//   dialogRef.afterClosed().subscribe(result => {
        
//     if(result!=undefined ){
//       if(result !==true){
//         this.reason = result.reason;
//         this.saveApprovalRequest();
//       }   
//     }
//   });
// }
}
