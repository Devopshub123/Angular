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

const routes: Routes = [
  {path:'',component:MainComponent,children:[
      {path:'PendingApprovals',component:PendingApprovalsComponent},
      {path:'ReviewAndApprovals',component:ManagerReviewAndApprovalsComponent},
      {path:"ManagerDashboard",component:ManagerDashboardComponent},
      {path:"PendingCompoff",component:PendingCompoffComponent},
      {path:"LeaveHistory",component:LeaveHistoryComponent},
      {path:"CompOffHistory",component:CompOffHistoryComponent},
      {path:'DetailedReport',component:DetailedReportForManagerComponent}

    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeavesRoutingModule { }
