import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApproveAssetDialogComponent } from '../approve-asset-dialog/approve-asset-dialog.component';

@Component({
  selector: 'app-approve-asset-change-request-level2',
  templateUrl: './approve-asset-change-request-level2.component.html',
  styleUrls: ['./approve-asset-change-request-level2.component.scss']
})
export class ApproveAssetChangeRequestLevel2Component implements OnInit {
  level2ApprovalForm!: FormGroup;
  constructor(private formBuilder: FormBuilder,public dialog: MatDialog,private router: Router) { }
  isReject: boolean = false;
  ngOnInit(): void {
    this.level2ApprovalForm = this.formBuilder.group(
      {
        appliedDate: ["", Validators.required],
        reportManager:  [""],
        employeeName:[""],
        assetName:  [""],
        assetType: [""],
        reason: [""],
        approveReason: [""],
        exisitingId: [""],
      });
  }
  approveRequest() {
    this.isReject = false;
    this.dialog.open(ApproveAssetDialogComponent, {
      disableClose:true,
      data: this.isReject,
    });
  }
  rejectAsset() {
    this.isReject = true;
    this.dialog.open(ApproveAssetDialogComponent, {
      height: '40%',
      width: '30%',
      disableClose:true,
      data: this.isReject
    });
  }
  cancel(){     
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    this.router.navigate(["/Asset/ApproveAssetChangeRequestL1"]));
  }
}