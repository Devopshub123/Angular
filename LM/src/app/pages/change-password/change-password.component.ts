import { Component, OnInit,ViewChild} from '@angular/core';
import { changePassword } from 'src/app/models/changepassword';
import { FormGroup,FormControl,Validators, FormBuilder, AbstractControl} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PopupComponent,PopupConfig } from '../popup/popup.component';
import { MatDialog } from '@angular/material/dialog'; 
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';



import { LoginService } from 'src/app/services/login.service';
import Validation from '../confirm-password.validator';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})

export class ChangePasswordComponent implements OnInit {
  changePasswordform!: FormGroup;
  submitted: boolean = false;
  changePasswordAddObj: changePassword;
  userSession:any;
  usersession:any;
  data:any;
  issubmitted: boolean=false;
  isvalid:boolean=false;
  isView:boolean=true;
  empId: any;
  msgLM1:any='This Field is Requird';
  msgLM2:any;
  msgLM4:any;
  msgLM5:any;
  msgLM56:any;

  constructor(private formBuilder: FormBuilder,private dialog: MatDialog,private router: Router,private ts: LoginService) {
    this.changePasswordAddObj =  new changePassword();
   }
   @ViewChild("chngfrm", {static: true}) form: any;
  passwordPattern = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9].{8,20})"
  ngOnInit() {
    // this.getErrorMessages('LM1')
    // this.getErrorMessages('LM2')
    // this.getErrorMessages('LM4')
    // this.getErrorMessages('LM5')
    // this.getErrorMessages('LM56')
    this.changePasswordform=this.formBuilder.group(
      {
        oldPassword:["",Validators.required],
        password: ["",Validators.required],
        confirmPassword: [""],
        },
        {
          validators: [Validation.match('password', 'confirmPassword')]
        }
      );
    this.usersession =  sessionStorage.getItem('user')
    this.userSession = JSON.parse(this.usersession)
    console.log(this.userSession)
    console.log(this.userSession.id)
    this.changePasswordAddObj.empId = this.userSession.id ;
    this.changePasswordAddObj.email = this.userSession.officeemail ;
    
    console.log(this.userSession.firstlogin)
    if(this.usersession.firstlogin == 'Y'){
      console.log("true")
      this.isView=false;      
    }
    else{
      console.log("false")
      this.isView=true;

    }
  
  }
  get f(): { [key: string]: AbstractControl } {
    return this.changePasswordform.controls;
  }
  cancel(){ 
    this.router.navigate(["/MainDashboard"])
  }
  changePassword(){
      this.submitted = true;
    if(this.changePasswordform.valid){
      this.changePasswordAddObj.oldPassword=this.changePasswordform.controls.oldPassword.value;
      this.changePasswordAddObj.newPassword=this.changePasswordform.controls.password.value;
      this.changePasswordAddObj.confirmPassword=this.changePasswordform.controls.confirmPassword.value;
     
      if(this.changePasswordAddObj.oldPassword !='' && this.changePasswordAddObj.newPassword != '' && this.changePasswordAddObj.confirmPassword !=''){
        if(this.changePasswordAddObj.oldPassword === this.changePasswordAddObj.newPassword){
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            disableClose: true,
            data: 'Your new password cannot be same as the old password'
          });
        }
        else{
          this.ts.changepassword(this.changePasswordAddObj).subscribe((data) => {
            console.log(data)
            if (data[0]==0) {
              let dialogRef = this.dialog.open(ReusableDialogComponent, {
                disableClose: true,
                data: 'Password changed successfully' 
              });
              sessionStorage.removeItem('user')
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
                this.router.navigate(["/Login"]));
      
            } 
            else if(data[0]== -1) {
              let dialogRef = this.dialog.open(ReusableDialogComponent, {
                disableClose: true,
                data: "Please enter correct old password"
              });
            }
            else{
              let dialogRef = this.dialog.open(ReusableDialogComponent, {
                disableClose: true,
                data: "Your new password cannot be the same as previous passwords count of 3"
              });

            }
          });


        }
        
      }
    }
  }
 
  // getErrorMessages(errorCode:any) {

  //   this.ts.getErrorMessages(errorCode,1,1).subscribe((result)=>{

  //     if(result.status && errorCode == 'LM1')
  //     {
  //       this.msgLM1 = result.data[0].errormessage
  //       console.log(this.msgLM1)
  //     }
  //     else if(result.status && errorCode == 'LM2')
  //     {
  //       this.msgLM2 = result.data[0].errormessage
  //       console.log(this.msgLM2)
  //     }
  //     else if(result.status && errorCode == 'LM4')
  //     {
  //       this.msgLM4 = result.data[0].errormessage
  //       console.log(this.msgLM4)
  //     }
  //     else if(result.status && errorCode == 'LM5')
  //     {
  //       this.msgLM5 = result.data[0].errormessage
  //       console.log(this.msgLM5)
  //     }
  //     else if(result.status && errorCode == 'LM56')
  //     {
  //       this.msgLM56 = result.data[0].errormessage
  //       console.log(this.msgLM56)
  //     }
     
  //   })
  // }

}