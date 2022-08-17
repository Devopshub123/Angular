import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import Validation from '../confirm-password.validator';
import { resetPassword } from 'src/app/models/resetPassword';
import { PopupComponent,PopupConfig } from '../popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  formGroup: any=FormGroup;
  email:any;
  empid:any;
  resetpassword:any=[];
  resetpwd:any=[];
  newpassword:any;
  confirmpassword:any;
  issubmit:boolean=false;
  msgLM1:any;
  msgLM2:any;
  msgLM4:any;
  msgLM5:any;
  msgLM56:any;
  constructor(private formBuilder: FormBuilder,private dialog: MatDialog,private activatedRoute: ActivatedRoute,private tss:LoginService,private router: Router,) { }

  ngOnInit() {
    this.getErrorMessages('LM1')
    this.getErrorMessages('LM2')
    this.getErrorMessages('LM4')
    this.getErrorMessages('LM5')
    let params: any = this.activatedRoute.snapshot.params;
    this.email = params.email;
    this.empid = params.id;  
    this.createForm();
  }
  hide1 = true;
  hide2 = true;
  // ('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,20}')],
  createForm() {
    this.formGroup = this.formBuilder.group(
      {
      'newpassword': ['', Validators.required,Validators.pattern],
      'confirmpassword': ['',Validators.required],
    });
  }
  submit(){
    this.issubmit = true;
  var  resetObj = {
      empid:this.empid,
      email: this.email,
      newpassword:this.formGroup.controls.newpassword.value,
      confirmpassword:this.formGroup.controls.confirmpassword.value    
    }
    this.newpassword = this.formGroup.controls.newpassword.value;
    this.confirmpassword = this.formGroup.controls.confirmpassword.value;
    if(this.newpassword === this.confirmpassword  ){
      this.tss.resetpassword(resetObj).subscribe((data) => {
        if (data.status) {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: this.msgLM56
          });
          sessionStorage.removeItem('user')
          this.router.navigate(['/Login']);
  
        } else {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: 'Your newpassword cannot be same as the old password'
          });
        }
        
  
      });
    }
    else{
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position:{top:`70px`},
        disableClose: true,
        data: this.msgLM5
      });
  
    }
    
  }
  cancel(){
    this.formGroup.reset();
    this.formGroup.valid = true;
  

  }
  getErrorMessages(errorCode:any) {

    this.tss.getErrorMessages(errorCode,1,1).subscribe((result)=>{

      if(result.status && errorCode == 'LM1')
      {
        this.msgLM1 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM2')
      {
        this.msgLM2 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM4')
      {
        this.msgLM4 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM5')
      {
        this.msgLM5 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM55')
      {
        this.msgLM56 = result.data[0].errormessage
      }
    
     
    })
  }


  

}
