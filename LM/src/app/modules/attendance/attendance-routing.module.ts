import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprovalAttendanceComponent } from './pages/approval-attendance/approval-attendance.component';
import { AttendanceUploadexcelComponent } from './pages/attendance-uploadexcel/attendance-uploadexcel.component';
import { EmployeDashboardComponent } from './pages/employe-dashboard/employe-dashboard.component';
import { ManagerDashboardComponent } from './pages/manager-dashboard/manager-dashboard.component';
import { ApprovalAttendanceListComponent } from './pages/approval-attendance-list/approval-attendance-list.component';
import { AttendanceRequestBehalfComponent } from './pages/attendance-request-behalf/attendance-request-behalf.component';
import { AttendanceRequestComponent } from './pages/attendance-request/attendance-request.component';
import { MainComponent } from 'src/app/pages/main/main.component';
import {LMSAccessGuard} from  '../../LMS-access.guard';
import { ChangePasswordComponent } from '../../pages/change-password/change-password.component'
import { ShiftConfigureComponent } from './pages/shift-configure/shift-configure.component';
import { ApprovalHistoryComponent } from './pages/approval-history/approval-history.component';


const routes: Routes = [
  {
    path: '', component: MainComponent,
    children: [

      { path: 'Approval', component: ApprovalAttendanceComponent,canActivate:[LMSAccessGuard] },
      { path: 'ApprovalList', component: ApprovalAttendanceListComponent,canActivate:[LMSAccessGuard] },
      { path: 'Request', component: AttendanceRequestComponent ,canActivate:[LMSAccessGuard]},
      { path: 'RequestofEmployee', component: AttendanceRequestBehalfComponent ,canActivate:[LMSAccessGuard]},
      { path: 'EmployeeDashboard', component: EmployeDashboardComponent,canActivate:[LMSAccessGuard] },
      { path: 'ManagerDashboard', component: ManagerDashboardComponent,canActivate:[LMSAccessGuard]},
      { path: 'uploadExcel', component: AttendanceUploadexcelComponent,canActivate:[LMSAccessGuard] },
      { path: 'ChangePassword', component: ChangePasswordComponent,canActivate:[LMSAccessGuard] },
      { path: 'ShiftConfigure', component: ShiftConfigureComponent,canActivate:[LMSAccessGuard] },
      {path:'ApprovedHistory',component:ApprovalHistoryComponent,canActivate:[LMSAccessGuard]}
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AttendanceRoutingModule { }
