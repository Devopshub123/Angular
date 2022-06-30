import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';


@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss']
})
export class MainDashboardComponent implements OnInit {
  allModuleDetails:any=[];
  constructor(private AMS : LoginService) {
    this.AMS.getModules('modulesmaster',null,1,100,'boon_client').subscribe((result)=>{
      if(result && result.status){
        this.allModuleDetails = result.data;

      }
      console.log("resultatte",result)
    })
    
   }

  getModules(){
    this.AMS.getModules('modulesmaster',null,1,100,'boon_client').subscribe((result)=>{
      if(result && result.status){
        this.allModuleDetails = result.data;

      }
      console.log("resultatte",result)
    })
  }

  ngOnInit(): void {
    // this.getModules();
  }

}
