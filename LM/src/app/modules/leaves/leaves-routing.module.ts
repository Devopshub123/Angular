import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PendingApprovalsComponent} from "./pages/pending-approvals/pending-approvals.component";
import {MainComponent} from "../../pages/main/main.component";
import {ManagerReviewAndApprovalsComponent} from "./pages/manager-review-and-approvals/manager-review-and-approvals.component";
import {ManagerDashboardComponent} from "./pages/manager-dashboard/manager-dashboard.component";
import {PendingCompoffComponent} from "./pages/pending-compoff/pending-compoff.component";
import {LeaveHistoryComponent} from "./pages/leave-history/leave-history.component";
import {CompOffHistoryComponent} from "./pages/comp-off-history/comp-off-history.component";
import {DetailedReportForManagerComponent} from "./pages/detailed-report-for-manager/detailed-report-for-manager.component";
import {SummaryReportForManagerComponent} from "./pages/summary-report-for-manager/summary-report-for-manager.component";
import { UserLeaveHistoryComponent } from './pages/user-leave-history/user-leave-history.component';
import { UserLeaveBalanceComponent } from './pages/user-leave-balance/user-leave-balance.component';
import {ManagerDashboardCalenderComponent} from "./pages/manager-dashboard-calender/manager-dashboard-calender.component";
import { UserCompoffComponent } from './pages/user-compoff/user-compoff.component';
import {EditProfileComponent} from "./pages/edit-profile/edit-profile.component";
import {LeavesForCancellationComponent} from "./pages/leaves-for-cancellation/leaves-for-cancellation.component";
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import {UserLeaveRequestComponent} from "./pages/user-leave-request/user-leave-request.component";
const routes: Routes = [
  {path:'',component:MainComponent,children:[
      {path:'PendingApprovals',component:PendingApprovalsComponent},
      {path:'ReviewAndApprovals',component:ManagerReviewAndApprovalsComponent},
      {path:"ManagerDashboard",component:ManagerDashboardComponent},
      {path:"PendingCompoff",component:PendingCompoffComponent},
      {path:"LeaveHistory",component:LeaveHistoryComponent},
      {path:"CompOffHistory",component:CompOffHistoryComponent},
      {path:'DetailedReport',component:DetailedReportForManagerComponent},
      {path:'SummaryReport',component:SummaryReportForManagerComponent},
      {path:'UserLeaveHistory',component:UserLeaveHistoryComponent},
      {path:'UserLeaveBalance',component:UserLeaveBalanceComponent},
      {path:'UserCompOff',component:UserCompoffComponent},
      {path:"ManagerDashboardCalender",component:ManagerDashboardCalenderComponent},
      {path:'EditProfile',component:EditProfileComponent},
      {path:"LeavesForCancellation",component:LeavesForCancellationComponent},
      {path:'UserDashboard',component:UserDashboardComponent},
      {path:"ManagerDashboardCalender",component:ManagerDashboardCalenderComponent},
      {path:"LeaveRequest",component:UserLeaveRequestComponent}
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeavesRoutingModule { }
