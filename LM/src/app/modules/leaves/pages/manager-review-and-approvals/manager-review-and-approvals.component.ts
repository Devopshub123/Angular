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
import {LeavesForCancellationComponent} from "../leaves-for-cancellation/leaves-for-cancellation.component";
import { NgxSpinnerService } from 'ngx-spinner';
import {ConfirmationComponent} from "../../dialog/confirmation/confirmation.component";
import { EmsService } from 'src/app/modules/ems/ems.service';


@Component({
  selector: 'app-manager-review-and-approvals',
  templateUrl: './manager-review-and-approvals.component.html',
  styleUrls: ['./manager-review-and-approvals.component.scss']
})
export class ManagerReviewAndApprovalsComponent implements OnInit {
  requestform:any= FormGroup;
  leaveInfo:any;
  fileURL:any;
  titleName:any;
  reason:any;
  userSession:any;
  pendingapprove:any;
  compoffPendingapprove:any;
  cancellationapprove:any;
  LM120:any;
  LM121:any;
  LM119:any;
  activeModule:any;
  pdfName:any=null;
  constructor(private formBuilder: FormBuilder,private location: Location,public dialog: MatDialog,private LM:LeavesService,private router: Router,private spinner:NgxSpinnerService,private EMS: EmsService) {
    this.leaveInfo = this.location.getState();
  }
  pipe = new DatePipe('en-US');


