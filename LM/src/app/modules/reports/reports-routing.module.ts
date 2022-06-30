import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { loginDetails } from 'src/app/models/loginDetails';
import { MainComponent } from 'src/app/pages/main/main.component';
import { DetailReportComponent } from './pages/detail-report/detail-report.component';
import { SummaryReportComponent } from './pages/summary-report/summary-report.component';

const routes: Routes = [
  {path:'',component:MainComponent,children:[
    {path:'SummaryReport',component:SummaryReportComponent},
    {path:'DetailReport',component:DetailReportComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
