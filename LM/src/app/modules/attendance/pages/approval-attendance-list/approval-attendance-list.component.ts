import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/modules/admin/admin.service';
import { EmsService } from 'src/app/modules/ems/ems.service';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { AttendanceService } from '../../attendance.service';
import { DialogComponent } from '../../dialog/dialog.component';
import { UserData } from '../../models/EmployeeData';
interface IdName {
  id: string;
  name: string;
}
/** Constants used to fill up our data base. */

@Component({
  selector: 'app-approval-attendance-list',
  templateUrl: './approval-attendance-list.component.html',
  styleUrls: ['./approval-attendance-list.component.scss']
})


export class ApprovalAttendanceListComponent implements OnInit {
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
  messagesDataList: any = [];
  reqField: any;
  reqOption: any;
  reqSave: any;
  reqNotSave: any;
  reqReject: any;
  reqNotReject: any;
  constructor(private router:Router,public dialog: MatDialog,
    private attendanceService: AttendanceService, private adminService: AdminService,
    private emsService: EmsService) {
  
     // Assign the data to the data source for the table to render
    
   }
   employeeEmailData: any = [];
   employeeId: any;
  ngOnInit(): void {
    this.getMessagesList();
    this.userSession = JSON.parse(sessionStorage.getItem('user') ?? '');
    this.getPendingAttendanceRequestListByEmpId();
  }
  ngAfterViewInit() {
    // this.dataSource = new MatTableDataSource(this.arrayList);
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
}
getPendingAttendanceRequestListByEmpId() {
  this.arrayList = [];
  this.attendanceService.getPendingAttendanceListByManagerEmpId(this.userSession.id).subscribe((res) => {
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

  this.router.navigate(["/Attendance/Approval"],{state: {userData:elment,url:'ApprovalList'}}); 
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
acceptApproval(event:any){
  this.titleName="Approve";
  this.requestData = event;
  this.getEmployeeEmailData();
}
rejectApproval(event:any){
  this.titleName="Reject";
  this.requestData=event;
  this.openDialog();
}
  saveApprovalRequest() {
  let obj = {
  "id":this.requestData.id,
  "approvercomments": this.reason,
  "actionby": this.userSession.id,
    "approvelstatus": this.titleName == "Reject" ? 'Rejected' : 'Approved',
    "empData": this.requestData,
    "emailData":this.employeeEmailData,

};
this.attendanceService.updateAttendanceRequest(obj).subscribe((res) => {
  if (res.status) {
    let resMessage: any;
    if (res.message == "ApprovalRequest") {
      if (this.titleName=="Reject") {
        resMessage=this.reqReject
      } else {
        resMessage=this.reqSave
      }
    } else if (res.message == "UnableToApprove") {
      resMessage=this.reqNotSave
    } 
     let dialogRef = this.dialog.open(ReusableDialogComponent, {
      position:{top:`70px`},
      disableClose: true,
      data: resMessage
     // data: this.titleName=="Reject"?'Attendance request rejected successfully.':'Attendance request approved successfully.'
    });
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    this.router.navigate(["/Attendance/ApprovalList"]));
    
  }
})
    
    
}

openDialog(): void {
  const dialogRef = this.dialog.open(DialogComponent, {
    width: '500px',position:{top:`70px`},
    data: {name: this.titleName, reason: this.reason,}
  });

  dialogRef.afterClosed().subscribe(result => {
        
    if(result!=undefined ){
      if(result !==true){
        this.reason = result.reason;
        this.getEmployeeEmailData();
      }   
    }
  });
  }
  getMessagesList() {
    let data = 
     {
       "code": null,
       "pagenumber":1,
       "pagesize":100
   }
   this.adminService.getMessagesListApi(data).subscribe((res:any)=>{
     if(res.status) {
       this.messagesDataList = res.data;
       this.messagesDataList.forEach((e: any) => {
        if (e.code == "ATT13") {
         this.reqSave = e.message
        }else if (e.code == "ATT14") {
          this.reqNotSave =e.message
        }   else if (e.code == "ATT15") {
          this.reqReject =e.message
        } 
      })
     }
     else {
       this.messagesDataList = [];
     }

   })
  }
  
  getEmployeeEmailData() {
    this.employeeEmailData = [];
    this.emsService.getEmployeeEmailDataByEmpid(this.requestData.raisedbyid)
      .subscribe((res: any) => {
        this.employeeEmailData = JSON.parse(res.data[0].jsonvalu)[0];
        this.saveApprovalRequest();
      })
  }
}
