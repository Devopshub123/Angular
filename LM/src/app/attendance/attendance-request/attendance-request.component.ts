import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AttendanceService } from '../attendance.service';
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
const arrayList:any = [
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
  arrayList: any;
  employee_id:any;
  workTypeData: any;
  userSession:any;
  shiftData: any;
  constructor(private formBuilder: FormBuilder,private attendanceService:AttendanceService) {
     // Create 100 users
  
     // Assign the data to the data source for the table to render
     this.dataSource = new MatTableDataSource(arrayList);
   }

  ngOnInit(): void {
    this.todayWithPipe = this.pipe.transform(Date.now(), 'dd/MM/yyyy');
    this.requestform=this.formBuilder.group(
      {
        appliedDate:[this.todayWithPipe,Validators.required],
        shift:['',Validators.required],
        fromDate:['',Validators.required],
        toDate:['',Validators.required],
        workType:['',Validators.required],
        reason:['',Validators.required],
        
      });
      this.userSession = JSON.parse(sessionStorage.getItem('user')??'');
      console.log(this.userSession)
      console.log(this.userSession.id)
      this.getWorkypeList();
      this.getEmployeeShiftDetails()
      
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  getEmployeeShiftDetails(){
      this.attendanceService.getShiftDetailsByEmpId(this.userSession.id).subscribe((res)=>{
        if(res){
          this.shiftData=res.data[0];
          this.requestform.controls.shift.setValue(this.shiftData.shiftname)
        }
      })
  }
  getWorkypeList(){
    this.attendanceService.getWorkypeList('attendancetypesmaster','active',1,100,'boon_client').subscribe((info)=>{
      if(info.status && info.data.length !=0) {
      
        this.workTypeData = info.data;
       
      }

    })

  }
  getAttendanceRequestListByEmpId(){
    this.arrayList=[];
   this.attendanceService.getAttendanceRequestListByEmpId(this.userSession.id).subscribe((res)=>{
    if(res.status){
      this.arrayList=res.data;
    }else{
      this.arrayList=[];
    }
   })
  };
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  saveConsultation(){
   this.attendanceService.setemployeeattendanceregularization(this.resetform).subscribe((res)=>{
    if(res.status){
      
    }
   })
  }
  resetform(){
    
  }
}

