import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';


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

  constructor(private AMS : LoginService) {
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
    this.AMS.getrolescreenfunctionalities(this.usersession.id,id).subscribe((result)=>{
      if(result && result.status){
        this.userRoles = result.data;

      }
    })
  }

  ngOnInit(): void {
    this.getModules();
  }

  

}
