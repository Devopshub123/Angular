import {Component, OnInit, ViewChild} from '@angular/core';
import {LeavesService} from "../../leaves.service";
import { CalendarOptions, EventInput, FullCalendarComponent } from '@fullcalendar/angular';
import {DatePipe} from "@angular/common";
import {NgxSpinnerService} from "ngx-spinner"; // useful for typechecking


@Component({
  selector: 'app-manager-dashboard-calender',
  templateUrl: './manager-dashboard-calender.component.html',
  styleUrls: ['./manager-dashboard-calender.component.scss']
})
export class ManagerDashboardCalenderComponent implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  calendarApi:any;
  selectedDate:any;
  arrayList:any  = [];
  userSession:any=[];
  pipe = new DatePipe('en-US');

  // initialEvents:any=[];
  initialEvents: EventInput[] = [];
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
    height:450,
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,

  };
  // calendarOptions:any=[];
  constructor(private LM:LeavesService,public spinner :NgxSpinnerService) { }
  currentDate = new Date();


  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.getLeaveCalendarForManager();

  }
  getLeaveCalendarForManager(){
    this.arrayList= [];
    this.LM.getLeaveCalendarForManager(this.userSession.id).subscribe((res: any) => {
      console.log("jnkjsadkj",res)
      if (res.status) {
        this.arrayList = res.data;
        this.arrayList.forEach((e: any) => {
          let item =
            {
              title: e.ename,
              start: e.edate, ///new Date(e.attendancedate).toISOString().replace(/T.*$/, ''),
              color:e.color,
              icon:'fa-times-circle'
              // color: e.present_or_absent == 'P' ? '#32cd32' : '#FF3131',
              // icon: e.present_or_absent == 'P' ? 'fa-check-circle' : 'fa-times-circle'
            }
          this.initialEvents.push(item);
        });
        this.calendarOptions.events = this.initialEvents;

      }
    })

    }

  nextMonth(): void {
    this.spinner.show()

    this.calendarApi = this.calendarComponent.getApi();
    this.calendarApi.next();
    this.spinner.hide()

    // const selectDate = this.calendarApi.getDate();
    // console.log("ksjdk",selectDate)
    // if (selectDate.getTime() <= this.currentDate.getTime()) {
    //   // this.getLeaveCalendarForManager();
    // } else {
    //   this.arrayList = [];
    //   this.initialEvents = [];
    //   this.calendarOptions.events = this.initialEvents;
    // }

  }
  prevMonth(): void {
    this.calendarApi = this.calendarComponent.getApi();
    this.calendarApi.prev();
    // const selectDate = this.calendarApi.getDate();
    // if (selectDate.getTime() <= this.currentDate.getTime()) {
    //   this.getLeaveCalendarForManager();
    // } else {
    //   this.arrayList = [];
    //   this.initialEvents = [];
    //   this.calendarOptions.events = this.initialEvents;
    // }
  }
  currentMonth(): void {
    this.calendarApi = this.calendarComponent.getApi();
    this.calendarApi.today();
    // const currentDate = this.calendarApi.getDate();
    // this.selectedDate = this.pipe.transform(currentDate, 'yyyy-MM-dd');
    // this.getLeaveCalendarForManager()
  }

}
