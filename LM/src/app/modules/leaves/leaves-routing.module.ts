import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PendingApprovalsComponent} from "../leaves/pages/pending-approvals/pending-approvals.component";
import {MainComponent} from "../../pages/main/main.component";
import {ManagerReviewAndApprovalsComponent} from "./pages/manager-review-and-approvals/manager-review-and-approvals.component";

const routes: Routes = [
  {path:'',component:MainComponent,children:[
      {path:'PendingApprovals',component:PendingApprovalsComponent},
      {path:'ReviewAndApprovals',component:ManagerReviewAndApprovalsComponent},
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeavesRoutingModule { }
