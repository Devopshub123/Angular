import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { PopupComponent,PopupConfig } from '../popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
// import { EmsService } from 'src/app/modules/ems/ems.service';


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
    private tss: LoginService, private router: Router,
    private activatedRoute: ActivatedRoute,) {
    }
    messagesDataList: any = [];
  ngOnInit() {
    let params: any = this.activatedRoute.snapshot.params;
    this.companyName = params.companyName;

    this.createForm();
    this.formGroup.controls.username.setValue(localStorage.getItem("username"));
    this.formGroup.controls.password.setValue(localStorage.getItem("password"));
    this.formGroup.controls.comapnyname.setValue(localStorage.getItem("comapnyname"));
    this.formGroup.controls.rememberme.setValue((localStorage.getItem("rememberme")=='false')?0:1);    // console.log("nm--",this.formGroup.controls.username.value)
    // this.getMessagesList();
  }
  hide = true;

  createForm() {
    this.formGroup = this.formBuilder.group({
      'comapnyname':['', Validators.required],
      'username': ['', Validators.required],
      'password': ['', Validators.required],
      'rememberme':['']
    });
  }
  login() {
    this.issubmit = true;
    this.email = this.formGroup.controls.username.value;
    this.password = this.formGroup.controls.password.value;
    let data = {
      email:this.email,
      password:this.password,
      companyName:this.formGroup.controls.comapnyname.value
    }
    if (this.formGroup.valid) {
      sessionStorage.setItem('companyName',this.formGroup.controls.comapnyname.value);
      if(this.formGroup.controls.rememberme.value==true){
        localStorage.setItem("comapnyname",this.formGroup.controls.comapnyname.value);
        localStorage.setItem("username",this.formGroup.controls.username.value);
        localStorage.setItem("password",this.formGroup.controls.password.value);
        localStorage.setItem("rememberme", this.formGroup.controls.rememberme.value);
        } else if(this.formGroup.controls.rememberme.value==false){
        localStorage.setItem("comapnyname",'');
        localStorage.setItem("username",'');
        localStorage.setItem("password",'');
        localStorage.setItem("rememberme",'false');
      }
      this.tss.Savelogin(data).subscribe((data) =>{
        // sessionStorage.setItem('user', JSON.stringify(data.result[0]));
        if(data.status === true){
          if(new Date(data.expirydate)>=new Date()){
            let empdata = data.result[0];
          sessionStorage.setItem('token', data.token);
          sessionStorage.setItem('user', JSON.stringify(empdata));
          sessionStorage.setItem('expirydate', data.expirydate);
          this.employeeId = empdata.id;
          if (empdata.firstlogin == "Y") {
            // this.router.navigate(['/Attendance/ChangePassword'])
            this.router.navigate(['/ChangePassword'])
          }
          else if (empdata.roles[0].role_name == "Product Admin") {
            this.router.navigate(['/Admin/product-admin-dashboard'])
          }
          else {
            this.router.navigate(['main/MainDashboard'])
            // this.getEmployeeEmailData();
          }
          }
          else if(data.result[0].is_super_admin){
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('user', JSON.stringify(data.result[0]));
            sessionStorage.setItem('expirydate', data.expirydate);
            this.employeeId = data.result[0].id;
            this.router.navigate(['/Admin/client-superadmin-dashboard'])
            // this.router.navigate(['main/MainDashboard'])

          }
          else{
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position:{top:`70px`},
              disableClose: true,
              data:'Your subscription expired.Please contact your admin team.'
            });

          }

        }
        else if
        (data.message=='dbnotthere'){
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data:'Invalid company code or credentials. Please verify and retry.'
          });

        }
        else {
          this.router.navigate(['/Login']);
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            // data:'The username and/or password you entered did not match our records. Please double-check and try again.'
            data:'Invalid company short code or credentials. Please enter valid company short code or credentials.'
            // data: this.msgLM14
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



  // getEmployeeEmailData() {
  //   this.emsService.getEmployeeEmailDataByEmpid(this.employeeId)
  //     .subscribe((res: any) => {
  //       // this.employeeEmailData = JSON.parse(res.data[0].jsonvalu)[0];
  //      })
  // }
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
