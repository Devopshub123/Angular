import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/pages/main/main.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { DeparmentComponent } from './pages/deparment/deparment.component';
import { DesignationsComponent } from './pages/designations/designations.component';
import { EmployeeMasterToAddComponent } from './pages/employee-master-to-add/employee-master-to-add.component';
import { CompanylogoComponent } from './pages/companylogo/companylogo.component';
import { CompanyinformationComponent } from './pages/companyinformation/companyinformation.component';
const routes: Routes = [
  {
    path: '', component: MainComponent,
    children: [
      {path:'Dashboard',component:AdminDashboardComponent},
      { path: 'Designation', component: DesignationsComponent },
      { path: 'Department', component: DeparmentComponent },
      { path: 'Employee', component: EmployeeMasterToAddComponent },
      { path: 'CompanyInformation',component:CompanyinformationComponent},
      { path: 'Logo',component:CompanylogoComponent},
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
