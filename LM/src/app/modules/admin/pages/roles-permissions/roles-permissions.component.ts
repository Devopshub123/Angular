import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AddRoleModalComponent} from '../add-role-modal/add-role-modal.component';
import {CompanySettingService} from 'src/app/services/companysetting.service';
import {RoleMasterService} from 'src/app/services/role-master.service';
import {ReusableDialogComponent} from 'src/app/pages/reusable-dialog/reusable-dialog.component';

import {MainService} from 'src/app/services/main.service';
import {AdminService} from '../../admin.service';
import {Observable} from "rxjs";
import { Router } from '@angular/router';

@Component({
  selector: 'app-roles-permissions',
  templateUrl: './roles-permissions.component.html',
  styleUrls: ['./roles-permissions.component.scss']
})
export class RolesPermissionsComponent implements OnInit {
  usersession: any;
  data: any;
  module: any;

  constructor(private mainService: MainService,private router:Router,
              private adminService: AdminService, private CS: CompanySettingService,
              private RM: RoleMasterService, public dialog: MatDialog) {
    this.data = sessionStorage.getItem('user')
    this.usersession = JSON.parse(this.data)
    this.module = sessionStorage.getItem('activeModule');
    this.module = JSON.parse(this.module);
  }

  roleMasters: any = [];
  roleId: any = '';
  screenRoles: any = [];
  roles: any = [];
  rolesLength: any = [];
  functionalityMaster: any = [];
  screensPermission: any = [];
  Departments: any = [];
  Designations: any = [];
  count: any = 0;
  msgLM88: any = '';
  msgLM94: any = '';
  screenMaster: any = [];
  isScreenRolesEmpty: boolean = false;
  screensNames: any = [];
  isdisplay: boolean = false;
  isEditRule: any = '';
  info: any = {};
  screensIndex: any = [];
  modulesScreens: any = [];
  screenWithFunctionalities: any = [];
  moduleRoleScreens: any = []
  add: any = [];
  isDisabledCheckBox: boolean = false;
  istrue: boolean = true;

  ngOnInit() {
    this.getRoleMaster();
    this.getScreenMaster();
    this.getFunctionalitesMaster();
    this.getErrorMessages('LM88');
    this.getErrorMessages('LM94');
    this.getModulesWithScreens();
  }

  getRoleMaster() {
    this.RM.getRoleMaster().subscribe((result) => {
      this.roleMasters = result;
      this.roleMasters = this.roleMasters.data[0];
    })
  }

  getModulesWithScreens() {
    this.adminService.getModulesWithScreens().subscribe((res: any) => {
      if (res.status) {
        this.modulesScreens = JSON.parse(res.data.json_value);
        for (var j = 0; j < this.modulesScreens.length; j++) {
          this.moduleRoleScreens[this.modulesScreens[j].modulename] = [];
          this.roles[this.modulesScreens[j].modulename] = [];
          this.screensIndex[this.modulesScreens[j].modulename] = [];
          this.rolesLength[this.modulesScreens[j].modulename] = 0;
          this.modulesScreens[j].isDisabledCheckBox = false;
          this.modulesScreens[j].roleClassName = this.modulesScreens[j].modulename.replace(/ /g, '_')
        }
      }
    })
  }

  getScreenWithFunctionalities(id: any, name: any, index: any, moduleStatus: any) {
    if (moduleStatus) {
      this.adminService.getScreenWithFunctionalities(id).subscribe((res: any) => {
        if (res.status) {
          this.screenWithFunctionalities[name] = JSON.parse(res.data.json_value);
          this.getRoleScreenFunctionalitiesV2(name)
        }
      })
    }
  }

  async getScreenMaster() {
    this.RM.getScreenMaster().subscribe((result) => {
      this.screenMaster = result;
      this.screenMaster = this.screenMaster.data[0];
    })

  }

  getFunctionalitesMaster() {
    this.RM.getFunctionalitesMaster().subscribe((result) => {
      this.functionalityMaster = result;
      this.functionalityMaster = this.functionalityMaster.data[0];
    })
  }

  getScreenFunctionalities() {
    this.RM.getScreenFunctionalities().subscribe((result) => {
    })
  }

