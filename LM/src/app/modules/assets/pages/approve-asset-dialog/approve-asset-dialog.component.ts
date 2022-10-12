import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-approve-asset-dialog',
  templateUrl: './approve-asset-dialog.component.html',
  styleUrls: ['./approve-asset-dialog.component.scss']
})
export class ApproveAssetDialogComponent implements OnInit {
  approveAssetForm!: FormGroup;
  constructor(private formBuilder: FormBuilder, private router: Router, public dialogRef: MatDialogRef<ApproveAssetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  assetTypeList: any = ['Router', 'Softwares', 'Laptop'];
  assetNameList: any = ['ACT Fiber', 'Office 360', 'Lenovo'];
  isReject: boolean = false;
  rejectReason: FormControl = new FormControl('');
  ngOnInit(): void {
       this.approveAssetForm = this.formBuilder.group(
      {
        assetType: [],
        assetName: [],
        remarks: [],
    });
         this.isReject = this.data;
  }
  close(){
    this.dialogRef.close();
  }
}
