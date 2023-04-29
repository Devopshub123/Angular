
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
import { EmsService } from 'src/app/modules/ems/ems.service';
import { MatSelect } from '@angular/material/select';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';

@Component({
  selector: 'app-subscription-plans-master',
  templateUrl: './subscription-plans-master.component.html',
  styleUrls: ['./subscription-plans-master.component.scss']
})
export class SubscriptionPlansMasterComponent implements OnInit {
  enable: any = null;
  isdata: boolean = true;
  isEdit: boolean = true;
  isSave: boolean = false;
  isadd:boolean=true;
  editing:boolean=false;
  isviewdata:boolean=false;

  editdata:any=[];
  selectedmodule:any=[];
  company:any='Sreeb Tech'
  array:any=[]
  subscriptionForm:any= FormGroup;
  isview:boolean=true;
  ishide:boolean=false;
  ishideselect:boolean=false;
  reasondata:any;
  userSession:any;
  displayedColumns: string[] = ['sno','plan','module','status','action'];
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
  planid:any=null;

  selectedModules: any = [];
  arrayValue:any=[{"id":"Active","name":"Active"},{"id":"Inactive","name":"Inactive"}];
  modulesList:any=[];
  ischecked:boolean=false;
  constructor(private formBuilder: FormBuilder, private router: Router, public dialog: MatDialog,
    private adminService: AdminService, private ES: EmsService, private LM: CompanySettingService) {
   }
   seperationsList: any = [];
   editflag: boolean = true;
  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    /** */
    this.getSpryplePlans();
    this.getmodules();
    this.subscriptionForm=this.formBuilder.group(
      {
      planName:["",[Validators.required]],
      modules:[ "",[Validators.required]],
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
            this.router.navigate(["/Admin/subscription-plans"]));

  }
//   selectAll(select: any, values:any, array:any) {
//     console.log("select ",select)
//     this.ishideselect = true;
// this.ischecked = true;
// select.value = values;
// array = values;
// this.subscriptionForm.controls.modules.setValue(array)


// }

// deselectAll(select: MatSelect) {
// this.ishideselect = false;
// this.ischecked = false
// this.selectedmodule= [];
// select.value = [];
// this.subscriptionForm.controls.modules.setValue('')

// }

  saved(){
    let array=[]
    let data = this.subscriptionForm.controls.modules.value;
    for (let i=0;i<data.length;i++){
      array.push(data[i].id)

    }
    if(this.subscriptionForm.valid){
      let data ={
        plan:this.subscriptionForm.controls.planName.value,
        modules:this.selectedModules,
        created_by:this.userSession.id,
        id:this.editing?1:null
      }
      this.adminService.setSpryplePlan(data).subscribe((result:any)=>{
        if(result.status){
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data:"Data added succesfully. "
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
   getSpryplePlans(){
    this.adminService.getSpryplePlans().subscribe((result:any)=>{
      if(result.status&&result.data.length>0){
        this.dataSource = result.data;
        console.log(this.dataSource)

      }
    })
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
    console.log(data)
    this.editflag =false;
    this.isData = true;
    this.isAddBtn = false;
    this.isadd=false;
    this.editing=true;
    this.editdata = data;
    let datas = JSON.parse(data.modules)
    this.planid = data.id;
    this.subscriptionForm.controls.planName.setValue(data.plan_name);

    for(let i=0;i<datas.length;i++){
      this.selectedmodule.push(datas[i].id);
    }
    this.subscriptionForm.controls.modules.setValue(this.selectedmodule);
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

  selectedModulesChange(event: any) {
    if (event.isUserInput && event.source.selected == false) {
      let index = this.selectedModules.indexOf(event.source.value);
      this.selectedModules.splice(index, 1)

    } else {
      if(!this.selectedModules.includes(event.source.value.id)) {
        this.selectedModules.push(event.source.value.id);
      }
    }
  }
  getmodules(){
    this.adminService.getAllModules().subscribe((result:any)=>{
      if(result.status&& result.data.length>0){
        for(let i=0;i<result.data.length;i++){
          this.modulesList.push({"id":result.data[i].id,"modulename":result.data[i].modulename});
          // this.modulesList[i].push(result.data[i].modulename)
        }
        // this.modulesList=result.data;
        console.log(this.modulesList)
        // this.subscriptionForm.controls.modules.setValue(this.modulesList)
      }


    })
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

