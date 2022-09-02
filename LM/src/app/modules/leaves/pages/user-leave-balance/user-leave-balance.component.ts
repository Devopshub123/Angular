import { Component, OnInit } from '@angular/core';
import { LeavesService } from '../../leaves.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-leave-balance',
  templateUrl: './user-leave-balance.component.html',
  styleUrls: ['./user-leave-balance.component.scss']
})
export class UserLeaveBalanceComponent implements OnInit {
  usersession:any;
  leavedata:any = [];
  constructor(private router: Router,private LM:LeavesService) {
    this.usersession = JSON.parse(sessionStorage.getItem('user') || '');
   }

  ngOnInit(): void {
    this.getLeaveBalance();
  }
  getLeaveBalance(){
    this.LM.getLeaveBalance(this.usersession.id).subscribe((result)=>{
      if(result.status){
        for(let i =0; i<result.data[0].length; i++){
            let total = result.data[0][i].total.split('.')
            if(total[1] == '00'){
              result.data[0][i].total = total[0];
            }
          if ( result.data[0][i].leavename === "Marriage Leave" && this.usersession.maritalstatus === "Single") {
            this.leavedata.push( result.data[0][i])

          } else if ( result.data[0][i].leavename === 'Maternity Leave'&& this.usersession.maritalstatus === "Married") {
            if (this.usersession.gender === 'Female') {
              this.leavedata.push( result.data[0][i])
            }
          } else if ( result.data[0][i].leavename === 'Paternity Leave'&& this.usersession.maritalstatus === "Married") {
            if (this.usersession.gender === 'Male') {
              this.leavedata.push( result.data[0][i])
            }
          }else if( result.data[0][i].leavename !== 'Paternity Leave' &&  result.data[0][i].leavename !== "Marriage Leave" && result.data[0][i].leavename !== 'Maternity Leave'){
            this.leavedata.push( result.data[0][i])
          }
          // if(this.usersession.maritalstatus === "Married" && result.data[0][t].leavename === "Marriage Leave"){
          //   result.data[0].splice(t,1);
          //   if(this.usersession.gender === 'Male' && result.data[0][t].leavename === 'Maternity Leave'){
          //     result.data[0].splice(t,1);
          //   }else if(this.usersession.gender === "FeMale" && result.data[0][t].leavename === 'Paternity Leave') {
          //     result.data[0].splice(t,1);
          //   }
          // }else {
          //   if(result.data[0][t].leavename === 'Maternity Leave' || result.data[0][t].leavename === 'Paternity Leave'){
          //     result.data[0].splice(t,1)
          //   }

          // }
          // return data;
        }

        // this.leavedata = data;
      }
    })
  }

}
