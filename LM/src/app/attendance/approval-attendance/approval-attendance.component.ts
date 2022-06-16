import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
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
  animal: string='';
  titleName: string='';
  constructor(private formBuilder: FormBuilder, private activeroute: ActivatedRoute,
    private location:Location,public dialog: MatDialog,private router:Router) { }

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
        appliedDate:[this.userData.userData.appliedDate,Validators.required],
        shift:[this.userData.userData.shift,Validators.required],
        empName:[this.userData.userData.empName,Validators.required],
        fromDate:[this.userData.userData.fromDate,Validators.required],
        toDate:[this.userData.userData.toDate,Validators.required],
        workType:[this.userData.userData.workType,Validators.required],
        reason:[this.userData.userData.reason,Validators.required],
        
      });
      
      
  }
  acceptApproval(){
    this.titleName="Accept Approval"
    this.openDialog();
  }
  rejectApproval(){
    this.titleName="Reject Approval"
    this.openDialog();
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '300px',
      data: {name: this.titleName, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }
}
