import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprovalAttendanceComponent } from './pages/approval-attendance/approval-attendance.component';
import { AttendanceUploadexcelComponent } from './pages/attendance-uploadexcel/attendance-uploadexcel.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { EmployeDashboardComponent } from './pages/employe-dashboard/employe-dashboard.component';
import { ManagerDashboardComponent } from './pages/manager-dashboard/manager-dashboard.component';
import { ApprovalAttendanceListComponent } from './pages/approval-attendance-list/approval-attendance-list.component';
import { AttendanceRequestBehalfComponent } from './pages/attendance-request-behalf/attendance-request-behalf.component';
import { AttendanceRequestComponent } from './pages/attendance-request/attendance-request.component';
import { MainComponent } from 'src/app/pages/main/main.component';

const routes: Routes = [
  {
    path: '', component: MainComponent,
    children: [
      // {path:'',component:AttendanceComponent},
      { path: 'Approval', component: ApprovalAttendanceComponent },
      { path: 'ApprovalList', component: ApprovalAttendanceListComponent },
      { path: 'Request', component: AttendanceRequestComponent },
      { path: 'RequestofEmployee', component: AttendanceRequestBehalfComponent },
      { path: 'EmployeeDashboard', component: EmployeDashboardComponent },
      { path: 'ManagerDashboard', component: ManagerDashboardComponent },
      { path: 'uploadExcel', component: AttendanceUploadexcelComponent },
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule { }
