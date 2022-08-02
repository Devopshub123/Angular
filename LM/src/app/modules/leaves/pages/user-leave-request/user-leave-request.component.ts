import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {LeavesService} from "../../leaves.service";

@Component({
  selector: 'app-user-leave-request',
  templateUrl: './user-leave-request.component.html',
  styleUrls: ['./user-leave-request.component.scss']
})
export class UserLeaveRequestComponent implements OnInit {
  editForm:any= FormGroup;
  leavebalance:any=[];
  userSession:any=[];

  constructor(private router: Router,private LM:LeavesService,private formBuilder: FormBuilder,private dialog: MatDialog) { }

  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.editForm = this.formBuilder.group({
      leaveId: ['',Validators.required],
      fromDate:['',Validators.required],
      toDate:['',Validators.required],
      toDateHalf:['',Validators.required],
      fromDateHalf:['',Validators.required],
      leaveCount:['',Validators.required],
      reason:['',Validators.required],
      contact:['',Validators.required],
      emergencyEmail:['',Validators.required],

    })
    this.getLeaveBalance();

  }

  getLeaveBalance() {
    this.LM.getLeaveBalance(this.userSession.id).subscribe((result) => {
      if(result && result.status){
        this.leavebalance = this.leaveTypes(result.data[0])
      }
    })
  }
  /**
   * leaveTypes
   * few leavetypes will display based on  gender and maritalstatus in leave types dropdown
   **/

  leaveTypes(leaveTypes:any){
    var data = [];
    for (var i = 0; i < leaveTypes.length; i++) {

      if (leaveTypes[i].leavename === "Marriage Leave" && this.userSession.maritalstatus === "Single") {
        data.push(leaveTypes[i])

      } else if (leaveTypes[i].leavename === 'Maternity Leave'&& this.userSession.maritalstatus === "Married") {
        if (this.userSession.gender === 'Female') {
          data.push(leaveTypes[i])
        }
      } else if (leaveTypes[i].leavename === 'Paternity Leave'&& this.userSession.maritalstatus === "Married") {
        if (this.userSession.gender === 'Male') {
          data.push(leaveTypes[i])
        }
      }else if(leaveTypes[i].leavename !== 'Paternity Leave' && leaveTypes[i].leavename !== "Marriage Leave" && leaveTypes[i].leavename !== 'Maternity Leave'){
        data.push(leaveTypes[i])
      }

    }
    return data;
  }
}
