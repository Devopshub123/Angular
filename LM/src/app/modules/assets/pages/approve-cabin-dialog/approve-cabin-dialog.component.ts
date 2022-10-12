import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
@Component({
  selector: 'app-approve-cabin-dialog',
  templateUrl: './approve-cabin-dialog.component.html',
  styleUrls: ['./approve-cabin-dialog.component.scss']
})
export class ApproveCabinDialogComponent implements OnInit {
  approveCabinForm!: FormGroup;
  constructor(private formBuilder: FormBuilder, private router: Router,
    public dialogRef: MatDialogRef<ApproveCabinDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  assetTypeList: any = ['Assign New Cabin','Swapping Cabin ID'];
  assetNameList: any = ['ACT Fiber', 'Office 360', 'Lenovo'];
  isAdd:boolean=false;
  cabinAssignType!: boolean;
  rejectReason: FormControl = new FormControl('');
  ngOnInit(): void {
       this.approveCabinForm = this.formBuilder.group(
      {
        requestType: [],
        currentEmpId: [],
        currentEmpName: [],
        currentCabinId: [],
        newEmpId: [],
        newEmpName: [],
        newCabinId: [],
        assignCabinId: [],
        remarks: [],
    });
    this.approveCabinForm.get('requestType')?.valueChanges.subscribe(selectedValue => {
      if (selectedValue == "Assign New Cabin") {
        this.cabinAssignType = true;
        this.isAdd = true;
      } else {
        this.cabinAssignType = false;
        this.isAdd = true;
      }
       
    })
  }
  close(){
    this.dialogRef.close();
  }
}
