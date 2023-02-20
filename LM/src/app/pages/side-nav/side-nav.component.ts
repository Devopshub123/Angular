import { Subscribable, Subscription } from 'rxjs';
import { UserDashboardService } from 'src/app/services/user-dashboard.service';
import { RoleMasterService } from 'src/app/services/role-master.service';
import { Component, OnInit,ElementRef,ViewChild } from '@angular/core';
import { BaseService } from '../../services/base.service';
import { MainService } from 'src/app/services/main.service';
import {MatIconModule} from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  self :any = 'Self';
  menuList: any[] = [];
  showFiller = false;
  isExpanded = false;
  element= HTMLElement;
  currentItem:any = null;
  currentChild:any = null;
  mainDashBoard ='/main/MainDashboard';
  selectedModule:any = 'Spryple';
  usersession: any;
  activeModuleData: any;
  moduleName: any;
  flag: boolean = true;
  sideNavigationWidth : any= '20';
  istoolTipExp: boolean = true;
  istoolTip= "Expand";
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
    this.router.navigate(['/main/MainDashboard']);
    sessionStorage.setItem('selectedModule','Spryple' );
  }
  toggleExpand(){
    if(this.isExpanded && (sessionStorage.getItem('selectedModule') && sessionStorage.getItem('selectedModule')!=='Spryple')){
      this.isExpanded = true;
    } else this.isExpanded = false;
    return this.isExpanded;
     // return this.isExpanded && (sessionStorage.getItem('selectedModule') && sessionStorage.getItem('selectedModule')!=='Spryple');
    }

  toggleChild(item:any,child:any,subchild:any,route:any,screen:any) {
    let _this =this;
    this.isExpanded = true;
    this.menuList.forEach(function(m:any){
      if(m.children && m.children[0]){
        m.children.forEach(function(c:any){
          if(c.subChildren && c.subChildren[0]){
            c.subChildren.forEach(function(sc:any){
              if(sc.routename === route) {
                m.displayStatus = true;
                _this.currentItem  = m;
                _this.selectedModule = _this.currentItem.modulename ;
                sc.childStatus = true;
                _this.currentChild = sc;
                _this.activeModuleData.moduleid = _this.currentItem.id;
                _this.activeModuleData.module = _this.currentItem ;
                sessionStorage.setItem('selectedModule',_this.selectedModule );
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

  constructor(private mainService: MainService, private baseService: BaseService, private UD: UserDashboardService,
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
   //this.getrolescreenfunctionalities()
   this.getSideNavigation();
  }
  menu:any[]=[];
  _mobileQueryListener(){};
  getSideNavigation() {
    this.mainService.getSideNavigation({empid: this.usersession.id}).subscribe((res: any) => {
      //this.menu=[];
      for(let i=0; i<res.data.length;i++) {
        res.data[i].displayStatus = res.data[i].modulename === sessionStorage.getItem('selectedModule');
        if (res.data[i].children != 'null') {
          let one = JSON.parse(res.data[i].children);
          // res.data[i].children=Array.from(new Set(res.data[i].children))
          res.data[i].children = one.filter((thing: any, index: any, self: any) =>
            index === self.findIndex((t: any) => (
              JSON.stringify(t) === JSON.stringify(thing)
            ))
          )


          this.menu=[];
          res.data[i].children.forEach((e: any) => {
            e.subChildren =[];
            if (this.menu.length > 0) {
              var isvalid = true;
              this.menu.forEach((item:any) => {
                if (item.displayName == e.role_name && e.parentrole!=1) {
                  isvalid = false;
                  var itemnav = {
                    screen_name: e.screen_name,
                    iconName: '',// e.role_name,
                    routename: e.routename,
                    menu_order: e.menu_order
                  }
                  item.subChildren?.push(itemnav);
                }else{
                  if(item.displayName == this.self  && e.parentrole==1 ){
                    isvalid = false;
                    var itemnav = {
                      screen_name: e.screen_name,
                      iconName: '',// e.role_name,
                      routename: e.routename,
                      menu_order: e.menu_order
                    }
                    item.subChildren?.push(itemnav);
                  }
                }
              })
              if (isvalid == true) {
                if (e.parentrole == 1) {
                  var navitem = {
                    displayName: this.self,
                    iconName: '',//e.role_name,
                    subChildren: [
                      {
                        screen_name: e.screen_name,
                        iconName: '',// e.role_name,
                        routename: e.routename,
                        menu_order: e.menu_order
                      }

                    ]
                  };
                  this.menu.push(navitem)
                } else {
                  var item = {
                    displayName: e.role_name,
                    iconName: '',//e.role_name,
                    subChildren: [
                      {
                        screen_name: e.screen_name,
                        iconName: '',// e.role_name,
                        routename: e.routename,
                        menu_order: e.menu_order
                      }

                    ]
                  };
                  this.menu.push(item)
                }

              }
            } else {
              if (e.parentrole == 1) {
                var items = {
                  displayName: this.self,
                  iconName: '',//e.role_name,
                  subChildren: [
                    {
                      screen_name: e.screen_name,
                      iconName: '',// e.role_name,
                      routename: e.routename,
                      menu_order: e.menu_order
                    }

                  ]
                };
                //  this.firstRoute = e.routename;
                this.menu.push(items)
              } else {
                var navtem = {
                  displayName: e.role_name,
                  iconName: '',//e.role_name,
                  subChildren: [
                    {
                      screen_name: e.screen_name,
                      iconName: '',// e.role_name,
                      routename: e.routename,
                      menu_order: e.menu_order
                    }

                  ]
                };
                //  this.firstRoute = e.routename;

                this.menu.push(navtem)

              }
            }
          });


          //res.data[i].displayStatus = !i;
          res.data[i].children =this.menu

          }
          else{
            res.data[i].children =[];
          }
        }
      this.menuList = res.data;
      var timesheetId = 0;
      var timesheetMenu = {};

      this.menuList.forEach(function(m:any,index:any){
        if(m.children && m.children[0]){
          m.children.forEach(function(c:any){
            if(c.subChildren && c.subChildren[0])
              c.subChildren.sort(function(a:any,b:any){ return ( a.menu_order < b.menu_order )?-1:1;});
          });
        }
        if(m.modulename.toLowerCase().includes('timesheet')){
          timesheetMenu = m;
          timesheetId = index;
        }
      });
      if(timesheetId){
        this.menuList.splice(timesheetId,1);
        this.menuList.push(timesheetMenu);
      }
      sessionStorage.setItem("moduleData",JSON.stringify( this.menuList) );
      //let storedArray = JSON.parse(sessionStorage.getItem("moduleData"));//no brackets
        //  console.log((storedArray));
          //console.log(JSON.parse(pk));
      //this.currentItem = res.data[0];
    });
  }
}

  //
  //
  // remove_duplicates(arr:[]) {
  //   var obj = {};
  //   for (let i = 0; i < arr.length; i++) {
  //     obj[arr[i]] = 1;
  //   }
  //   arr = [];
  //   for (let key in obj) {
  //     arr.push(key);
  //   }
  //   return arr;
  // }

