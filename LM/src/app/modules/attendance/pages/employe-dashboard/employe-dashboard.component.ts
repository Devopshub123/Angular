import { ChangeDetectorRef, Component, OnInit, ViewChild,ElementRef,Renderer2 } from '@angular/core';
import { CalendarOptions, EventInput, FullCalendarComponent } from '@fullcalendar/angular'; // useful for typechecking
import { AttendanceService } from '../../attendance.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { RequestData } from '../../models/Request';
import { MediaMatcher } from '@angular/cdk/layout';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-employe-dashboard',
  templateUrl: './employe-dashboard.component.html',
  styleUrls: ['./employe-dashboard.component.scss']
})
export class EmployeDashboardComponent implements OnInit {

  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;
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
    }, customButtons: {
      next: {
        click: this.nextMonth.bind(this),
      },
      prev: {
        click: this.prevMonth.bind(this),
      },

      // today: {

      //     click: this.currentMonth.bind(this),
      // },
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    height:'auto'
  };

  pipe = new DatePipe('en-US');
  userSession: any;
  attendanceData: any;
  selectedDate: any;
  calendarApi: any;
  notificationsData: any = [];
  shiftDetails: any;
  currentShift = "";
  currentShiftStartTime = "";
  currentShiftendTime = "";
  mobileQuery!: MediaQueryList;
  private _mobileQueryListener: () => void;
  currentShiftStartDate: any;
  currentShiftendDate: any;
  sampleElement: any;
  calendarCount: any = [];
  constructor(
    private attendanceService: AttendanceService,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    private router: Router, private element: ElementRef,
    private renderer: Renderer2,private spinner: NgxSpinnerService,) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  firstIn: any = '00:00';
  lastOut: any = '00:00';
  currentDate = new Date();
  ngOnInit(): void {
   this.selectedDate = this.pipe.transform(Date.now(), 'yyyy-MM-dd');
    this.todayDate = this.pipe.transform(Date.now(), 'dd-MM-yyyy');
    this.userSession = JSON.parse(sessionStorage.getItem('user') ?? '');
    this.getemployeeattendancedashboard();
    this.getEmployeeAttendanceNotifications();
    this.getEmployeeCurrentShifts();
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  getEmployeeCurrentShifts() {
    let data = {
      "employee_id": this.userSession.id,
    }
    this.attendanceService.getEmployeeCurrentShifts(data).subscribe((res: any) => {
      if (res.status) {
        this.shiftDetails = res.data;
        // this.currentShift = this.shiftDetails.shiftname;
        // this.currentShiftStartDate = this.shiftDetails.fromdate;
        // this.currentShiftendDate = this.shiftDetails.todate;
        // this.currentShiftStartTime = this.shiftDetails.fromtime;
        // this.currentShiftendTime = this.shiftDetails.totime;
      }
    });
  }
  getemployeeattendancedashboard() {
    this.showSpinner();
   let data = {
      'manager_id': null,
      'employee_id': this.userSession.id,
      'date': this.selectedDate
    }
    this.attendanceService.getemployeeattendancedashboard(data).subscribe((res: any) => {
      if (res.status) {
        this.attendanceData = res.data;
        this.initialEvents=[];
        this.attendanceData.forEach((e: any) => {

          let currentDate = this.pipe.transform(Date.now(), 'yyyy-MM-dd');
          let selectDate = this.pipe.transform(e.attendancedate, 'yyyy-MM-dd');
          if (currentDate == selectDate) {
            this.firstIn = this.pipe.transform(e.firstlogintime, 'shortTime');
            this.lastOut = this.pipe.transform(e.lastlogouttime, 'shortTime');
          }
          let color;
          if(e.present_or_absent=='P'){
            color='#32cd32';
          }else if(e.present_or_absent=='W'){
            color='#2e0cf3';
          }else if(e.present_or_absent=='A'){
            color='#FF3131';
          } else if(e.present_or_absent=='H'){
            // color='#ffff00';
            color='#800000'
          }else if(e.present_or_absent=='L'){
            color='#FF8C00';
          }

          let item =
          {
            title: e.present_or_absent,
            start: e.attendancedate,
        //   start: e.present_or_absent == 'P'?e.firstlogintime !=''? e.firstlogintime : new Date(e.attendancedate): e.attendancedate, ///new Date(e.attendancedate).toISOString().replace(/T.*$/, ''),
           // start: e.firstlogintime != '' ? e.firstlogintime : new Date(e.attendancedate),
            // end:e.lastlogouttime !=''? e.lastlogouttime : e.attendancedate,
            color:color,      //e.isweekoff == null ? e.present_or_absent == 'P' ? '#32cd32' : '#FF3131' : '#2e0cf3',
            icon: e.present_or_absent == 'P' ? 'fa-check-circle' : 'fa-times-circle'
          }
          this.initialEvents.push(item);
        });
 this.calendarOptions.events = this.initialEvents;
 //  this.calendarCountViewNoMore();
 this.spinner.hide();
      }

    })
  }
  getEmployeeAttendanceNotifications() {
    let data = {
      'manager_id': null,
      'employee_id': this.userSession.id,
      'date': this.selectedDate
    }
    this.attendanceService.getEmployeeAttendanceNotifications(data).subscribe((res: any) => {
      this.notificationsData = [];
      if (res.status) {
        this.notificationsData = res.data;
      }


    })
  }
  onRequestClick(elment: RequestData) {

    this.router.navigate(["/Attendance/Request"], { state: { userData: elment } });
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
      this.notificationsData = [];
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
      this.notificationsData = [];
      this.initialEvents = [];
      this.calendarOptions.events = this.initialEvents;
    }
  }
  currentMonth(): void {
    this.calendarApi = this.calendarComponent.getApi();
    this.calendarApi.today();
    const currentDate = this.calendarApi.getDate();
    this.selectedDate = this.pipe.transform(currentDate, 'yyyy-MM-dd');
    this.getemployeeattendancedashboard();
    this.getEmployeeAttendanceNotifications();
  }
  calendarCountViewNoMore() {
    setTimeout(() => {

      this.sampleElement = (<HTMLElement>this.element.nativeElement).querySelectorAll('.fc-daygrid-more-link');
      var closeElement = (<HTMLElement>this.element.nativeElement).querySelectorAll('.fc-daygrid-more-link.fc-more-link');
      for(var j=0;j<this.sampleElement.length;j++)
      {
        this.calendarCount[j] = this.sampleElement[j].innerHTML.substring(0, this.sampleElement[j].innerHTML.length - 4)
        this.sampleElement[j].innerHTML =  this.calendarCount[j];
      }

      for(var k=0;k<closeElement.length;k++) {
        if (closeElement[k] != null) {
          this.renderer.listen(closeElement[k], 'click', () => {
            this.closePopUpOver();
          });
        }
      }

    }, 1000);
  }
  closePopUpOver(){
    var openElement = (<HTMLElement>this.element.nativeElement).querySelectorAll('.fc-popover-close.fc-icon.fc-icon-x');
    setTimeout(() => {
      for(var k=0;k<openElement.length;k++) {
        this.renderer.listen(openElement[k], 'click', () => {
          this.sampleElement = (<HTMLElement>this.element.nativeElement).querySelectorAll('.fc-daygrid-more-link');
          for (var j = 0; j < this.sampleElement.length; j++) {
            this.sampleElement[j].innerHTML = this.calendarCount[j];
          }
        });
      }
    }, 500);
  }
 showSpinner(){
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 5000);
  }
}
