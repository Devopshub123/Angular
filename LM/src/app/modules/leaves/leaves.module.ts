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
import { EmployeeLeavesListComponent } from './pages/employee-leaves-list/employee-leaves-list.component';
import { LeaveHistoryComponent } from './pages/leave-history/leave-history.component';
import { CompOffHistoryComponent } from './pages/comp-off-history/comp-off-history.component';
import { DetailedReportForManagerComponent } from './pages/detailed-report-for-manager/detailed-report-for-manager.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { SummaryReportForManagerComponent } from './pages/summary-report-for-manager/summary-report-for-manager.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { UserLeaveHistoryComponent } from './user-leave-history/user-leave-history.component';
import { UserLeaveBalanceComponent } from './user-leave-balance/user-leave-balance.component';
import { ManagerDashboardCalenderComponent } from './pages/manager-dashboard-calender/manager-dashboard-calender.component';
import {FullCalendarModule} from "@fullcalendar/angular";
import { UserCompoffComponent } from './pages/user-compoff/user-compoff.component';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { LeavesForCancellationComponent } from './pages/leaves-for-cancellation/leaves-for-cancellation.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { UserLeaveRequestComponent } from './pages/user-leave-request/user-leave-request.component';
import { MatCheckboxModule } from '@angular/material/checkbox';


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
    SummaryReportForManagerComponent,
    UserLeaveHistoryComponent,
    UserLeaveBalanceComponent,
    UserCompoffComponent,
    ManagerDashboardCalenderComponent,
    EditProfileComponent,
    NotificationsComponent,
    LeavesForCancellationComponent,
    UserDashboardComponent,
    UserLeaveRequestComponent
  ],
  imports: [
    CommonModule,
    LeavesRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    FullCalendarModule,
    MatCheckboxModule
  ]
})
export class LeavesModule { }
