import { MainComponent } from 'src/app/pages/main/main.component';
import { MinMaxDirective } from './directive/min-max-length-directive';
import { NgModule, Directive } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MaterialElevationDirective } from 'src/app/modules/payroll/directive/material-elevation-directive';
import { PayrollRoutingModule } from './payroll-routing.module';
import { MaterialModule } from '../../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular'; 
 import dayGridPlugin from '@fullcalendar/daygrid'; 
 import interactionPlugin from '@fullcalendar/interaction'; 
import { FlexLayoutModule } from '@angular/flex-layout';
import { DialogComponent } from './dialog/dialog.component';
import { FinanceDashboardComponent } from './pages/finance-dashboard/finance-dashboard.component';
import { InvestmentProofComponent } from './pages/investment-proof/investment-proof.component';
import { InvestmentProofRequestComponent } from './pages/investment-proof-request/investment-proof-request.component';
import { ProfessionalTaxComponent } from './pages/professional-tax/professional-tax.component';
import { PayGroupComponent } from './pages/pay-group/pay-group.component';
import { PayGroupRequestComponent } from './pages/pay-group-request/pay-group-request.component';
import { ProfessionalTaxRequestComponent } from './pages/professional-tax-request/professional-tax-request.component';
import { SalaryMasterComponent } from './pages/salary-master/salary-master.component';
import { PayScheduleComponent } from './pages/pay-schedule/pay-schedule.component';
import { PayScheduleRequestComponent } from './pages/pay-schedule-request/pay-schedule-request.component';
import { EarningsComponent } from './pages/earnings/earnings.component';
import { EarningsRequestComponent } from './pages/earnings-request/earnings-request.component';
import { EmployeeItDeclarationsComponent } from './pages/employee-it-declarations/employee-it-declarations.component';
import { PaySlipsComponent } from './pages/pay-slips/pay-slips.component';
import { PaySlipsViewComponent } from './pages/pay-slips-view/pay-slips-view.component';
import { EmployeeForm16Component } from './pages/employee-form16/employee-form16.component';
import { FinanceForm16Component } from './pages/finance-form16/finance-form16.component';
import { EsiComponent } from './pages/esi/esi.component';
import { EpfComponent } from './pages/epf/epf.component';
import { EmployeeDashboardComponent } from './pages/employee-dashboard/employee-dashboard.component';
import { OrganizationDetailsComponent } from './pages/organization-details/organization-details.component';
import { ProfessionalTaxMainComponent } from './pages/professional-tax-main/professional-tax-main.component';
import { NgChartsModule } from 'ng2-charts';
import { ChartModule } from 'angular2-chartjs';
import 'chartjs-adapter-date-fns';
import { AssignPayGroupComponent } from './pages/assign-pay-group/assign-pay-group.component';
import { AssignPaygroupPopupComponent } from './pages/assign-paygroup-popup/assign-paygroup-popup.component';
import { InvestmentRejectComponent } from './pages/investment-reject/investment-reject.component';
import { MonthlyPayrollComponent } from './pages/monthly-payroll/monthly-payroll.component';
import { CopyContentService } from './copy-content.service';
import { ConfirmationDialogueComponent } from './pages/confirmation-dialogue/confirmation-dialogue.component';
import { NgxMaskModule,IConfig } from 'ngx-mask'
 FullCalendarModule.registerPlugins([ 
  dayGridPlugin,
  interactionPlugin
]);

@NgModule({
  declarations: [
    DialogComponent,
    FinanceDashboardComponent,
    InvestmentProofComponent,
    InvestmentProofRequestComponent,
    ProfessionalTaxComponent,
    PayGroupComponent,
    PayGroupRequestComponent,
    ProfessionalTaxRequestComponent,
    SalaryMasterComponent,
    PayScheduleComponent,
    PayScheduleRequestComponent,
    EarningsComponent,
    EarningsRequestComponent,
    EmployeeItDeclarationsComponent,
    PaySlipsComponent,
    PaySlipsViewComponent,
    EmployeeForm16Component,
    FinanceForm16Component,
    EsiComponent,
    EpfComponent,
    EmployeeDashboardComponent,
    OrganizationDetailsComponent,
    ProfessionalTaxMainComponent,
    MaterialElevationDirective,
    AssignPayGroupComponent,
    AssignPaygroupPopupComponent,
    InvestmentRejectComponent,
    MonthlyPayrollComponent,
    MinMaxDirective,
    ConfirmationDialogueComponent
  ],
  imports: [
    CommonModule,
    PayrollRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule,
    FlexLayoutModule,    
    NgChartsModule,
    ChartModule,
    NgxMaskModule.forRoot({
      // showMaskTyped : true,
      // clearIfNotMatch : true
    }),
  ],
  providers:[DatePipe,
    CopyContentService]

})
export class PayrollModule { }