  getRoleScreenFunctionalities(id: any) {

    this.screensNames = [];
    for (var y = 0; y < this.roleMasters.length; y++) {
      if (this.roleMasters[y].id == this.roleId) {
        this.isEditRule = this.roleMasters[y].isEditable;
      }
    }

    this.roles = [];
    this.isdisplay = true;
    var count = 0;
    for (var i = 0; i < this.screenMaster.length; i++) {

      if (this.screenMaster[i].routename != null) {
        this.roles[count] = {};
        if (this.screenMaster[i].name != 'DashBoard' && this.screenMaster[i].name != 'Dashboard') {
          this.roles[count].key = this.screenMaster[i].name;
          this.screensIndex[this.screenMaster[i].name] = count;
          this.roles[count].countIndex = count
          this.roles[count].value = [{permissions: [{label: 'Add'}, {label: 'Edit'}, {label: 'View'}, {label: 'Cancel'}, {label: 'Delete'}, {label: 'Approval'}]}];
          this.roles[count].value[0].screenname = this.screenMaster[i].name;
          this.roles[count].value[0].screenid = this.screenMaster[i].id;
          count++;
        }
      }
    }
    let data = {
      'roleid': this.roleId,
      'moduleid': id
    };
    this.mainService.getrolescreenfunctionalitiesforrole(data).subscribe((result: any) => {

      this.screenRoles = result;
      this.count = 1;
      if (this.screenRoles.data.length > 0) {
        this.isScreenRolesEmpty = false;
        for (var i = 0; i < this.screenRoles.data.length; i++) {
          if (!this.screensNames.includes(this.screenRoles.data[i].screen_name)) {
            this.screensNames.push(this.screenRoles.data[i].screen_name);
          }
          if (this.screenRoles.data[i].screen_name == 'Attendance Request') {
            for (var p = 0; p < this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions.length; p++) {
              var json = JSON.parse(this.screenRoles.data[i].fjson);
              for (var q = 0; q < json.length; q++) {
                if (this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == json[q].functionalityname) {
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].id = json[q].functionalityid;
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].name = json[q].functionalityname;
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = true;
                } else if (this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "View" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Edit" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Cancel" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Delete" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Approval") {
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = 'NA';
                }
              }


            }

          } else if (this.screenRoles.data[i].screen_name == 'Summary Report') {
            for (var p = 0; p < this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions.length; p++) {
              var json = JSON.parse(this.screenRoles.data[i].fjson);
              for (var q = 0; q < json.length; q++) {
                if (this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == json[q].functionalityname) {
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].id = json[q].functionalityid;
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].name = json[q].functionalityname;
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = true;
                } else if (this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Add" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Edit" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Cancel" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Delete" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Approval") {
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = 'NA';
                }
              }


            }

          } else if (this.screenRoles.data[i].screen_name == 'Detailed Report') {
            for (var p = 0; p < this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions.length; p++) {
              var json = JSON.parse(this.screenRoles.data[i].fjson);
              for (var q = 0; q < json.length; q++) {
                if (this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == json[q].functionalityname) {
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].id = json[q].functionalityid;
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].name = json[q].functionalityname;
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = true;
                } else if (this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Add" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Edit" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Cancel" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Delete" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Approval") {
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = 'NA';
                }
              }


            }

          } else if (this.screenRoles.data[i].screen_name == 'Department') {
            for (var p = 0; p < this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions.length; p++) {
              var json = JSON.parse(this.screenRoles.data[i].fjson);
              for (var q = 0; q < json.length; q++) {
                if (this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == json[q].functionalityname) {
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].id = json[q].functionalityid;
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].name = json[q].functionalityname;
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = true;
                } else if (this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Cancel" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Delete" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Approval") {
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = 'NA';
                }
              }


            }

          } else if (this.screenRoles.data[i].screen_name == 'Designation') {
            for (var p = 0; p < this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions.length; p++) {
              var json = JSON.parse(this.screenRoles.data[i].fjson);
              for (var q = 0; q < json.length; q++) {
                if (this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == json[q].functionalityname) {
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].id = json[q].functionalityid;
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].name = json[q].functionalityname;
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = true;
                } else if (this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Cancel" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Delete" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Approval") {
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = 'NA';
                }
              }
            }
          } else if (this.screenRoles.data[i].screen_name == 'Company Logo') {
            for (var p = 0; p < this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions.length; p++) {
              var json = JSON.parse(this.screenRoles.data[i].fjson);
              for (var q = 0; q < json.length; q++) {
                if (this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == json[q].functionalityname) {
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].id = json[q].functionalityid;
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].name = json[q].functionalityname;
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = true;
                } else if (this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "View" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Cancel" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Approval") {
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = 'NA';
                }
              }
            }
          }
          if (this.screenRoles.data[i].screen_name == 'Company Information') {
            for (var p = 0; p < this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions.length; p++) {
              var json = JSON.parse(this.screenRoles.data[i].fjson);
              for (var q = 0; q < json.length; q++) {
                if (this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == json[q].functionalityname) {
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].id = json[q].functionalityid;
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].name = json[q].functionalityname;
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = true;
                } else if (this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Cancel" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Delete" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Approval") {
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = 'NA';
                }
              }
            }
          } else if (this.screenRoles.data[i].screen_name == 'Employee Master') {
            for (var p = 0; p < this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions.length; p++) {
              var json = JSON.parse(this.screenRoles.data[i].fjson);
              for (var q = 0; q < json.length; q++) {
                if (this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == json[q].functionalityname) {
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].id = json[q].functionalityid;
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].name = json[q].functionalityname;
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = true;
                } else if (this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Cancel" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Delete" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Approval") {
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = 'NA';
                }
              }
            }
          } else if (this.screenRoles.data[i].screen_name == 'Roles & Permissions') {
            for (var p = 0; p < this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions.length; p++) {
              var json = JSON.parse(this.screenRoles.data[i].fjson);
              for (var q = 0; q < json.length; q++) {
                if (this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == json[q].functionalityname) {
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].id = json[q].functionalityid;
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].name = json[q].functionalityname;
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = true;
                } else if (this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Delete" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "View" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Cancel" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Approval") {
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = 'NA';
                }
              }
            }
          }
          if (this.screenRoles.data[i].screen_name == 'EmployeeDashBoard') {
            for (var p = 0; p < this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions.length; p++) {
              var json = JSON.parse(this.screenRoles.data[i].fjson);
              for (var q = 0; q < json.length; q++) {
                if (this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == json[q].functionalityname) {
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].id = json[q].functionalityid;
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].name = json[q].functionalityname;
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = true;
                } else if (this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Add" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Edit" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Cancel" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Delete" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Approval") {
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = 'NA';
                }
              }


            }

          } else if (this.screenRoles.data[i].screen_name == 'Excel Upload') {
            for (var p = 0; p < this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions.length; p++) {
              var json = JSON.parse(this.screenRoles.data[i].fjson);
              for (var q = 0; q < json.length; q++) {
                if (this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == json[q].functionalityname) {
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].id = json[q].functionalityid;
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].name = json[q].functionalityname;
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = true;
                } else if (this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "View" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Edit" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Cancel" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Delete" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Approval") {
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = 'NA';
                }
              }


            }

          } else if (this.screenRoles.data[i].screen_name == 'Pending Approvals') {
            for (var p = 0; p < this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions.length; p++) {
              var json = JSON.parse(this.screenRoles.data[i].fjson);
              for (var q = 0; q < json.length; q++) {
                if (this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == json[q].functionalityname) {
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].id = json[q].functionalityid;
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].name = json[q].functionalityname;
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = true;
                } else if (this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "View" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Edit" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Cancel" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Delete" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Add") {
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = 'NA';
                }
              }


            }

          } else if (this.screenRoles.data[i].screen_name == 'Request on Behalf of Employee') {
            for (var p = 0; p < this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions.length; p++) {
              var json = JSON.parse(this.screenRoles.data[i].fjson);
              for (var q = 0; q < json.length; q++) {
                if (this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == json[q].functionalityname) {
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].id = json[q].functionalityid;
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].name = json[q].functionalityname;
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = true;
                } else if (this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Cancel" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Delete" || this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].label == "Approval") {
                  this.roles[this.screensIndex[this.screenRoles.data[i].screen_name]].value[0].permissions[p].status = 'NA';
                }
              }


            }

          }

        }
      } else {
        this.isScreenRolesEmpty = true;
        this.screenRoles = [];
      }
      this.rolesLength = Object.keys(this.roles).length

      Object.entries(this.roles).forEach(([key1, data]) => {

        if (!this.screensNames.includes(this.roles[key1].value[0].screenname)) {
          if (this.roles[key1].value[0].screenname == 'Department') {
            for (var p = 0; p < this.roles[key1].value[0].permissions.length; p++) {
              if (this.roles[key1].value[0].permissions[p].label == "Cancel" || this.roles[key1].value[0].permissions[p].label == "Delete" || this.roles[key1].value[0].permissions[p].label == "Approval") {
                this.roles[key1].value[0].permissions[p].status = 'NA';
              }
            }
          } else if (this.roles[key1].value[0].screenname == 'Attendance Request') {
            for (var p = 0; p < this.roles[key1].value[0].permissions.length; p++) {
              if (this.roles[key1].value[0].permissions[p].label == "Edit" || this.roles[key1].value[0].permissions[p].label == "View" || this.roles[key1].value[0].permissions[p].label == "Cancel" || this.roles[key1].value[0].permissions[p].label == "Delete" || this.roles[key1].value[0].permissions[p].label == "Approval") {
                this.roles[key1].value[0].permissions[p].status = 'NA';
              }
            }
          } else if (this.roles[key1].value[0].screenname == 'Designation') {
            for (var p = 0; p < this.roles[key1].value[0].permissions.length; p++) {
              if (this.roles[key1].value[0].permissions[p].label == "Cancel" || this.roles[key1].value[0].permissions[p].label == "Delete" || this.roles[key1].value[0].permissions[p].label == "Approval") {
                this.roles[key1].value[0].permissions[p].status = 'NA';
              }
            }
          } else if (this.roles[key1].value[0].screenname == 'Company Logo') {
            for (var p = 0; p < this.roles[key1].value[0].permissions.length; p++) {
              if (this.roles[key1].value[0].permissions[p].label == "Delete" || this.roles[key1].value[0].permissions[p].label == "Cancel" || this.roles[key1].value[0].permissions[p].label == "Approval") {
                this.roles[key1].value[0].permissions[p].status = 'NA';
              }

            }
          } else if (this.roles[key1].value[0].screenname == 'Company Information') {
            for (var p = 0; p < this.roles[key1].value[0].permissions.length; p++) {
              if (this.roles[key1].value[0].permissions[p].label == "Cancel" || this.roles[key1].value[0].permissions[p].label == "Delete" || this.roles[key1].value[0].permissions[p].label == "Approval") {
                this.roles[key1].value[0].permissions[p].status = 'NA';
              }

            }
          } else if (this.roles[key1].value[0].screenname == 'Employee Master') {
            for (var p = 0; p < this.roles[key1].value[0].permissions.length; p++) {
              if (this.roles[key1].value[0].permissions[p].label == "Cancel" || this.roles[key1].value[0].permissions[p].label == "Delete" || this.roles[key1].value[0].permissions[p].label == "Approval") {
                this.roles[key1].value[0].permissions[p].status = 'NA';
              }

            }
          } else if (this.roles[key1].value[0].screenname == 'Roles & Permissions') {
            for (var p = 0; p < this.roles[key1].value[0].permissions.length; p++) {
              if (this.roles[key1].value[0].permissions[p].label == "Delete" || this.roles[key1].value[0].permissions[p].label == "View" || this.roles[key1].value[0].permissions[p].label == "Cancel" || this.roles[key1].value[0].permissions[p].label == "Approval") {
                this.roles[key1].value[0].permissions[p].status = 'NA';
              }

            }
          } else if (this.roles[key1].value[0].screenname == 'EmployeeDashBoard') {
            for (var p = 0; p < this.roles[key1].value[0].permissions.length; p++) {
              if (this.roles[key1].value[0].permissions[p].label == "Edit" || this.roles[key1].value[0].permissions[p].label == "Delete" || this.roles[key1].value[0].permissions[p].label == "Add" || this.roles[key1].value[0].permissions[p].label == "Cancel" || this.roles[key1].value[0].permissions[p].label == "Approval") {
                this.roles[key1].value[0].permissions[p].status = 'NA';
              }

            }
          } else if (this.roles[key1].value[0].screenname == 'Excel Upload') {
            for (var p = 0; p < this.roles[key1].value[0].permissions.length; p++) {
              if (this.roles[key1].value[0].permissions[p].label == "Edit" || this.roles[key1].value[0].permissions[p].label == "View" || this.roles[key1].value[0].permissions[p].label == "Cancel" || this.roles[key1].value[0].permissions[p].label == "Delete" || this.roles[key1].value[0].permissions[p].label == "Approval") {
                this.roles[key1].value[0].permissions[p].status = 'NA';
              }
            }
          } else if (this.roles[key1].value[0].screenname == 'Pending Approvals') {
            for (var p = 0; p < this.roles[key1].value[0].permissions.length; p++) {
              if (this.roles[key1].value[0].permissions[p].label == "Edit" || this.roles[key1].value[0].permissions[p].label == "View" || this.roles[key1].value[0].permissions[p].label == "Cancel" || this.roles[key1].value[0].permissions[p].label == "Delete" || this.roles[key1].value[0].permissions[p].label == "Add") {
                this.roles[key1].value[0].permissions[p].status = 'NA';
              }
            }
          } else if (this.roles[key1].value[0].screenname == 'Request on Behalf of Employee') {
            for (var p = 0; p < this.roles[key1].value[0].permissions.length; p++) {
              if (this.roles[key1].value[0].permissions[p].label == "Cancel" || this.roles[key1].value[0].permissions[p].label == "Delete" || this.roles[key1].value[0].permissions[p].label == "Approval") {
                this.roles[key1].value[0].permissions[p].status = 'NA';
              }
            }
          } else if (this.roles[key1].value[0].screenname == 'Summary Report') {
            for (var p = 0; p < this.roles[key1].value[0].permissions.length; p++) {
              if (this.roles[key1].value[0].permissions[p].label == "Edit" || this.roles[key1].value[0].permissions[p].label == "Add" || this.roles[key1].value[0].permissions[p].label == "Cancel" || this.roles[key1].value[0].permissions[p].label == "Delete" || this.roles[key1].value[0].permissions[p].label == "Approval") {
                this.roles[key1].value[0].permissions[p].status = 'NA';
              }
            }
          } else if (this.roles[key1].value[0].screenname == 'Detailed Report') {
            for (var p = 0; p < this.roles[key1].value[0].permissions.length; p++) {
              if (this.roles[key1].value[0].permissions[p].label == "Edit" || this.roles[key1].value[0].permissions[p].label == "Add" || this.roles[key1].value[0].permissions[p].label == "Cancel" || this.roles[key1].value[0].permissions[p].label == "Delete" || this.roles[key1].value[0].permissions[p].label == "Approval") {
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

  cancelRole() {
    this.getRoleScreenFunctionalities('4');
  }

  openModalForm() {
    const dialogRef = this.dialog.open(AddRoleModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result.status) {
        this.getRoleMaster();
      }
    });
  }

  getErrorMessages(errorCode: any) {

    this.CS.getErrorMessages(errorCode, 1, 1).subscribe((result) => {

      if (result.status && errorCode == 'LM88') {
        this.msgLM88 = result.data[0].errormessage
      } else if (result.status && errorCode == 'LM94') {
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
      this.info['screens'][this.count]['permissions'] = [];
      this.info['screens'][this.count]['screenId'] = this.roles[key2].value[0].screenid
      Object.entries(this.roles[key2].value[0].permissions).forEach(([key1, value1]) => {
        if (this.roles[key2].value[0].permissions[key1].status == true) {
          if (this.roles[key2].value[0].permissions[key1].id != undefined) {
            this.info['screens'][this.count]['permissions'].push(this.roles[key2].value[0].permissions[key1].id);
          } else if (this.roles[key2].value[0].permissions[key1].id == undefined && this.roles[key2].value[0].permissions[key1].label == 'Add') {
            this.info['screens'][this.count]['permissions'].push(1);
          } else if (this.roles[key2].value[0].permissions[key1].id == undefined && this.roles[key2].value[0].permissions[key1].label == 'Edit') {
            this.info['screens'][this.count]['permissions'].push(2);
          } else if (this.roles[key2].value[0].permissions[key1].id == undefined && this.roles[key2].value[0].permissions[key1].label == 'View') {
            this.info['screens'][this.count]['permissions'].push(3);
          } else if (this.roles[key2].value[0].permissions[key1].id == undefined && this.roles[key2].value[0].permissions[key1].label == 'Cancel') {
            this.info['screens'][this.count]['permissions'].push(4);
          } else if (this.roles[key2].value[0].permissions[key1].id == undefined && this.roles[key2].value[0].permissions[key1].label == 'Delete') {
            this.info['screens'][this.count]['permissions'].push(5);
          } else if (this.roles[key2].value[0].permissions[key1].id == undefined && this.roles[key2].value[0].permissions[key1].label == 'Approval') {
            this.info['screens'][this.count]['permissions'].push(6);
          }
        }
      });
      this.count++
    });
    this.RM.setRoleAccess(this.info).subscribe((data) => {

      if (data.status) {
        let dialogRef1 = this.dialog.open(ReusableDialogComponent, {
          position: {top: `70px`},
          disableClose: true,
          data: this.msgLM88
        });
      } else {
        let dialogRef1 = this.dialog.open(ReusableDialogComponent, {
          position: {top: `70px`},
          disableClose: true,
          data: this.msgLM94
        });
      }
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/Admin/RolesPermissions"]));
    });
  }

  checkBoxStatus(event: any, index: any) {
    this.modulesScreens[index].isChecked = event.checked;
    this.getScreenWithFunctionalities(this.modulesScreens[index].moduleid, this.modulesScreens[index].modulename, index, this.modulesScreens[index].isChecked);

  }

  getRoleScreenfunctionalitiesByRoleId() {
    this.getModulesWithScreens();
    this.screensNames = [];
    for (var y = 0; y < this.roleMasters.length; y++) {
      if (this.roleMasters[y].id == this.roleId) {
        this.isEditRule = this.roleMasters[y].isEditable;
      }
    }
    /* this.isDisabledCheckBox =true;*/
    this.adminService.getRoleScreenfunctionalitiesByRoleId(this.roleId).subscribe((res: any) => {
      if (res.status && res.data[0].length != 0) {
        for (var i = 0; i < res.data[0].length; i++) {

          if (!this.screensNames.includes(res.data[0][i].screen_name)) {
            this.screensNames.push(res.data[0][i].screen_name);
            this.enableCheckBox(res.data[0][i].modulename);
          }
          this.moduleRoleScreens[res.data[0][i].modulename][res.data[0][i].screen_name] = res.data[0][i];
          if(i === res.data[0].length-1 ){
            this.autoRolesCheckBoxesChecked();
          }
        }
      }
      else if(res.status && res.data[0].length === 0){
        this.autoRolesCheckBoxesChecked();
      }
    })
  }

  getRoleScreenFunctionalitiesV2(name: any) {
    this.screensNames = [];
    for (var y = 0; y < this.roleMasters.length; y++) {
      if (this.roleMasters[y].id == this.roleId) {
        this.isEditRule = this.roleMasters[y].isEditable;
      }
    }

    this.isdisplay = true;
    var count = 0;

    for (var i = 0; i < this.screenWithFunctionalities[name].length; i++) {

      this.roles[name][count] = {};
      this.roles[name][count].defaultPermissions = [];
      this.roles[name][count].key = this.screenWithFunctionalities[name][i].screenname;
      this.screensIndex[name][this.screenWithFunctionalities[name][i].screenname] = count;
      this.roles[name][count].countIndex = count
      this.roles[name][count].value = [{permissions: [{label: 'Add'}, {label: 'Edit'}, {label: 'View'}, {label: 'Cancel'}, {label: 'Delete'}, {label: 'Approval'}]}];
      this.roles[name][count].value[0].screenname = this.screenWithFunctionalities[name][i].screenname;
      this.roles[name][count].value[0].screenid = this.screenWithFunctionalities[name][i].screenid;
      /* this.roles[name][count].defaultPermissions = this.getDefaultPermissions(this.screenWithFunctionalities[name][i].screenname)*/
      for (var l = 0; l < this.screenWithFunctionalities[name][i].functionalities.length; l++) {
        this.roles[name][count].defaultPermissions.push(this.screenWithFunctionalities[name][i].functionalities[l].functname);
      }
      count++;
    }
    for (var j = 0; j < this.roles[name].length; j++) {
      for (var p = 0; p < this.roles[name][j].value[0].permissions.length; p++) {
        var json;
        if (this.moduleRoleScreens[name][this.roles[name][j].key] != undefined) {
          json = JSON.parse(this.moduleRoleScreens[name][this.roles[name][j].key].fjson);
          for (var q = 0; q < json.length; q++) {
            if (this.roles[name][j].value[0].permissions[p].label == json[q].functionalityname) {
              this.roles[name][j].value[0].permissions[p].id = json[q].functionalityid;
              this.roles[name][j].value[0].permissions[p].name = json[q].functionalityname;
              this.roles[name][j].value[0].permissions[p].status = true;
            }
          }
        }

        /*var json = JSON.parse(this.screenRoles.data[i].fjson);*/
      }
    }
    this.rolesLength[name] = Object.keys(this.roles[name]).length

    Object.entries(this.roles[name]).forEach(([key1, data]) => {
      for (var p = 0; p < this.roles[name][key1].value[0].permissions.length; p++) {
        if (this.isEditRule == 0 && this.roles[name][key1].value[0].permissions[p].status === undefined) {
          this.roles[name][key1].value[0].permissions[p].status = 'NA';
        } else if (this.isEditRule == 1 && this.roles[name][key1].value[0].permissions[p].status === undefined && this.roles[name][key1].defaultPermissions.includes(this.roles[name][key1].value[0].permissions[p].label)) {
          this.roles[name][key1].value[0].permissions[p].status = false;
        } else if (this.isEditRule == 1 && this.roles[name][key1].value[0].permissions[p].status === true && this.roles[name][key1].defaultPermissions.includes(this.roles[name][key1].value[0].permissions[p].label)) {
          this.roles[name][key1].value[0].permissions[p].status = true;
        } else if (this.isEditRule == 1 && this.roles[name][key1].value[0].permissions[p].status === undefined && !this.roles[name][key1].defaultPermissions.includes(this.roles[name][key1].value[0].permissions[p].label)) {
          this.roles[name][key1].value[0].permissions[p].status = 'NA';
        }
      }
    });
    if (this.isEditRule == 1) {
      setTimeout(function customEnableCheckBox() {
        var element: any = document.querySelectorAll('.' + name.replace(/ /g, "_"));
        for (var i = 0; i < element.length; i++) {
          element[i].checked = true;
        }
      }, 1000);

    }
  }

  getDefaultPermissions(screenName: any) {
    var defaultPermissions = [];
    switch (screenName) {
      case "Company Logo":
        defaultPermissions = ['Add', 'Edit', 'Delete'];
        break;

      default:
        defaultPermissions = ['Add', 'Edit', 'View'];
    }
    return defaultPermissions
  }

  submitRoleV2() {
    this.count = 0;

    this.info['roleId'] = this.roleId;
    this.info['screens'] = [];
    for (var k = 0; k < this.modulesScreens.length; k++) {
      if (this.modulesScreens[k].isChecked) {
        this.count = 0;
        this.info['screens'] = [];
        Object.entries(this.roles[this.modulesScreens[k].modulename]).forEach(([key2, value]) => {

          this.info['screens'][this.count] = {};
          this.info['screens'][this.count]['permissions'] = [];
          this.info['screens'][this.count]['screenId'] = this.roles[this.modulesScreens[k].modulename][key2].value[0].screenid
          /*  this.info['screens'][this.count]['moduelid'] = this.modulesScreens[k].moduleid;
            this.info['screens'][this.count]['moduelname'] = this.modulesScreens[k].modulename;
  */
          Object.entries(this.roles[this.modulesScreens[k].modulename][key2].value[0].permissions).forEach(([key1, value1]) => {
            if (this.roles[this.modulesScreens[k].modulename][key2].value[0].permissions[key1].status == true) {
              if (this.roles[this.modulesScreens[k].modulename][key2].value[0].permissions[key1].id != undefined) {
                this.info['screens'][this.count]['permissions'].push(this.roles[this.modulesScreens[k].modulename][key2].value[0].permissions[key1].id);
              } else if (this.roles[this.modulesScreens[k].modulename][key2].value[0].permissions[key1].id == undefined && this.roles[this.modulesScreens[k].modulename][key2].value[0].permissions[key1].label == 'Add') {
                this.info['screens'][this.count]['permissions'].push(1);
              } else if (this.roles[this.modulesScreens[k].modulename][key2].value[0].permissions[key1].id == undefined && this.roles[this.modulesScreens[k].modulename][key2].value[0].permissions[key1].label == 'Edit') {
                this.info['screens'][this.count]['permissions'].push(2);
              } else if (this.roles[this.modulesScreens[k].modulename][key2].value[0].permissions[key1].id == undefined && this.roles[this.modulesScreens[k].modulename][key2].value[0].permissions[key1].label == 'View') {
                this.info['screens'][this.count]['permissions'].push(3);
              } else if (this.roles[this.modulesScreens[k].modulename][key2].value[0].permissions[key1].id == undefined && this.roles[this.modulesScreens[k].modulename][key2].value[0].permissions[key1].label == 'Cancel') {
                this.info['screens'][this.count]['permissions'].push(4);
              } else if (this.roles[this.modulesScreens[k].modulename][key2].value[0].permissions[key1].id == undefined && this.roles[this.modulesScreens[k].modulename][key2].value[0].permissions[key1].label == 'Delete') {
                this.info['screens'][this.count]['permissions'].push(5);
              } else if (this.roles[this.modulesScreens[k].modulename][key2].value[0].permissions[key1].id == undefined && this.roles[this.modulesScreens[k].modulename][key2].value[0].permissions[key1].label == 'Approval') {
                this.info['screens'][this.count]['permissions'].push(6);
              }
            }
          });
          /*if(this.info['screens'][this.modulesScreens[k].modulename][this.count]['permissions'].length === 0){
            delete this.info['screens'][this.modulesScreens[k].modulename][this.count];
          }*/
          this.count++
        });
      }
      if (this.modulesScreens.length - 1 == k) {
        this.RM.setRoleAccess(this.info).subscribe((data) => {

          if (data.status) {
            let dialogRef1 = this.dialog.open(ReusableDialogComponent, {
              position: {top: `70px`},
              disableClose: true,
              data: this.msgLM88
            });
          } else {
            let dialogRef1 = this.dialog.open(ReusableDialogComponent, {
              position: {top: `70px`},
              disableClose: true,
              data: this.msgLM94
            });
          }

        });
      }
    }
  }

  enableCheckBox(moduleName: any) {
    for (var j = 0; j < this.modulesScreens.length; j++) {
      if (this.isEditRule == 1 && this.modulesScreens[j].isDisabledCheckBox === false) {
        this.modulesScreens[j].isDisabledCheckBox = true;
      }
      if (this.modulesScreens[j].modulename === moduleName && this.modulesScreens[j].isDisabledCheckBox === false) {
        this.modulesScreens[j].isDisabledCheckBox = true;
      }

      if(this.roleId < 8){
        this.modulesScreens[j].checked = true;
        this.modulesScreens[j].isChecked = true;
      }
    }
  }
  autoRolesCheckBoxesChecked(){
    for (var j = 0; j < this.modulesScreens.length; j++) {
        if(this.roleId > 7){
          this.modulesScreens[j].isDisabledCheckBox = true;
        }
        this.modulesScreens[j].checked = true;
        this.modulesScreens[j].isChecked = true;
        this.getScreenWithFunctionalities(this.modulesScreens[j].moduleid, this.modulesScreens[j].modulename, j, this.modulesScreens[j].isChecked);
    }
  }
}
