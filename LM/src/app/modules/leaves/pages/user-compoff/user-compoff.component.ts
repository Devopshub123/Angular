import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl,Validators, FormBuilder, AbstractControl, FormArray} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-user-compoff',
  templateUrl: './user-compoff.component.html',
  styleUrls: ['./user-compoff.component.scss']
})
export class UserCompoffComponent implements OnInit {
  CompoffForm:any= FormGroup;
  private exportTime = { hour: 7, minute: 15, meriden: 'PM', format: 24 };

  constructor(private formBuilder: FormBuilder,private router: Router,) { }

  ngOnInit(): void {
    this.CompoffForm=this.formBuilder.group(
      {
      empid: ["",Validators.required],        
      empname: ["",],
      workeddate:[""],
      workedtime:["",],
      reason:["",]
      
    });
  }
  submit(){}
  cancel(){}
  onChangeHour(event:Event){}

}
