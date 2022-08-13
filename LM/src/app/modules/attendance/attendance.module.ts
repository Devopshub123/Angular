import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AttendanceRoutingModule } from './attendance-routing.module';
import { ApprovalAttendanceComponent } from './pages/approval-attendance/approval-attendance.component';
import { EmployeDashboardComponent } from './pages/employe-dashboard/employe-dashboard.component';
import { ManagerDashboardComponent } from './pages/manager-dashboard/manager-dashboard.component';
import { MaterialModule } from '../../material/material.module';
import { AttendanceUploadexcelComponent } from './pages/attendance-uploadexcel/attendance-uploadexcel.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular'; 
 import dayGridPlugin from '@fullcalendar/daygrid'; 
 import interactionPlugin from '@fullcalendar/interaction'; 
import { FlexLayoutModule } from '@angular/flex-layout';
import { DialogComponent } from './dialog/dialog.component';
import { ApprovalAttendanceListComponent } from './pages/approval-attendance-list/approval-attendance-list.component';
import { AttendanceRequestBehalfComponent } from './pages/attendance-request-behalf/attendance-request-behalf.component';
import { AttendanceRequestComponent } from './pages/attendance-request/attendance-request.component';
import { ShiftConfigureComponent } from './pages/shift-configure/shift-configure.component';
import { ApprovalHistoryComponent } from './pages/approval-history/approval-history.component';

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
    AttendanceUploadexcelComponent,
    DialogComponent,
    ShiftConfigureComponent,
    ApprovalHistoryComponent
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
