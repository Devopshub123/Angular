import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import {DatePipe,Location} from "@angular/common";
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
  issubmit:boolean=false;
  companyName:any;
  info:any;
  constructor(private formBuilder: FormBuilder,private dialog: MatDialog,private tss:LoginService,private router: Router,private location: Location) {

    this.info = this.location.getState();
    // this.companyName = this.info.companyName;


  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.formGroup = this.formBuilder.group({
      'comapnyname': ['', Validators.required],
      'email': ['', Validators.required],
    });
  }
  submit(){
    this.issubmit=true;
    this.email = this.formGroup.controls.email.value;
    this.companyName = this.formGroup.controls.comapnyname.value;
    this.tss.verifyEmail(this.email,this.companyName).subscribe((data) => {
      if(data.status){
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: 'Please check your email for reset password'
        });
          this.router.navigate(["/Login"])
      }
    
      
      else {
        if (data.message == 'datanotthere') {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: 'Db not there.'
          });
          
        }
        else {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: 'Please enter valid email for reset password'
          });
          
        }
        
      }

    });

  }

  cancel(){
    this.router.navigate(['Login']);
  }

}
