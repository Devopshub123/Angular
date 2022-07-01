import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {AddRoleModalComponent} from '../add-role-modal/add-role-modal.component';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import {RoleMasterService} from 'src/app/services/role-master.service';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
@Component({
  selector: 'app-roles-permissions',
  templateUrl: './roles-permissions.component.html',
  styleUrls: ['./roles-permissions.component.scss']
})
export class RolesPermissionsComponent implements OnInit {

  constructor(private CS:CompanySettingService,private RM:RoleMasterService,public dialog: MatDialog) { }

 roleMasters:any = [];
  roleId:any='';
  screenRoles:any=[];
  roles:any=[];
  rolesLength:any=1;
    functionalityMaster:any = [];
    screensPermission:any = [];
    Departments:any = [];
    Designations:any = [];
    count:any = 0;
    msgLM88:any = '';
    msgLM94:any = '';
    screenMaster:any=[];
    isScreenRolesEmpty:boolean = false;
    screensNames:any=[];
    isdisplay:boolean=false;
    isEditRule:any = '';
    info:any=[]
  ngOnInit() {
    this.getRoleMaster();
    this.getScreenMaster();
    this.getFunctionalitesMaster();
    this.getScreenFunctionalities();
      this.getErrorMessages('LM88');
      this.getErrorMessages('LM94');
    /*this.getRoleScreenFunctionalities();*/
  }
  getRoleMaster() {
    this.RM.getRoleMaster().subscribe((result)=>{
      this.roleMasters = result;
      this.roleMasters = this.roleMasters.data[0];
      console.log("RoleMasters",this.roleMasters);
    })
  }
    async getScreenMaster() {
    this.RM.getScreenMaster().subscribe((result)=>{
        this.screenMaster = result;
        this.screenMaster = this.screenMaster.data[0];
        console.log("ScreenMaster",this.screenMaster);
    })

  }
  getFunctionalitesMaster() {
    this.RM.getFunctionalitesMaster().subscribe((result)=>{
     this.functionalityMaster = result;
     this.functionalityMaster = this.functionalityMaster.data[0];
     console.log("functionalityMaster",this.functionalityMaster);
    })
  }
  getScreenFunctionalities() {
    this.RM.getScreenFunctionalities().subscribe((result)=>{
    })
  }
  getRoleScreenFunctionalities() {

     this.screensNames = [];
     for(var y=0;y<this.roleMasters.length;y++)
     {
     if(this.roleMasters[y].id == this.roleId)
     {
       this.isEditRule = this.roleMasters[y].isEditable;
     }
     }

      this.roles = [];
      this.isdisplay=true;
      var count = 0;
      for(var i=0;i<this.screenMaster.length;i++)
      {

          if(this.screenMaster[i].routename != null) {
              this.roles[count] = {};
              this.roles[count].key = this.screenMaster[i].routename;
              this.roles[count].countIndex = count
              this.roles[count].value = [{permissions: [{label: 'Add'}, {label: 'Edit'}, {label: 'View'}, {label: 'Cancel'}, {label: 'Delete'}, {label: 'Approvals'}]}];
              this.roles[count].value[0].screenname = this.screenMaster[i].name;
              this.roles[count].value[0].screenid = this.screenMaster[i].id;
              count++;
          }
      }

    this.RM.getRoleScreenFunctionalities(this.roleId).subscribe((result)=>{

     this.screenRoles = result;
      this.count = 1;
     console.log("screenRoles",this.screenRoles);
      if(this.screenRoles.data[0].length > 0)
      {
        this.isScreenRolesEmpty = false;
        this.screenRoles = this.screenRoles.data[0]
        console.log("screenRoles",this.screenRoles);
        for(var i=0;i<this.screenRoles.data[0].length;i++)
        {
         if(!this.screensNames.includes(this.screenRoles.data[0][i].name)) {
             this.screensNames.push(this.screenRoles.data[0][i].name);
         }
         if(this.screenRoles.data[0][i].name == 'Departments')
         {
            for(var p=0;p<this.roles[2].value[0].permissions.length;p++)
             {
                 var json = JSON.parse(this.screenRoles.data[0][i].fjson);
                for(var q=0;q<json.length;q++)
                 {
                     if(this.roles[2].value[0].permissions[p].label == json[q].functionalityname)
                     {
                         this.roles[2].value[0].permissions[p].id = json[q].functionalityid;
                         this.roles[2].value[0].permissions[p].name = json[q].functionalityname;
                         this.roles[2].value[0].permissions[p].status = true;
                     }
                     else if(this.roles[2].value[0].permissions[p].label == "Cancel" || this.roles[2].value[0].permissions[p].label == "Delete" || this.roles[2].value[0].permissions[p].label == "Approvals"){
                         this.roles[2].value[0].permissions[p].status = 'NA';
                     }
                 }


             }

         }
         else if(this.screenRoles.data[0][i].name == 'Designations')
         {
             for(var p=0;p<this.roles[2].value[0].permissions.length;p++)
             {
                 var json = JSON.parse(this.screenRoles.data[0][i].fjson);
                 for(var q=0;q<json.length;q++) {
                     if (this.roles[3].value[0].permissions[p].label == json[q].functionalityname) {
                         this.roles[3].value[0].permissions[p].id = json[q].functionalityid;
                         this.roles[3].value[0].permissions[p].name = json[q].functionalityname;
                         this.roles[3].value[0].permissions[p].status = true;
                     }
                     else if (this.roles[3].value[0].permissions[p].label == "Cancel" || this.roles[3].value[0].permissions[p].label == "Delete" || this.roles[3].value[0].permissions[p].label == "Approvals") {
                         this.roles[3].value[0].permissions[p].status = 'NA';
                     }
                 }
             }
         }
         else if(this.screenRoles.data[0][i].name == 'Holidays')
         {
             for(var p=0;p<this.roles[5].value[0].permissions.length;p++)
             {
                 var json = JSON.parse(this.screenRoles.data[0][i].fjson);
                 for(var q=0;q<json.length;q++) {
                     if (this.roles[5].value[0].permissions[p].label == json[q].functionalityname) {
                         this.roles[5].value[0].permissions[p].id = json[q].functionalityid;
                         this.roles[5].value[0].permissions[p].name = json[q].functionalityname;
                         this.roles[5].value[0].permissions[p].status = true;
                     }
                     else if (this.roles[5].value[0].permissions[p].label == "Cancel" || this.roles[5].value[0].permissions[p].label == "Approvals") {
                         this.roles[5].value[0].permissions[p].status = 'NA';
                     }
                 }
             }
         }
         else if(this.screenRoles.data[0][i].name == 'CompanyLogo')
         {
             for(var p=0;p<this.roles[1].value[0].permissions.length;p++)
             {
                 var json = JSON.parse(this.screenRoles.data[0][i].fjson);
                 for(var q=0;q<json.length;q++) {
                     if (this.roles[1].value[0].permissions[p].label == json[q].functionalityname) {
                         this.roles[1].value[0].permissions[p].id = json[q].functionalityid;
                         this.roles[1].value[0].permissions[p].name = json[q].functionalityname;
                         this.roles[1].value[0].permissions[p].status = true;
                     }
                     else if (this.roles[1].value[0].permissions[p].label == "Add" || this.roles[1].value[0].permissions[p].label == "View" || this.roles[1].value[0].permissions[p].label == "Cancel" || this.roles[1].value[0].permissions[p].label == "Approvals") {
                         this.roles[1].value[0].permissions[p].status = 'NA';
                     }
                 }
             }
         }
         else if(this.screenRoles.data[0][i].name == 'WorkLocation')
         {
             for(var p=0;p<this.roles[9].value[0].permissions.length;p++)
             {
                 var json = JSON.parse(this.screenRoles.data[0][i].fjson);
                 for(var q=0;q<json.length;q++) {
                     if (this.roles[9].value[0].permissions[p].label == json[q].functionalityname) {
                         this.roles[9].value[0].permissions[p].id = json[q].functionalityid;
                         this.roles[9].value[0].permissions[p].name = json[q].functionalityname;
                         this.roles[9].value[0].permissions[p].status = true;
                     }
                     else if (this.roles[9].value[0].permissions[p].label == "View" || this.roles[9].value[0].permissions[p].label == "Cancel" || this.roles[9].value[0].permissions[p].label == "Approvals") {
                          this.roles[9].value[0].permissions[p].status = 'NA';
                     }
                 }
             }
         }
         else if(this.screenRoles.data[0][i].name == 'CompanyInformation')
         {
             for(var p=0;p<this.roles[0].value[0].permissions.length;p++)
                {
                    var json = JSON.parse(this.screenRoles.data[0][i].fjson);
                    for(var q=0;q<json.length;q++) {
                     if (this.roles[0].value[0].permissions[p].label == json[q].functionalityname) {
                         this.roles[0].value[0].permissions[p].id = json[q].functionalityid;
                         this.roles[0].value[0].permissions[p].name = json[q].functionalityname;
                         this.roles[0].value[0].permissions[p].status = true;
                     }
                     else if (this.roles[0].value[0].permissions[p].label == "Cancel" || this.roles[0].value[0].permissions[p].label == "Delete" || this.roles[0].value[0].permissions[p].label == "Approvals") {
                            this.roles[0].value[0].permissions[p].status = 'NA';
                     }
                    }
                }
            }
         else if(this.screenRoles.data[0][i].name == 'EmployeeMasterToAdd')
         {
             for(var p=0;p<this.roles[4].value[0].permissions.length;p++)
             {
                 var json = JSON.parse(this.screenRoles.data[0][i].fjson);
                 for(var q=0;q<json.length;q++) {
                     if (this.roles[4].value[0].permissions[p].label == json[q].functionalityname) {
                         this.roles[4].value[0].permissions[p].id = json[q].functionalityid;
                         this.roles[4].value[0].permissions[p].name = json[q].functionalityname;
                         this.roles[4].value[0].permissions[p].status = true;
                     }
                     else if (this.roles[4].value[0].permissions[p].label == "Cancel" || this.roles[4].value[0].permissions[p].label == "Delete" || this.roles[4].value[0].permissions[p].label == "Approvals") {
                         this.roles[4].value[0].permissions[p].status = 'NA';
                     }
                 }
             }
         }
         else if(this.screenRoles.data[0][i].name == 'AddLeaveConfigure')
         {
             for(var p=0;p<this.roles[6].value[0].permissions.length;p++)
             {
                 var json = JSON.parse(this.screenRoles.data[0][i].fjson);
                 for(var q=0;q<json.length;q++) {
                     if (this.roles[6].value[0].permissions[p].label == json[q].functionalityname) {
                         this.roles[6].value[0].permissions[p].id = json[q].functionalityid;
                         this.roles[6].value[0].permissions[p].name = json[q].functionalityname;
                         this.roles[6].value[0].permissions[p].status = true;
                     }
                     else if (this.roles[6].value[0].permissions[p].label == "Cancel" || this.roles[6].value[0].permissions[p].label == "Delete" || this.roles[6].value[0].permissions[p].label == "Approvals") {
                         this.roles[6].value[0].permissions[p].status = 'NA';
                     }
                 }
             }
         }
         else if(this.screenRoles.data[0][i].name == 'errorMessages')
         {
             for(var p=0;p<this.roles[8].value[0].permissions.length;p++)
             {
                 var json = JSON.parse(this.screenRoles.data[0][i].fjson);
                 for(var q=0;q<json.length;q++) {
                     if (this.roles[8].value[0].permissions[p].label == json[q].functionalityname) {
                         this.roles[8].value[0].permissions[p].id = json[q].functionalityid;
                         this.roles[8].value[0].permissions[p].name = json[q].functionalityname;
                         this.roles[8].value[0].permissions[p].status = true;
                     }
                     else if ( this.roles[8].value[0].permissions[p].label == "Add" ||  this.roles[8].value[0].permissions[p].label == "Cancel" ||  this.roles[8].value[0].permissions[p].label == "Delete" ||  this.roles[8].value[0].permissions[p].label == "Approvals") {
                          this.roles[8].value[0].permissions[p].status = 'NA';
                     }
                 }
             }
         }
         else if(this.screenRoles.data[0][i].name == 'roleMaster')
         {
             for(var p=0;p<this.roles[7].value[0].permissions.length;p++)
             {
                 var json = JSON.parse(this.screenRoles.data[0][i].fjson);
                 for(var q=0;q<json.length;q++) {
                     if (this.roles[7].value[0].permissions[p].label == json[q].functionalityname) {
                         this.roles[7].value[0].permissions[p].id = json[q].functionalityid;
                         this.roles[7].value[0].permissions[p].name = json[q].functionalityname;
                         this.roles[7].value[0].permissions[p].status = true;
                     }
                     else if (this.roles[7].value[0].permissions[p].label == "Delete" || this.roles[7].value[0].permissions[p].label == "View" || this.roles[7].value[0].permissions[p].label == "Cancel" || this.roles[7].value[0].permissions[p].label == "Approvals") {
                              this.roles[7].value[0].permissions[p].status = 'NA';
                     }
                 }
             }
         }
        }
      }
      else {
          this.isScreenRolesEmpty = true;
        this.screenRoles = [];
      }
        console.log("Rolesretet",this.roles);

        this.rolesLength = Object.keys(this.roles).length

           Object.entries(this.roles).forEach(([key1, data]) => {

            if(!this.screensNames.includes(this.roles[key1].value[0].screenname))
             {
                 if(this.roles[key1].value[0].screenname == 'Departments')
                 {
                     for(var p=0;p<this.roles[key1].value[0].permissions.length;p++) {
                         if (this.roles[key1].value[0].permissions[p].label == "Cancel" || this.roles[key1].value[0].permissions[p].label == "Delete" || this.roles[key1].value[0].permissions[p].label == "Approvals") {
                             this.roles[key1].value[0].permissions[p].status = 'NA';
                         }
                     }
                 }
                 else if(this.roles[key1].value[0].screenname == 'Designations')
                 {
                     for(var p=0;p<this.roles[key1].value[0].permissions.length;p++)
                     {
                        if(this.roles[key1].value[0].permissions[p].label == "Cancel" || this.roles[key1].value[0].permissions[p].label == "Delete" || this.roles[key1].value[0].permissions[p].label == "Approvals"){
                             this.roles[key1].value[0].permissions[p].status = 'NA';
                         }
                     }
                 }
                 else if(this.roles[key1].value[0].screenname == 'Holidays')
                 {
                     for(var p=0;p<this.roles[key1].value[0].permissions.length;p++)
                     {
                       if(this.roles[key1].value[0].permissions[p].label == "Cancel" || this.roles[key1].value[0].permissions[p].label == "Approvals"){
                             this.roles[key1].value[0].permissions[p].status = 'NA';
                         }
                     }
                 }
                 else if(this.roles[key1].value[0].screenname == 'Company Logo')
                 {
                     for(var p=0;p<this.roles[key1].value[0].permissions.length;p++)
                     {
                        if(this.roles[key1].value[0].permissions[p].label == "Add" || this.roles[key1].value[0].permissions[p].label == "View"  || this.roles[key1].value[0].permissions[p].label == "Cancel" || this.roles[key1].value[0].permissions[p].label == "Approvals"){
                             this.roles[key1].value[0].permissions[p].status = 'NA';
                         }

                     }
                 }
                 else if(this.roles[key1].value[0].screenname == 'Work Location')
                 {
                     for(var p=0;p<this.roles[key1].value[0].permissions.length;p++)
                     {
                         if(this.roles[key1].value[0].permissions[p].label == "View"  || this.roles[key1].value[0].permissions[p].label == "Cancel" || this.roles[key1].value[0].permissions[p].label == "Approvals"){
                             this.roles[key1].value[0].permissions[p].status = 'NA';
                         }

                     }
                 }
                 else if(this.roles[key1].value[0].screenname == 'Company Information')
                 {
                     for(var p=0;p<this.roles[key1].value[0].permissions.length;p++)
                     {
                         if(this.roles[key1].value[0].permissions[p].label == "Cancel" || this.roles[key1].value[0].permissions[p].label == "Delete" || this.roles[key1].value[0].permissions[p].label == "Approvals"){
                             this.roles[key1].value[0].permissions[p].status = 'NA';
                         }

                     }
                 }
                 else if(this.roles[key1].value[0].screenname == 'Employee Master')
                 {
                     for(var p=0;p<this.roles[key1].value[0].permissions.length;p++)
                     {
                         if(this.roles[key1].value[0].permissions[p].label == "Cancel" || this.roles[key1].value[0].permissions[p].label == "Delete" || this.roles[key1].value[0].permissions[p].label == "Approvals"){
                             this.roles[key1].value[0].permissions[p].status = 'NA';
                         }

                     }
                 }
                 else if(this.roles[key1].value[0].screenname == 'LeavePolicies')
                 {
                     for(var p=0;p<this.roles[key1].value[0].permissions.length;p++)
                     {
                         if(this.roles[key1].value[0].permissions[p].label == "Cancel" || this.roles[key1].value[0].permissions[p].label == "Delete" || this.roles[key1].value[0].permissions[p].label == "Approvals"){
                             this.roles[key1].value[0].permissions[p].status = 'NA';
                         }

                     }
                 }
                 else if(this.roles[key1].value[0].screenname == 'Screen Messages')
                 {
                     for(var p=0;p<this.roles[key1].value[0].permissions.length;p++)
                     {
                         if(this.roles[key1].value[0].permissions[p].label == "Add" ||  this.roles[key1].value[0].permissions[p].label == "Cancel" || this.roles[key1].value[0].permissions[p].label == "Delete" || this.roles[key1].value[0].permissions[p].label == "Approvals"){
                             this.roles[key1].value[0].permissions[p].status = 'NA';
                         }

                     }
                 }
                 else if(this.roles[key1].value[0].screenname == 'Roles & Permissions')
                 {
                     for(var p=0;p<this.roles[key1].value[0].permissions.length;p++)
                     {
                         if(this.roles[key1].value[0].permissions[p].label == "Delete"  || this.roles[key1].value[0].permissions[p].label == "View"  || this.roles[key1].value[0].permissions[p].label == "Cancel" || this.roles[key1].value[0].permissions[p].label == "Approvals"){
                             this.roles[key1].value[0].permissions[p].status = 'NA';
                         }

                     }
                 }
                 else if(this.roles[key1].value[0].screenname == 'Leave Balance')
                 {
                     for(var p=0;p<this.roles[key1].value[0].permissions.length;p++)
                     {
                         if(this.roles[key1].value[0].permissions[p].label == "Delete"  || this.roles[key1].value[0].permissions[p].label == "Add"  || this.roles[key1].value[0].permissions[p].label == "Cancel" || this.roles[key1].value[0].permissions[p].label == "Approvals" || this.roles[key1].value[0].permissions[p].label == "Edit"){
                             this.roles[key1].value[0].permissions[p].status = 'NA';
                         }

                     }
                 }
                 else if(this.roles[key1].value[0].screenname == 'LeaveDelete')
                 {
                     for(var p=0;p<this.roles[key1].value[0].permissions.length;p++)
                     {
                         if(this.roles[key1].value[0].permissions[p].label == "View"  || this.roles[key1].value[0].permissions[p].label == "Add"  || this.roles[key1].value[0].permissions[p].label == "Cancel" || this.roles[key1].value[0].permissions[p].label == "Approvals" || this.roles[key1].value[0].permissions[p].label == "Edit"){
                             this.roles[key1].value[0].permissions[p].status = 'NA';
                         }

                     }
                 }
                 else if(this.roles[key1].value[0].screenname == 'LeaveCancellation')
                 {
                     for(var p=0;p<this.roles[key1].value[0].permissions.length;p++)
                     {
                         if(this.roles[key1].value[0].permissions[p].label == "View"  || this.roles[key1].value[0].permissions[p].label == "Add"  || this.roles[key1].value[0].permissions[p].label == "Delete" || this.roles[key1].value[0].permissions[p].label == "Approvals" || this.roles[key1].value[0].permissions[p].label == "Edit"){
                             this.roles[key1].value[0].permissions[p].status = 'NA';
                         }

                     }
                 }
                 else if(this.roles[key1].value[0].screenname == 'Leave History')
                 {
                     for(var p=0;p<this.roles[key1].value[0].permissions.length;p++)
                     {
                         if(this.roles[key1].value[0].permissions[p].label == "Cancel"  || this.roles[key1].value[0].permissions[p].label == "Add"  || this.roles[key1].value[0].permissions[p].label == "Delete" || this.roles[key1].value[0].permissions[p].label == "Approvals" || this.roles[key1].value[0].permissions[p].label == "Edit"){
                             this.roles[key1].value[0].permissions[p].status = 'NA';
                         }
                     }
                 }
             }
           });
    })
  }


