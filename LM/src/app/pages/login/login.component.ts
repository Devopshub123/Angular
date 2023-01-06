import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { PopupComponent,PopupConfig } from '../popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { EmsService } from 'src/app/modules/ems/ems.service';


@Component({
  selector: 'app-root',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formGroup: any=FormGroup;
  email:any;
  password:any;
  msgLM14:any;
  msgLM1:any;
  msgLM2:any;
  employeeId:any;
  issubmit:boolean= false;
  companyName:any;
  userlocalSessionemail:any;
  userlocalSessionpassword:any;
  userlocalSessionrememberme:any;
  constructor(private formBuilder: FormBuilder, private dialog: MatDialog,
    private tss: LoginService, private router: Router, private emsService: EmsService,
    private activatedRoute: ActivatedRoute,) {
    }
    messagesDataList: any = [];
  ngOnInit() {
    let params: any = this.activatedRoute.snapshot.params;
    this.companyName = params.companyName;
    console.log("cname",this.companyName)
    this.createForm();
    this.formGroup.controls.username.setValue(localStorage.getItem("username"));
    this.formGroup.controls.password.setValue(localStorage.getItem("password"));
    this.formGroup.controls.rememberme.setValue(localStorage.getItem("rememberme"));
    // console.log("nm--",this.formGroup.controls.username.value)
    // console.log("pwd--",this.formGroup.controls.password.value)
    // console.log("rmm--",this.formGroup.controls.rememberme.value)
    this.getMessagesList();
  }
  hide = true;

  createForm() {
    this.formGroup = this.formBuilder.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required],
      'rememberme':['']
    });
  }
  login(){
    this.issubmit = true;
    this.email = this.formGroup.controls.username.value;
    this.password = this.formGroup.controls.password.value;
    let data = {
      email:this.email,
      password:this.password,
      companyName:this.companyName
    }
    if(this.formGroup.valid){
      sessionStorage.setItem('companyName', this.companyName);
      if(this.formGroup.controls.rememberme.value==true){
        localStorage.setItem("username",this.formGroup.controls.username.value);
        localStorage.setItem("password",this.formGroup.controls.password.value);
        localStorage.setItem("rememberme", this.formGroup.controls.rememberme.value);
        // console.log("nm-1-",this.formGroup.controls.username.value)
        // console.log("pwd-1-",this.formGroup.controls.password.value)
        // console.log("rmm-1-",this.formGroup.controls.rememberme.value)
      } else if(this.formGroup.controls.rememberme.value==false){
        localStorage.setItem("username",'');
        localStorage.setItem("password",'');
        localStorage.setItem("rememberme",'false');
      }
      this.tss.Savelogin(data).subscribe((data) =>{
        if(data.status === true){
          let empdata = data.result[0];
          this.employeeId = empdata.id;
          sessionStorage.setItem('user', JSON.stringify(empdata));
          if (empdata.firstlogin == "Y") {
            this.router.navigate(['/Attendance/ChangePassword'])
          }
          else {
            this.router.navigate(['/MainDashboard'])
            this.getEmployeeEmailData();
          }


        }
        else {
          this.router.navigate(['/Login']);
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: this.msgLM14
          });
       }

      });

      }

  }

  ForgotPassword(){
    this.router.navigate(['ForgotPassword'],{state:{companyName:this.companyName}} )
  }
  // getErrorMessages(errorCode:any){
  //   this.tss.getErrorMessages(errorCode,1,100).subscribe((result)=>{

  //     if(result.status && errorCode == 'LM1')
  //     {
  //       this.msgLM1 = result.data[0].errormessage
  //     }
  //     else if(result.status && errorCode == 'LM2')
  //     {
  //       this.msgLM2 = result.data[0].errormessage
  //     }
  //     else if(result.status && errorCode == 'LM14')
  //     {
  //       this.msgLM14 = result.data[0].errormessage
  //     }


  //   })
  // }
  getMessagesList() {
  
    this.tss.getErrorMessages(null,1,1000).subscribe((res:any)=>{
     if(res.status) {
       this.messagesDataList = res.data;
       this.messagesDataList.forEach((e: any) => {
        if (e.code == "LM1") {
          this.msgLM1 = e.errormessage
        } else if (e.code == "LM2") {
          this.msgLM2 =e.errormessage
        }else if (e.code == "LM14") {
          this.msgLM14 =e.errormessage
        }
         })
     } else {
       this.messagesDataList = [];
     }

   })


  }



  getEmployeeEmailData() {
    this.emsService.getEmployeeEmailDataByEmpid(this.employeeId)
      .subscribe((res: any) => {
        // this.employeeEmailData = JSON.parse(res.data[0].jsonvalu)[0];
       })
  }
  // getError(el:any) {
  //   switch (el) {
  //     case 'user':
  //       if (this.formGroup.get('username').hasError('required')) {
  //         return 'Username required';
  //       }
  //       break;
  //     case 'pass':
  //       if (this.formGroup.get('password').hasError('required')) {
  //         return 'Password required';
  //       }
  //       break;
  //     default:
  //       return '';
  //   }
  // }
}
