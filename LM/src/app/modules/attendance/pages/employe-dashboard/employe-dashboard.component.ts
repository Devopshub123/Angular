import { Component, OnInit } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/angular'; // useful for typechecking
import { MatDividerModule } from '@angular/material/divider';
@Component({
  selector: 'app-employe-dashboard',
  templateUrl: './employe-dashboard.component.html',
  styleUrls: ['./employe-dashboard.component.scss']
})
export class EmployeDashboardComponent implements OnInit {
  // calendarOptions: CalendarOptions = {
  //   initialView: 'dayGridMonth',
  // //  dateClick: this.handleDateClick.bind(this), // bind is important!
  //   events: [
  //     {
  //       title: 'Present',
  //       start: '2020-06-12T10:30:00',
  //       end: '2020-06-12T11:00:00',
  //     },
  //     { title: 'event 1', date: '2020-06-15' },
  //     { title: 'event 2', date: '2020-06-30' }
  //   ]
  // };
  // handleDateClick(arg:any) {
  //   alert('date click! ' + arg.dateStr)
  // }
   TODAY_STR = new Date().toISOString().replace(/T.*$/, '');
  initialEvents:EventInput[] = [
    
      {
        title: 'Present',
        start: '2020-06-12T10:30:00',
        
      },
      {
        title: 'Present',
        start: '2020-06-13T10:30:00',
        
      },
      {
        title: 'Present',
        start: '2020-06-15T10:30:00',
        
      },
    
  ];
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth'
    },
    initialView: 'dayGridMonth',
    initialDate: '2020-06-07',
   initialEvents: this.initialEvents, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    eventColor: '#378006'

    // select: this.handleDateSelect.bind(this),
    // eventClick: this.handleEventClick.bind(this),
    // eventsSet: this.handleEvents.bind(this)
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };


  constructor() { }

  ngOnInit(): void {
  }

}
