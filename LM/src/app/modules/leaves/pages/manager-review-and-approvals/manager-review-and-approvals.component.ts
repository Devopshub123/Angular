import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DatePipe, Location} from "@angular/common";
import {DialogComponent} from "../../../attendance/dialog/dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ReviewAndApprovalsComponent} from "../../dialog/review-and-approvals/review-and-approvals.component";
import {LeavesService} from "../../leaves.service";
import {PendingApprovalsComponent} from "../pending-approvals/pending-approvals.component";
import {Router} from "@angular/router";
import {PendingCompoffComponent} from "../pending-compoff/pending-compoff.component";


@Component({
  selector: 'app-manager-review-and-approvals',
  templateUrl: './manager-review-and-approvals.component.html',
  styleUrls: ['./manager-review-and-approvals.component.scss']
})
export class ManagerReviewAndApprovalsComponent implements OnInit {
  requestform:any= FormGroup;
  leaveInfo:any;
  titleName:any;
  reason:any;
  userSession:any;
  pendingapprove:any;
  compoffPendingapprove:any;
  constructor(private formBuilder: FormBuilder,private location: Location,public dialog: MatDialog,private LM:LeavesService,private router: Router) {
    this.leaveInfo = this.location.getState();
  }
  pipe = new DatePipe('en-US');


  ngOnInit(): void {
    this.pendingapprove = new PendingApprovalsComponent(this.LM,this.router,this.dialog);
    this.compoffPendingapprove = new PendingCompoffComponent(this.LM,this.dialog,this.router,);
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.pendingapprove.ngOnInit();
    this.compoffPendingapprove.ngOnInit();
    this.requestform = this.formBuilder.group(
          {
            appliedOn: [{ value:'' , disabled: true }],
            empId: [{ value: '', disabled: true }],
            empName: [{ value: '', disabled: true }],
            leaveType: [{ value: '', disabled: true }],
            fromDate: [{ value: '', disabled: true }],
            toDate: [{ value: '', disabled: true }],
            noOfDays: [{ value: '', disabled: true }],
            workType1: [{ value: '', disabled: true }],
            pendingSince: [{ value: '', disabled: true }],
            leaveReason: [{ value: '', disabled: true }],
          });
    /**
     * extracted data from route and assign to corresponding fields
     * **/
    if(this.leaveInfo.leaveData !=undefined){
      if(this.leaveInfo.isleave){
        this.requestform = this.formBuilder.group(
          {
            appliedOn: [{ value:this.pipe.transform(new Date(this.leaveInfo.leaveData.appliedon), 'mediumDate') , disabled: true }],
            empId: [{ value: this.leaveInfo.leaveData.empid, disabled: true }],
            empName: [{ value: this.leaveInfo.leaveData.emp_name, disabled: true }],
            leaveType: [{ value:this.leaveInfo.leaveData.display_name, disabled: true }],
            fromDate: [{ value:this.pipe.transform(new Date(this.leaveInfo.leaveData.fromdate), 'mediumDate') , disabled: true }],
            toDate: [{ value: this.pipe.transform(new Date(this.leaveInfo.leaveData.todate), 'mediumDate') , disabled: true }],
            noOfDays: [{ value: this.leaveInfo.leaveData.leavecount, disabled: true }],
            // workType1: [{ value: this.leaveInfo.leaveDate.leavecount, disabled: true }],
            pendingSince: [{ value: this.leaveInfo.leaveData.leavecount, disabled: true }],
            leaveReason: [{ value: this.leaveInfo.leaveData.leavereason, disabled: true }],
            relation:[{value:this.leaveInfo.leaveData.bereavement_relation, disabled:true }],
            approvedon: [{ value: this.pipe.transform(new Date(this.leaveInfo.leaveData.approvedon), 'mediumDate'),disabled:true}],
            actionReason:[{value:this.leaveInfo.leaveData.action_reason, disabled:true }],

          });


      }else{
        this.requestform = this.formBuilder.group(
          {
            appliedOn: [{ value:this.pipe.transform(new Date(this.leaveInfo.leaveData.applied_date), 'mediumDate') , disabled: true }],
            empId: [{ value: this.leaveInfo.leaveData.empid, disabled: true }],
            empName: [{ value: this.leaveInfo.leaveData.employeename, disabled: true }],
            // leaveType: [{ value:this.leaveInfo.leaveData.display_name, disabled: true }],
            fromDate: [{ value:this.pipe.transform(new Date(this.leaveInfo.leaveData.comp_off_date), 'mediumDate') , disabled: true }],
            // toDate: [{ value: this.pipe.transform(new Date(this.leaveInfo.leaveData.todate), 'mediumDate') , disabled: true }],
            noOfDays: [{ value: this.leaveInfo.leaveData.worked_hours+':'+this.leaveInfo.leaveData.worked_minutes, disabled: true }],
            // workType1: [{ value: this.leaveInfo.leaveDate.leavecount, disabled: true }],
            pendingSince: [{ value: this.leaveInfo.leaveData.pendingSince, disabled: true }],
            leaveReason: [{ value: this.leaveInfo.leaveData.reason, disabled: true }],
          });

      }

    }

  }
  // saveConsultation(){
  //
  // }
  // resetform(){
  //
  // }
  approval(){
    if(this.leaveInfo.isleave) {

      this.pendingapprove.leaveApprove(this.leaveInfo.leaveData, 'Approved', this.userSession.id)

    }else {
      this.compoffPendingapprove.compoffApprove(this.leaveInfo.leaveData,'Approved',null);

    }
    // this.titleName="Approve"
    //
    // this.openDialog();
  }
  reject(){
    this.titleName="Reject"
    this.openDialog();
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(ReviewAndApprovalsComponent, {
      width: '500px',position:{top:`70px`},
      data: {name: this.titleName, reason: this.reason,}
    });

    dialogRef.afterClosed().subscribe(result => {

      if(result!=undefined ){
        if(result !==true){
          if(this.leaveInfo.isleave){

          this.leaveInfo.leaveData.action_reason = result.reason;
          this.pendingapprove.leaveApprove(this.leaveInfo.leaveData,'Rejected',this.userSession.id)
          // this.saveApproval();
          }else {
            this.leaveInfo.leaveData.remarks=result.reason;
            this.compoffPendingapprove.compoffApprove(this.leaveInfo.leaveData,'Rejected',null)
          }

        }
      }
    });
  }

  setApprovalsReject(){
    let obj = {
      "id":'',
      "leave_id": this.userSession.id ?this.userSession.id:'',
      "emp_id":this.leaveInfo.leaveData.leavetype,
      "approver_id":this.leaveInfo.leaveData.fromdate,
      "leavestatus":this.leaveInfo.leaveData.todate,
      "reason":"jbjhbhj",
    };

    this.LM.setApproveOrReject(obj).subscribe((res: any) => {


    })

  }

  compoffApproval(){


  }
  compoffReject(){

  }

  cancel(){
    if(this.leaveInfo.isleaveHistory == 'leave'){
      this.router.navigate(['/LeaveManagement/LeaveHistory'])

    }
  }


}
