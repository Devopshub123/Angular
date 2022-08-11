import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { PopupComponent,PopupConfig } from '../popup/popup.component';
import { MatDialog } from '@angular/material/dialog'; 
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';


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
  issubmit:boolean= false;
  constructor(private formBuilder: FormBuilder,private dialog: MatDialog,private tss:LoginService,private router: Router,) { }

  ngOnInit() {
    this.createForm();
    this.getErrorMessages('LM14')
    this.getErrorMessages('LM1')
    this.getErrorMessages('LM2')
  }
  hide = true;

  createForm() {
    this.formGroup = this.formBuilder.group({
      'username': ['', Validators.required],
      'password': ['', Validators.required],
    });
  }
  login(){
    this.issubmit = true;
    this.email = this.formGroup.controls.username.value;
    this.password = this.formGroup.controls.password.value;
    let data = {
      email:this.email,
      password:this.password
    }
    if(this.formGroup.valid){
      this.tss.Savelogin(data).subscribe((data) =>{
        if(data.status === true){
          let empdata = data.result[0];
          sessionStorage.setItem('user',JSON.stringify(empdata));
          this.router.navigate(['/MainDashboard'])
                  
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