
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';
import { AttendanceService } from '../../attendance.service';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
@Component({
  selector: 'app-approval-attendance',
  templateUrl: './approval-attendance.component.html',
  styleUrls: ['./approval-attendance.component.scss']
})
export class ApprovalAttendanceComponent implements OnInit {
  requestform!: FormGroup;
  fromDate: any;
  toDate: any;
  today: Date = new Date();
  minDate=new Date('1950/01/01'); maxDate = new Date();
  pipe = new DatePipe('en-US');
  todayWithPipe:any;
  public userData:any;
  reason: string='';
  titleName: string='';
  userSession: any;
  constructor(private formBuilder: FormBuilder, private activeroute: ActivatedRoute,
    private location:Location,public dialog: MatDialog,private router:Router,
     private attendanceService: AttendanceService) { }

  ngOnInit(): void {
    // if (this.activeroute.snapshot.params.userData !=null){
    //   this.userData=this.activeroute.snapshot.params.userData;
    // }
    this.userData = this.location.getState();
   if(this.userData.userData ==null && this.userData.userData ==undefined ){
    this.router.navigate(["/Attendance/ApprovalList"],);  
   }
    this.todayWithPipe = this.pipe.transform(Date.now(), 'dd/MM/yyyy');
    this.requestform=this.formBuilder.group(
      {
        appliedDate:[this.userData.userData.applieddate,Validators.required],
        shift:[this.userData.userData.shift,Validators.required],
        empName:[this.userData.userData.raisedbyname,Validators.required],
        fromDate:[this.userData.userData.fromdate,Validators.required],
        toDate:[this.userData.userData.todate,Validators.required],
        workType:[this.userData.userData.worktype,Validators.required],
        reason:[this.userData.userData.reason,Validators.required],
        
      });
      this.userSession = JSON.parse(sessionStorage.getItem('user') ?? '');
      
  }
  acceptApproval(){
    this.titleName="Approve"
    
    this.openDialog();
  }
  rejectApproval(){
    this.titleName="Reject"
    this.openDialog();
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px',position:{top:`70px`},
      data: {name: this.titleName, reason: this.reason,}
    });

    dialogRef.afterClosed().subscribe(result => {
          
      if(result!=undefined ){
        this.reason = result.reason;
        this.saveApproval();
        
      }
    });
  }
  saveApproval(){
      let obj = {
      "id":this.userData.userData.id,
      "approvercomments": this.reason,
      "actionby": this.userSession.id,
      "approvelstatus": this.titleName=="Reject"?'Rejected':'Approved'

    };


    this.attendanceService.updateAttendanceRequest(obj).subscribe((res) => {
      if (res.status) {
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          disableClose: true,
          data: this.titleName=="Reject"?'Attendance request rejected successfully':'Attendance request approved successfully'
        });
        this.router.navigate(["/Attendance/ApprovalList"],);  
        
      }
    })
  }
}


