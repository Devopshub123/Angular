import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavItem } from 'src/app/models/navItem';
import { LoginService } from 'src/app/services/login.service';
import { MainService } from 'src/app/services/main.service';
import { SideMenuService } from 'src/app/services/side-menu.service';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss']
})
export class MainDashboardComponent implements OnInit {
  allModuleDetails:any=[];
  usersession:any;
  data :any;
  userRoles:any=[];
  menu: NavItem[]=[];
  firstRoute:any;
  compoff:any;
  showError: boolean = false;
  private unsubscriber: Subject<void> = new Subject<void>();
  constructor(private AMS : LoginService,private mainService:MainService,
    private sideMenuService:SideMenuService,private router:Router) {
      this.getCompoffleavestatus();
    this.data= sessionStorage.getItem('user')
    this.usersession = JSON.parse(this.data)

   }

  getModules(){
    this.AMS.getModules('modulesmaster',null,1,100,'spryple_sanela').subscribe((result)=>{
      if(result && result.status){
        this.allModuleDetails = result.data;

      }
    })
  }

  getCompoffleavestatus(){
    this.mainService.getCompoffleavestatus().subscribe((result)=>{
     if(result.status){
       this.compoff = result.data.compoff_status;
     }
    })
   }



  getrolescreenfunctionalities(id:any,date:any){

    if(date){
        let data={
          'empid':this.usersession.id,
          'moduleid':id
        };
        sessionStorage.setItem('activeModule',JSON.stringify(data));
        this.mainService.getRoleScreenFunctionalities(data).subscribe((res:any)=>{
          this.menu=[];
          if(res.status){
            this.menu=[];
            this.firstRoute='';
            res.data.forEach((e: any) => {

              if (this.menu.length > 0) {
                var isvalid = true;
                this.menu.forEach((item) => {
                  if (item.displayName == e.role_name && e.parentrole!=1) {
                    isvalid = false;
                    if(this.compoff){
                      var itemnav = {
                        displayName: e.screen_name,
                        iconName: '',// e.role_name,
                        route: e.routename
                      }
                      item.children?.push(itemnav);

                    }
                    else{
                      if(e.screen_name == 'Comp off History'){}
                      else{
                        var itemnav = {
                          displayName: e.screen_name,
                          iconName: '',// e.role_name,
                          route: e.routename
                        }
                        item.children?.push(itemnav);
                      }
                    }

                  }else{
                    if(item.displayName == 'Self'  && e.parentrole==1 ){
                      isvalid = false;
                      if(this.compoff){
                        var itemnav = {
                          displayName: e.screen_name,
                          iconName: '',// e.role_name,
                          route: e.routename
                        }
                        item.children?.push(itemnav);
                      }
                      else{
                        if(e.screen_name == 'Comp Off'){}
                        else{
                          var itemnav = {
                            displayName: e.screen_name,
                            iconName: '',// e.role_name,
                            route: e.routename
                          }
                          item.children?.push(itemnav);
                        }
                      }


                    }
                  }
                })
                if (isvalid == true) {
                  if (e.parentrole == 1) {
                    var navitem = {
                      displayName: 'Self',
                      iconName: '',//e.role_name,
                      children: [
                        {
                          displayName: e.screen_name,
                          iconName: '',// e.role_name,
                          route: e.routename
                        }

                      ]
                    };
                    this.menu.push(navitem)
                  } else {
                    var item = {
                      displayName: e.role_name,
                      iconName: '',//e.role_name,
                      children: [
                        {
                          displayName: e.screen_name,
                          iconName: '',// e.role_name,
                          route: e.routename
                        }

                      ]
                    };
                    this.menu.push(item)
                  }

                }
              } else {
                if (e.parentrole == 1) {
                  var items = {
                    displayName: 'Self',
                    iconName: '',//e.role_name,
                    children: [
                      {
                        displayName: e.screen_name,
                        iconName: '',// e.role_name,
                        route: e.routename
                      }

                    ]
                  };
                  this.firstRoute = e.routename;
                  this.menu.push(items)
                } else {
                  var navtem = {
                    displayName: e.role_name,
                    iconName: '',//e.role_name,
                    children: [
                      {
                        displayName: e.screen_name,
                        iconName: '',// e.role_name,
                        route: e.routename
                      }

                    ]
                  };
                  this.firstRoute = e.routename;
                  this.menu.push(navtem)

                }
              }
            });
          sessionStorage.setItem('sidemenu',JSON.stringify(this.menu));
                if(this.usersession.firstlogin == 'Y'){
            this.router.navigate(['/ChangePassword']);
          }else{
          this.router.navigate([this.firstRoute]);
          }

          }



        })
  }

  }

  ngOnInit(): void {
    this.getModules();
    history.pushState(null, '');

    fromEvent(window, 'popstate')
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((_) => {
        history.pushState(null, '');
        this.showError = true;
      });
  }


  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }
}
