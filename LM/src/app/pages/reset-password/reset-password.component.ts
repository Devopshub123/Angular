import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { ConfirmPasswordValidator} from '../confirm-password.validator';
import { resetPassword } from 'src/app/models/resetPassword';
import { PopupComponent,PopupConfig } from '../popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { EmsService } from 'src/app/modules/ems/ems.service';


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
  msgEM1:any;
  msgEM3:any;
  msgEM128:any;
  msgEM129:any;
  msgEM1296:any;
  date:any;
  URL:boolean=false;
  currentDate :any=new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate();
  constructor(private formBuilder: FormBuilder,private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,private tss:LoginService,
    private router: Router,private emsService:EmsService) { }

  ngOnInit() {
    this.getMessages('EM1');
    this.getMessages('EM3');
    this.getMessages('EM128');
    this.getMessages('EM129');
    this.getMessages('EM131');

    let params: any = this.activatedRoute.snapshot.params;
    this.email = JSON.parse(atob(params.token)).email;
    this.empid = JSON.parse(atob(params.token)).id;
    this.date = JSON.parse(atob(params.token)).date;
    if(this.date != this.currentDate){
      this.URL = true
    }else {
      this.URL = false

    }

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
      this.tss.resetpassword(resetObj).subscribe((data:any) => {
        if (data.status) {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: this.msgEM1296
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
        data: this.msgEM129
      });

    }

  }
  cancel(){
    this.formGroup.reset();
    this.formGroup.valid = true;


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
      else if(result.status && messageCode == 'EM131')
      {
        this.msgEM1296 = result.data[0].message
      }


    })
  }




}
