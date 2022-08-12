import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { CalendarOptions, EventInput, FullCalendarComponent } from '@fullcalendar/angular'; // useful for typechecking
import { FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // a plugin!
import { AttendanceService } from '../../attendance.service';
import { UserData } from '../../models/EmployeeData';
import { RequestData } from '../../models/Request';

@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss']
})
export class ManagerDashboardComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;
  // references the #calendar in the template
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  TODAY_STR = new Date().toISOString().replace(/T.*$/, '');
  initialEvents: EventInput[] = [];
  todayDate: any;
  Events: any[] = [];
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev',
      center: 'title',
       right: 'next'
    },
    customButtons: {
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
  attendanceData: any;
  notificationsData:any;
  selectedDate: any;
  arrayList: any;
  displayEvent: any;
  calendarApi: any;

  constructor(private attendanceService: AttendanceService, private router: Router) { }
  currentDate = new Date();
  ngOnInit(): void {
    this.selectedDate = this.pipe.transform(Date.now(), 'yyyy-MM-dd');
    this.todayDate = this.pipe.transform(Date.now(), 'dd/MM/yyyy');
    this.userSession = JSON.parse(sessionStorage.getItem('user') ?? '');
    this.getemployeeattendancedashboard();
    this.getEmployeeAttendanceNotifications();
    this.getPendingAttendanceRequestListByEmpId();
  }
  getemployeeattendancedashboard() {
    // this.selectedDate = this.pipe.transform(Date.now(), 'yyyy-MM-dd');
    let data = {
      'manager_id': this.userSession.id,
      'employee_id': this.userSession.id,
      'date': this.selectedDate
    }
    this.attendanceService.getemployeeattendancedashboard(data).subscribe((res: any) => {
      if (res.status) {
        this.attendanceData = res.data;
        this.attendanceData.forEach((e: any) => {
          let item =
          {
            title: e.empname,
          //  start: e.attendancedate, ///new Date(e.attendancedate).toISOString().replace(/T.*$/, ''),
          start:e.firstlogintime !=''? e.firstlogintime : new Date(e.attendancedate), ///new Date(e.attendancedate).toISOString().replace(/T.*$/, ''),
        //  end:e.lastlogouttime !=''? e.lastlogouttime : e.attendancedate,  
          color: e.present_or_absent == 'P' ? '#32cd32' : '#FF3131',
            icon: e.present_or_absent == 'P' ? 'fa-check-circle' : 'fa-times-circle'
          }
          this.initialEvents.push(item);
        });
        this.calendarOptions.events = this.initialEvents;

      }

    })
  }
  getEmployeeAttendanceNotifications() {
    // this.selectedDate = this.pipe.transform(Date.now(), 'yyyy-MM-dd');
    let data = {
      'manager_id': this.userSession.id,
      'employee_id': this.userSession.id,
      'date': this.selectedDate
    }
    this.attendanceService.getEmployeeAttendanceNotifications(data).subscribe((res: any) => {
      this.notificationsData=[];
      if (res.status) {
        this.notificationsData = res.data;
        }


    })
  }
  getPendingAttendanceRequestListByEmpId() {
    this.arrayList = [];
    this.attendanceService.getPendingAttendanceListByManagerEmpId(this.userSession.id).subscribe((res:any) => {
      if (res.status) {
        this.arrayList = res.data;

      } else {
        this.arrayList = [];

      }
    })
  };
  changeTab(elment: UserData) {
    this.router.navigate(["/Attendance/Approval"], { state: { userData: elment ,url:'ManagerDashboard' } });
  }
  onBehalfofRequestClick(elment: RequestData) {

    this.router.navigate(["/Attendance/RequestofEmployee"], { state: { userData: elment,url:'ManagerDashboard' } });
  }
  nextMonth(): void {
    this.calendarApi = this.calendarComponent.getApi();
    this.calendarApi.next();
    const selectDate = this.calendarApi.getDate();
    if (selectDate.getTime() <= this.currentDate.getTime()) {
      this.selectedDate = this.pipe.transform(selectDate, 'yyyy-MM-dd');
      this.getemployeeattendancedashboard();
      this.getEmployeeAttendanceNotifications();
    } else {
      this.attendanceData = [];
      this.notificationsData=[];
      this.initialEvents = [];
      this.calendarOptions.events = this.initialEvents;
    }

  }
  prevMonth(): void {
    this.calendarApi = this.calendarComponent.getApi();
    this.calendarApi.prev();
    const selectDate = this.calendarApi.getDate();
    if (selectDate.getTime() <= this.currentDate.getTime()) {
      this.selectedDate = this.pipe.transform(selectDate, 'yyyy-MM-dd');
      this.getemployeeattendancedashboard();
      this.getEmployeeAttendanceNotifications();
    } else {
      this.attendanceData = [];
      this.notificationsData=[];
      this.initialEvents = [];
      this.calendarOptions.events = this.initialEvents;
    }
  }
  currentMonth(): void {
    this.calendarApi = this.calendarComponent.getApi();
    this.calendarApi.today();
    const currentDate = this.calendarApi.getDate();
    this.selectedDate = this.pipe.transform(currentDate, 'yyyy-MM-dd');
    this.getemployeeattendancedashboard()
    this.getEmployeeAttendanceNotifications();
  }
}