import { Component, OnInit, ViewChild  } from '@angular/core';
import { FormGroup,FormControl,Validators, FormBuilder, AbstractControl, FormArray} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from 'src/app/modules/admin/admin.service';
import { EmsService } from '../../ems.service';
import { DatePipe } from '@angular/common';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { ReviewAndApprovalsComponent } from 'src/app/modules/leaves/dialog/review-and-approvals/review-and-approvals.component';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { environment } from 'src/environments/environment';
import * as _moment from 'moment';
// import {default as _rollupMoment} from 'moment';
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
  selector: 'app-resignation',
  templateUrl: './resignation.component.html',
  styleUrls: ['./resignation.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ResignationComponent implements OnInit {
  enable: any = null;
  isdata: boolean = true;
  isEdit: boolean = true;
  isSave: boolean = false;
  isadd:boolean=true;
  editing:boolean=false;
  isviewdata:boolean=false;
  titleName:any;
  resonid:any;
  reason:any;
  editdata:any=[];
  noticeperiod:any;
  company:any='Sreeb Tech'
  empname:any;
  resignForm:any= FormGroup;
  isview:boolean=true;
  ishide:boolean=false;
  reasondata:any;
  releivedate:any;
  userSession:any;
  min:any=new Date();
  max:any;
  canceldata:any;
  pipe = new DatePipe('en-US');
  displayedColumns: string[] = ['sno','date','status','reason','action'];
  dataSource: MatTableDataSource<any>=<any>[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  companyDBName:any = environment.dbName;
  constructor(private formBuilder: FormBuilder,private router: Router,public dialog: MatDialog,private adminService: AdminService,private ES:EmsService,private LM:CompanySettingService) {
    this.getnoticeperiods()
   }
   seperationsList: any = [];
  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.resignForm=this.formBuilder.group(
      {
      resigndate: [new Date(),],
      noticperiod: ['',],
      releivingdate:[],
      exitdate:[""],
      reason:["",Validators.required],
      notice:["",],

      });
      this.getReasons();
      this.getCompanyInformation();
      this.getEmployeesResignation();
    this.empname = this.userSession.firstname+'  '+this.userSession.lastname;
    this.resignForm.get('noticperiod')?.valueChanges.subscribe((selectedValue:any) => {
      this.max= new Date(new Date().setDate(new Date().getDate() + Number(selectedValue)))
      this.resignForm.controls.releivingdate.setValue(new Date(this.max));
    })


  }
  submit(){
    this.isview=false;
   this.ishide=true;
  }
  cancel(){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/MainDashboard"]));

  }
  clear() {
   this.isview=true;
    this.ishide=false;
    this.isadd=true;
    this.editing=false;
    this.isviewdata=false;
    this.resignForm.controls.exitdate.setValue('')
    this.resignForm.controls.reason.setValue('')
    this.resignForm.controls.notice.setValue('')
  }

  saved(){
    if(this.resignForm.valid){
      let data = {
        resgid:null,
        empid:this.userSession.id,
        applied_date:this.pipe.transform(this.resignForm.controls.resigndate.value,'yyyy-MM-dd')+' '+this.pipe.transform(this.resignForm.controls.resigndate.value, 'HH:mm:ss'),
        notice_period:this.resignForm.controls.noticperiod.value,
        original_relieving_date:this.pipe.transform(this.resignForm.controls.releivingdate.value,'yyyy-MM-dd')+' '+this.pipe.transform(this.resignForm.controls.releivingdate.value, 'HH:mm:ss'),
        actual_relieving_date:null,
        requested_relieving_date:this.pipe.transform(this.resignForm.controls.exitdate.value,'yyyy-MM-dd')+' '+this.pipe.transform(this.resignForm.controls.exitdate.value, 'HH:mm:ss'),
        reason_id:this.resignForm.controls.reason.value,
        resg_comment:this.resignForm.controls.notice.value,
        resg_status:"Submitted",
        approver_comment:null,
        actionby:this.userSession.id
      }

      this.ES.setEmployeeResignation(data).subscribe((res: any) => {
        if(res.status && res.data == 0){
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/ems/resignation"]));
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: 'Resignation added successfully'
          });

        }
        else{
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: 'Unable to add resignation'
          });
        }

      });

    }


  }
  getEmployeesResignation(){
    this.ES.getEmployeesResignation(this.userSession.id).subscribe((res: any) => {
      if (res.status) {
         this.dataSource = new MatTableDataSource(res.data)
        this.seperationsList = res.data;
        if (this.seperationsList.length > 0) {
          this.isview = false;
          this.ishide = true;
        }
       }
    });

  }
  getnoticeperiods(){
    this.ES.getnoticeperiods().subscribe((res: any) => {
      if(res.status){
       this.resignForm.controls.noticperiod.setValue(res.data[0].value)
      }
    });

  }
  getCompanyInformation(){
    this.LM.getCompanyInformation('companyinformation',null,1,10,this.companyDBName).subscribe((data:any)=>{
      if(data.status && data.data.length!=0) {
        this.company=data.data[0].companyname;

      }else {
        // this.enable=true;
        // this.isSubmit=true;
        // this.companyForm=[];

      }

    })

  }
  getReasons() {
    this.adminService.getAllReasonsList().subscribe((res: any) => {
      if (res.status && res.data.length != 0) {
        this.reasondata=res.data;
       }
    })
  }
  edit(event: any, data: any) {
    console.log(data)
    this.isadd=false;
    this.editing=true;
    this.editdata = data;
    this.resignForm.controls.resigndate.setValue(new Date(data.applied_date));
    this.resignForm.controls.releivingdate.setValue(new Date(data.original_relieving_date));
    this.resignForm.controls.exitdate.setValue(new Date(data.requested_relieving_date));
    this.resignForm.controls.notice.setValue(data.comment);
    for(let i=0;i<this.reasondata.length;i++){
      if(data.reason == this.reasondata[i].reason){
        this.resignForm.controls.reason.setValue(this.reasondata[i].id);
       break;
      }
    }

  }
  editsaved(){
    this.editdata;
    let data = {
      resgid:this.editdata.id,
      empid:this.userSession.id,
      applied_date:this.pipe.transform(this.resignForm.controls.resigndate.value,'yyyy-MM-dd')+' '+this.pipe.transform(this.resignForm.controls.resigndate.value, 'HH:mm:ss'),
      notice_period:this.resignForm.controls.noticperiod.value,
      original_relieving_date:this.pipe.transform(this.resignForm.controls.releivingdate.value,'yyyy-MM-dd')+' '+this.pipe.transform(this.resignForm.controls.releivingdate.value, 'HH:mm:ss'),
      actual_relieving_date:null,
      requested_relieving_date:this.pipe.transform(this.resignForm.controls.exitdate.value,'yyyy-MM-dd')+' '+this.pipe.transform(this.resignForm.controls.exitdate.value, 'HH:mm:ss'),
      reason_id:this.resignForm.controls.reason.value,
      resg_comment:this.resignForm.controls.notice.value,
      resg_status:"Submitted",
      approver_comment:null,
      actionby:this.userSession.id
    }
    this.ES.setEmployeeResignation(data).subscribe((res: any) => {

        if(res.status && res.data == 0){
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/ems/resignation"]));
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: 'Resignation updated successfully '
          });

        }
        else{
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: 'Unable to update resignation'
          });
        }


    });

  }
  save(event:any){
    this.enable = null;
    this.isEdit = true;
    this.isSave = false;

  }
  canceledit(event: any, id: any) {
    this.enable = null;
    this.isEdit = true;
    this.isSave = false;

  }
  view($event:any,data:any){
    this.isviewdata=true;
    this.isadd=false;
    this.editing=false;;
    this.editdata = data;
    this.resignForm.controls.resigndate.setValue(new Date(data.applied_date));
    this.resignForm.controls.releivingdate.setValue(new Date(data.applied_date));
    this.resignForm.controls.exitdate.setValue(new Date(data.requested_relieving_date));
    this.resignForm.controls.notice.setValue(data.comment);
    for(let i=0;i<this.reasondata.length;i++){
      if(data.reason == this.reasondata[i].reason){
        this.resignForm.controls.reason.setValue(this.reasondata[i].id);
         break;
      }
    }

  }
  cancelresignation(event: any,data:any){
    for(let i=0;i<this.reasondata.length;i++){
      if(data.reason == this.reasondata[i].reason){
        this.resonid=this.reasondata[i].id
        break;
      }
    }
    this.enable = null;
    this.isEdit = true;
    this.isSave = false;
    this.editdata = data;
    this.canceldata={
      applied_date: data.applied_date,
      resgid:data.id,
      empid:this.userSession.id,
      notice_period:data.notice_period,
      original_relieving_date:data.original_relieving_date,
      actual_relieving_date:null,
      requested_relieving_date:data.requested_relieving_date,
      reason_id:this.resonid,
      resg_comment:'',
      resg_status:"Cancelled",
      approver_comment:null,
      actionby:this.userSession.id
    }
    this.titleName="Do you really want to cancel the Resignation?"
    this.openDialogcancel();
  }
  openDialogcancel(): void {
    const dialogRef = this.dialog.open(ReviewAndApprovalsComponent, {
      width: '600px',position:{top:`70px`},
      data: {name: this.titleName, reason: this.reason}
    });

    dialogRef.afterClosed().subscribe((result:any) => {
    this.canceldata.resg_comment =result.reason;
    this.canceldata.resg_status = 'Cancelled'
      if(result!=''){
        this.ES.setEmployeeResignation(this.canceldata).subscribe((res: any) => {
            if(res.status && res.data == 0){
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
                this.router.navigate(["/ems/resignation"]));
              let dialogRef = this.dialog.open(ReusableDialogComponent, {
                position:{top:`70px`},
                disableClose: true,
                data: 'Resignation successfully cancelled'
              });

            }
            else{
              let dialogRef = this.dialog.open(ReusableDialogComponent, {
                position:{top:`70px`},
                disableClose: true,
                data: 'Resignation not cancelled'
              });
            }


        });


      }
    });
  }



}
