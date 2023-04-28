import { EmsMessagemasterComponent } from './pages/ems-messagemaster/ems-messagemaster.component';
import { ConfigureDocumentsComponent } from './pages/configure-documents/configure-documents.component';
import { HrPendingApprovalsComponent } from './pages/hr-resignation-approvals/hr-pending-approvals.component';
import { HrDocumentApprovalComponent } from './pages/hr-document-approval/hr-document-approval.component';
import { AssignChecklistComponent } from './pages/assign-checklist/assign-checklist.component';
import { AnnouncementsComponent } from './pages/announcements/announcements.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewhireComponent } from './pages/newhire/newhire.component';
import { MainComponent } from 'src/app/pages/main/main.component';
import { LMSAccessGuard } from 'src/app/LMS-access.guard';
import { TerminateComponent } from './pages/terminate/terminate.component';
import { ResignationComponent } from './pages/resignation/resignation.component';
import { EmployeeInfoComponent } from './pages/employee-info/employee-info.component';
import { SettingsAddChecklistComponent } from './pages/settings-add-checklist/settings-add-checklist.component';
import { SettingsOffBoardingComponent } from './pages/settings-off-boarding/settings-off-boarding.component';
import { SettingsOnBoardingComponent } from './pages/settings-on-boarding/settings-on-boarding.component';
import { EmployeereportComponent } from './reports/employeereport/employeereport.component';
import { HrResignationComponent } from './pages/hr-resignation-checklist/hr-resignation.component';
import { EmployeeDirectoryComponent } from './pages/employee-directory/employee-directory.component';
import { EmployeeDashboardComponent } from './pages/employee-dashboard/employee-dashboard.component';
import { HrOnboardingComponent } from './pages/hr-onboarding-checklist/hr-onboarding.component';
import { HrOnboardingChecklistComponent } from './pages/manager-onboarding-checklist/hr-onboarding-checklist.component';
import { HrOffboardingChecklistComponent } from './pages/manager-termination-checklist/hr-offboarding-checklist.component';
import { ChecklistMeetComponent } from './pages/induction-program-schedules/checklist-meet.component';
import { HrOffboardingChecklistoverviewComponent } from './pages/hr-termination-checklist/hr-offboarding-checklistoverview.component';
import { EmployeeChecklistComponent } from './pages/employee-checklist/employee-checklist.component';
import { EmployeeProfileComponent } from './pages/employee-profile/employee-profile.component';
import { InductionComponent } from './pages/induction-master/induction.component';
import { UsersLoginComponent } from './pages/users-login/users-login.component';
import { NewHireListComponent } from './pages/new-hire-list/new-hire-list.component';
import { DeptResignationPendingchecklistComponent } from './pages/manager-resignation-checklist/dept-resignation-pendingchecklist.component';

const routes: Routes = [
  {
    path: '', component: MainComponent,
    children: [

      { path: 'newHire', component: NewhireComponent,canActivate:[LMSAccessGuard] },
      { path: 'terminate', component: TerminateComponent,canActivate:[LMSAccessGuard] },
      { path: 'resignation',component:ResignationComponent,canActivate:[LMSAccessGuard]},
      { path: 'empInformation',component:EmployeeInfoComponent},
     // { path: 'settings-checklist',component:SettingsAddChecklistComponent,canActivate:[LMSAccessGuard]},
      //{ path: 'settings-offBoarding',component:SettingsOffBoardingComponent,canActivate:[LMSAccessGuard]},
      //{ path: 'settings-onBoarding',component:SettingsOnBoardingComponent,canActivate:[LMSAccessGuard]},
      { path: 'emloyee-report',component:EmployeereportComponent,canActivate:[LMSAccessGuard]},
      { path: 'hr-resignation',component:HrResignationComponent,canActivate:[LMSAccessGuard]},
      { path: 'employeeDirectory',component:EmployeeDirectoryComponent,canActivate:[LMSAccessGuard]},
      { path: 'employeeDashboard',component:EmployeeDashboardComponent,canActivate:[LMSAccessGuard]},
      { path: 'hr-onboarding',component:HrOnboardingComponent,canActivate:[LMSAccessGuard]},
      { path: 'onboarding-checklist-department',component:HrOnboardingChecklistComponent,canActivate:[LMSAccessGuard]},
      { path: 'termination-checklist-department',component:HrOffboardingChecklistComponent,canActivate:[LMSAccessGuard]},
      { path: 'induction-program',component:ChecklistMeetComponent,canActivate:[LMSAccessGuard]},
      { path:'termination-pendinging-checklist',component:HrOffboardingChecklistoverviewComponent,canActivate:[LMSAccessGuard]},
     // { path:'announcement',component:AnnouncementsComponent,canActivate:[LMSAccessGuard]},
      { path:'assign-checklist',component:AssignChecklistComponent,canActivate:[LMSAccessGuard]},
      { path:'hr-document-approval',component:HrDocumentApprovalComponent,canActivate:[LMSAccessGuard]},
      { path:'hr-pending-approval',component:HrPendingApprovalsComponent,canActivate:[LMSAccessGuard]},
      //{ path:'configure-documents',component:ConfigureDocumentsComponent,canActivate:[LMSAccessGuard]},
      { path:'employee-checklist',component:EmployeeChecklistComponent,canActivate:[LMSAccessGuard]},
      { path:'employee-profile',component:EmployeeProfileComponent,canActivate:[LMSAccessGuard]},
     // { path:'induction',component:InductionComponent,canActivate:[LMSAccessGuard]},
      //{ path:'users-login',component:UsersLoginComponent,canActivate:[LMSAccessGuard]},
      { path:'new-hired-list',component:NewHireListComponent,canActivate:[LMSAccessGuard]},
      { path:'resignation-pendingchecklist-department',component:DeptResignationPendingchecklistComponent,canActivate:[LMSAccessGuard]},
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EMSRoutingModule { }
