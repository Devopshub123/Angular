import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AttendanceRoutingModule } from './attendance-routing.module';
import { ApprovalAttendanceListComponent } from './approval-attendance-list/approval-attendance-list.component';
import { ApprovalAttendanceComponent } from './approval-attendance/approval-attendance.component';
import { AttendanceRequestComponent } from './attendance-request/attendance-request.component';
import { AttendanceRequestBehalfComponent } from './attendance-request-behalf/attendance-request-behalf.component';
import { EmployeDashboardComponent } from './employe-dashboard/employe-dashboard.component';
import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { MaterialModule } from '../material/material.module';
import { AttendanceUploadexcelComponent } from './attendance-uploadexcel/attendance-uploadexcel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular'; 
 import dayGridPlugin from '@fullcalendar/daygrid'; 
 import interactionPlugin from '@fullcalendar/interaction'; 
import { FlexLayoutModule } from '@angular/flex-layout';
import { DialogComponent } from './dialog/dialog.component';
 FullCalendarModule.registerPlugins([ 
  dayGridPlugin,
  interactionPlugin
]);

@NgModule({
  declarations: [
    ApprovalAttendanceListComponent,
    ApprovalAttendanceComponent,
    AttendanceRequestComponent,
    AttendanceRequestBehalfComponent,
    EmployeDashboardComponent,
    ManagerDashboardComponent,
    AttendanceComponent,
    AttendanceUploadexcelComponent,
    DialogComponent
  ],
  imports: [
    CommonModule,
    AttendanceRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule,
    FlexLayoutModule,
  ],
  providers:[DatePipe]
})
export class AttendanceModule { }
