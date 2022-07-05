import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {AddRoleModalComponent} from '../add-role-modal/add-role-modal.component';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import {RoleMasterService} from 'src/app/services/role-master.service';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';

import { MainService } from 'src/app/services/main.service';
@Component({
  selector: 'app-roles-permissions',
  templateUrl: './roles-permissions.component.html',
  styleUrls: ['./roles-permissions.component.scss']
})
export class RolesPermissionsComponent implements OnInit {
   usersession:any;
   data:any;
   module:any;
  constructor(private mainService:MainService,private CS:CompanySettingService,private RM:RoleMasterService,public dialog: MatDialog) {
     this.data= sessionStorage.getItem('user')
     this.usersession = JSON.parse(this.data)
     this.module = sessionStorage.getItem('activeModule');
     this.module = JSON.parse(this.module);
  }

 roleMasters:any = [];
  roleId:any='';
  screenRoles:any=[];
  roles:any=[];
  rolesLength:any=0;
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
    info:any={};
    screensIndex:any = [];

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
    })
  }
    async getScreenMaster() {
    this.RM.getScreenMaster().subscribe((result)=>{
        this.screenMaster = result;
        this.screenMaster = this.screenMaster.data[0];
    })

  }
  getFunctionalitesMaster() {
    this.RM.getFunctionalitesMaster().subscribe((result)=>{
     this.functionalityMaster = result;
     this.functionalityMaster = this.functionalityMaster.data[0];
    })
  }
  getScreenFunctionalities() {
    this.RM.getScreenFunctionalities().subscribe((result)=>{
    })
  }
  getRoleScreenFunctionalities(id:any) {

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
              if(this.screenMaster[i].name != 'DashBoard' && this.screenMaster[i].name != 'Dashboard')
              {
              this.roles[count].key = this.screenMaster[i].name;
              this.screensIndex[this.screenMaster[i].name] = count;
              this.roles[count].countIndex = count
              this.roles[count].value = [{permissions: [{label: 'Add'}, {label: 'Edit'}, {label: 'View'}, {label: 'Cancel'}, {label: 'Delete'}, {label: 'Approvals'}]}];
              this.roles[count].value[0].screenname = this.screenMaster[i].name;
              this.roles[count].value[0].screenid = this.screenMaster[i].id;
              count++;
              }
          }
      }
      let data={
          'roleid':this.roleId,
          'moduleid':id
      };
      this.mainService.getrolescreenfunctionalitiesforrole(data).subscribe((result:any)=>{

     this.screenRoles = result;
      this.count = 1;
      if(this.screenRoles.data.length > 0)
      {
        this.isScreenRolesEmpty = false;
        for(var i=0;i<this.screenRoles.data.length;i++)
        {
         if(!this.screensNames.includes(this.screenRoles.data[i].screen_name)) {
             this.screensNames.push(this.screenRoles.data[i].screen_name);
         }
         if(this.screenRoles.data[i].screen_name == 'Attendance Request')
         {
            for(var p=0;p<this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions.length;p++)
             {
                 var json = JSON.parse(this.screenRoles.data[i].fjson);
                for(var q=0;q<json.length;q++)
                 {
                     if(this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == json[q].functionalityname)
                     {
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].id = json[q].functionalityid;
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].name = json[q].functionalityname;
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = true;
                     }
                     else if(this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "View" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Edit" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Cancel" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Delete" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Approvals"){
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = 'NA';
                     }
                 }


             }

         }
         else if(this.screenRoles.data[i].screen_name == 'Summary Report')
         {
            for(var p=0;p<this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions.length;p++)
             {
                 var json = JSON.parse(this.screenRoles.data[i].fjson);
                for(var q=0;q<json.length;q++)
                 {
                     if(this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == json[q].functionalityname)
                     {
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].id = json[q].functionalityid;
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].name = json[q].functionalityname;
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = true;
                     }
                     else if(this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Add" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Edit" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Cancel" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Delete" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Approvals"){
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = 'NA';
                     }
                 }


             }

         }
         else if(this.screenRoles.data[i].screen_name == 'Detailed Report')
         {
            for(var p=0;p<this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions.length;p++)
             {
                 var json = JSON.parse(this.screenRoles.data[i].fjson);
                for(var q=0;q<json.length;q++)
                 {
                     if(this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == json[q].functionalityname)
                     {
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].id = json[q].functionalityid;
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].name = json[q].functionalityname;
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = true;
                     }
                     else if(this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Add" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Edit" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Cancel" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Delete" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Approvals"){
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = 'NA';
                     }
                 }


             }

         }
         else if(this.screenRoles.data[i].screen_name == 'Department')
         {
            for(var p=0;p<this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions.length;p++)
             {
                 var json = JSON.parse(this.screenRoles.data[i].fjson);
                for(var q=0;q<json.length;q++)
                 {
                     if(this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == json[q].functionalityname)
                     {
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].id = json[q].functionalityid;
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].name = json[q].functionalityname;
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = true;
                     }
                     else if(this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Cancel" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Delete" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Approvals"){
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = 'NA';
                     }
                 }


             }

         }
         else if(this.screenRoles.data[i].screen_name == 'Designation')
         {
             for(var p=0;p<this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions.length;p++)
             {
                 var json = JSON.parse(this.screenRoles.data[i].fjson);
                 for(var q=0;q<json.length;q++) {
                     if (this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == json[q].functionalityname) {
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].id = json[q].functionalityid;
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].name = json[q].functionalityname;
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = true;
                     }
                     else if (this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Cancel" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Delete" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Approvals") {
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = 'NA';
                     }
                 }
             }
         }
         else if(this.screenRoles.data[i].screen_name == 'Company Logo')
         {
             for(var p=0;p<this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions.length;p++)
             {
                 var json = JSON.parse(this.screenRoles.data[i].fjson);
                 for(var q=0;q<json.length;q++) {
                     if (this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == json[q].functionalityname) {
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].id = json[q].functionalityid;
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].name = json[q].functionalityname;
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = true;
                     }
                     else if (this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "View" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Cancel" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Approvals") {
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = 'NA';
                     }
                 }
             }
         }
         else if(this.screenRoles.data[i].screen_name == 'Company Information')
         {
             for(var p=0;p<this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions.length;p++)
                {
                    var json = JSON.parse(this.screenRoles.data[i].fjson);
                    for(var q=0;q<json.length;q++) {
                     if (this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == json[q].functionalityname) {
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].id = json[q].functionalityid;
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].name = json[q].functionalityname;
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = true;
                     }
                     else if (this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Cancel" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Delete" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Approvals") {
                            this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = 'NA';
                     }
                    }
                }
            }
         else if(this.screenRoles.data[i].screen_name == 'Employee Master')
         {
             for(var p=0;p<this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions.length;p++)
             {
                 var json = JSON.parse(this.screenRoles.data[i].fjson);
                 for(var q=0;q<json.length;q++) {
                     if (this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == json[q].functionalityname) {
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].id = json[q].functionalityid;
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].name = json[q].functionalityname;
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = true;
                     }
                     else if (this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Cancel" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Delete" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Approvals") {
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = 'NA';
                     }
                 }
             }
         }
         else if(this.screenRoles.data[i].screen_name == 'Roles & Permissions')
         {
             for(var p=0;p<this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions.length;p++)
             {
                 var json = JSON.parse(this.screenRoles.data[i].fjson);
                 for(var q=0;q<json.length;q++) {
                     if (this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == json[q].functionalityname) {
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].id = json[q].functionalityid;
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].name = json[q].functionalityname;
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = true;
                     }
                     else if (this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Delete" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "View" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Cancel" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Approvals") {
                              this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = 'NA';
                     }
                 }
             }
         }
         if(this.screenRoles.data[i].screen_name == 'EmployeeDashBoard')
         {
            for(var p=0;p<this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions.length;p++)
             {
                 var json = JSON.parse(this.screenRoles.data[i].fjson);
                for(var q=0;q<json.length;q++)
                 {
                     if(this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == json[q].functionalityname)
                     {
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].id = json[q].functionalityid;
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].name = json[q].functionalityname;
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = true;
                     }
                     else if(this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Add" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Edit" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Cancel" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Delete" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Approvals"){
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = 'NA';
                     }
                 }


             }

         }
         else if(this.screenRoles.data[i].screen_name == 'Excel Upload')
         {
            for(var p=0;p<this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions.length;p++)
             {
                 var json = JSON.parse(this.screenRoles.data[i].fjson);
                for(var q=0;q<json.length;q++)
                 {
                     if(this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == json[q].functionalityname)
                     {
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].id = json[q].functionalityid;
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].name = json[q].functionalityname;
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = true;
                     }
                     else if(this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "View" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Edit" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Cancel" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Delete" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Approvals"){
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = 'NA';
                     }
                 }


             }

         }
         else if(this.screenRoles.data[i].screen_name == 'Pending Approvals')
         {
            for(var p=0;p<this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions.length;p++)
             {
                 var json = JSON.parse(this.screenRoles.data[i].fjson);
                for(var q=0;q<json.length;q++)
                 {
                     if(this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == json[q].functionalityname)
                     {
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].id = json[q].functionalityid;
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].name = json[q].functionalityname;
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = true;
                     }
                     else if(this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "View" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Edit" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Cancel" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Delete" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Add"){
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = 'NA';
                     }
                 }


             }

         }
         else if(this.screenRoles.data[i].screen_name == 'Request on Behalf of Employee')
         {
            for(var p=0;p<this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions.length;p++)
             {
                 var json = JSON.parse(this.screenRoles.data[i].fjson);
                for(var q=0;q<json.length;q++)
                 {
                     if(this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == json[q].functionalityname)
                     {
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].id = json[q].functionalityid;
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].name = json[q].functionalityname;
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = true;
                     }
                     else if(this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Cancel" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Delete" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Approvals"){
                         this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = 'NA';
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

        this.rolesLength = Object.keys(this.roles).length

           Object.entries(this.roles).forEach(([key1, data]) => {

            if(!this.screensNames.includes(this.roles[key1].value[0].screenname))
             {
                 if(this.roles[key1].value[0].screenname == 'Department')
                 {
                     for(var p=0;p<this.roles[key1].value[0].permissions.length;p++) {
                         if (this.roles[key1].value[0].permissions[p].label == "Cancel" || this.roles[key1].value[0].permissions[p].label == "Delete" || this.roles[key1].value[0].permissions[p].label == "Approvals") {
                             this.roles[key1].value[0].permissions[p].status = 'NA';
                         }
                     }
                 }
                 else if(this.roles[key1].value[0].screenname == 'Attendance Request')
                 {
                     for(var p=0;p<this.roles[key1].value[0].permissions.length;p++)
                     {
                        if(this.roles[key1].value[0].permissions[p].label == "Edit" || this.roles[key1].value[0].permissions[p].label == "View" || this.roles[key1].value[0].permissions[p].label == "Cancel" || this.roles[key1].value[0].permissions[p].label == "Delete" || this.roles[key1].value[0].permissions[p].label == "Approvals"){
                             this.roles[key1].value[0].permissions[p].status = 'NA';
                         }
                     }
                 }
                 else if(this.roles[key1].value[0].screenname == 'Designation')
                 {
                     for(var p=0;p<this.roles[key1].value[0].permissions.length;p++)
                     {
                        if(this.roles[key1].value[0].permissions[p].label == "Cancel" || this.roles[key1].value[0].permissions[p].label == "Delete" || this.roles[key1].value[0].permissions[p].label == "Approvals"){
                             this.roles[key1].value[0].permissions[p].status = 'NA';
                         }
                     }
                 }
                 else if(this.roles[key1].value[0].screenname == 'Company Logo')
                 {
                     for(var p=0;p<this.roles[key1].value[0].permissions.length;p++)
                     {
                        if(this.roles[key1].value[0].permissions[p].label == "Delete"  || this.roles[key1].value[0].permissions[p].label == "Cancel" || this.roles[key1].value[0].permissions[p].label == "Approvals"){
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
                 else if(this.roles[key1].value[0].screenname == 'Roles & Permissions')
                 {
                     for(var p=0;p<this.roles[key1].value[0].permissions.length;p++)
                     {
                         if(this.roles[key1].value[0].permissions[p].label == "Delete"  || this.roles[key1].value[0].permissions[p].label == "View"  || this.roles[key1].value[0].permissions[p].label == "Cancel" || this.roles[key1].value[0].permissions[p].label == "Approvals"){
                             this.roles[key1].value[0].permissions[p].status = 'NA';
                         }

                     }
                 }
                 else if(this.roles[key1].value[0].screenname == 'EmployeeDashBoard')
                 {
                     for(var p=0;p<this.roles[key1].value[0].permissions.length;p++)
                     {
                         if(this.roles[key1].value[0].permissions[p].label == "Edit" || this.roles[key1].value[0].permissions[p].label == "Delete"  || this.roles[key1].value[0].permissions[p].label == "Add"  || this.roles[key1].value[0].permissions[p].label == "Cancel" || this.roles[key1].value[0].permissions[p].label == "Approvals"){
                             this.roles[key1].value[0].permissions[p].status = 'NA';
                         }

                     }
                 }
                 else if(this.roles[key1].value[0].screenname == 'Excel Upload')
                 {
                     for(var p=0;p<this.roles[key1].value[0].permissions.length;p++)
                     {
                        if(this.roles[key1].value[0].permissions[p].label == "Edit" || this.roles[key1].value[0].permissions[p].label == "View" || this.roles[key1].value[0].permissions[p].label == "Cancel" || this.roles[key1].value[0].permissions[p].label == "Delete" || this.roles[key1].value[0].permissions[p].label == "Approvals"){
                             this.roles[key1].value[0].permissions[p].status = 'NA';
                         }
                     }
                 }
                 else if(this.roles[key1].value[0].screenname == 'Pending Approvals')
                 {
                     for(var p=0;p<this.roles[key1].value[0].permissions.length;p++)
                     {
                        if(this.roles[key1].value[0].permissions[p].label == "Edit" || this.roles[key1].value[0].permissions[p].label == "View" || this.roles[key1].value[0].permissions[p].label == "Cancel" || this.roles[key1].value[0].permissions[p].label == "Delete" || this.roles[key1].value[0].permissions[p].label == "Add"){
                             this.roles[key1].value[0].permissions[p].status = 'NA';
                         }
                     }
                 }
                 else if(this.roles[key1].value[0].screenname == 'Request on Behalf of Employee')
                 {
                     for(var p=0;p<this.roles[key1].value[0].permissions.length;p++) {
                         if (this.roles[key1].value[0].permissions[p].label == "Cancel" || this.roles[key1].value[0].permissions[p].label == "Delete" || this.roles[key1].value[0].permissions[p].label == "Approvals") {
                             this.roles[key1].value[0].permissions[p].status = 'NA';
                         }
                     }
                 }
                 else if(this.roles[key1].value[0].screenname == 'Summary Report')
                 {
                     for(var p=0;p<this.roles[key1].value[0].permissions.length;p++) {
                         if (this.roles[key1].value[0].permissions[p].label == "Edit" || this.roles[key1].value[0].permissions[p].label == "Add" || this.roles[key1].value[0].permissions[p].label == "Cancel" || this.roles[key1].value[0].permissions[p].label == "Delete" || this.roles[key1].value[0].permissions[p].label == "Approvals") {
                             this.roles[key1].value[0].permissions[p].status = 'NA';
                         }
                     }
                 }
                 else if(this.roles[key1].value[0].screenname == 'Detailed Report')
                 {
                     for(var p=0;p<this.roles[key1].value[0].permissions.length;p++) {
                         if (this.roles[key1].value[0].permissions[p].label == "Edit" || this.roles[key1].value[0].permissions[p].label == "Add" || this.roles[key1].value[0].permissions[p].label == "Cancel" || this.roles[key1].value[0].permissions[p].label == "Delete" || this.roles[key1].value[0].permissions[p].label == "Approvals") {
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
      this.getRoleScreenFunctionalities('4');
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
      this.RM.setRoleAccess(this.info).subscribe((data)=>{

          if(data.status){
            let dialogRef1 = this.dialog.open(ReusableDialogComponent, {
                position:{top:`70px`},
              disableClose: true,
              data: this.msgLM88
            });
          }
          else {
            let dialogRef1 = this.dialog.open(ReusableDialogComponent, {
                position:{top:`70px`},
              disableClose: true,
              data: this.msgLM94
            });
         }

      });
    }

}
