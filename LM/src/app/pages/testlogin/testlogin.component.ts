import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavItem } from 'src/app/models/navItem';
import { LoginService } from 'src/app/services/login.service';
import { MainService } from 'src/app/services/main.service';
import { SideMenuService } from 'src/app/services/side-menu.service';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-testlogin',
  templateUrl: './testlogin.component.html',
  styleUrls: ['./testlogin.component.scss']
})
export class TestloginComponent implements OnInit {
  allModuleDetails:any=[]
  usersession:any;
  data :any;
  userRoles:any=[];
  menu: NavItem[]=[];
  firstRoute:any;
  showError: boolean = false;
  private unsubscriber: Subject<void> = new Subject<void>();
  constructor(private AMS : LoginService,private mainService:MainService,
    private sideMenuService:SideMenuService,private router:Router) {
    this.data= sessionStorage.getItem('user')
    this.usersession = JSON.parse(this.data)
  
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
  getModules(){
    this.AMS.getModules('modulesmaster',null,1,100,'keerthi_hospitals').subscribe((result)=>{
      if(result && result.status){
        this.allModuleDetails = result.data;

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
            res.data.forEach((e:any)=>{
              
            if(this.menu.length>0){
              var isvalid=true;
              this.menu.forEach((item)=>{
                if(item.displayName==e.role_name){
                  isvalid=false;
                  var itemnav=    {
                    displayName: e.screen_name,
                    iconName:'',// e.role_name,
                    route: e.routename
                  }
                  item.children?.push(itemnav);
                }
              })
                if(isvalid==true){
                  var navitem= {
                    displayName: e.role_name,
                    iconName:'' ,//e.role_name,
                    children: [
                      {
                        displayName: e.screen_name,
                        iconName:'',// e.role_name,
                        route: e.routename
                      }
                      
                    ]};
                    this.menu.push(navitem)
                

                }
            }else{
              
            var navtem= {
                displayName: e.role_name,
                iconName: '',//e.role_name,
                children: [
                  {
                    displayName: e.screen_name,
                    iconName:'',// e.role_name,
                    route: e.routename
                  }
                  
                ]};
                this.firstRoute=e.routename;
                this.menu.push(navtem)
            
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

}
