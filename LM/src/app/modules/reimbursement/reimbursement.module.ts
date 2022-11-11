import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReimbursementRoutingModule } from './reimbursement-routing.module';
import { ReimbursementRequestComponent } from './pages/reimbursement-request/reimbursement-request.component';
import { ReimbursementApproveComponent } from './pages/reimbursement-approve/reimbursement-approve.component';
import { DetailYearlyReportComponent } from './reports/detail-yearly-report/detail-yearly-report.component';
import { EmployeeWiseReportComponent } from './reports/employee-wise-report/employee-wise-report.component';
import { ReimbursementTypeWiseReportComponent } from './reports/reimbursement-type-wise-report/reimbursement-type-wise-report.component';
import { SummaryReportComponent } from './reports/summary-report/summary-report.component';


@NgModule({
  declarations: [
    ReimbursementRequestComponent,
    ReimbursementApproveComponent,
    DetailYearlyReportComponent,
    EmployeeWiseReportComponent,
    ReimbursementTypeWiseReportComponent,
    SummaryReportComponent
  ],
  imports: [
    CommonModule,
    ReimbursementRoutingModule
  ]
})
export class ReimbursementModule { }
