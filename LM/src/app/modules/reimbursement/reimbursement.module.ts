import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReimbursementRoutingModule } from './reimbursement-routing.module';
import { ReimbursementRequestComponent } from './pages/reimbursement-request/reimbursement-request.component';
import { ReimbursementApproveComponent } from './pages/reimbursement-approve/reimbursement-approve.component';
import { DetailYearlyReportComponent } from './reports/detail-yearly-report/detail-yearly-report.component';
import { EmployeeWiseReportComponent } from './reports/employee-wise-report/employee-wise-report.component';
import { ReimbursementTypeWiseReportComponent } from './reports/reimbursement-type-wise-report/reimbursement-type-wise-report.component';
import { SummaryReportComponent } from './reports/summary-report/summary-report.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgChartsModule } from 'ng2-charts';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MaterialModule } from 'src/app/material/material.module';


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
    ReimbursementRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule,
    FlexLayoutModule,
    AngularEditorModule,
    NgChartsModule,
    NgxSpinnerModule
  ]
})
export class ReimbursementModule { }
