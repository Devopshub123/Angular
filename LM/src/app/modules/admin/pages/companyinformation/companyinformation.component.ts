import { Component, OnInit,ViewChild} from '@angular/core';
import { EmployeeMasterService } from 'src/app/services/employee-master-service';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { OnlyNumberDirective } from 'src/app/custom-directive/only-number.directive';
import { FormGroup,FormControl,Validators, FormBuilder,FormArray, AbstractControl} from '@angular/forms';
import { environment } from 'src/environments/environment';
import { EmsService } from 'src/app/modules/ems/ems.service';
import * as _moment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { DatePipe } from '@angular/common';
const moment =  _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
@Component({
  selector: 'app-companyinformation',
  templateUrl: './companyinformation.component.html',
  styleUrls: ['./companyinformation.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
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
  msgEM1:any;
  msgEM3:any;
  msgEM2:any;
  msgEM67:any
  msgEM68:any;
  msgLM22:any;
  msgEM69:any;
  msgEM70:any;
  maxDate = new Date();
  pipe = new DatePipe('en-US');
  companyDBName:any = environment.dbName;
  constructor(private formBuilder: FormBuilder,private router: Router,
    private LMS:CompanySettingService,private dialog: MatDialog,private ts: LoginService,
    private emsService:EmsService) { 
    this.getCountry();
    this.getCompanyInformation();
    }

  ngOnInit(): void {
    this.getMessages('EM1')
    this.getMessages('EM3')
    this.getMessages('EM2')
    this.getMessages('EM67')
    this.getMessages('EM68')
    this.getMessages('LM22')
    this.getMessages('EM69')
    this.getMessages('EM70')
    
    this.companyForm=this.formBuilder.group(
      {
        companyname:["",Validators.required],
        address1:["",Validators.required],
        contact:["",[Validators.required]],
        email:["",[Validators.required,Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        // website:["",Validators.required,Validators.pattern("^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$")],
        website:["",Validators.required], //,Validators.pattern('^(?www)?:[a-zA-Z/].[a-zA-z]')
        address2:[""],
        cin:["",Validators.required],
        gstnumber:["",Validators.required],
        established_date:[new Date(),Validators.required],
        secondarycontactnumber:[""],
        city: ["",Validators.required],
        state: ["",Validators.required],
        pincode: ["",Validators.required],
        country: ["",Validators.required],

      })
      this.companyForm.get('country')?.valueChanges.subscribe(selectedValue => {
        this.stateDetails= [];
        this.LMS.getStatesc(selectedValue).subscribe((data)=>{
          this.stateDetails=data.data;
          if(this.companyinfo != null)
          {
            this.companyForm.controls.state.setValue(this.companyinfo.stateid);

          }
        })


      })
    this.companyForm.get('state')?.valueChanges.subscribe(selectedValue => {
      this.companyForm.controls.city.setValue("");
      this.cityDetails = [];
       this.LMS.getCities(selectedValue).subscribe((data)=>{
          this.cityDetails=data.data
          if(this.companyinfo != null)
          {
            this.companyForm.controls.city.setValue(this.companyinfo.locationid);
          }
      // this.availablecities=data
        })
      })
  }
  getCountry(){
    this.LMS.getCountry('countrymaster',null,1,10,this.companyDBName).subscribe((results)=>{
      this.CountryDetails=results.data;


    })
  }

  update() {
   
    if(this.companyForm.valid){
    let companyinformation ={
      id: this.companyinfo.id,
      companyname:this.companyForm.controls.companyname.value,
      companywebsite:this.companyForm.controls.website.value,
      cin:this.companyForm.controls.cin.value,
      gstnumber:this.companyForm.controls.gstnumber.value,
      established_date :this.pipe.transform(this.companyForm.controls.established_date.value, 'yyyy-MM-dd'),
      primarycontactnumber:this.companyForm.controls.contact.value,
      secondarycontactnumber:this.companyForm.controls.secondarycontactnumber.value==''?null:this.companyForm.controls.secondarycontactnumber.value,
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
          data: this.msgEM70
        });

        this.getCompanyInformation()

      }else {
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: this.msgEM68
        });

      }

    })
    }
  }

  save(){
    this.issubmitted=true;
    let companyinformation ={
      companyname:this.companyForm.controls.companyname.value,
      companywebsite:this.companyForm.controls.website.value,
      cin:this.companyForm.controls.cin.value,
      gstnumber:this.companyForm.controls.gstnumber.value,
      established_date :this.pipe.transform(this.companyForm.controls.established_date.value, 'yyyy-MM-dd'),
      primarycontactnumber:this.companyForm.controls.contact.value,
      secondarycontactnumber:this.companyForm.controls.secondarycontactnumber.value==''?null:this.companyForm.controls.secondarycontactnumber.value,
      primarycontactemail:this.companyForm.controls.email.value,
      address1:this.companyForm.controls.address1.value,
      address2:this.companyForm.controls.address2.value?this.companyForm.controls.address2.value:'',
      country:this.companyForm.controls.country.value,
      state:this.companyForm.controls.state.value,
      city:this.companyForm.controls.city.value,
      pincode:this.companyForm.controls.pincode.value,
      companyDBName:this.companyDBName
    }
    if(true) {

      this.LMS.setCompanyInformation(companyinformation).subscribe((data) => {

        if (data.status) {
          this.getCompanyInformation()
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: this.msgEM69
        });

        } else {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: this.msgEM67
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
    this.LMS.getCompanyInformation('companyinformation',null,1,10,this.companyDBName).subscribe((data)=>{
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
        this.companyForm.controls.cin.setValue(data.data[0].cin);
        this.companyForm.controls.gstnumber.setValue(data.data[0].gstnumber);
        this.companyForm.controls.established_date.setValue(new Date(data.data[0].established_date)??new Date());
        if(data.data[0].secondarycontactnumber=="null"){
        this.companyForm.controls.secondarycontactnumber.setValue('');
        }
        else{
          this.companyForm.controls.secondarycontactnumber.setValue(data.data[0].secondarycontactnumber);
        }
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
      else if(result.status && messageCode == 'EM2')
      {
        this.msgEM2 = result.data[0].message
      }
      else if(result.status && messageCode == 'EM67')
      {
        this.msgEM67 = result.data[0].message
      }
      else if(result.status && messageCode == 'EM68')
      {
        this.msgEM68 = result.data[0].message
      }
      else if(result.status && messageCode == 'EM69')
      {
        this.msgEM69 = result.data[0].message
      }
      else if(result.status && messageCode == 'EM70')
      {
        this.msgEM70 = result.data[0].message
      }

    })
  }
  alphaNumberOnly(e: any) {  // Accept only alpha numerics, not special characters
    var regex = new RegExp("^[a-zA-Z0-9 ]+$");
    var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (regex.test(str)) {
      return true;
    }
    e.preventDefault();
    return false;
  }

}
