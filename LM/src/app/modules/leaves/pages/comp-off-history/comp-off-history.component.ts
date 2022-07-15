import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {UserData} from "../../../attendance/models/EmployeeData";
import {LeavesService} from "../../leaves.service";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-comp-off-history',
  templateUrl: './comp-off-history.component.html',
  styleUrls: ['./comp-off-history.component.scss']
})
export class CompOffHistoryComponent implements OnInit {
  userSession:any;
  displayedColumns: string[] = ['appliedOn','empId' ,'empName','fromDate', 'noOfHours','pendingSince','reason','action'];
  dataSource: MatTableDataSource<UserData>=<any>[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  arrayList:any=[];

  constructor(private LM:LeavesService,public dialog: MatDialog,private router: Router) { }

  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.getCompoffs();
  }
  getCompoffs() {
    var Data ={
      'empId':null,
      'rmId':this.userSession.id
    }
    this.LM.getCompoffs(Data).subscribe((res: any) => {
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

    });
  }
  compoffReview(compoff:any){
    compoff.employeename = compoff.employee_name;
    console.log("hsfkldkfksjd",compoff);
    compoff.leavestatus = compoff.status;
    this.router.navigate(["/LeaveManagement/ReviewAndApprovals"], { state: { leaveData: compoff ,isleave:false,isleaveHistory:'compoff'} });

  }
}
