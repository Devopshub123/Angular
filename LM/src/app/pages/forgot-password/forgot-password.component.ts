import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { PopupComponent,PopupConfig } from '../popup/popup.component';
import { MatDialog } from '@angular/material/dialog'; 

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
        const dialog: PopupConfig = {
          title: "Please Check Your Email For ResetPassword",
          close: 'OK',
          
        };
        this.dialog.open(PopupComponent, { width: '600px', data: dialog });
      }
      else{
        const dialog: PopupConfig = {
          title: "Please Enter Valid Email For ResetPassword",
          close: 'OK',
          
        };
        this.dialog.open(PopupComponent, { width: '600px', data: dialog });

      }
  
    });
   
  }
  verifyemail(){
    console.log("ghgh",this.email)
    // this.tss.verifyEmail(this.email.emailid).subscribe((data) => {
    //   if(data.status){

    
    // }
  
    // });
  }
  cancel(){
    // this.formGroup.valid = true;
    // this.formGroup.reset();
    this.router.navigate(['/Login'])
  }

}
