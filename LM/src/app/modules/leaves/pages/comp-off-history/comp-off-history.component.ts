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
  // displayedColumns: string[] = ['appliedOn','empId' ,'empName','fromDate', 'noOfHours','pendingSince','reason','action'];
    displayedColumns: string[] = ['appliedOn','empId' ,'empName','fromDate', 'noOfHours','pendingSince','action'];

  dataSource: MatTableDataSource<UserData>=<any>[];
  pageLoading=true;
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
        this.dataSource = new MatTableDataSource(this.arrayList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageLoading=false;
      } else {
        this.arrayList = [];
        this.dataSource = new MatTableDataSource(this.arrayList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageLoading=false;
      }

    });
  }
  getPageSizes(): number[] {
    if (this.dataSource.data.length > 20) {
      return [5, 10, 20, this.dataSource.data.length];
    }
    else {

     return [5, 10, 20];
    }
  }
  compoffReview(compoff:any){
    compoff.employeename = compoff.employee_name;
    compoff.leavestatus = compoff.status;
    compoff.url = "/LeaveManagement/CompOffHistory"
    this.router.navigate(["/LeaveManagement/ReviewAndApprovals"], { state: { leaveData: compoff ,isleave:false,isleaveHistory:'compoff'} });

  }
}
