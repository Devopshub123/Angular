import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PendingApprovalsComponent} from "../leaves/pages/pending-approvals/pending-approvals.component";
import {MainComponent} from "../../pages/main/main.component";

const routes: Routes = [
  {path:'',component:MainComponent,children:[
      {path:'PendingApprovalsComponent',component:PendingApprovalsComponent},
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeavesRoutingModule { }
