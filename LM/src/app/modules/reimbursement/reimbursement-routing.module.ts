import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LMSAccessGuard } from 'src/app/LMS-access.guard';
import { MainComponent } from 'src/app/pages/main/main.component';
import { ReimbursementApproveComponent } from './pages/reimbursement-approve/reimbursement-approve.component';
import { ReimbursementRequestComponent } from './pages/reimbursement-request/reimbursement-request.component';
import { DetailYearlyReportComponent } from './reports/detail-yearly-report/detail-yearly-report.component';
import { EmployeeWiseReportComponent } from './reports/employee-wise-report/employee-wise-report.component';
import { ReimbursementTypeWiseReportComponent } from './reports/reimbursement-type-wise-report/reimbursement-type-wise-report.component';
import { SummaryReportComponent } from './reports/summary-report/summary-report.component';

const routes: Routes = [
  {
    path: '', component: MainComponent,
    children: [
      { path: 'ReimbursementRequest', component: ReimbursementRequestComponent,canActivate:[LMSAccessGuard] },
      { path: 'ReimbursementApprove', component: ReimbursementApproveComponent,canActivate:[LMSAccessGuard] },
      { path: 'DetailedYearlyReport', component: DetailYearlyReportComponent,canActivate:[LMSAccessGuard] },
      { path: 'EmployeeWiseReport', component: EmployeeWiseReportComponent,canActivate:[LMSAccessGuard] },
      { path: 'ReimbursementTypeWiseReport', component: ReimbursementTypeWiseReportComponent,canActivate:[LMSAccessGuard] },
      { path: 'SummaryReport', component: SummaryReportComponent,canActivate:[LMSAccessGuard] },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReimbursementRoutingModule { }
