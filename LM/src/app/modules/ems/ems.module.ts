import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EMSRoutingModule } from './ems-routing.module';
import { NewhireComponent } from './pages/newhire/newhire.component';
import {MaterialModule} from "../../material/material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FlexLayoutModule} from "@angular/flex-layout";
import {FullCalendarModule} from "@fullcalendar/angular";
import { EmployeeInfoComponent } from './pages/employee-info/employee-info.component';
import { TerminateComponent } from './pages/terminate/terminate.component';
import { ResignationComponent } from './pages/resignation/resignation.component';
import { SettingsOffBoardingComponent } from './pages/settings-off-boarding/settings-off-boarding.component';
import { SettingsOnBoardingComponent } from './pages/settings-on-boarding/settings-on-boarding.component';
import { SettingsAddChecklistComponent } from './pages/settings-add-checklist/settings-add-checklist.component';
import { EmployeereportComponent } from './reports/employeereport/employeereport.component';
import { HrResignationComponent } from './pages/hr-resignation-checklist/hr-resignation.component';
import { EmployeeDirectoryComponent } from './pages/employee-directory/employee-directory.component';
import { EmployeeDashboardComponent } from './pages/employee-dashboard/employee-dashboard.component';
import { HrOnboardingComponent } from './pages/hr-onboarding-checklist/hr-onboarding.component';
import { HrOnboardingChecklistComponent } from './pages/manager-onboarding-checklist/hr-onboarding-checklist.component';
import { HrOffboardingChecklistComponent } from './pages/manager-termination-checklist/hr-offboarding-checklist.component';
import { ChecklistMeetComponent } from './pages/induction-program-schedules/checklist-meet.component';
import { HrOffboardingChecklistoverviewComponent } from './pages/hr-termination-checklist/hr-offboarding-checklistoverview.component';
import { AnnouncementsComponent } from './pages/announcements/announcements.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AssignChecklistComponent } from './pages/assign-checklist/assign-checklist.component';
import { HrDocumentApprovalComponent } from './pages/hr-document-approval/hr-document-approval.component';
import { HrPendingApprovalsComponent } from './pages/hr-resignation-approvals/hr-pending-approvals.component';
import { ConfigureDocumentsComponent } from './pages/configure-documents/configure-documents.component';
import { ReusePopupComponent } from './pages/reuse-popup/reuse-popup.component';
import { EmsMessagemasterComponent } from './pages/ems-messagemaster/ems-messagemaster.component';
import { EmployeeChecklistComponent } from './pages/employee-checklist/employee-checklist.component';
import { EmployeeProfileComponent } from './pages/employee-profile/employee-profile.component';
import { NgChartsModule } from 'ng2-charts';
import 'chartjs-adapter-date-fns';
import { InductionComponent } from './pages/induction-master/induction.component';
import { UsersLoginComponent } from './pages/users-login/users-login.component';
import { NewHireListComponent } from './pages/new-hire-list/new-hire-list.component';
import { ReportpopupComponent } from './pages/reportpopup/reportpopup.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DeptResignationPendingchecklistComponent } from './pages/manager-resignation-checklist/dept-resignation-pendingchecklist.component';
import { InductionConductedByMasterComponent } from './pages/induction-conducted-by-master/induction-conducted-by-master.component';

@NgModule({
  declarations: [
    NewhireComponent,
    EmployeeInfoComponent,
    TerminateComponent,
    ResignationComponent,
    SettingsOffBoardingComponent,
    SettingsOnBoardingComponent,
    SettingsAddChecklistComponent,
    EmployeereportComponent,
    HrResignationComponent,
    EmployeeDirectoryComponent,
    EmployeeDashboardComponent,
    HrOnboardingComponent,
    HrOnboardingChecklistComponent,
    HrOffboardingChecklistComponent,
    ChecklistMeetComponent,
    HrOffboardingChecklistoverviewComponent,
    AnnouncementsComponent,
    AssignChecklistComponent,
    HrDocumentApprovalComponent,
    HrPendingApprovalsComponent,
    ConfigureDocumentsComponent,
    ReusePopupComponent,
    EmsMessagemasterComponent,
    EmployeeChecklistComponent,
    EmployeeProfileComponent,
    InductionComponent,
    UsersLoginComponent,
    NewHireListComponent,
    ReportpopupComponent,
    DeptResignationPendingchecklistComponent,
    InductionConductedByMasterComponent,
  ],
  imports: [
    CommonModule,
    EMSRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule,
    FlexLayoutModule,
    AngularEditorModule,
    NgChartsModule,
    NgxSpinnerModule
  ]
})
export class EMSModule { }
