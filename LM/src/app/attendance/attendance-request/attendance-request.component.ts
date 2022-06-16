import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
export interface UserData {
  id: number;
  workType: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: string;
}
interface IdName {
  id: string;
  name: string;
}
/** Constants used to fill up our data base. */
const arrayList = [
  {"id":1,"workType":"Work From Office","fromDate":"02/06/2022","toDate":"03/07/2022","reason":"outside work","status":"Pending"},
  {"id":2,"workType":"On Duty","fromDate":"02/06/2022","toDate":"03/07/2022","reason":"outside work","status":"Approved"},
  {"id":3,"workType":"Remote Work","fromDate":"02/06/2022","toDate":"03/07/2022","reason":"outside work","status":"Pending"},
  {"id":4,"workType":"Work From Office","fromDate":"02/06/2022","toDate":"03/07/2022","reason":"outside work","status":"Approve"},
  {"id":5,"workType":"On Duty","fromDate":"02/06/2022","toDate":"03/07/2022","reason":"outside work","status":"Pending"},
];

@Component({
  selector: 'app-attendance-request',
  templateUrl: './attendance-request.component.html',
  styleUrls: ['./attendance-request.component.scss']
})
export class AttendanceRequestComponent implements OnInit {
  requestform!: FormGroup;
  fromDate: any;
  toDate: any;
  today: Date = new Date();
  minDate=new Date('1950/01/01'); maxDate = new Date();
  pipe = new DatePipe('en-US');
  todayWithPipe:any;
  displayedColumns: string[] = ['id', 'workType', 'fromDate', 'toDate','reason','status'];
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
  constructor(private formBuilder: FormBuilder) {
     // Create 100 users
  
     // Assign the data to the data source for the table to render
     this.dataSource = new MatTableDataSource(arrayList);
   }

  ngOnInit(): void {
    this.todayWithPipe = this.pipe.transform(Date.now(), 'dd/MM/yyyy');
    this.requestform=this.formBuilder.group(
      {
        appliedDate:[this.todayWithPipe,Validators.required],
        shift:['General',Validators.required],
        fromDate:['',Validators.required],
        toDate:['',Validators.required],
        workType:['',Validators.required],
        reason:['',Validators.required],
        
      });
      
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
  saveConsultation(){

  }
  resetform(){
    
  }
}

