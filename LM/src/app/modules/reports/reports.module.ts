import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { SummaryReportComponent } from './pages/summary-report/summary-report.component';
import { DetailReportComponent } from './pages/detail-report/detail-report.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { DialogDetailComponent } from './pages/dialog-detail/dialog-detail.component';
import { EmployeMonthlyDetailReportComponent } from './pages/employe-monthly-detail-report/employe-monthly-detail-report.component';
import { Limit } from 'src/app/custom-directive/limit';
import { LateAttendanceReportComponent } from './pages/late-attendance-report/late-attendance-report.component';


@NgModule({
  declarations: [
    SummaryReportComponent,
    DetailReportComponent,
    DialogDetailComponent,
    EmployeMonthlyDetailReportComponent,
    Limit,
    LateAttendanceReportComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
  ]
})
export class ReportsModule { }
