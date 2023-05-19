import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/pages/main/main.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { DeparmentComponent } from './pages/deparment/deparment.component';
import { DesignationsComponent } from './pages/designations/designations.component';
import { EmployeeMasterToAddComponent } from './pages/employee-master-to-add/employee-master-to-add.component';
import { CompanylogoComponent } from './pages/companylogo/companylogo.component';
import { CompanyinformationComponent } from './pages/companyinformation/companyinformation.component';
import {LMSAccessGuard} from  '../../LMS-access.guard';
import { WorklocationComponent } from './pages/worklocation/worklocation.component';
import { RolesPermissionsComponent } from './pages/roles-permissions/roles-permissions.component';
import { HolidaysComponent } from './pages/holidays/holidays.component';
import { LeavepoliciesComponent } from './pages/leavepolicies/leavepolicies.component';
import { MappingIdsComponent } from './pages/mapping-ids/mapping-ids.component';
import { ShiftMasterComponent } from './pages/shift-master/shift-master.component';
import { MessageMasterComponent } from './pages/message-master/message-master.component';
import { LmMessageMasterComponent } from './pages/lm-message-master/lm-message-master.component';
import { EmsMessagemasterComponent } from '../ems/pages/ems-messagemaster/ems-messagemaster.component';
import { TerminationCategoryComponent } from './pages/termination-category/termination-category.component';
import { ReasonMasterComponent } from './pages/reason-master/reason-master.component';
import { ReimbursementMasterComponent } from './pages/reimbursement-master/reimbursement-master.component';
import { SettingsAddChecklistComponent } from '../ems/pages/settings-add-checklist/settings-add-checklist.component';
import { InductionComponent } from '../ems/pages/induction-master/induction.component';
import { ConfigureDocumentsComponent } from '../ems/pages/configure-documents/configure-documents.component';
import { AnnouncementsComponent } from '../ems/pages/announcements/announcements.component';
import { UsersLoginComponent } from '../ems/pages/users-login/users-login.component';
import { SettingsOnBoardingComponent } from '../ems/pages/settings-on-boarding/settings-on-boarding.component';
import { SettingsOffBoardingComponent } from '../ems/pages/settings-off-boarding/settings-off-boarding.component';
import { InductionConductedByMasterComponent } from '../ems/pages/induction-conducted-by-master/induction-conducted-by-master.component';
import { PayrollMessagesComponent } from './pages/payroll-messages/payroll-messages.component';
import { ProductAdminInvoiceHistoryComponent } from './subscription/product-admin-invoice-history/product-admin-invoice-history.component';
import { ClientAdminInvoiceHistoryComponent } from './subscription/client-admin-invoice-history/client-admin-invoice-history.component';
import { ClientAdminSubscriptionComponent } from './subscription/client-admin-subscription/client-admin-subscription.component';
import { ProductAdminClientsComponent } from './subscription/product-admin-clients/product-admin-clients.component';
import { SubscriptionMasterComponent } from './subscription/subscription-master/subscription-master.component';
import { ClientUpgradePlanComponent } from './subscription/client-upgrade-plan/client-upgrade-plan.component';
import { SubscriptionCancelComponent } from './subscription/subscription-cancel/subscription-cancel.component';
import { SubscriptionPlansMasterComponent } from './subscription/subscription-plans-master/subscription-plans-master.component';
import { AddRenewalUesrsComponent } from './subscription/add-renewal-uesrs/add-renewal-uesrs.component';
import { ProductAdminDashboardComponent } from 'src/app/pages/product-admin-dashboard/product-admin-dashboard.component';
import { ClientSuperAdminDashboardComponent } from './subscription/client-super-admin-dashboard/client-super-admin-dashboard.component';
const routes: Routes = [
  {
    path: '', component: MainComponent,
    children: [
      { path: 'Dashboard',component:AdminDashboardComponent,canActivate:[LMSAccessGuard] },
      { path: 'Designation', component: DesignationsComponent,canActivate:[LMSAccessGuard] },
      { path: 'Department', component: DeparmentComponent ,canActivate:[LMSAccessGuard]},
      { path: 'Employee', component: EmployeeMasterToAddComponent,canActivate:[LMSAccessGuard] },
      { path: 'CompanyInformation',component:CompanyinformationComponent,canActivate:[LMSAccessGuard]},
      { path: 'CompanyLogo',component:CompanylogoComponent,canActivate:[LMSAccessGuard]},
      { path: 'RolesPermissions',component:RolesPermissionsComponent,canActivate:[LMSAccessGuard]},
      { path: 'Worklocation',component:WorklocationComponent,canActivate:[LMSAccessGuard]},
      { path: 'Holidays',component:HolidaysComponent,canActivate:[LMSAccessGuard]},
      { path: 'Leavepolicies',component:LeavepoliciesComponent,canActivate:[LMSAccessGuard]},
      { path: 'Holiday', component: HolidaysComponent, canActivate: [LMSAccessGuard] },
      { path: 'MappingIds', component: MappingIdsComponent, canActivate: [LMSAccessGuard] },
      { path: 'Shift', component: ShiftMasterComponent, canActivate: [LMSAccessGuard] },
      { path: 'MessageMaster',component:MessageMasterComponent},
      { path: 'LM-MessageMaster',component:LmMessageMasterComponent},
      { path:'EMS-MessageMaster',component:EmsMessagemasterComponent,canActivate:[LMSAccessGuard]},
      { path:'Termination-Category',component:TerminationCategoryComponent,canActivate:[LMSAccessGuard]},
      { path:'Reason',component:ReasonMasterComponent,canActivate:[LMSAccessGuard]},
      { path: 'Reimbursement', component: ReimbursementMasterComponent, canActivate: [LMSAccessGuard] },
      { path: 'settings-checklist', component: SettingsAddChecklistComponent, canActivate: [LMSAccessGuard] },
      { path: 'induction', component: InductionComponent, canActivate: [LMSAccessGuard] },
      { path: 'configure-documents', component: ConfigureDocumentsComponent, canActivate: [LMSAccessGuard] },
      { path: 'announcement', component: AnnouncementsComponent, canActivate: [LMSAccessGuard] },
      { path: 'users-login', component: UsersLoginComponent, canActivate: [LMSAccessGuard] },
      { path: 'settings-onBoarding', component: SettingsOnBoardingComponent, canActivate: [LMSAccessGuard] },
      { path: 'settings-offBoarding', component: SettingsOffBoardingComponent, canActivate: [LMSAccessGuard] },
      { path: 'Induction-ConductedBy', component: InductionConductedByMasterComponent, canActivate: [LMSAccessGuard] },
      { path: 'Payroll_Messages',component:PayrollMessagesComponent,canActivate:[LMSAccessGuard]},
      { path: 'product-admin-invoicehistory', component: ProductAdminInvoiceHistoryComponent, canActivate: [LMSAccessGuard] },
      { path: 'InvoiceHistory', component: ClientAdminInvoiceHistoryComponent, canActivate: [LMSAccessGuard] },
      { path: 'Subscription', component: ClientAdminSubscriptionComponent, canActivate: [LMSAccessGuard] },
      { path: 'product-admin-clients', component: ProductAdminClientsComponent, canActivate: [LMSAccessGuard] },
      { path: 'subscription-master',component:SubscriptionMasterComponent,canActivate:[LMSAccessGuard]},
      { path: 'upgrade-plan',component:ClientUpgradePlanComponent,canActivate:[LMSAccessGuard]},
      { path: 'subscription-cancel',component:SubscriptionCancelComponent,canActivate:[LMSAccessGuard]},
      { path: 'subscription-plans',component:SubscriptionPlansMasterComponent,canActivate:[LMSAccessGuard]},
      { path: 'add-renewal-users', component: AddRenewalUesrsComponent },
      { path: 'product-admin-dashboard', component: ProductAdminDashboardComponent },
      { path: 'client-superadmin-dashboard', component: ClientSuperAdminDashboardComponent, canActivate: [LMSAccessGuard] },
     ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