  ngOnInit(): void {
    if(!this.leaveInfo.leaveData){
      this.router.navigate(['/LeaveManagement/ManagerDashboard'])
    }
    this.pendingapprove = new PendingApprovalsComponent(this.LM,this.router,this.dialog,this.spinner,this.EMS);
    this.compoffPendingapprove = new PendingCompoffComponent(this.LM,this.dialog,this.router,this.spinner,this.EMS);
    this.cancellationapprove = new LeavesForCancellationComponent(this.LM,this.router,this.dialog,this.spinner,this.EMS);
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.activeModule = JSON.parse(sessionStorage.getItem('activeModule') || '');

    this.pendingapprove.ngOnInit();
    this.compoffPendingapprove.ngOnInit();
    this.cancellationapprove.ngOnInit();

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
            workDate:[{ value: '', disabled: true }],
          });
    /**
     * extracted data from route and assign to corresponding fields
     * **/
    if(this.leaveInfo.leaveData !=undefined){
      if (this.leaveInfo.isleave) {
        console.log("v-0",this.leaveInfo.leaveData);
        console.log("v-1",this.leaveInfo.leaveData.worked_date);
        if(this.leaveInfo.leaveData.leavetype == 3 || this.leaveInfo.leaveData.leavetype == 5 ){
          this.getUploadDocument()
        }
        this.requestform = this.formBuilder.group(
          {
            appliedOn: [{ value:this.pipe.transform(new Date(this.leaveInfo.leaveData.appliedon), 'dd-MM-yyyy') , disabled: true }],
            empId: [{ value: this.leaveInfo.leaveData.employee_id, disabled: true }],
            empName: [{ value: this.leaveInfo.leaveData.emp_name, disabled: true }],
            leaveType: [{ value:this.leaveInfo.leaveData.display_name, disabled: true }],
            fromDate: [{ value:this.pipe.transform(new Date(this.leaveInfo.leaveData.fromdate), 'dd-MM-yyyy') , disabled: true }],
            toDate: [{ value: this.pipe.transform(new Date(this.leaveInfo.leaveData.todate), 'dd-MM-yyyy') , disabled: true }],
            noOfDays: [{ value: this.leaveInfo.leaveData.leavecount, disabled: true }],
            // workType1: [{ value: this.leaveInfo.leaveDate.leavecount, disabled: true }],
            pendingSince: [{ value: this.leaveInfo.leaveData.pendingSince, disabled: true }],
            leaveReason: [{ value: this.leaveInfo.leaveData.leavereason, disabled: true }],
            relation:[{value:this.leaveInfo.leaveData.bereavement_relation, disabled:true }],
            approvedon: [{ value: this.pipe.transform(new Date(this.leaveInfo.leaveData.approvedon), 'dd-MM-yyyy'),disabled:true}],
            actionReason:[{value:this.leaveInfo.leaveData.action_reason, disabled:true }],
            updatedon:[{value: this.pipe.transform(new Date(this.leaveInfo.leaveData.updatedon), 'dd-MM-yyyy'), disabled:true}],
            workDate:[{value: this.pipe.transform(new Date(this.leaveInfo.leaveData.comp_off_worked_date), 'dd-MM-yyyy'), disabled:true}]
          });


      } else {
         this.requestform = this.formBuilder.group(
          {
            appliedOn: [{ value:this.pipe.transform(new Date(this.leaveInfo.leaveData.applied_date), 'dd-MM-yyyy') , disabled: true }],
            empId: [{ value: this.leaveInfo.leaveData.employee_id, disabled: true }],
            empName: [{ value: this.leaveInfo.leaveData.employeename, disabled: true }],
            // leaveType: [{ value:this.leaveInfo.leaveData.display_name, disabled: true }],
            fromDate: [{ value:this.pipe.transform(new Date(this.leaveInfo.leaveData.comp_off_date), 'dd-MM-yyyy') , disabled: true }],
            // toDate: [{ value: this.pipe.transform(new Date(this.leaveInfo.leaveData.todate), 'mediumDate') , disabled: true }],
            noOfDays: [{ value: this.leaveInfo.leaveData.worked_hours+':'+this.leaveInfo.leaveData.worked_minutes, disabled: true }],
            // workType1: [{ value: this.leaveInfo.leaveDate.leavecount, disabled: true }],
            approvedon: [{ value: this.pipe.transform(new Date(this.leaveInfo.leaveData.updateddate), 'dd-MM-yyyy'),disabled:true}],
            pendingSince: [{ value: this.leaveInfo.leaveData.pendingSince, disabled: true }],
            leaveReason: [{ value: this.leaveInfo.leaveData.reason, disabled: true }],
            actionReason:[{value:this.leaveInfo.leaveData.remarks, disabled:true }],
            updatedon:[{value: this.pipe.transform(new Date(this.leaveInfo.leaveData.updateddate), 'dd-MM-yyyy'), disabled:true}],
            workDate:[{value: this.pipe.transform(new Date(this.leaveInfo.leaveData.comp_off_worked_date), 'dd-MM-yyyy'), disabled:true}]
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
    if(this.leaveInfo.isCancellation){
      this.cancellationapprove.leaveCancellationApprove(this.leaveInfo.leaveData,'Cancel Approved',this.userSession.id)
    }
    else if(this.leaveInfo.isleave) {

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
      width: '600px',position:{top:`100px`},
      data: {name: this.titleName, reason: this.reason}
    });

    dialogRef.afterClosed().subscribe(result => {

      if(result!=undefined ){
        if(result !==true){
          if(this.leaveInfo.isCancellation){
            this.leaveInfo.leaveData.action_reason = result.reason;
            this.cancellationapprove.leaveCancellationApprove(this.leaveInfo.leaveData,'Cancel Rejected',this.userSession.id)
          }
          else if(this.leaveInfo.isleave){
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
      if(res && res.status){
        if(res.leaveStatus == 'Cancel Approved'){
          this.dialog.open(ConfirmationComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: {Message:this.LM120,url: '/LeaveManagement/ManagerDashboard'}
          });

        }else {
          this.dialog.open(ConfirmationComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: {Message:this.LM121,url: '/LeaveManagement/ManagerDashboard'}
          });

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

  compoffApproval(){


  }
  compoffReject(){

  }

  cancel(){
    if(this.leaveInfo.isleaveHistory == 'leave'){
      this.router.navigate(['/LeaveManagement/LeaveHistory'])

    }
    this.router.navigate([this.leaveInfo.leaveData.url])

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
  

  fileView(){
  
   window.open(this.fileURL);
  
}
  getUploadDocument() {
    this.spinner.show();
    let info = {
      'employeeId':this.leaveInfo.leaveData.empid,
      'filecategory': this.leaveInfo.leaveData.leavetype==3?'SL':'ML',
      'moduleId':this.activeModule.moduleid,
      'requestId':this.leaveInfo?this.leaveInfo.leaveData.leave_id:null,
    }
    this.LM.getFilesMaster(info).subscribe((result) => {
     if(result && result.status && result.data.length>0){
        let documentName = result.data[0].filename.split('_')
        var docArray=[];
        for(let i=0;i<=documentName.length;i++){
          if(i>2){
            docArray.push(documentName[i])
          }
        }
        this.pdfName = docArray.join('')
       result.data[0].employeeId=this.userSession.id;
        let info = result.data[0]
        this.LM.getProfileImage(info).subscribe((imageData) => {
          if(imageData.success){
          
            let TYPED_ARRAY = new Uint8Array(imageData.image.data);
            const STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
              return data + String.fromCharCode(byte);
            }, '');

            const file = new Blob([TYPED_ARRAY], { type: "application/pdf" });
            this.fileURL = URL.createObjectURL(file);
            
    
    
          }
          else{
           
            this.spinner.hide();

          }
        })
      }})
    }





}
