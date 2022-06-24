import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AttendanceService } from '../../attendance.service';
import { UserData } from '../../models/EmployeeData';
interface IdName {
  id: string;
  name: string;
}
/** Constants used to fill up our data base. */

@Component({
  selector: 'app-approval-attendance-list',
  templateUrl: './approval-attendance-list.component.html',
  styleUrls: ['./approval-attendance-list.component.scss']
})


export class ApprovalAttendanceListComponent implements OnInit {
  displayedColumns: string[] = ['id','applieddate' ,'worktype','raisedbyname','shift', 'fromdate', 'todate','reason','status'];
  dataSource: MatTableDataSource<UserData>=<any>[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
 
  arrayList: UserData[]=[];
  userSession: any;
  constructor(private router:Router, private attendanceService:AttendanceService) {
  
     // Assign the data to the data source for the table to render
    
   }

  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') ?? '');
    this.getPendingAttendanceRequestListByEmpId();
  }
  ngAfterViewInit() {
    // this.dataSource = new MatTableDataSource(this.arrayList);
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
}
getPendingAttendanceRequestListByEmpId() {
  this.arrayList = [];
  this.attendanceService.getPendingAttendanceListByManagerEmpId(this.userSession.id).subscribe((res) => {
    if (res.status) {
      this.arrayList = res.data;
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
};
changeTab(elment:UserData){

  this.router.navigate(["/Attendance/Approval"],{state: {userData:elment}}); 
}
}
