import { Component, OnInit, ViewChild  } from '@angular/core';
import { FormGroup,FormControl,Validators, FormBuilder, AbstractControl, FormArray, ValidatorFn, ValidationErrors} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from 'src/app/modules/admin/admin.service';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { environment } from 'src/environments/environment';
import * as _moment from 'moment';
import { EmsService } from 'src/app/modules/ems/ems.service';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
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
  selector: 'app-subscription-master',
  templateUrl: './subscription-master.component.html',
  styleUrls: ['./subscription-master.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class SubscriptionMasterComponent implements OnInit {
  enable: any = null;
  isdata: boolean = true;
  isEdit: boolean = true;
  isSave: boolean = false;
  isadd:boolean=true;
  editing:boolean=false;
  isviewdata:boolean=false;

  editdata:any=[];

  company:any='Sreeb Tech'

  subscriptionForm:any= FormGroup;
  isview:boolean=true;
  ishide:boolean=false;
  reasondata:any;
  userSession:any;
  displayedColumns: string[] = ['sno','plan','monthUser','yearUser','min-user','max-user','action'];
  dataSource: MatTableDataSource<any>=<any>[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  companyDBName: any = environment.dbName;
  /** */
  isAddBtn = true;
  isData = false;
  searchTextboxControl = new FormControl();
  flag: boolean = true;
  employeeList: any = [
    {cmp_code:"M-1",module:"All"},
    {cmp_code:"M-2",module:"AMS"},
    {cmp_code:"M-3",module:"LMS"},
    {cmp_code:"M-4",module:"Payroll"},
  ];
  selectedEmployees: any = [];
  constructor(private formBuilder: FormBuilder, private router: Router, public dialog: MatDialog,
    private AS: AdminService, private ES: EmsService, private LM: CompanySettingService) {
   }
   seperationsList: any = [];
   plansdata:any=[];
  //  plansdata:any=[{id:1,'plan':'standard'},{id:1,'plan':'premium'},{id:1,'plan':'extra premium'}]
  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.getSpryplePlans();
    this.getSpryplePlanCostDetails();
    /** */
    this.subscriptionForm=this.formBuilder.group(
      {
      planName:["",[Validators.required]],
      monthlyCost:["",[Validators.required]],
      yearlyCost:["",[Validators.required]],
      modules:["",[Validators.required]],
      minUsers:["",[Validators.required]],
      maxUsers:["",],
      });
      this.subscriptionForm.get('planName')?.valueChanges.subscribe((selectedValue:any) => {
      this.getMinUserForPlan(selectedValue);
      })
  }
  addNew() {
    this.isData = true;
    this.isAddBtn = false;
  }
  submit(){
    this.isview=false;
   this.ishide=true;
  }
  cancel(){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/Admin/subscription-master"]));

  }
  getMinUserForPlan(data:any){
    this.AS.getMinUserForPlan(data).subscribe((result:any)=>{
      if(result.status){
        if(result.data[0].minimum_value == 0){
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data:'The previous slab of this plan does not contain a maximum value. Please set that value and proceed with creation of a new slab.'
          });

        }
        else{
          this.subscriptionForm.controls.minUsers.setValue(result.data[0].minimum_value)
        }
        

      }
     
    })
  }
  getSpryplePlanCostDetails(){
    this.AS.getSpryplePlanCostDetails().subscribe((result:any)=>{
      if(result.status&&result.data.length>0){
        this.dataSource = result.data;
        console.log(this.dataSource)

      }
    })
  }

  saved(){
  
    // if(this.subscriptionForm.valid){
      let data = {
        plan_id_value:this.subscriptionForm.controls.planName.value,
        lower_range_value:this.subscriptionForm.controls.minUsers.value,
        upper_range_value:this.subscriptionForm.controls.maxUsers.value==''?null:this.subscriptionForm.controls.maxUsers.value,
        cost_per_user_monthly:this.subscriptionForm.controls.monthlyCost.value,
        cost_per_user_yearly:this.subscriptionForm.controls.yearlyCost.value,
        created_by_value:this.userSession.id,
        id_value:null
      }
      this.AS.setPlanDetails(data).subscribe((result:any)=>{
       if(result.status){
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/Admin/subscription-master"]));
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data:'Subscription plan added successfully.'
        });

       }
      })
    // }
    //cost_per_user_monthly,cost_per_user_yearly,created_by_value,id_value
   }


  getCompanyInformation(){
    this.LM.getCompanyInformation('companyinformation',null,1,10,this.companyDBName).subscribe((data:any)=>{
      if(data.status && data.data.length!=0) {
        this.company=data.data[0].companyname;

      }else {
        }

    })

  }
  getSpryplePlans(){
    this.AS.getSpryplePlans().subscribe((result:any)=>{
      if(result.status&&result.data.length>0){
        this.plansdata = result.data;
        console.log(this.plansdata)

      }
    })
  }
   
 

  edit(event: any, data: any) {
    this.isadd=false;
    this.editing=true;
    this.editdata = data;
    this.subscriptionForm.controls.planName.setValue(data.comment);
    this.subscriptionForm.controls.monthlyCost.setValue(data.comment);
    this.subscriptionForm.controls.yearlyCost.setValue(data.comment);
    this.subscriptionForm.controls.modules.setValue(data.comment);
    this.subscriptionForm.controls.minUsers.setValue(data.comment);
    this.subscriptionForm.controls.maxUsers.setValue(data.comment);

  }
  editsaved(){

  }
  save(event:any){
    this.enable = null;
    this.isEdit = true;
    this.isSave = false;

  }

  view($event:any,data:any){
    this.isviewdata=true;
    this.isadd=false;
    this.editing=false;;
    this.editdata = data;
    this.subscriptionForm.controls.planName.setValue(data.comment);
    this.subscriptionForm.controls.monthlyCost.setValue(data.comment);
    this.subscriptionForm.controls.yearlyCost.setValue(data.comment);
    this.subscriptionForm.controls.modules.setValue(data.comment);
    this.subscriptionForm.controls.minUsers.setValue(data.comment);
    this.subscriptionForm.controls.maxUsers.setValue(data.comment);

  }

  selectedEmployesChange(event: any) {
    if (event.isUserInput && event.source.selected == false) {
      let index = this.selectedEmployees.indexOf(event.source.value);
      this.selectedEmployees.splice(index, 1)

    } else {
      if(!this.selectedEmployees.includes(event.source.value.empid)) {
        this.selectedEmployees.push(event.source.value.empid);
      }
    }
  }

  openedSearch(e:any) {
    this.searchTextboxControl.patchValue('');
  }
  compareFn(option1:any,option2:any){
    return option1.empid === option2.empid;
  }
  stopLeadingZero(event:any) {
    const input = event.target.value;
    if (input.length === 0 && event.which === 48) {
      event.preventDefault();
    }
  }
  alphabetKeyPress(event: any,) {
    const pattern = /[a-zA-Z ]/;
      let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