  incrementValue() {
    return this.count++;
  }

  cancelRole(){
      this.getRoleScreenFunctionalities();
  }
    openModalForm(){
        const dialogRef = this.dialog.open(AddRoleModalComponent);

        dialogRef.afterClosed().subscribe(result => {
            if(result.status)
            {
               this.getRoleMaster();
            }
        });
    }
    getErrorMessages(errorCode:any) {

        this.CS.getErrorMessages(errorCode, 1, 1).subscribe((result)=> {

            if (result.status && errorCode == 'LM88') {
                this.msgLM88 = result.data[0].errormessage
            }
            else if (result.status && errorCode == 'LM94') {
                this.msgLM94 = result.data[0].errormessage
            }

        });
    }
    submitRole() {
      this.count = 0;

      this.info['roleId'] = this.roleId;
      this.info['screens'] = [];


      Object.entries(this.roles).forEach(([key2, value]) => {
          this.info['screens'][this.count] = {};
          this.info['screens'][this.count]['permissions']=[];
          this.info['screens'][this.count]['screenId'] = this.roles[key2].value[0].screenid
          Object.entries(this.roles[key2].value[0].permissions).forEach(([key1, value1]) => {
            if(this.roles[key2].value[0].permissions[key1].status == true)
            {
                if(this.roles[key2].value[0].permissions[key1].id != undefined) {
                    this.info['screens'][this.count]['permissions'].push(this.roles[key2].value[0].permissions[key1].id);
                }
                else if(this.roles[key2].value[0].permissions[key1].id == undefined && this.roles[key2].value[0].permissions[key1].label == 'Add')
                {
                    this.info['screens'][this.count]['permissions'].push(1);
                }
                else if(this.roles[key2].value[0].permissions[key1].id == undefined && this.roles[key2].value[0].permissions[key1].label == 'Edit')
                {
                    this.info['screens'][this.count]['permissions'].push(2);
                }
                else if(this.roles[key2].value[0].permissions[key1].id == undefined && this.roles[key2].value[0].permissions[key1].label == 'View')
                {
                    this.info['screens'][this.count]['permissions'].push(3);
                }
                else if(this.roles[key2].value[0].permissions[key1].id == undefined && this.roles[key2].value[0].permissions[key1].label == 'Cancel')
                {
                    this.info['screens'][this.count]['permissions'].push(4);
                }
                else if(this.roles[key2].value[0].permissions[key1].id == undefined && this.roles[key2].value[0].permissions[key1].label == 'Delete')
                {
                    this.info['screens'][this.count]['permissions'].push(5);
                }
                else if(this.roles[key2].value[0].permissions[key1].id == undefined && this.roles[key2].value[0].permissions[key1].label == 'Approval')
                {
                    this.info['screens'][this.count]['permissions'].push(6);
                }
            }
          });
         this.count++
      });
      console.log(this.info);
      this.RM.setRoleAccess(this.info).subscribe((data)=>{

          if(data.status){
            let dialogRef1 = this.dialog.open(ReusableDialogComponent, {
              disableClose: true,
              data: this.msgLM88
            });
          }
          else {
            let dialogRef1 = this.dialog.open(ReusableDialogComponent, {
              disableClose: true,
              data: this.msgLM94
            });
         }

      });
    }

}
