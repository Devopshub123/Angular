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
  selector: 'app-settings-off-boarding',
  templateUrl: './settings-off-boarding.component.html',
  styleUrls: ['./settings-off-boarding.component.scss']
})
export class SettingsOffBoardingComponent implements OnInit {
  offboardingForm:any= FormGroup;
  offboardrules:any=[]
  days:any;
  ruledataoptions:any=[];
  EM26:any;
  EM27:any;
  previousnoticeperioddays:any=0;
  constructor(private formBuilder: FormBuilder,private router: Router,private ems:EmsService,private dialog: MatDialog,private EM:AdminService) { }

  ngOnInit(): void {
    this.getMessageList();
    this.offboardingForm=this.formBuilder.group(
      {
        SEND_AUTOMATIC_REMAINDERS_OFFBOARD: [""],

        NOTICE_PERIOD: ["",],
        NOTICE_PERIOD_DAYS:[""],
        RESIGNATION_APPROVAL_SEQUENCE:[""]

    });
    this.days = [0,15,30,45,60,75,90];
    this.getOffboardingSettings();

    this.offboardingForm.get('NOTICE_PERIOD_DAYS')?.valueChanges.subscribe((selectedValue:any) => {
      for(let i=0;i<this.offboardrules.length;i++){
        if(this.offboardrules[i].rulename === 'NOTICE_PERIOD_DAYS')
          this.offboardrules[i].value =  selectedValue;
      }
    });
  }

  getOffboardingSettings(){
    this.ems.getOffboardingSettings().subscribe((result) => {
      this.offboardrules = result.data;
      for(let i=0;i<this.offboardrules.length;i++){
        if(this.offboardrules[i].rulename === "NOTICE_PERIOD_DAYS") {
          this.offboardingForm.controls.NOTICE_PERIOD_DAYS.setValue(Number(this.offboardrules[i].value));
          this.previousnoticeperioddays = Number(this.offboardrules[i].value);
        }
        else this.offboardingForm.controls[this.offboardrules[i].rulename].setValue(!!Number(this.offboardrules[i].value));
      }
    })
  }
  setOffboardingSettings(){
    this.ruledataoptions =[];
    this.offboardrules.forEach((e: any) => {
      this.ruledataoptions.push(
        {
          "id":e.id,
          "ruleid":e.ruleid,
          "rulevalue":e.value
        });
    });
    this.ems.setOffboardingSettings({ruledata:this.ruledataoptions}).subscribe((result:any)=>{
      if (result.status){
        this.previousnoticeperioddays = this.offboardingForm.controls.NOTICE_PERIOD_DAYS.value;
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: this.EM26
        });

      }
      else{
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: this.EM27
        });
      }
    })

  }

  toglechange(rulename:any,event:any) {
    for(let i=0;i<this.offboardrules.length;i++){
      if(this.offboardrules[i].rulename === rulename){
        this.offboardrules[i].value = event.checked ? '1':'0';
      }
    }
    this.offboardingForm.controls.NOTICE_PERIOD_DAYS.setValue(Number(this.previousnoticeperioddays)*(this.offboardingForm.controls.NOTICE_PERIOD.value?1:0));
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
          if(result.data[i].code =='EM26'){
            this.EM26=result.data[i].message;

          }
          else if(result.data[i].code =='EM27'){
            this.EM27=result.data[i].message;

          }
          
        }

      }

    })

  }

}
