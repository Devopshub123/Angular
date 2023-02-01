import { Component, OnInit } from '@angular/core';
import {LeavesService} from "../../leaves.service";

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss']
})
export class ManagerDashboardComponent implements OnInit {
  compoff:any;

  constructor(private LM:LeavesService) { }

  ngOnInit(): void {
    this.getCompoffleavestatus();
  }
  getCompoffleavestatus(){
    this.LM.getCompoffleavestatus().subscribe((result) => {
      console.log("data--", result.data)
     if(result.status){
       this.compoff = result.data.compoff_status;
     }
    })
   }

}
