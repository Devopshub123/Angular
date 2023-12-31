import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component'
import {MainDashboardComponent} from './pages/main-dashboard/main-dashboard.component'
import {LMSAccessGuard} from  './LMS-access.guard';
import { CommonModule } from '@angular/common';
import { PreOnboardingDetailsComponent } from './pages/pre-onboarding-details/pre-onboarding-details.component';
import {SideNavComponent} from './pages/side-nav/side-nav.component'
import { MainComponent } from './pages/main/main.component';
import { AuditLogComponent } from './pages/audit-logs/audit-log/audit-log.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { RegisterValidationComponent } from './modules/admin/subscription/register-validation/register-validation.component';
import { TermsConditionsComponent } from './pages/terms-conditions/terms-conditions.component';
var Login :string;
 var comp = sessionStorage.getItem('companyName')?sessionStorage.getItem('companyName'):'';
Login = 'Login'


const routes: Routes = [
  {path:'sign-up/:token',component:SignUpComponent},
  {path:'Validateemail',component:RegisterValidationComponent},
  {path:'Login',component:LoginComponent},
  {path:'Terms-conditions',component:TermsConditionsComponent},
  {path:'sidenav',component:SideNavComponent},
  {path:'main',component:MainComponent,children:[
    {path:'MainDashboard',component:MainDashboardComponent},
    {path:'AuditLog',component:AuditLogComponent},
    
  ]},
  {path:'ChangePassword',component:ChangePasswordComponent},
  // {path:'ResetPassword',component:ResetPasswordComponent},
  {path:'ResetPassword/:token',component:ResetPasswordComponent},

  {path:'ForgotPassword',component:ForgotPasswordComponent},
  //{path:':token',component:PreOnboardingDetailsComponent},
  {path:'pre-onboarding/:token',component:PreOnboardingDetailsComponent},
  // {
  //   path: 'HrmsDashboard',
  //   component:ForgotPasswordComponent
  // },
  {
    path: 'Admin',
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule)
    
  },
  {
    path: 'Attendance',
    loadChildren: () => import('./modules/attendance/attendance.module').then(m => m.AttendanceModule)
  },
  {
    path: 'Payroll',
    loadChildren: () => import('./modules/payroll/payroll.module').then(m => m.PayrollModule)
  },
  {path:'Reports',loadChildren:()=>import('./modules/reports/reports.module').then(m=>m.ReportsModule)},
  {
    path: '',
    redirectTo: Login,
    pathMatch: 'full'
  },
  // {path:'MainDashboard',component:MainDashboardComponent,canActivate:[LMSAccessGuard]},
  {path:'LeaveManagement',loadChildren:()=>import('./modules/leaves/leaves.module').then(m=>m.LeavesModule)},
  {path:'Asset',loadChildren:()=>import('./modules/assets/assets.module').then(m=>m.AssetsModule),canActivate:[LMSAccessGuard]},
  {path:'ems',loadChildren:()=>import('./modules/ems/ems.module').then(m=>m.EMSModule)},
  {path:'Reimbursement',loadChildren:()=>import('./modules/reimbursement/reimbursement.module').then(m=>m.ReimbursementModule),canActivate:[LMSAccessGuard]}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes),CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
