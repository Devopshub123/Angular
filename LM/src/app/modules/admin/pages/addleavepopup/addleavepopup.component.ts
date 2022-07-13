import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialog ,MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from 'src/app/modules/attendance/dialog/dialog.component';

import { LeavePoliciesService } from 'src/app/services/leave-policies.service'; 
export interface DialogData {
  leavetypename: string;
  displayname: string;
  color:string;
}
@Component({
  selector: 'app-addleavepopup',
  templateUrl: './addleavepopup.component.html',
  styleUrls: ['./addleavepopup.component.scss']
})
export class AddleavepopupComponent implements OnInit {
  leaveTypeForm:any = FormGroup;
  isCustomLeaveSubmitted:boolean=false;
  existingLeaveTypes:any=[]
  existingColors:any=[]
  existingDisplayNames:any=[]
  // public color: ThemePalette = 'primary';
  // public disabled = false;
  // public touchUi = false;
  // colorCtr: AbstractControl = new FormControl(null);

  // public options = [
  //   { value: true, label: 'True' },
  //   { value: false, label: 'False' }
  // ];

  // public listColors = ['primary', 'accent', 'warn'];

  // public codeColorPicker = `
  // <mat-form-field>
  //   <input matInput [ngxMatColorPicker]="picker" [formControl]="colorCtr">
  //   <ngx-mat-color-toggle matSuffix [for]="picker"></ngx-mat-color-toggle>
  //   <ngx-mat-color-picker #picker></ngx-mat-color-picker>
  // </mat-form-field>`;

  constructor(private LM:LeavePoliciesService,private formBuilder:FormBuilder,public dialogRef: MatDialogRef<AddleavepopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,) { }

  ngOnInit(): void {
    this.leaveTypeForm = this.formBuilder.group({
      leavetypename :[""],
      displayname:["",],
      colors:[""]

    })
  }
  submit(){}
  cancel(){}

  /**get all leavetype details */
  getLeavesDetails() {
    this.LM.getLeaveDetails('lm_leavesmaster',null,1,100).subscribe((result) =>{
      for(let i=0; i<result.data.length;i++) {
        this.existingLeaveTypes.push(result.data[i].leavename);
        this.existingColors.push(result.data[i].leavecolor);
        this.existingDisplayNames.push(result.data[i].display_name);
      }

    });
  }

}
