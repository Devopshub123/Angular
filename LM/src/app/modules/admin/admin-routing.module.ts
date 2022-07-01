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
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
