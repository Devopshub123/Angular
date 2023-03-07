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
  displayedColumns: string[] = ['sno','plan','monthUser','yearUser','module','min-user','max-user','status','action'];
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
    private adminService: AdminService, private ES: EmsService, private LM: CompanySettingService) {
   }
   seperationsList: any = [];
  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    /** */
    this.subscriptionForm=this.formBuilder.group(
      {
      planName:["",[Validators.required]],
      monthlyCost:["",[Validators.required]],
      yearlyCost:["",[Validators.required]],
      modules:["",[Validators.required]],
      minUsers:["",[Validators.required]],
      maxUsers:["",[Validators.required]],
      });
    
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

  saved(){
   }


  getCompanyInformation(){
    this.LM.getCompanyInformation('companyinformation',null,1,10,this.companyDBName).subscribe((data:any)=>{
      if(data.status && data.data.length!=0) {
        this.company=data.data[0].companyname;

      }else {
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
