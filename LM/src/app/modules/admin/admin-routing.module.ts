import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeparmentComponent } from './pages/deparment/deparment.component';
import { DesignationsComponent } from './pages/designations/designations.component';

const routes: Routes = [
  {path:'Designation',component:DesignationsComponent},
  {path:'Department',component:DeparmentComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
