import { EditProfileComponent } from './modules/leaves/pages/edit-profile/edit-profile.component';
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
import { MatDatepickerModule } from '@angular/material/datepicker'
import { CommonModule } from '@angular/common';
import { OnlyNumberDirective } from './custom-directive/only-number.directive';
import { MainComponent } from './pages/main/main.component';
import { EmployeeMasterToAddComponent } from './modules/admin/pages/employee-master-to-add/employee-master-to-add.component';
import { MatTableModule } from '@angular/material/table';
import { MainDashboardComponent } from './pages/main-dashboard/main-dashboard.component';
import { BnNgIdleService } from 'bn-ng-idle';
import { CompanyinformationComponent } from './modules/admin/pages/companyinformation/companyinformation.component';
import { WorklocationComponent } from './modules/admin/pages/worklocation/worklocation.component';
import { HolidaysComponent } from './modules/admin/pages/holidays/holidays.component';
import { LeavepoliciesComponent } from './modules/admin/pages/leavepolicies/leavepolicies.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { OnlyCharactorDirective } from './custom-directive/only-charactors.directive';
import { MappingIdsComponent } from './modules/admin/pages/mapping-ids/mapping-ids.component';
import { ShiftMasterComponent } from './modules/admin/pages/shift-master/shift-master.component';


// import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';


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
    WorklocationComponent,
    HolidaysComponent,
    LeavepoliciesComponent,
    MainDashboardComponent,
    EditProfileComponent,
    OnlyCharactorDirective,
    MappingIdsComponent,
    ShiftMasterComponent,
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
    NgxSpinnerModule,
    MatDatepickerModule,
    // BsDatepickerModule.forRoot(),
    // DatepickerModule.forRoot() 

  ],

  // providers: [BnNgIdleService, BsDatepickerConfig],
  providers: [BnNgIdleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
