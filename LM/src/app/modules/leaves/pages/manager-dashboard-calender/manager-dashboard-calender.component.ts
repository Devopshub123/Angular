import { Tooltip } from 'chart.js';
import {Component, OnInit, ViewChild} from '@angular/core';
import {LeavesService} from "../../leaves.service";
import { CalendarOptions, EventInput, FullCalendarComponent,EventHoveringArg } from '@fullcalendar/angular';
import {DatePipe} from "@angular/common";
import {NgxSpinnerService} from "ngx-spinner"; // useful for typechecking
import { TooltipComponent } from '@angular/material/tooltip';
import {FormControl} from '@angular/forms';



@Component({
  selector: 'app-manager-dashboard-calender',
  templateUrl: './manager-dashboard-calender.component.html',
  styleUrls: ['./manager-dashboard-calender.component.scss']
})
export class ManagerDashboardCalenderComponent implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  calendarApi:any;
  color:any;
  selectedDate:any;
  arrayList:any  = [];
  userSession:any=[];
  pipe = new DatePipe('en-US');
  message :any=  '';
  // initialEvents:any=[];
  initialEvents: EventInput[] = [];
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev',
      center: 'title',
      right: 'next'
    },
    eventMouseEnter:this.eventClick.bind(this),
    eventMouseLeave:this.eventMouseLeave.bind(this),
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
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,

  };
  // calendarOptions:any=[];
  constructor(private LM:LeavesService,public spinner :NgxSpinnerService) {
  
   }
  currentDate = new Date();


  ngOnInit(): void {
      
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.getLeaveCalendarForManager();

  }
  getLeaveCalendarForManager(){
    this.arrayList= [];
    this.LM.getLeaveCalendarForManager(this.userSession.id).subscribe((res: any) => {
      if (res.status) {
        this.arrayList = res.data;
        this.arrayList.forEach((e: any) => {
          let item =
            {
              title: e.ename,
              start: e.edate, ///new Date(e.attendancedate).toISOString().replace(/T.*$/, ''),
              color:e.color,
              icon:'fa-times-circle',
              description:e.leave_name
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
 }
  prevMonth(): void {
    this.calendarApi = this.calendarComponent.getApi();
    this.calendarApi.prev();
  }
  currentMonth(): void {
    this.calendarApi = this.calendarComponent.getApi();
    this.calendarApi.today();
     }
     eventClick(clickInfo: EventHoveringArg) {
      this.message =  clickInfo.event.extendedProps.description;
      this.color = clickInfo.event._def.ui.backgroundColor;
// if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
//       // clickInfo.event.remove();
//       console.log("ldhkvjbjkfd",clickInfo.event.title) 

//     }
    
}
eventMouseLeave(clickInfo:any){
  this.message =  '';
}


}

