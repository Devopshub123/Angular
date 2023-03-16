import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { AdminService } from '../../admin.service';
import { MatDialog } from '@angular/material/dialog';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';

@Component({
  selector: 'app-register-validation',
  templateUrl: './register-validation.component.html',
  styleUrls: ['./register-validation.component.scss']
})
export class RegisterValidationComponent implements OnInit {
  formGroup: any=FormGroup;

  constructor(private formBuilder: FormBuilder, private dialog: MatDialog,
    private tss: LoginService, private router: Router,private AS: AdminService,
    private activatedRoute: ActivatedRoute,) { }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      'comapnyname':['', Validators.required],
      'username': ['', Validators.required],
      'captcha': ['', Validators.required],
      
    });
  }
  submit(){
    let data ={
      email :this.formGroup.controls.username.value,
      companycode: this.formGroup.controls.comapnyname.value,
    }
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
