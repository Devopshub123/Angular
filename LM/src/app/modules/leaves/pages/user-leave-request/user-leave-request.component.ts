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

  constructor(private router: Router,private LM:LeavesService,private formBuilder: FormBuilder,private dialog: MatDialog) { }

  ngOnInit(): void {
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

  }

}
