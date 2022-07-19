import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {UserData} from "../../../attendance/models/EmployeeData";
import {LeavesService} from "../../leaves.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-leave-history',
  templateUrl: './leave-history.component.html',
  styleUrls: ['./leave-history.component.scss']
})
export class LeaveHistoryComponent implements OnInit {

  constructor( private router: Router,private LM:LeavesService) { }
  displayedColumns: string[] = ['appliedOn','empId' ,'empName','leaveType','fromDate', 'toDate', 'noOfDays','pendingSince','status','action'];
  dataSource: MatTableDataSource<UserData>=<any>[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  userSession:any;
  arrayList:any;



  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.getHandledLeaves()
  }
  leaveReview(row:any){
    row.url = "/LeaveManagement/LeaveHistory"

    this.router.navigate(["/LeaveManagement/ReviewAndApprovals"], { state: { leaveData: row ,isleave:true,isleaveHistory:'leave'} });


  }

  // /**
  //  * get all pending leave for approvals
  //  * **/
  // getLeavesForApprovals(){
  //   this.LM.getLeavesForApprovals(this.userSession.id).subscribe((res: any) => {
  //     if (res.status) {
  //       // this.arrayList = res.data;
  //       for(let i = 0; i<res.data.length;i++){
  //         var date = new Date();
  //         var appliedDate = new Date(res.data[i].appliedon)
  //         res.data[i].pendingSince = date.getDate() - appliedDate.getDate();
  //         this.arrayList.push(res.data[i])
  //       }
  //       console.log(this.arrayList,'this.arrayList')
  //
  //       this.dataSource = new MatTableDataSource(this.arrayList);
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //     } else {
  //       this.arrayList = [];
  //       this.dataSource = new MatTableDataSource(this.arrayList);
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //     }
  //   })
  // }

  getHandledLeaves(){
    this.LM.getHandledLeaves(this.userSession.id).subscribe((res: any) => {
      if (res.status) {
        this.arrayList = res.data;
        // for(let i = 0; i<res.data.length;i++){
        //   var date = new Date();
        //   var appliedDate = new Date(res.data[i].applied_date)
        //   res.data[i].pendingSince = date.getDate() - appliedDate.getDate();
        //   this.arrayList.push(res.data[i])
        // }
        console.log(this.arrayList,'this.arrayList')

        this.dataSource = new MatTableDataSource(this.arrayList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.arrayList = [];
        this.dataSource = new MatTableDataSource(this.arrayList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }

    })

  }

}
