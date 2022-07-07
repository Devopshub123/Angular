import {Component, OnInit, ViewChild} from '@angular/core';
import {UserData} from "../../../attendance/models/EmployeeData";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {LeavesService} from '../../leaves.service'

@Component({
  selector: 'app-pending-approvals',
  templateUrl: './pending-approvals.component.html',
  styleUrls: ['./pending-approvals.component.scss']
})
export class PendingApprovalsComponent implements OnInit {
  displayedColumns: string[] = ['appliedOn','empId' ,'empName','leaveType','fromDate', 'toDate', 'noOfDays','pendingSince','action'];
  dataSource: MatTableDataSource<UserData>=<any>[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  userSession:any;
  arrayList:any=[];

  constructor(private LM:LeavesService) { }

  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    console.log("hello0",this.userSession)
    this.getLeavesForApprovals();
  }

  getLeavesForApprovals(){
    this.LM.getLeavesForApprovals(this.userSession.id).subscribe((res: any) => {
      if (res.status) {
        // console.log("hellooo",res.data);
        this.arrayList = res.data;
        this.dataSource = new MatTableDataSource(this.arrayList);
        console.log("hellooo",this.dataSource);

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

  applyFilter(event: Event) {
    // const filterValue = (event.target as HTMLInputElement).value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    //
    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }

  onApproveClick(event: Event){
    console.log("heloooooooooooooo",event)

  }

}
