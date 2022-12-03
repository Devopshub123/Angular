import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {CompanySettingService } from 'src/app/services/companysetting.service';
import {RoleMasterService} from 'src/app/services/role-master.service';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { EmsService } from 'src/app/modules/ems/ems.service';
@Component({
  selector: 'app-add-role-modal',
  templateUrl: './add-role-modal.component.html',
  styleUrls: ['./add-role-modal.component.scss']
})
export class AddRoleModalComponent implements OnInit {
 isCustomRoleSubmitted:boolean = false;
  constructor(private RM:RoleMasterService,private CS:CompanySettingService,
    private dialog: MatDialog,private dialogRef: MatDialogRef<AddRoleModalComponent>,
    private emsService:EmsService) { }
  role:any= {};
  msgEM1:any='';
  msgEM107:any='';
  msgEM108:any='';
  msgEM106:any='';
  isRoleAlreadyExists:boolean=false;
  roleMasters:any=[];
  ngOnInit(): void {
    this.getRoleMaster();
    this.getMessages('EM1');
    this.getMessages('EM107');
    this.getMessages('EM108');
    this.getMessages('EM106');
  }
  addRole(roleTypeForm:any) {
    this.isCustomRoleSubmitted = true;
    if (roleTypeForm.valid && !this.isRoleAlreadyExists) {
      this.RM.setRoleMaster(this.role).subscribe((data)=> {
        this.dialogRef.close(data);
        if(data.status){
            let dialogRef1 = this.dialog.open(ReusableDialogComponent, {
              position:{top:`70px`},
              disableClose: true,
              data: this.msgEM108
            });
        }
        else {
            let dialogRef1 = this.dialog.open(ReusableDialogComponent, {
              position:{top:`70px`},
              disableClose: true,
              data: this.msgEM106
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
  getMessages(messageCode:any) {
    let data =
    {
      "code": messageCode,
      "pagenumber": 1,
      "pagesize": 1
    }
    this.emsService.getMessagesListApi(data).subscribe((result: any) => {
      if(result.status && messageCode == 'EM1')
      {
        this.msgEM1 = result.data[0].message
      }
      else if(result.status && messageCode == 'EM107')
      {
        this.msgEM107 = result.data[0].message
      }
      else if(result.status && messageCode == 'EM108')
      {
        this.msgEM108 = result.data[0].message
      }
      else if(result.status && messageCode == 'EM106')
      {
        this.msgEM106 = result.data[0].message
      }

    })
  }
}
