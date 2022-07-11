import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PendingApprovalsComponent} from "./pages/pending-approvals/pending-approvals.component";
import {MainComponent} from "../../pages/main/main.component";
import {ManagerReviewAndApprovalsComponent} from "./pages/manager-review-and-approvals/manager-review-and-approvals.component";
import {ManagerDashboardComponent} from "./pages/manager-dashboard/manager-dashboard.component";
import {PendingCompoffComponent} from "./pages/pending-compoff/pending-compoff.component";

const routes: Routes = [
  {path:'',component:MainComponent,children:[
      {path:'PendingApprovals',component:PendingApprovalsComponent},
      {path:'ReviewAndApprovals',component:ManagerReviewAndApprovalsComponent},
      {path:"ManagerDashboard",component:ManagerDashboardComponent},
      {path:"PendingCompoff",component:PendingCompoffComponent}
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeavesRoutingModule { }
