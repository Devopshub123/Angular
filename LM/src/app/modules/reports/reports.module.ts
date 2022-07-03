import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { SummaryReportComponent } from './pages/summary-report/summary-report.component';
import { DetailReportComponent } from './pages/detail-report/detail-report.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { DialogDetailComponent } from './pages/dialog-detail/dialog-detail.component';


@NgModule({
  declarations: [
    SummaryReportComponent,
    DetailReportComponent,
    DialogDetailComponent
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
