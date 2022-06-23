import { Component, OnInit } from '@angular/core';

import { CalendarOptions, EventInput } from '@fullcalendar/angular'; // useful for typechecking
import { FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // a plugin!
@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss']
})
export class ManagerDashboardComponent implements OnInit {
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
