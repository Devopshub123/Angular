import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'src/app/pages/main/main.component';
import {LMSAccessGuard} from  '../../LMS-access.guard';
import { ChangePasswordComponent } from '../../pages/change-password/change-password.component';
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
import { EmployeeDashboardComponent } from './pages/employee-dashboard/employee-dashboard.component';
import { EsiComponent } from './pages/esi/esi.component';
import { EpfComponent } from './pages/epf/epf.component';
import { OrganizationDetailsComponent } from './pages/organization-details/organization-details.component';
import { ProfessionalTaxMainComponent } from './pages/professional-tax-main/professional-tax-main.component';
import { AssignPayGroupComponent } from './pages/assign-pay-group/assign-pay-group.component';
import { MonthlyPayrollComponent } from './pages/monthly-payroll/monthly-payroll.component';
const routes: Routes = [
  {    path: '', component: MainComponent,
    children: [

      { path: 'FinanceDashboard', component: FinanceDashboardComponent,canActivate:[LMSAccessGuard]},  
      { path: 'InvestmentProof', component: InvestmentProofComponent},  
      { path: 'ITDeclaration', component: InvestmentProofRequestComponent,canActivate:[LMSAccessGuard]},  
      { path: 'ProfessionalTax', component: ProfessionalTaxComponent,canActivate:[LMSAccessGuard]},  
      { path: 'PayGroup', component: PayGroupComponent,canActivate:[LMSAccessGuard]},  
      { path: 'PayGroupRequest', component: PayGroupRequestComponent,canActivate:[LMSAccessGuard]},  
      { path: 'ProfessionalTaxRequest', component: ProfessionalTaxRequestComponent,canActivate:[LMSAccessGuard]},  
      { path: 'SalaryMaster', component: SalaryMasterComponent,canActivate:[LMSAccessGuard]}, 
      { path: 'PaySchedule', component: PayScheduleComponent,canActivate:[LMSAccessGuard]},  
      { path: 'PayScheduleRequest', component: PayScheduleRequestComponent,canActivate:[LMSAccessGuard]}, 
      { path: 'Earnings', component: EarningsComponent},  
      { path: 'EarningsRequest', component: EarningsRequestComponent}, 
      { path: 'EmployeeITDeclaration', component: EmployeeItDeclarationsComponent,canActivate:[LMSAccessGuard]}, 
      { path: 'PaySlips', component: PaySlipsComponent,canActivate:[LMSAccessGuard]}, 
      { path: 'PaySlipsView', component: PaySlipsViewComponent,canActivate:[LMSAccessGuard]}, 
      { path: 'EmployeeForm16', component: EmployeeForm16Component,canActivate:[LMSAccessGuard]}, 
      { path: 'FinanceForm16', component: FinanceForm16Component,canActivate:[LMSAccessGuard]}, 
      { path: 'ESI', component: EsiComponent,canActivate:[LMSAccessGuard]}, 
      { path: 'EPF', component: EpfComponent,canActivate:[LMSAccessGuard]}, 
      { path: 'EmployeeDashboard', component: EmployeeDashboardComponent,canActivate:[LMSAccessGuard]}, 
      { path: 'ChangePassword', component: ChangePasswordComponent,canActivate:[LMSAccessGuard] },
      { path: 'OrganizationTaxDetails', component: OrganizationDetailsComponent,canActivate:[LMSAccessGuard] },
      { path: 'ProfessionalTaxMain', component: ProfessionalTaxMainComponent,canActivate:[LMSAccessGuard] },
      { path: 'AssignPayGroup', component: AssignPayGroupComponent,canActivate:[LMSAccessGuard] },
      { path: 'MonthlyPayroll', component: MonthlyPayrollComponent,canActivate:[LMSAccessGuard] },
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayrollRoutingModule { }
