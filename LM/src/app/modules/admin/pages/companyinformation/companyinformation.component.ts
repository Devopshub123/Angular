import { Component, OnInit,ViewChild} from '@angular/core';
import { EmployeeMasterService } from 'src/app/services/employee-master-service';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import { MatDialog } from '@angular/material/dialog'; 
import { Router } from '@angular/router';
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

  constructor(private formBuilder: FormBuilder,private router: Router,private LMS:CompanySettingService,private dialog: MatDialog) { }

  ngOnInit(): void {
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
    this.LMS.getCountry('countrymaster',null,1,10,'keerthi_hospitals').subscribe((results)=>{
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
          data: 'Company Information updated successfully'
        });
       
        this.getCompanyInformation()

      }else {
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: 'Unable to update Company Information'
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
          data: 'Company Information added successfully'
        });

        } else {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: 'Unable to add Company Information'
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
    this.LMS.getCompanyInformation('companyinformation',null,1,10,'keerthi_hospitals').subscribe((data)=>{
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

}
