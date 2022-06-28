import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/pages/main/main.component';
import { DeparmentComponent } from './pages/deparment/deparment.component';
import { DesignationsComponent } from './pages/designations/designations.component';
import { EmployeeMasterToAddComponent } from './pages/employee-master-to-add/employee-master-to-add.component';
import { CompanyinformationComponent } from './pages/companyinformation/companyinformation.component';
const routes: Routes = [
  {
    path: '', component: MainComponent,
    children: [
      { path: 'Designation', component: DesignationsComponent },
      { path: 'Department', component: DeparmentComponent },
      { path: 'Employee', component: EmployeeMasterToAddComponent },
      { path: 'CompanyInformation',component:CompanyinformationComponent}
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
