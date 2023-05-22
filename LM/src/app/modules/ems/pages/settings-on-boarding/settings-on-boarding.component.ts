import { Component, OnInit } from '@angular/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
// import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup,FormControl,Validators, FormBuilder, AbstractControl, FormArray} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EmsService } from '../../ems.service';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { AdminService } from 'src/app/modules/admin/admin.service';

@Component({
  selector: 'app-settings-on-boarding',
  templateUrl: './settings-on-boarding.component.html',
  styleUrls: ['./settings-on-boarding.component.scss']
})
export class SettingsOnBoardingComponent implements OnInit {
  onboardingForm:any= FormGroup;
  onboardrules:any=[]
  days:any;
  ruledataoptions:any=[];
  previousprobationdays:any=0;
  EM28:any;
  EM29:any;
  constructor(private formBuilder: FormBuilder,private router: Router,private ems:EmsService,private dialog: MatDialog,private EM:AdminService) { }

  ngOnInit(): void {
    this.getMessageList();
    this.onboardingForm=this.formBuilder.group(
      {
        SEND_AUTOMATIC_REMAINDERS_ONBOARD: [""],
        PROBATION_PERIOD: ["",],
        PROBATION_PERIOD_DAYS:["",],
        CUSTOMISED_EMAIL_NOTIFICATIONS:[""],
        ACTIVATION_EMAIL:[""],
        PROFILE_NOTIFICATIONS:[""],
        EMPLOYEE_INFORMATION_UPDATED:[""],
        ONBOARDING:[""],
        NEW_HIRE_ADDED:[""],
        ON_BOARDING_COMPLETION:[""],
        EMPLOYEE_NOT_JOINING:[""]
    });
    this.days = [1,2,3,4,5,6,7,8,9,10,11,12];
    this.getOnboardingSettings();
    this.onboardingForm.get('PROBATION_PERIOD_DAYS')?.valueChanges.subscribe((selectedValue:any) => {
      for(let i=0;i<this.onboardrules.length;i++){
        if(this.onboardrules[i].rulename === 'PROBATION_PERIOD_DAYS')
          this.onboardrules[i].value =  selectedValue;
      }
    });
  }

  getOnboardingSettings(){
    this.ems.getOnboardingSettings().subscribe((result) => {
      this.onboardrules = result.data;
      for(let i=0;i<this.onboardrules.length;i++){
        if(this.onboardrules[i].rulename === "PROBATION_PERIOD_DAYS") {
          this.onboardingForm.controls.PROBATION_PERIOD_DAYS.setValue(Number(this.onboardrules[i].value));
          this.previousprobationdays = Number(this.onboardrules[i].value);
        }
        else this.onboardingForm.controls[this.onboardrules[i].rulename].setValue(!!Number(this.onboardrules[i].value));
      }
    })
  }


  setOnboardingSettings(){
    this.ruledataoptions =[];
    this.onboardrules.forEach((e: any) => {
      this.ruledataoptions.push(
        {
          "id":e.id,
          "ruleid":e.ruleid,
          "rulevalue":e.value
        });
    });
     this.ems.setOnboardingSettings({ruledata:this.ruledataoptions}).subscribe((result:any)=>{
      if (result.status){
        this.previousprobationdays = this.onboardingForm.controls.PROBATION_PERIOD_DAYS.value;
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: this.EM28
        });

      }
      else{
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: this.EM29
        });
      }
    })

  }

  toglechange(rulename:any,event:any) {
 for(let i=0;i<this.onboardrules.length;i++){
      if(this.onboardrules[i].rulename === rulename)
        this.onboardrules[i].value = event.checked ? '1':'0';
    }
    this.onboardingForm.controls.PROBATION_PERIOD_DAYS.setValue(Number(this.previousprobationdays)*(this.onboardingForm.controls.PROBATION_PERIOD.value?1:0));

    this.onboardingForm.controls.ACTIVATION_EMAIL.setValue(Number(this.onboardingForm.controls.ACTIVATION_EMAIL.value)*(this.onboardingForm.controls.CUSTOMISED_EMAIL_NOTIFICATIONS.value?1:0));
    this.onboardingForm.controls.PROFILE_NOTIFICATIONS.setValue(Number(this.onboardingForm.controls.PROFILE_NOTIFICATIONS.value)*(this.onboardingForm.controls.CUSTOMISED_EMAIL_NOTIFICATIONS.value?1:0));
    this.onboardingForm.controls.ONBOARDING.setValue(Number(this.onboardingForm.controls.ONBOARDING.value)*(this.onboardingForm.controls.CUSTOMISED_EMAIL_NOTIFICATIONS.value?1:0));

    this.onboardingForm.controls.EMPLOYEE_INFORMATION_UPDATED.setValue(Number(this.onboardingForm.controls.EMPLOYEE_INFORMATION_UPDATED.value)*(this.onboardingForm.controls.PROFILE_NOTIFICATIONS.value?1:0));

    this.onboardingForm.controls.NEW_HIRE_ADDED.setValue(Number(this.onboardingForm.controls.NEW_HIRE_ADDED.value)*(this.onboardingForm.controls.ONBOARDING.value?1:0));
    this.onboardingForm.controls.ON_BOARDING_COMPLETION.setValue(Number(this.onboardingForm.controls.ON_BOARDING_COMPLETION.value)*(this.onboardingForm.controls.ONBOARDING.value?1:0));
    this.onboardingForm.controls.EMPLOYEE_NOT_JOINING.setValue(Number(this.onboardingForm.controls.EMPLOYEE_NOT_JOINING.value)*(this.onboardingForm.controls.ONBOARDING.value?1:0));
}

  getMessageList(){
    let info={
      "code": null,
      "pagenumber":1,
      "pagesize":1000
    }
    this.EM.getEMSMessagesList(info).subscribe((result: any) => {
      if(result && result.status){
        for(let i=0;i<result.data.length;i++){
          if(result.data[i].code =='EM28'){
            this.EM28=result.data[i].message;

          }
          else if(result.data[i].code =='EM29'){
            this.EM29=result.data[i].message;

          }
          
        }

      }
    })

  }


}

