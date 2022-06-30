import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, EventInput, FullCalendarComponent } from '@fullcalendar/angular'; // useful for typechecking
import { MatDividerModule } from '@angular/material/divider';
import { AttendanceService } from '../../attendance.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { UserData } from '../../models/EmployeeData';
import { RequestData } from '../../models/Request';
@Component({
  selector: 'app-employe-dashboard',
  templateUrl: './employe-dashboard.component.html',
  styleUrls: ['./employe-dashboard.component.scss']
})
export class EmployeDashboardComponent implements OnInit {
  
  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
   TODAY_STR = new Date().toISOString().replace(/T.*$/, '');
  initialEvents:EventInput[] = [ ];
  todayDate:any;
  Events: any[] = [];
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth'
    }, customButtons: {
      next: {
          click: this.nextMonth.bind(this),
      },
      prev: {
          click: this.prevMonth.bind(this),
      },
      today: {
  
          click: this.currentMonth.bind(this),
      },
  },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    
  };
  pipe = new DatePipe('en-US');
  userSession: any;
  attendanceData:any;
  selectedDate: any;
  calendarApi: any;

  constructor(private attendanceService:AttendanceService,private router:Router) { }

  ngOnInit(): void {
    this.selectedDate = this.pipe.transform(Date.now(), 'yyyy-MM-dd');
   this.todayDate= this.pipe.transform(Date.now(), 'dd/MM/yyyy');
    this.userSession = JSON.parse(sessionStorage.getItem('user') ?? '');
    this.getemployeeattendancedashboard();
  }
  getemployeeattendancedashboard(){
   // this.selectedDate = this.pipe.transform(Date.now(), 'yyyy-MM-dd');
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
  onRequestClick(elment:RequestData){
  
    this.router.navigate(["/Attendance/Request"],{state: {userData:elment}}); 
  }
  nextMonth(): void {
    this.calendarApi = this.calendarComponent.getApi();
    this.calendarApi.next();
    const currentDate = this.calendarApi.getDate();
    this.selectedDate = this.pipe.transform(currentDate, 'yyyy-MM-dd');
    this.getemployeeattendancedashboard()
}
prevMonth(): void {
  this.calendarApi = this.calendarComponent.getApi();
  this.calendarApi.prev();
  const currentDate = this.calendarApi.getDate();
  this.selectedDate = this.pipe.transform(currentDate, 'yyyy-MM-dd');
  this.getemployeeattendancedashboard()
}
currentMonth(): void {
  this.calendarApi = this.calendarComponent.getApi();
  this.calendarApi.today();
  const currentDate = this.calendarApi.getDate();
  this.selectedDate = this.pipe.transform(currentDate, 'yyyy-MM-dd');
  this.getemployeeattendancedashboard()
}
}
