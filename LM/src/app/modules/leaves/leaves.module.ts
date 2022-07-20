import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeavesRoutingModule } from './leaves-routing.module';
import {PendingApprovalsComponent} from "./pages/pending-approvals/pending-approvals.component";
import {MaterialModule} from "../../material/material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FlexLayoutModule} from "@angular/flex-layout";
import { ManagerReviewAndApprovalsComponent } from './pages/manager-review-and-approvals/manager-review-and-approvals.component';
import { ReviewAndApprovalsComponent } from './dialog/review-and-approvals/review-and-approvals.component';
import { ManagerDashboardComponent } from './pages/manager-dashboard/manager-dashboard.component';
import { ConfirmationComponent } from './dialog/confirmation/confirmation.component';
import { PendingCompoffComponent } from './pages/pending-compoff/pending-compoff.component';
// import { UserLeavesComponent } from './pages/user-leaves/user-leaves.component';
import { EmployeeLeavesListComponent } from './pages/employee-leaves-list/employee-leaves-list.component';
import { LeaveHistoryComponent } from './pages/leave-history/leave-history.component';
import { CompOffHistoryComponent } from './pages/comp-off-history/comp-off-history.component';
import { DetailedReportForManagerComponent } from './pages/detailed-report-for-manager/detailed-report-for-manager.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { UserLeaveHistoryComponent } from './user-leave-history/user-leave-history.component';
import { UserLeaveBalanceComponent } from './user-leave-balance/user-leave-balance.component';


@NgModule({
  declarations: [
    PendingApprovalsComponent,
    ManagerReviewAndApprovalsComponent,
    ReviewAndApprovalsComponent,
    ManagerDashboardComponent,
    ConfirmationComponent,
    PendingCompoffComponent,
    EmployeeLeavesListComponent,
    LeaveHistoryComponent,
    CompOffHistoryComponent,
    DetailedReportForManagerComponent,
    UserLeaveHistoryComponent,
    UserLeaveBalanceComponent,
  ],
  imports: [
    CommonModule,
    LeavesRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    NgxPaginationModule,
  ]
})
export class LeavesModule { }
