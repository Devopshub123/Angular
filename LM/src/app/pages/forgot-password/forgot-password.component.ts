import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { PopupComponent,PopupConfig } from '../popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

 
  formGroup: any=FormGroup;
  email:any;
  constructor(private formBuilder: FormBuilder,private dialog: MatDialog,private tss:LoginService,private router: Router,) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      'email': ['', Validators.required],
    });
  }
  submit(){
    this.email = this.formGroup.controls.email.value;
    this.tss.verifyEmail(this.email).subscribe((data) => {
      if(data.status){
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: 'Please check your email for resetPassword'
        });
          this.router.navigate(["/Login"])
      }
      else{
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: 'Please enter valid email for resetPassword'
        });
      }
  
    });
   
  }
 
  cancel(){
    this.router.navigate(['/Login'])
  }

}
