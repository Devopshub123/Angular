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
const routes: Routes = [
  {
    path: '', component: MainComponent,
    children: [
      {path:'Dashboard',component:AdminDashboardComponent,canActivate:[LMSAccessGuard] },
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
       {path:'MessageMaster',component:MessageMasterComponent}
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
