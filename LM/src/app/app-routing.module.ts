import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthguardGuard } from './authguard.guard';
import { LoginComponent } from './pages/login/login.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component'
import {LMSAccessGuard} from  './LMS-access.guard';

const routes: Routes = [
  {path:'Login',component:LoginComponent},
  {path:'ChangePassword',component:ChangePasswordComponent,canActivate:[LMSAccessGuard]},
  // {path:'ResetPassword',component:ResetPasswordComponent},
  {path:'ResetPassword/:email/:id',component:ResetPasswordComponent},

  {path:'ForgotPassword',component:ForgotPasswordComponent},

  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule)
    ,canActivate:[LMSAccessGuard]
  },
  {
    path: 'Attendance',
    loadChildren: () => import('./modules/attendance/attendance.module').then(m => m.AttendanceModule)
    //,canActivate: [AuthguardGuard]
  ,canActivate:[LMSAccessGuard]},

  {
    path: '',
    redirectTo: 'Login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
