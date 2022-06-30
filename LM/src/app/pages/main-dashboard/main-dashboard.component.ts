import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavItem } from 'src/app/models/navItem';
import { LoginService } from 'src/app/services/login.service';
import { MainService } from 'src/app/services/main.service';
import { SideMenuService } from 'src/app/services/side-menu.service';


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
  constructor(private AMS : LoginService,private mainService:MainService,
    private sideMenuService:SideMenuService,private router:Router) {
    this.data= sessionStorage.getItem('user')
    this.usersession = JSON.parse(this.data)
  
   }

  getModules(){
    this.AMS.getModules('modulesmaster',null,1,100,'boon_client').subscribe((result)=>{
      if(result && result.status){
        this.allModuleDetails = result.data;

      }
    })
  }

  getrolescreenfunctionalities(id:any){
   
    let data={
      'empid':this.usersession.id,
      'moduleid':id
    };
    this.mainService.getRoleScreenFunctionalities(data).subscribe((res:any)=>{
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
      // this.router.navigate(['/admin/Dashboard'])
      // sessionStorage.setItem('user',JSON.stringify(this.menu));
     //  this.sideMenuService.setData(this.menu);
      // this.router.navigate(['/admin/Dashboard'])
       this.router.navigate([this.firstRoute]);
        
      }


    
    })

  }

  ngOnInit(): void {
    this.getModules();
  }

  

}
