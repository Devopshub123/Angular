import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { DesignationsComponent } from './pages/designations/designations.component';
import { DeparmentComponent } from './pages/deparment/deparment.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { CompanyinformationComponent } from './pages/companyinformation/companyinformation.component';
import { CompanylogoComponent } from './pages/companylogo/companylogo.component';
import { RolesPermissionsComponent } from './pages/roles-permissions/roles-permissions.component';
import { AddRoleModalComponent } from './pages/add-role-modal/add-role-modal.component';
// import { OnlyNumberDirective } from 'src/app/custom-directive/only-number.directive';
// import { WorklocationComponent } from './pages/worklocation/worklocation.component';
// import { HolidaysComponent } from './pages/holidays/holidays.component';
// import { LeavepoliciesComponent } from './pages/leavepolicies/leavepolicies.component';
import { AddleavepopupComponent } from './pages/addleavepopup/addleavepopup.component';
import { MessageMasterComponent } from './pages/message-master/message-master.component';
import { LmMessageMasterComponent } from './pages/lm-message-master/lm-message-master.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LeavePoliciesDialogComponent } from './dialog/leave-policies-dialog/leave-policies-dialog.component';
import { TerminationCategoryComponent } from './pages/termination-category/termination-category.component';
import { ReasonMasterComponent } from './pages/reason-master/reason-master.component';
import { ReimbursementMasterComponent } from './pages/reimbursement-master/reimbursement-master.component';
import { PayrollMessagesComponent } from './pages/payroll-messages/payroll-messages.component';
import { ProductAdminInvoiceHistoryComponent } from './subscription/product-admin-invoice-history/product-admin-invoice-history.component';
import { ClientAdminInvoiceHistoryComponent } from './subscription/client-admin-invoice-history/client-admin-invoice-history.component';
import { ClientAdminSubscriptionComponent } from './subscription/client-admin-subscription/client-admin-subscription.component';
import { ProductAdminClientsComponent } from './subscription/product-admin-clients/product-admin-clients.component';
import { SubscriptionMasterComponent } from './subscription/subscription-master/subscription-master.component';
import { NumbersOnlyDirective } from './numbers-only.directive';
import { ManageUsersComponent } from './subscription/dialog/manage-users/manage-users.component';
import { InvoiceDataComponent } from './subscription/dialog/invoice-data/invoice-data.component';
import { ClientUpgradePlanComponent } from './subscription/client-upgrade-plan/client-upgrade-plan.component';
import { SubscriptionCancelComponent } from './subscription/subscription-cancel/subscription-cancel.component';
import { SubscriptionPlansMasterComponent } from './subscription/subscription-plans-master/subscription-plans-master.component';
import { RegisterValidationComponent } from './subscription/register-validation/register-validation.component';
import { AddRenewalUesrsComponent } from './subscription/add-renewal-uesrs/add-renewal-uesrs.component';
import { NgxCaptchaModule } from 'ngx-captcha';
import { ProductInvoiceDataComponent } from './subscription/dialog/product-invoice-data/product-invoice-data.component';
import { ClientSuperAdminDashboardComponent } from './subscription/client-super-admin-dashboard/client-super-admin-dashboard.component';
import { NgChartsModule } from 'ng2-charts';
import { ChartModule } from 'angular2-chartjs';
import { AdminShiftConfigurationComponent } from './pages/admin-shift-configuration/admin-shift-configuration.component';
@NgModule({
  declarations: [

    DesignationsComponent,
    DeparmentComponent,
    AdminDashboardComponent,

    CompanylogoComponent,
    RolesPermissionsComponent,
    AddRoleModalComponent,
    AddleavepopupComponent,
    MessageMasterComponent,
    LmMessageMasterComponent,
    LeavePoliciesDialogComponent,
    TerminationCategoryComponent,
    ReasonMasterComponent,
    ReimbursementMasterComponent,
    PayrollMessagesComponent,
    ProductAdminInvoiceHistoryComponent,
    ClientAdminInvoiceHistoryComponent,
    ClientAdminSubscriptionComponent,
    ProductAdminClientsComponent,
    SubscriptionMasterComponent,
    NumbersOnlyDirective,
    ManageUsersComponent,
    InvoiceDataComponent,
    ClientUpgradePlanComponent,
    SubscriptionCancelComponent,
    SubscriptionPlansMasterComponent,
    RegisterValidationComponent,
    AddRenewalUesrsComponent,
    ProductInvoiceDataComponent,
    ClientSuperAdminDashboardComponent,
    AdminShiftConfigurationComponent,
    
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    NgxSpinnerModule,
    NgxCaptchaModule,
    NgChartsModule,
    ChartModule

  ]
})
export class AdminModule { }
