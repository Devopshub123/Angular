import { Component, OnInit } from '@angular/core';
import { BaseService } from '../../services/base.service';
import { Subscribable, Subscription } from 'rxjs';
import {UserDashboardService} from '../../services/user-dashboard.service';
import {RoleMasterService} from '../../services/role-master.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  checkSideNav: any;
  checkHeadNav: any;
  checkSubSideNav: any;
  checkToggleBar: any;
  subscription!: Subscription;
  employeeRoles:any = [];
  rolesScreen:any = [];
  usersession:any;
  constructor(private baseService: BaseService,private UD:UserDashboardService,private RM:RoleMasterService,) {
  }

  ngOnInit(): void {
    this.getHeadNav();
    this.baseService.setSideNav("admin");
    this.usersession = JSON.parse(sessionStorage.getItem('user')??'')
    this.getSideNav();
    this.getToggleSideBar();
    this.getEmployeeRoles();
  }

  setSideNav(data:any): void {
    this.baseService.setSideNav(data);
  }
  clearMessages(): void {
    // clear messages
    this.baseService.clearSideNav();
  }
  ngOnDestroy(): void {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
    this.clearMessages();
    this.clearSubSideNav();
  }
  getSideNav(): void
  {
    this.baseService.getSideNav().subscribe(message => {
      if (message) {
        this.checkSideNav = message;
      } else {
        this.checkSideNav = '';
      }
    });
  }
  getHeadNav(): void
  {
    this.baseService.getHeadNav().subscribe(message => {
      if (message) {
        this.checkHeadNav = message;
      } else {
        this.checkHeadNav = '';
      }
    });
  }
  setSubSideNav(data:any): void {
    this.baseService.setSubSideNav(data);
    this.getSubSideNav();
  }
  clearSubSideNav(): void {
    // clear messages
    this.baseService.clearSubSideNav();
  }
  getSubSideNav(): void
  {
    this.baseService.getSubSideNav().subscribe(message => {
      if (message) {
        this.checkSubSideNav = message;
      } else {
        this.checkSubSideNav = '';
      }
    });
  }
  getToggleSideBar(): void
  {
    this.baseService.getToggleSideBar().subscribe(message => {
      if (message) {
        this.checkToggleBar = message;
      } else {
        this.checkToggleBar = '';
      }
    });
  }
  getEmployeeRoles() {
    this.UD.getEmployeeRoles(this.usersession.roles[0].employee_id).subscribe((result)=>{
      this.employeeRoles = result;
      this.employeeRoles = this.employeeRoles.data[0];
    })
  }
  getScreens(name:any,id:any)
  {

    this.RM.getRoleScreenFunctionalities(id).subscribe((result)=>{
      this.rolesScreen = result;
      this.rolesScreen = this.rolesScreen.data[0]
    /*  this.baseService.setRoles(data);*/
    });
  }
  setRoles(data:any): void {
    this.baseService.setSubSideNav(data);
    this.getSubSideNav();
  }
  clearRoles(): void {
    // clear messages
    this.baseService.clearSubSideNav();
  }
}
