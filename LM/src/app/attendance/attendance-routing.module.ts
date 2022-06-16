import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprovalAttendanceListComponent } from './approval-attendance-list/approval-attendance-list.component';
import { ApprovalAttendanceComponent } from './approval-attendance/approval-attendance.component';
import { AttendanceRequestBehalfComponent } from './attendance-request-behalf/attendance-request-behalf.component';
import { AttendanceRequestComponent } from './attendance-request/attendance-request.component';
import { AttendanceUploadexcelComponent } from './attendance-uploadexcel/attendance-uploadexcel.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { EmployeDashboardComponent } from './employe-dashboard/employe-dashboard.component';
import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component';

const routes: Routes = [
  {path:'',component:AttendanceComponent},
  {path:'Approval',component:ApprovalAttendanceComponent},
  {path:'ApprovalList',component:ApprovalAttendanceListComponent},
  {path:'AttendanceRequest',component:AttendanceRequestComponent},
  {path: 'AttendanceBehalfRequest',component:AttendanceRequestBehalfComponent},
  {path:'EmployeeDashboard',component:EmployeDashboardComponent},
  {path:'ManagerDashboard',component:ManagerDashboardComponent},
  {path:'uploadExcel',component:AttendanceUploadexcelComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule { }
