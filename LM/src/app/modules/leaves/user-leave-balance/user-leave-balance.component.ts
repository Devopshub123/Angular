import { Component, OnInit } from '@angular/core';
import { LeavesService } from '../leaves.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-leave-balance',
  templateUrl: './user-leave-balance.component.html',
  styleUrls: ['./user-leave-balance.component.scss']
})
export class UserLeaveBalanceComponent implements OnInit {
  usersession:any;
  leavedata:any;
  constructor(private router: Router,private LM:LeavesService) {
    this.usersession = JSON.parse(sessionStorage.getItem('user') || '');
   }

  ngOnInit(): void {
    this.getLeaveBalance();
  }
  getLeaveBalance(){
    this.LM.getLeaveBalance(this.usersession.id).subscribe((result)=>{
      if(result.status){
        for(let t =0; t<result.data[0].length; t++){
          if(this.usersession.maritalstatus === "Married" && result.data[0][t].leavename === "Marriage Leave"){
            result.data[0].splice(t,1);
            if(this.usersession.gender === 'Male' && result.data[0][t].leavename === 'Maternity Leave'){
              result.data[0].splice(t,1);
            }else if(this.usersession.gender === "FeMale" && result.data[0][t].leavename === 'Paternity Leave') {
              result.data[0].splice(t,1);
            }
          }else {
            if(result.data[0][t].leavename === 'Maternity Leave' || result.data[0][t].leavename === 'Paternity Leave'){
              result.data[0].splice(t,1)
            }

          }
        }

        this.leavedata = result.data[0];
      }
    })
  }

}
