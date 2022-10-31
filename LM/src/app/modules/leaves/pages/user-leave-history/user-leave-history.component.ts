// import { ReviewAndApprovalsComponent } from './../dialog/review-and-approvals/review-and-approvals.component';
import { ReviewAndApprovalsComponent } from '../../dialog/review-and-approvals/review-and-approvals.component';
import { DialogComponent } from 'src/app/modules/attendance/dialog/dialog.component';
import { Component, OnInit,ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { LeavesService } from '../../leaves.service';
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { LoginService } from 'src/app/services/login.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-user-leave-history',
  templateUrl: './user-leave-history.component.html',
  styleUrls: ['./user-leave-history.component.scss']
})
export class UserLeaveHistoryComponent implements OnInit {
  usersession:any;
  leavedata:any;
  viewdata:any;
  deletedata:any;
  titleName:any;
  reason:any;
  isview:boolean=false;
  isdata:boolean=true;
  maxall : number=20;
  msgLM16:any;
  msgLM17:any;
  msgLM73:any;
  msgLM74:any;
  activeModule:any;
  fileURL:any;
  pdfName:any;
  displayedColumns: string[] = ['appliedon','leavetype','fromdate','todate','days','status','approver','action'];
  dataSource: MatTableDataSource<any>=<any>[];
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private router: Router,private spinner:NgxSpinnerService,private LM:LeavesService,public dialog: MatDialog,private ts :LoginService) { }
  pageLoading = true;
  ngOnInit(): void {
    this.getErrorMessages('LM16');
    this.getErrorMessages('LM17');
    this.getErrorMessages('LM73');
    this.getErrorMessages('LM74');
    this.usersession = JSON.parse(sessionStorage.getItem('user') || '');
    this.activeModule = JSON.parse(sessionStorage.getItem('activeModule') || '');

    this.dataSource.paginator = this.paginator;
    this.getleavehistory(null,null);
  }
  getleavehistory(page:any,size:any){
    this.LM.getleavehistory(this.usersession.id,1,1000).subscribe((result:any)=>{
      this.leavedata=result.data
      this.dataSource = new MatTableDataSource(this.leavedata);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.pageLoading = false;

    })

  }

view(data:any){
  this.isview=true;
  this.isdata=false;
  this.viewdata = data;
  if(data.leavetypeid == 3 || data.leavetypeid == 5){
    this.getUploadDocument(data)

  }
}
close(){
  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    this.router.navigate(["/LeaveManagement/UserLeaveHistory"]));
}
cancel(data:any){
  this.deletedata = data;
  this.titleName="Do you really want to cancel the leave?"
  this.openDialogcancel();
}
openDialogcancel(): void {
  const dialogRef = this.dialog.open(ReviewAndApprovalsComponent, {
    width: '500px',position:{top:`70px`},
    data: {name: this.titleName, reason: this.reason}
  });

  dialogRef.afterClosed().subscribe(result => {
  this.deletedata.actionreason =result.reason;
    if(result!=''){
      this.LM.cancelLeaveRequest(this.deletedata).subscribe((data)=>{
        if(data.status){
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/LeaveManagement/UserLeaveHistory"]));
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: this.msgLM74
          });

        }
        else{
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: this.msgLM17
          });
        }
      })
    }
  });
}

delete(data:any){
  this.deletedata = data;
  this.titleName="Do you really want to delete the leave?"
  this.openDialogdelete();
}
openDialogdelete(): void {
  const dialogRef = this.dialog.open(ReviewAndApprovalsComponent, {
    width: '500px',position:{top:`70px`},
    data: {name: this.titleName, reason: this.reason}
  });

  dialogRef.afterClosed().subscribe(result => {
  this.deletedata.actionreason =result.reason;
    if(result!=''){
      this.LM.setDeleteLeaveRequest(this.deletedata).subscribe((data)=>{
        if(data.status){
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/LeaveManagement/UserLeaveHistory"]));
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position:{top:`70px`},
              disableClose: true,
              data: this.msgLM73
            });
        }
        else{
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: this.msgLM16
          });
        }
      })
    }
  });
}


  edit(leave:any){
    leave.URL = '/LeaveManagement/UserLeaveHistory';
    leave.isdashboard = true;
    this.router.navigate(['/LeaveManagement/LeaveRequest'],{state:{leaveData:leave}});
  }
  getErrorMessages(errorCode:any) {

    this.ts.getErrorMessages(errorCode,1,1).subscribe((result)=>{

      if(result.status && errorCode == 'LM16')
      {
        this.msgLM16 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM17')
      {
        this.msgLM17 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM73')
      {
        this.msgLM73 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM74')
      {
        this.msgLM74 = result.data[0].errormessage
      }


    })
  }

  getUploadDocument(data:any){
    this.spinner.show();

    let info = {
      'employeeId':this.usersession.id,
      'filecategory': data.leavetypeid==3?'SL':'ML',
      'moduleId':this.activeModule.moduleid,
      'requestId':data?data.id:null,
    }
    this.LM.getFilesMaster(info).subscribe((result) => {

      if(result && result.status){
        if(result.data && result.data.length>0){
        let documentName = result.data[0].filename.split('_')
        var docArray=[];
        for(let i=0;i<=documentName.length;i++){
          if(i>2){
            docArray.push(documentName[i])
          }
        }
        this.pdfName = docArray.join('')

       result.data[0].employeeId=this.usersession.id;
       let info = result.data[0]
        this.LM.getProfileImage(info).subscribe((imageData) => {
          this.spinner.hide();
          if(imageData.success){
            let TYPED_ARRAY = new Uint8Array(imageData.image.data);
            const STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
              return data + String.fromCharCode(byte);
            }, '');

            const file = new Blob([TYPED_ARRAY], { type: "application/pdf" });
            this.fileURL = URL.createObjectURL(file);
          }
        })
      }else{
        this.spinner.hide();
      }
      }
      else{
        this.spinner.hide();

      }

    })
    }

    fileView(){
  
      window.open(this.fileURL);
     
  }
  
  getPageSizes(): number[] {
    if (this.dataSource.data.length > 20) {
      return [5, 10, 20, this.dataSource.data.length];
    }
    else {
      return [5, 10, 20];
    }
  }

}
