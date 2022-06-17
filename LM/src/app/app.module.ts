import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AttendanceModule } from './attendance/attendance.module';
import { AdminModule } from './admin/admin.module';
import { MaterialModule } from './material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular'; 
 import dayGridPlugin from '@fullcalendar/daygrid'; 
 import interactionPlugin from '@fullcalendar/interaction'; 
import { FlexLayoutModule } from '@angular/flex-layout';
import { AuthguardService } from './authguard.service';
import { LoginComponent } from './pages/login/login.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { HeaderComponent } from './pages/header/header.component';
import { SideNavComponent } from './pages/side-nav/side-nav.component';
import { FooterComponent } from './pages/footer/footer.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { JitCompiler }from '@angular/compiler';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { PopupComponent} from './pages/popup/popup.component'
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReusableDialogComponent } from './pages/reusable-dialog/reusable-dialog.component';
import { DesignationsComponent } from './pages/designations/designations.component';
import { DeparmentComponent } from './pages/deparment/deparment.component';


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
    DesignationsComponent,
    DeparmentComponent
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
    HttpClientModule
    // HttpClient,
    // HttpHeaders,
    // Observable

   

  ],

  providers: [AuthguardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
