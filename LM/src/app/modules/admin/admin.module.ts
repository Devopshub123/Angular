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
    PayrollMessagesComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    NgxSpinnerModule,


  ]
})
export class AdminModule { }
