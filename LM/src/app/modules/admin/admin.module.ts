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
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    
  ]
})
export class AdminModule { }
