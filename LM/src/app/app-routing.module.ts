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


const routes: Routes = [
  {path:'Login',component:LoginComponent},
  {path:'ChangePassword',component:ChangePasswordComponent,canActivate:[LMSAccessGuard]},
  // {path:'ResetPassword',component:ResetPasswordComponent},
  {path:'ResetPassword/:email/:id',component:ResetPasswordComponent},

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
    ,canActivate:[LMSAccessGuard]
  },
  {
    path: 'Attendance',
    loadChildren: () => import('./modules/attendance/attendance.module').then(m => m.AttendanceModule)
  ,canActivate:[LMSAccessGuard]},
  {path:'Reports',loadChildren:()=>import('./modules/reports/reports.module').then(m=>m.ReportsModule)},
  {
    path: '',
    redirectTo: 'Login',
    pathMatch: 'full'
  },
  {path:'MainDashboard',component:MainDashboardComponent,canActivate:[LMSAccessGuard]},
  {path:'LeaveManagement',loadChildren:()=>import('./modules/leaves/leaves.module').then(m=>m.LeavesModule),canActivate:[LMSAccessGuard]},
  {path:'Asset',loadChildren:()=>import('./modules/assets/assets.module').then(m=>m.AssetsModule),canActivate:[LMSAccessGuard]},
  {path:'ems',loadChildren:()=>import('./modules/ems/ems.module').then(m=>m.EMSModule),canActivate:[LMSAccessGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes),CommonModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
