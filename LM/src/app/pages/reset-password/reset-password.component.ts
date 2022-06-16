import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import Validation from '../confirm-password.validator';
import { resetPassword } from 'src/app/models/resetPassword';
import { PopupComponent,PopupConfig } from '../popup/popup.component';
import { MatDialog } from '@angular/material/dialog'; 

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
  msgLM1:any;
  msgLM2:any;
  msgLM4:any;
  msgLM5:any;
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
  var  resetObj = {
      empid:this.empid,
      email: this.email,
      newpassword:this.formGroup.controls.newpassword.value,
      confirmpassword:this.formGroup.controls.confirmpassword.value    
    }
    this.newpassword = this.formGroup.controls.newpassword.value;
    this.confirmpassword = this.formGroup.controls.confirmpassword.value;
    console.log("hhh",resetObj)
    if(this.newpassword === this.confirmpassword  ){
      console.log("dgsd",resetObj)
      this.tss.resetpassword(resetObj).subscribe((data) => {
        if (data.status) {
          // Swal.fire({title:'Password  reset successfully ',showCloseButton: true});
          const dialog: PopupConfig = {
            title: "Password Change Succesfull",
            close: 'OK',
            
          };
          this.dialog.open(PopupComponent, { width: '600px', data: dialog });
          sessionStorage.removeItem('user')
          this.router.navigate(['/Login']);
  
        } else {
          const dialog: PopupConfig = {
            title: "Please Change Password",
            close: 'OK',
            
          };
          this.dialog.open(PopupComponent, { width: '600px', data: dialog });

          // Swal.fire({title:'please change password',showCloseButton: true});
        }
        
  
      });
      

      // console.log("newpassword",this.newpassword)
      // console.log("confirmpassword",this.confirmpassword)
      // console.log("email",this.email)
      // console.log("passempidord",this.empid)
    }
    else{
      const dialog: PopupConfig = {
        title: this.msgLM5,
        close: 'OK',
        
      };
      this.dialog.open(PopupComponent, { width: '600px', data: dialog });
  
    }
    
  }
  cancel(){
    this.formGroup.valid = true;
    this.formGroup.reset();

  }
  getErrorMessages(errorCode:any) {

    this.tss.getErrorMessages(errorCode,1,1).subscribe((result)=>{

      if(result.status && errorCode == 'LM1')
      {
        this.msgLM1 = result.data[0].errormessage
        console.log(this.msgLM1)
      }
      else if(result.status && errorCode == 'LM2')
      {
        this.msgLM2 = result.data[0].errormessage
        console.log(this.msgLM2)
      }
      else if(result.status && errorCode == 'LM4')
      {
        this.msgLM4 = result.data[0].errormessage
        console.log(this.msgLM4)
      }
      else if(result.status && errorCode == 'LM5')
      {
        this.msgLM5 = result.data[0].errormessage
        console.log(this.msgLM5)
      }
    
     
    })
  }


  

}
