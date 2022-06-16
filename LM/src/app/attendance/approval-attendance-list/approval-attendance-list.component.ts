import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UserData } from '../models/EmployeeData';
interface IdName {
  id: string;
  name: string;
}
/** Constants used to fill up our data base. */
const arrayList = [
  {"id":1,"appliedDate":"10/06/2022","workType":"Work From Office","empName":"Raghavendra","shift":"General","fromDate":"02/06/2022","toDate":"03/07/2022","reason":"outside work","status":"Pending"},
  {"id":2,"appliedDate":"10/06/2022","workType":"On Duty","empName":"Chandra Shekar","shift":"AfterNoon","fromDate":"02/06/2022","toDate":"03/07/2022","reason":"outside work","status":"Approved"},
  {"id":3,"appliedDate":"10/06/2022","workType":"Remote Work","empName":"Ganesh","shift":"Evening","fromDate":"02/06/2022","toDate":"03/07/2022","reason":"outside work","status":"Pending"},
  {"id":4,"appliedDate":"10/06/2022","workType":"Work From Office","empName":"Raju","shift":"General","fromDate":"02/06/2022","toDate":"03/07/2022","reason":"outside work","status":"Approve"},
  {"id":5,"appliedDate":"10/06/2022","workType":"On Duty","empName":"Venu","shift":"Morning","fromDate":"02/06/2022","toDate":"03/07/2022","reason":"outside work","status":"Pending"},
];
@Component({
  selector: 'app-approval-attendance-list',
  templateUrl: './approval-attendance-list.component.html',
  styleUrls: ['./approval-attendance-list.component.scss']
})
export class ApprovalAttendanceListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'workType','empName','shift', 'fromDate', 'toDate','reason','status'];
  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  workType: IdName[] = [
    {id: '1', name: 'Remote Work'},
    {id: '2', name: 'On Duty'},
    {id: '3', name: 'Work From Home'},
    {id: '3', name: 'Work From Office'},
  ];
  constructor(private router:Router) {
  
     // Assign the data to the data source for the table to render
     this.dataSource = new MatTableDataSource(arrayList);
   }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
}
changeTab(elment:UserData){

  this.router.navigate(["/Attendance/Approval"],{state: {userData:elment}}); 
}
}
