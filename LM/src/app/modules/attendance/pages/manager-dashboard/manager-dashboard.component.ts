import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { CalendarOptions, EventInput } from '@fullcalendar/angular'; // useful for typechecking
import { FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // a plugin!
import { AttendanceService } from '../../attendance.service';
import { UserData } from '../../models/EmployeeData';
@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss']
})
export class ManagerDashboardComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;
  TODAY_STR = new Date().toISOString().replace(/T.*$/, '');
 initialEvents:EventInput[] = [ ];
 todayDate:any;
 Events: any[] = [];
 calendarOptions: CalendarOptions = {
   headerToolbar: {
     left: 'prev,next today',
     center: 'title',
     right: 'dayGridMonth'
   },
   initialView: 'dayGridMonth',
   weekends: true,
   editable: true,
   selectable: true,
   selectMirror: true,
   dayMaxEvents: true
 };
 pipe = new DatePipe('en-US');
 userSession: any;
 attendanceData:any;
 selectedDate: any;
  arrayList: any;

 constructor(private attendanceService:AttendanceService,private router:Router) { }

 ngOnInit(): void {
  this.todayDate= this.pipe.transform(Date.now(), 'dd/MM/yyyy');
   this.userSession = JSON.parse(sessionStorage.getItem('user') ?? '');
   this.getemployeeattendancedashboard();
   this.getPendingAttendanceRequestListByEmpId();
 }
 getemployeeattendancedashboard(){
   this.selectedDate = this.pipe.transform(Date.now(), 'yyyy-MM-dd');
   let data={
     'manager_id':null,
     'employee_id':this.userSession.id,
     'date':this.selectedDate
   }
   this.attendanceService.getemployeeattendancedashboard(data).subscribe((res:any)=>{
     if(res.status){
       this.attendanceData=res.data;
       this.attendanceData.forEach((e:any)=>{
         let item=
           {
             title: e.present_or_absent=='P'?'Present':'Absent',
             start:e.attendancedate, ///new Date(e.attendancedate).toISOString().replace(/T.*$/, ''),
             color: e.present_or_absent=='P'?'#32cd32':'#FF3131',
                 }
         this.initialEvents.push(item);
       });
       this.calendarOptions.events = this.initialEvents;

     }

   })
  }
  getPendingAttendanceRequestListByEmpId() {
    this.arrayList = [];
    this.attendanceService.getPendingAttendanceListByManagerEmpId(this.userSession.id).subscribe((res) => {
      if (res.status) {
        this.arrayList = res.data;
       
      } else {
        this.arrayList = [];

      }
    })
  };
  changeTab(elment:UserData){
  
    this.router.navigate(["/Attendance/Approval"],{state: {userData:elment}}); 
  }
}