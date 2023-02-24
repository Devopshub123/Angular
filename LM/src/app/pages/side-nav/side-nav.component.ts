import { Subscribable, Subscription } from 'rxjs';
import { UserDashboardService } from 'src/app/services/user-dashboard.service';
import { RoleMasterService } from 'src/app/services/role-master.service';
import { Component, OnInit,ElementRef,ViewChild } from '@angular/core';
import { BaseService } from '../../services/base.service';
import { MainService } from 'src/app/services/main.service';
import {MatIconModule} from '@angular/material/icon';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  self :any = 'Employee';
  menuList: any[] = [];
  showFiller = false;
  isExpanded = false;
  element= HTMLElement;
  currentItem:any = null;
  currentChild:any = null;
  firstRoute: any;
  selectedModule:any = 'Spryple';
  usersession: any;
  activeModuleData: any;
  moduleName: any;
  flag: boolean = true;
  sideNavigationWidth : any= '20';
  istoolTipExp: boolean = true;
  istoolTip= "Expand";
  icon: boolean = false;

  click(child:any){
    child.isOpen = !child.isOpen;
    if(child.displayName === this.self)
    child.isOpen = true;
    }
 
  sidemenuHover(item:any) {
       this.moduleName = item.modulename;
  }

  toggleActive(item: any) {
    if (item.id==3) {
      this.timesheet();
      return;
       }
    if(!(item.children && item.children[0])){
        return;
      }

    this.isExpanded = true;
    this.menuList.forEach((m:any) =>{
      m.displayStatus = false;
    })
    item.displayStatus = true;
    sessionStorage.setItem('selectedModule',item.modulename );
  }
  timesheet() {
    window.open('http://122.175.62.210:5050', '_blank');
  }

  onClickMainDashboard(){
    sessionStorage.setItem('selectedModule','Spryple' );
    this.router.navigate(['/main/MainDashboard']);
    
  }
  toggleExpand(){
    if(this.isExpanded && (sessionStorage.getItem('selectedModule') && sessionStorage.getItem('selectedModule')!=='Spryple')){
      this.isExpanded = true;
    } else this.isExpanded = false;

    if(sessionStorage.getItem('selectedModule')==='Edit Profile')
      this.isExpanded = false;
    if(sessionStorage.getItem('selectedModule')==='Change Password')
      this.isExpanded = false;
    return this.isExpanded;
    }

  toggleChild(item:any,route:any) { 
   
    let _this =this;
    this.showSpinner();
    if (item.id==3) {
      this.timesheet();
      return;
       }
       if(!(item.children && item.children[0])){
        return;
      }
    this.isExpanded = true;
   
    this.menuList.forEach(function(m:any){
      if(m.children && m.children[0]){
        m.children.forEach(function(c:any){
          if(c.subChildren && c.subChildren[0]){
            c.subChildren.forEach(function(sc:any){
              c.isOpen = true;
              m.displayStatus = false;
              if(sc.routename === route) {
                _this.currentItem  = m;
                _this.selectedModule = _this.currentItem.modulename ;
                sc.childStatus = true;
                _this.currentChild = sc;
                _this.activeModuleData.moduleid = _this.currentItem.id;
                _this.activeModuleData.module = _this.currentItem ;
               // sessionStorage.setItem('selectedModule',_this.selectedModule );
                sessionStorage.setItem('activeModule',(_this.activeModuleData) ?JSON.stringify(_this.activeModuleData):'' );
                sessionStorage.setItem('activeChild',(_this.currentChild) ?JSON.stringify(_this.currentChild):'' );
              }
              else{
              //  m.displayStatus = false;
              }
            });
          }
        });
      }
    });
    item.displayStatus = true;
    sessionStorage.setItem('selectedModule',item.modulename);
  } 
  toggleRoute(route:any) { 
    let _this =this;
    this.showSpinner();
    if(route === '/LeaveManagement/EditProfile'){
      this.isExpanded = false;
      sessionStorage.setItem('selectedModule','Spryple');
      return;
    }
    this.isExpanded = true;
    this.menuList.forEach(function(m:any){
      if(m.children && m.children[0]){
        m.children.forEach(function(c:any){
          if(c.subChildren && c.subChildren[0]){
            c.subChildren.forEach(function(sc:any){
              c.isOpen = true;
              m.displayStatus = false;
              if(sc.routename === route) {
                _this.currentItem  = m;
                m.displayStatus = true;
                _this.selectedModule = _this.currentItem.modulename ;
                sc.childStatus = true;
                _this.currentChild = sc;
                _this.activeModuleData.moduleid = _this.currentItem.id;
                _this.activeModuleData.module = _this.currentItem ;
                sessionStorage.setItem('selectedModule',m.modulename );
                sessionStorage.setItem('activeModule',(_this.activeModuleData) ?JSON.stringify(_this.activeModuleData):'' );
                sessionStorage.setItem('activeChild',(_this.currentChild) ?JSON.stringify(_this.currentChild):'' );
              }
              else{
              //  m.displayStatus = false;
              }
            });
          }
        });
      }
    });
    
  } 
 

  toggleBack(event:any) {
    let _this =this;
    this.isExpanded = !this.isExpanded;
    this.istoolTipExp = this.isExpanded;
    if(this.istoolTipExp) {
      this.istoolTip = "Collapse";
    } else {
      this.istoolTip = "Expand";
    }
   }

   getRouterStyle(){
    return this.isExpanded? '16%':'';
   }

  @ViewChild('parentMenu') parentMenu!: ElementRef;
  @ViewChild('childMenu') childMenu!: ElementRef;

  constructor(private mainService: MainService, private baseService: BaseService, private UD: UserDashboardService, private spinner: NgxSpinnerService,
    private RM: RoleMasterService, public router: Router) {
    this.usersession = JSON.parse(sessionStorage.getItem('user') ?? '');
    if (this.usersession.firstlogin == "N")
         this.flag = true;
    else this.flag = false;
    this.isExpanded = this.flag;
  }

  ngOnInit(): void {

    // this.usersession = JSON.parse(sessionStorage.getItem('user') ?? '');

    this.isExpanded = true;
    this.activeModuleData = {
      empid: this.usersession.id
    };

   this.getSideNavigation();
  }
  menu:any[]=[];
  _mobileQueryListener(){};
  getSideNavigation() { 
      this.showSpinner();
      if(!(sessionStorage.getItem("moduleData"))){
        this.spinner.show();
          this.mainService.getSideNavigation({empid: this.usersession.id}).subscribe((res: any) => {
            this.spinner.hide();
            this.menuList = res.data;
            sessionStorage.setItem("moduleData",JSON.stringify( this.menuList) );
            sessionStorage.setItem('selectedModule','Spryple');
          });
    } 
    else {
          let menuList = sessionStorage.getItem("moduleData");
          this.menuList = JSON.parse(menuList||'');
    }
  
    if(sessionStorage.getItem('selectedModule')==='Spryple'){
      this.isExpanded = false;   
          this.onClickMainDashboard();
    }else if(sessionStorage.getItem('selectedModule')==='Edit Profile'){ 
      this.isExpanded = false;
      this.router.navigate(['LeaveManagement/EditProfile']);
    }else if(sessionStorage.getItem('selectedModule')==='Change Password'){ 
      this.isExpanded = false;
      this.router.navigate(['Attendance/ChangePassword']);
    }
     else {
          for(let i=0; i< this.menuList.length;i++) {
              this.menuList[i].displayStatus =  this.menuList[i].modulename === sessionStorage.getItem('selectedModule');
          }
    }
    
  }

  showSpinner() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000); // 2 seconds
  }
}
 