import { Component, OnInit,ViewChild} from '@angular/core';
import { EmployeeMasterService } from 'src/app/services/employee-master-service';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { OnlyNumberDirective } from 'src/app/custom-directive/only-number.directive';
import { PopupComponent, PopupConfig } from '../../../../pages/popup/popup.component';
import { FormGroup,FormControl,Validators, FormBuilder,FormArray, AbstractControl} from '@angular/forms';
@Component({
  selector: 'app-companyinformation',
  templateUrl: './companyinformation.component.html',
  styleUrls: ['./companyinformation.component.scss']
})
export class CompanyinformationComponent implements OnInit {
  companyForm!: FormGroup;
  foodCtrl!: FormControl;
  CountryDetails:any=[];
  stateDetails:any=[];
  cityDetails:any=[];
  issubmitted:boolean=false;
  companyinfo:any=[];
  isview:boolean=false;
  isadd:boolean=true;
  isedit:boolean=false;
  msgLM1:any;
  msgLM2:any;
  msgLM3:any;
  msgLM20:any
  msgLM21:any;
  msgLM22:any;
  msgLM57:any;
  msgLM58:any;

  constructor(private formBuilder: FormBuilder,private router: Router,private LMS:CompanySettingService,private dialog: MatDialog,private ts: LoginService) { }

  ngOnInit(): void {
    this.getErrorMessages('LM1')
    this.getErrorMessages('LM2')
    this.getErrorMessages('LM3')
    this.getErrorMessages('LM20')
    this.getErrorMessages('LM21')
    this.getErrorMessages('LM22')
    this.getErrorMessages('LM57')
    this.getErrorMessages('LM58')
    this.getCountry();
    this.getCompanyInformation();
    this.companyForm=this.formBuilder.group(
      {
        companyname:["",Validators.required],
        address1:["",Validators.required],
        contact:["",[Validators.required]],
        email:["",[Validators.required,Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        // website:["",Validators.required,Validators.pattern("^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$")],
        website:["",Validators.required], //,Validators.pattern('^(?www)?:[a-zA-Z/].[a-zA-z]')
        address2:[""],
        city: ["",Validators.required],
        state: ["",Validators.required],
        pincode: ["",Validators.required],
        country: ["",Validators.required],

      })
      this.companyForm.get('country')?.valueChanges.subscribe(selectedValue => {
        this.stateDetails= [];
        this.LMS.getStatesc(selectedValue).subscribe((data)=>{
          this.stateDetails=data[0];
          if(this.companyinfo != null)
          {
            this.companyForm.controls.state.setValue(this.companyinfo.stateid);

          }
        })


      })
      this.companyForm.get('state')?.valueChanges.subscribe(selectedValue => {
        this.cityDetails=[];
        this.LMS.getCities(selectedValue).subscribe((data)=>{
          this.cityDetails=data[0]
          if(this.companyinfo != null)
          {
            this.companyForm.controls.city.setValue(this.companyinfo.locationid);

          }
      // this.availablecities=data
        })
      })
  }
  getCountry(){
    this.LMS.getCountry('countrymaster',null,1,10,'ems').subscribe((results)=>{
      this.CountryDetails=results.data;


    })
  }
  update(){
    let companyinformation ={
      id: this.companyinfo.id,
      companyname:this.companyForm.controls.companyname.value,
      companywebsite:this.companyForm.controls.website.value,
      primarycontactnumber:this.companyForm.controls.contact.value,
      primarycontactemail:this.companyForm.controls.email.value,
      address1:this.companyForm.controls.address1.value,
      address2:this.companyForm.controls.address2.value,
      country:this.companyForm.controls.country.value,
      state:this.companyForm.controls.state.value,
      city:this.companyForm.controls.city.value,
      pincode:this.companyForm.controls.pincode.value,
    }
    this.LMS.putCompanyInformation(companyinformation).subscribe((data)=>{
      if(data.status){
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: this.msgLM58
        });

        this.getCompanyInformation()

      }else {
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: this.msgLM21
        });

      }

    })

  }
  save(){
    this.issubmitted=true;
    let companyinformation ={
      companyname:this.companyForm.controls.companyname.value,
      companywebsite:this.companyForm.controls.website.value,
      primarycontactnumber:this.companyForm.controls.contact.value,
      primarycontactemail:this.companyForm.controls.email.value,
      address1:this.companyForm.controls.address1.value,
      address2:this.companyForm.controls.address2.value?this.companyForm.controls.address2.value:'',
      country:this.companyForm.controls.country.value,
      state:this.companyForm.controls.state.value,
      city:this.companyForm.controls.city.value,
      pincode:this.companyForm.controls.pincode.value,
    }


    if(true) {

      this.LMS.setCompanyInformation(companyinformation).subscribe((data) => {

        if (data.status) {
          this.getCompanyInformation()
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: this.msgLM57
        });

        } else {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: this.msgLM20
          });
        }
      })
    }

  }
  cancel(): void {
    // this.companyForm.reset();
    this.issubmitted=false;
    this.ngOnInit();
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/Admin/CompanyInformation"]));
  }
  canceledit(){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/Admin/CompanyInformation"]));

  }
  edit(){
    this.isview=false;
    this.isadd = true;
    this.isedit=true;


  }
  getCompanyInformation(){
    this.LMS.getCompanyInformation('companyinformation',null,1,10,'ems').subscribe((data)=>{
      if(data.status && data.data.length!=0) {
        // this.enable=false;
        this.isview=true;
        this.isadd=false;


        this.companyinfo =data.data[0];
        this.companyForm.controls.companyname.setValue(data.data[0].companyname);
        this.companyForm.controls.website.setValue(data.data[0].companywebsite);
        this.companyForm.controls.contact.setValue(data.data[0].primarycontactnumber);
        this.companyForm.controls.address1.setValue(data.data[0].address1);
        this.companyForm.controls.address2.setValue(data.data[0].address2);
        this.companyForm.controls.pincode.setValue(data.data[0].pincode);
        this.companyForm.controls.email.setValue(data.data[0].primarycontactemail);
        this.companyForm.controls.country.setValue(data.data[0].countryid);
        this.companyForm.controls.state.setValue(data.data[0].state);
        this.companyForm.controls.city.setValue(data.data[0].city);
        // this.companyForm.controls.companyname.disable();
        // this.companyForm.controls.website.disable();
        // this.companyForm.controls.contact.disable()
        // this.companyForm.controls.address1.disable();
        // this.companyForm.controls.address2.disable();
        // this.companyForm.controls.pincode.disable();
        // this.companyForm.controls.email.disable();



      }else {
        // this.enable=true;
        // this.isSubmit=true;
        // this.companyForm=[];

      }

    })

  }
  getErrorMessages(errorCode:any) {

    this.ts.getErrorMessages(errorCode,1,1).subscribe((result)=>{

      if(result.status && errorCode == 'LM1')
      {
        this.msgLM1 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM2')
      {
        this.msgLM2 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM3')
      {
        this.msgLM3 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM20')
      {
        this.msgLM20 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM21')
      {
        this.msgLM21 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM57')
      {
        this.msgLM57 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM58')
      {
        this.msgLM58 = result.data[0].errormessage
      }

    })
  }

}
