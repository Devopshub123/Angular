import { Component, OnInit,ViewChild} from '@angular/core';
import { changePassword } from 'src/app/models/changepassword';
import { FormGroup,FormControl,Validators, FormBuilder, AbstractControl} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PopupComponent,PopupConfig } from '../popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';



import { LoginService } from 'src/app/services/login.service';
import { ConfirmPasswordValidator} from '../confirm-password.validator';
import { EmsService } from 'src/app/modules/ems/ems.service';
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
  msgEM1:any='This Field is Requird';
  msgEM3:any;
  msgEM128:any;
  msgEM129:any;
  msgEM132:any;
  hide1 = true;
  hide2 = true;
  hide3 = true;

  constructor(private formBuilder: FormBuilder,private dialog: MatDialog,private router: Router,
    private ts: LoginService,private emsService:EmsService) {
    this.changePasswordAddObj =  new changePassword();
   }
   @ViewChild("chngfrm", {static: true}) form: any;
  passwordPattern = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9].{8,20})"
  ngOnInit() {
    this.getMessages('EM1')
    this.getMessages('EM3')
    this.getMessages('EM128')
    this.getMessages('EM129')
    this.getMessages('EM132')
    this.changePasswordform=this.formBuilder.group(
      {
        oldPassword:["",Validators.required],
        password: ["",Validators.required],
        confirmPassword: [""],
        },
        {
          // validators: [Validation.match('password', 'confirmPassword')]
          validator: ConfirmPasswordValidator("password", "confirmPassword")
        }
      );
    this.usersession =  sessionStorage.getItem('user')
    this.userSession = JSON.parse(this.usersession)
    this.changePasswordAddObj.empId = this.userSession.id ;

    if(this.usersession.firstlogin == 'Y'){
      this.isView=false;
    }
    else{
      this.isView=true;
    }

  }
  get f(): { [key: string]: AbstractControl } {
    return this.changePasswordform.controls;
  }
  cancel(){
    this.router.navigate(["/main/MainDashboard"])
  }
  changePassword(){
      this.submitted = true;
    if(this.changePasswordform.valid){
      this.changePasswordAddObj.email = this.userSession.userid;
      this.changePasswordAddObj.oldPassword=this.changePasswordform.controls.oldPassword.value;
      this.changePasswordAddObj.newPassword=this.changePasswordform.controls.password.value;
      this.changePasswordAddObj.confirmPassword=this.changePasswordform.controls.confirmPassword.value;

      if(this.changePasswordAddObj.oldPassword !='' && this.changePasswordAddObj.newPassword != '' && this.changePasswordAddObj.confirmPassword !=''){
        if(this.changePasswordAddObj.oldPassword === this.changePasswordAddObj.newPassword){
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: 'Your new password cannot be same as the old password'
          });
        }
        else{
          this.ts.changepassword(this.changePasswordAddObj).subscribe((data) => {

            if (data[0]==0) {
              let dialogRef = this.dialog.open(ReusableDialogComponent, {
                position:{top:`70px`},
                disableClose: true,
                data: this.msgEM132
              });
              let login = "/Login"
              sessionStorage.removeItem('user')
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
                this.router.navigate([login]));

            }
            else if(data[0]== -1) {
              let dialogRef = this.dialog.open(ReusableDialogComponent, {
                position:{top:`70px`},
                disableClose: true,
                data: "Please enter correct old password"
              });
            }
            else{
              let dialogRef = this.dialog.open(ReusableDialogComponent, {
                position:{top:`70px`},
                disableClose: true,
                data: "Your new password cannot be the same as previous passwords count of 3"
              });

            }
          });


        }

      }
    }
  }

  getMessages(messageCode:any) {
    let data =
    {
      "code": messageCode,
      "pagenumber": 1,
      "pagesize": 1
    }
    this.emsService.getMessagesListApi(data).subscribe((result: any) => {
      if(result.status && messageCode == 'EM1')
      {
        this.msgEM1 = result.data[0].message
      }
      else if(result.status && messageCode == 'EM3')
      {
        this.msgEM3 = result.data[0].message
      }
      else if(result.status && messageCode == 'EM128')
      {
        this.msgEM128 = result.data[0].message
      }
      else if(result.status && messageCode == 'EM129')
      {
        this.msgEM129 = result.data[0].message
      }
      else if(result.status && messageCode == 'EM132')
      {
        this.msgEM132 = result.data[0].message
      }

    })
  }

}
