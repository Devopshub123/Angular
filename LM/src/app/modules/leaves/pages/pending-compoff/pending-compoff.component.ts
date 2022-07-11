import {Component, OnInit, ViewChild} from '@angular/core';
import {LeavesService} from "../../leaves.service";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {UserData} from "../../../attendance/models/EmployeeData";

@Component({
  selector: 'app-pending-compoff',
  templateUrl: './pending-compoff.component.html',
  styleUrls: ['./pending-compoff.component.scss']
})
export class PendingCompoffComponent implements OnInit {

  userSession:any;
  displayedColumns: string[] = ['appliedOn','empId' ,'empName','fromDate', 'noOfHours','pendingSince','reason','action'];
  dataSource: MatTableDataSource<UserData>=<any>[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  arrayList:any=[];

  constructor(private LM:LeavesService) { }

  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.getCompoffForApprovals();

  }


  getCompoffForApprovals() {
    this.LM.getCompoffForApprovals(this.userSession.id).subscribe((res: any) => {
      if (res.status) {
        // this.arrayList = res.data;
        for(let i = 0; i<res.data.length;i++){
          var date = new Date();
          var appliedDate = new Date(res.data[i].applied_date)
          res.data[i].pendingSince = date.getDate() - appliedDate.getDate();
          this.arrayList.push(res.data[i])
        }
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

  compoffApprove(compoff:any,status:any,approverId :any){

  }
  compoffReject(compoff:any){

  }

  compoffReview(compoff:any){

  }


}
