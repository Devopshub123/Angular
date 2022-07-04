import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {CompanySettingService } from 'src/app/services/companysetting.service';
import {RoleMasterService} from 'src/app/services/role-master.service';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
@Component({
  selector: 'app-add-role-modal',
  templateUrl: './add-role-modal.component.html',
  styleUrls: ['./add-role-modal.component.scss']
})
export class AddRoleModalComponent implements OnInit {
 isCustomRoleSubmitted:boolean = false;
  constructor(private RM:RoleMasterService,private CS:CompanySettingService,private dialog: MatDialog,private dialogRef: MatDialogRef<AddRoleModalComponent>) { }
  role:any= {};
  msgLM1:any='';
  msgLM52:any='';
  msgLM87:any='';
  msgLM93:any='';
  isRoleAlreadyExists:boolean=false;
  roleMasters:any=[];
  ngOnInit(): void {
    this.getRoleMaster();
    this.getErrorMessages('LM1');
    this.getErrorMessages('LM52');
    this.getErrorMessages('LM87');
    this.getErrorMessages('LM93');
  }
  addRole(roleTypeForm:any) {
    this.isCustomRoleSubmitted = true;
    if (roleTypeForm.valid && !this.isRoleAlreadyExists) {
      this.RM.setRoleMaster(this.role).subscribe((data)=> {
        this.dialogRef.close(data);
        if(data.status){
            let dialogRef1 = this.dialog.open(ReusableDialogComponent, {
              disableClose: true,
              data: this.msgLM87
            });
        }
        else {
            let dialogRef1 = this.dialog.open(ReusableDialogComponent, {
              disableClose: true,
              data: this.msgLM93
            });
        }
      });
    }
  }
  checkLeaveTypes(){
    this.isRoleAlreadyExists = false;
  this.roleMasters.findIndex((item:any) => {

      if(item.name == this.role.roleName)
      {
        this.isRoleAlreadyExists = true;
      }
    })
  }
  getRoleMaster() {
    this.RM.getRoleMaster().subscribe((result)=>{
      this.roleMasters = result;
      this.roleMasters = this.roleMasters.data[0]
    })
  }
  getErrorMessages(errorCode:any) {

    this.CS.getErrorMessages(errorCode,1,1).subscribe((result)=>{

      if(result.status && errorCode == 'LM1')
      {
        this.msgLM1 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM52')
      {
        this.msgLM52 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM87')
      {
        this.msgLM87 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM93')
      {
        this.msgLM93 = result.data[0].errormessage
      }

    })
  }
}
