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
      'companyname':['', Validators.required],
      'username': ['', Validators.required],
      // 'recaptcha': ['', Validators.required],
      
    });
  }
  submit(){
    //console.log("formgroup",this.formGroup.controls.companyname.valid,this.formGroup.controls.username.valid);
    console.log("captchavalid",this.captchavalid,this.formGroup.controls.username.value,this.formGroup.controls.companyname.value);
    if( this.captchavalid &&  this.formGroup.controls.companyname.value !='' && this.formGroup.controls.username.value !=''){
      let data ={
        email :this.formGroup.controls.username.value,
        companycode:this.formGroup.controls.companyname.value,
        company_name_value:null,
        company_size_value:null,
        plan_id_value:null,
        number_of_users_value:null,
        industry_type_pm:null,
        industry_type_value_pm:null,
        mobile_number_value:null,
        company_address1_value:null,
        company_address2_value:null,
        country_id_value:null,
        state_id_value:null,
        city_id_value:null,
        pincode_value:null,
        gst_number_value:null,
        agree_to_terms_and_conditions_value:null,
        steps_completed_value:0,
        id_value:null,
        created_by_value:null,
        contact_name_value:null
  
      }
      console.log("hjjhjkh",data)
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
