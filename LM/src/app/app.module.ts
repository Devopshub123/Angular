import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { AdminModule } from './modules/admin/admin.module';
import { MaterialModule } from './material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
 import dayGridPlugin from '@fullcalendar/daygrid';
 import interactionPlugin from '@fullcalendar/interaction';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LoginComponent } from './pages/login/login.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { HeaderComponent } from './pages/header/header.component';
import { SideNavComponent } from './pages/side-nav/side-nav.component';
import { FooterComponent } from './pages/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { PopupComponent} from './pages/popup/popup.component'
import { ReusableDialogComponent } from './pages/reusable-dialog/reusable-dialog.component';

import { CommonModule } from '@angular/common';
import { OnlyNumberDirective } from './custom-directive/only-number.directive';
import { MainComponent } from './pages/main/main.component';
import { EmployeeMasterToAddComponent } from './modules/admin/pages/employee-master-to-add/employee-master-to-add.component';
import { MatTableModule } from '@angular/material/table';
import { MainDashboardComponent } from './pages/main-dashboard/main-dashboard.component';
import { BnNgIdleService } from 'bn-ng-idle';
import { CompanyinformationComponent } from './modules/admin/pages/companyinformation/companyinformation.component';

 FullCalendarModule.registerPlugins([
  dayGridPlugin,
  interactionPlugin
]);
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    SideNavComponent,
    FooterComponent,
    ChangePasswordComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    PopupComponent,
    ReusableDialogComponent,
    OnlyNumberDirective,
    MainComponent,
    EmployeeMasterToAddComponent,
    CompanyinformationComponent,
    MainDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AttendanceModule,
    AdminModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule ,
    FlexLayoutModule,
    HttpClientModule,
    CommonModule,
    MatTableModule,

  ],

  providers: [BnNgIdleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
