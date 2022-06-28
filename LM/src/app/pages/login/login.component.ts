import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { PopupComponent,PopupConfig } from '../popup/popup.component';
import { MatDialog } from '@angular/material/dialog'; 

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
  constructor(private formBuilder: FormBuilder,private dialog: MatDialog,private tss:LoginService,private router: Router,) { }

  ngOnInit() {
    this.createForm();
    this.getErrorMessages('LM14')
    this.getErrorMessages('LM1')
    this.getErrorMessages('LM2')
    console.log(this.msgLM1)
  }
  hide = true;

  createForm() {
    this.formGroup = this.formBuilder.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required],
    });
  }
  login(){
    this.email = this.formGroup.controls.username.value;
    this.password = this.formGroup.controls.password.value;
    let data = {
      email:this.email,
      password:this.password
    }
    this.tss.Savelogin(data).subscribe((data) =>{
      console.log(data)
      if(data.status === true){
        let empdata = data.result[0];
        sessionStorage.setItem('user',JSON.stringify(empdata));
        if(empdata.firstlogin == 'Y'){
          const dialog: PopupConfig = {
            title: 'Login Successfull',
            close: 'OK',
            
          };
          this.dialog.open(PopupComponent, { width: '600px', data: dialog });
          this.router.navigate(['/ChangePassword']); 


        }
        else{
          // const dialog: PopupConfig = {
          //   title: 'Login Successfull',
          //   close: 'OK',
            
          // };
          // this.dialog.open(PopupComponent, { width: '600px', data: dialog });
          empdata.roles.forEach((e:any) => {
            if(e.role_name=="Employee"){
              this.router.navigate(['/Attendance/EmployeeDashboard']);
            }else if(e.role_name=="Manager"){
              this.router.navigate(['/Attendance/ManagerDashboard']);
            }else{
              this.router.navigate(['/admin/Dashboard']);
            }
          });
          


        }
                
      }
      else {
        this.router.navigate(['/Login']);
        const dialog: PopupConfig = {
          title: this.msgLM14,
          close: 'OK',
          
          
        };
        this.dialog.open(PopupComponent, { width: '600px', data: dialog });
        // swal.fire({title:this.msgLM14,color:"red",showCloseButton: true});
     }
     
    });
  }
  getErrorMessages(errorCode:any){
    this.tss.getErrorMessages(errorCode,1,100).subscribe((result)=>{
     
      if(result.status && errorCode == 'LM1')
      {
        this.msgLM1 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM2')
      {
        this.msgLM2 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM14')
      {
        this.msgLM14 = result.data[0].errormessage
      }
      
  
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