import { Component, OnInit,ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { AdminService } from '../../admin.service';
import { MatDialog } from '@angular/material/dialog';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { ReCaptcha2Component } from 'ngx-captcha';

@Component({
  selector: 'app-register-validation',
  templateUrl: './register-validation.component.html',
  styleUrls: ['./register-validation.component.scss']
})
export class RegisterValidationComponent implements OnInit {
  formGroup: any=FormGroup;
  @ViewChild('captchaElem') captchaElem: ReCaptcha2Component | undefined;
  @ViewChild('langInput') langInput: any;
  public captchaIsLoaded = false;
  public captchaSuccess = false;
  public captchaIsExpired = false;
  public captchaResponse?: string;
  captchavalid:boolean=false;

  public theme: 'light' | 'dark' = 'light';
  public size: 'compact' | 'normal' = 'normal';
  public lang = 'en';
  public type: 'image' | 'audio'= 'image';

  constructor(private formBuilder: FormBuilder, private dialog: MatDialog,
    private tss: LoginService, private router: Router,private AS: AdminService,
    private activatedRoute: ActivatedRoute,) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      'comapnyname':['', Validators.required],
      'username': ['', Validators.required],
      'recaptcha': ['', Validators.required],
      
    });
  }
  submit(){
    if( this.captchavalid){
      let data ={
        email :this.formGroup.controls.username.value,
        companycode: this.formGroup.controls.comapnyname.value,
      }
      this.AS.Validateemail(data).subscribe((result:any)=>{
      if(result.status){
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data:result.message
        });
      }
      else{
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data:result.message
        });
      }
    })

    }
    
    
  }
  handleSuccess(data:any,datas:any){
   if(datas){
    this.captchavalid =true;
   }
   else{
    this.captchavalid = false;
   }
  }
}
