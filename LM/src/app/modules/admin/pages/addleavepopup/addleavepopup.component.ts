import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup ,Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialog ,MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from 'src/app/modules/attendance/dialog/dialog.component';
import { Router, RouterModule } from '@angular/router';

import { LeavePoliciesService } from 'src/app/services/leave-policies.service'; 
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
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
  leavedata:any=[];
  existingLeaveTypes:any=[]
  existingColors:any=[]
  existingDisplayNames:any=[]
  isLeaveAlreadyExists:boolean=false;
  isDisplayAlreadyExists:boolean=false;
  isLeaveColorAlreadyExists:boolean=false;
  isValidLeaveName:boolean=false;
  isValidDisplayname:boolean=false;
  isValidColor:boolean=false;
  iscolor:boolean=false;

  isleavtypename:boolean=false;
  isdisaplayname:boolean=false;
  
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

  constructor(private LM:LeavePoliciesService,private formBuilder:FormBuilder, private dialog: MatDialog,private router: Router,public dialogRef: MatDialogRef<AddleavepopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }
    onNoClick(): void {
      this.dialogRef.close();
    }
  ngOnInit(): void {
    this.getLeavesDetails();
    this.leaveTypeForm = this.formBuilder.group({
      leavetypename :[ "",Validators.required],
      displayname:["",Validators.required],
      colors:["",Validators.required]

    })
    this.leaveTypeForm.get('leavetypename')?.valueChanges.subscribe((selectedValue:any) => {
      this.leaveTypeForm.controls.displayname.setValue(selectedValue)
      this.checkLeaveTypes('leavename',selectedValue)
      
      
    })
    this.leaveTypeForm.get('displayname')?.valueChanges.subscribe((selectedValue:any) => {
      this.checkLeaveTypes('display_name',selectedValue)
    })
    this.leaveTypeForm.get('colors')?.valueChanges.subscribe((selectedValue:any) => {
      this.hexToRgb(selectedValue)
      this.checkLeaveTypes('leavecolor',"rgb("+this.hexToRgb(selectedValue)+")")
      
    })
  }
  /**add new custom leave types */
  submit(){
    this.isCustomLeaveSubmitted = true
    if(this.leaveTypeForm.valid ){
      let info = {
        displayName: this.leaveTypeForm.controls.leavetypename.value,
        leaveColor:"rgb("+this.hexToRgb(this.leaveTypeForm.controls.colors.value)+")",
        leaveTypeName: this.leaveTypeForm.controls.displayname.value
      }
      
      if(!this.isLeaveAlreadyExists && !this.isDisplayAlreadyExists && !this.isLeaveColorAlreadyExists){
        this.dialogRef.close();
        this.LM.setNewLeaveType(info).subscribe((data) => {      
          if (data.status) {  
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
              data: "Leave Type added successfully"
            });
            this.dialogRef.close();
            // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            //   this.router.navigate(["/Admin/Leavepolicies"]));
          }
          else {
           
          }
        });
      }

    }
    else{

    }
    
      
  }
hexToRgb(hex:any) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if(result){
    var r= parseInt(result[1], 16);
    var g= parseInt(result[2], 16);
    var b= parseInt(result[3], 16);
    return r+","+g+","+b;//return 23,14,45 -> reformat if needed 
}   
  return null;
}
  cancel(){
    this.dialogRef.close();
  }
  checkLeaveTypes(key:any,leaveData:any)
  { 
    for(let i =0; i<this.existingLeaveTypes.length;i++){
      if(key === 'display_name' && this.existingLeaveTypes[i].display_name == leaveData){
        this.isDisplayAlreadyExists = true;
        break;
      }
      else if(key === 'display_name'){
        this.isDisplayAlreadyExists = false; 
      }
      if(key === 'leavename' && this.existingLeaveTypes[i].leavename == leaveData){
        this.isLeaveAlreadyExists = true; 
        break;
      }
      else if(key === 'leavename'){
        this.isLeaveAlreadyExists = false; 
      }
      if(key === 'leavecolor' && this.existingLeaveTypes[i].leavecolor === leaveData){
        this.isLeaveColorAlreadyExists = true;
        this.isValidColor = false
        break;
      }
      else if(key === 'leavecolor'){
        this.isLeaveColorAlreadyExists = false;
        this.isValidColor = true;
        if(this.leavedata.leavecolor){
          this.iscolor=false
        }else {
          this.iscolor=true
        }
      }
    }
  }
  /**get all leavetype details */
  getLeavesDetails() {
    this.LM.getLeaveDetails('lm_leavesmaster',null,1,100).subscribe((result) =>{
      this.existingLeaveTypes = result.data;
    });
  }

}
