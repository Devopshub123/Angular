import { UserData } from './../../../attendance/models/EmployeeData';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup,FormControl,Validators, FormBuilder, AbstractControl, FormArray} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
// import { AdminService } from 'src/app/modules/admin/admin.service';
import { EmsService } from '../../ems.service';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';


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
  selector: 'app-terminate',
  templateUrl: './terminate.component.html',
  styleUrls: ['./terminate.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class TerminateComponent implements OnInit {
  terminateForm:any= FormGroup;
  designations:any=[];
  terminationlist:any=[];
  terminateddata:any=[];
  employeelist:any=[];
  categiry:any;
  employee:any;
  isview:boolean=true;
  min:any=new Date();
  max:any=new Date();
  userSession:any;
  pageLoading = true;
  isEdit: boolean = true;
  isSave: boolean = false;
  enable: any = null;
  pipe = new DatePipe('en-US');
  isterminate:boolean=false;
  istable:boolean=true;
  displayedColumns: string[] = ['fullname','manager','terminatedate','status','Action'];
  dataSource: MatTableDataSource<any>=<any>[];
  // dataSource = new MatTableDataSource<PeriodicElement>(Sample_Data);
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private formBuilder: FormBuilder,private router: Router,private ES:EmsService,public dialog: MatDialog,) {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
   }

  ngOnInit(): void {
    this.getActiveTerminationCategories();
    this.getEmployeeslistforTermination();
    this.getEmployeesTermination();
    this.terminateForm=this.formBuilder.group(
      {
      dateoftermination: [new Date(),],        
      reason: ["",],
      terminatecategory:["",Validators.required],
      empname:["",Validators.required],
      selecttermination:[""],
      exitin:["",],
      searchempname:[""],
      editdate:[""]
      
      
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  terminate(){
    this.isterminate=true;
    this.istable=false;
    this.isview=true;
  }
  canceledit(event: any, id: any) {
    this.enable = null;
    this.isEdit = true;
    this.isSave = false;
    this.ngOnInit();

  }
  edit(w: any, i: any){
    console.log(i)
    
    this.enable = i.id;
    this.isEdit = false;
    this.isSave = true;
    this.terminateForm.controls.editdate.setValue(new Date(i.termination_date));
  }
  close() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/ems/terminate"]));
    
  }
  view($event:any,rowdata:any){
    this.isterminate=true;
    this.istable=false;
    this.isview=false;
    for(let i=0;i<this.terminationlist.length;i++){
      if(rowdata.category == this.terminationlist[i].category){
        this.categiry = this.terminationlist[i].id;
        console.log(this.terminationlist[i].id)
        break;
      }
    }
    for(let i=0;i<this.employeelist.length;i++){
      if(rowdata.empname == this.employeelist[i].ename){
        this.employee= this.employeelist[i].id
        break;
      }
    }
    this.terminateForm.controls.empname.setValue(this.employee);
    this.terminateForm.controls.dateoftermination.setValue(new Date(rowdata.termination_date));
    this.terminateForm.controls.terminatecategory.setValue(this.categiry);
    this.terminateForm.controls.reason.setValue(rowdata.comment);
    
    // console.log(row)

  }
  terminatesave(){

    if(this.terminateForm.valid){
      let data = {
        termid:null,
        empid:this.terminateForm.controls.empname.value,
        termination_date:this.pipe.transform(this.terminateForm.controls.dateoftermination.value,'yyyy-MM-dd')+' '+this.pipe.transform(this.terminateForm.controls.dateoftermination.value, 'HH:mm:ss'),
        category_id:this.terminateForm.controls.terminatecategory.value,
        term_status:"Submitted",
        term_comment: this.terminateForm.controls.reason.value,
        actionby:this.userSession.id
      }
    
    this.ES.setEmployeeTermination(data).subscribe((res: any) => {
      if(res.status && res.data == 0){
        console.log(res.data)
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/ems/terminate"]));
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: 'Employee terminated successfully'
        });

      }
      else{
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: 'Unable to terminate Employee'
        });
      }
     })
  
    }

  }
  getActiveTerminationCategories(){
    this.terminationlist=[];
    this.ES.getActiveTerminationCategories().subscribe((res: any) => {
      if (res.status && res.data.length != 0) {
        this.terminationlist=res.data;
      }
    })
  }
  getEmployeeslistforTermination(){
    this.employeelist=[]
    this.ES.getEmployeeslistforTermination().subscribe((res: any) => {
      if (res.status && res.data.length != 0) {
        this.employeelist=res.data;
        console.log(this.employeelist)
      }
    })

  }
  getEmployeesTermination(){
    this.terminateddata =[];
    this.ES.getEmployeesTermination(null).subscribe((res: any) => {
      if (res.status && res.data.length != 0) {
        this.terminateddata = res.data;
        this.dataSource = new MatTableDataSource(res.data)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })

  }
  save($event:any,rowdata:any){
    
    for(let i=0;i<this.terminationlist.length;i++){
      if(rowdata.category == this.terminationlist[i].category){
        this.categiry = this.terminationlist[i].id;
        console.log(this.terminationlist[i].id)
        break;
      }
    }
    for(let i=0;i<this.employeelist.length;i++){
      if(rowdata.empname == this.employeelist[i].ename){
        this.employee= this.employeelist[i].id
        break;
      }
    }
    let data = {
      termid:rowdata.id,
      empid:this.employee,
      termination_date:this.pipe.transform(this.terminateForm.controls.editdate.value,'yyyy-MM-dd')+' '+this.pipe.transform(this.terminateForm.controls.dateoftermination.value, 'HH:mm:ss'),
      category_id:this.categiry,
      term_status:"Submitted",
      term_comment: rowdata.comment,
      actionby:this.userSession.id
    }
    this.ES.setEmployeeTermination(data).subscribe((res: any) => {
      if(res.status && res.data == 0){
        console.log(res.data)
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/ems/terminate"]));
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: 'Employee terminate update successfully'
        });

      }
      else{
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: 'Unable to update terminate Employee'
        });
      }
     })
    
   

  }
  revoke($event:any,rowdata:any){
    
    for(let i=0;i<this.terminationlist.length;i++){
      if(rowdata.category == this.terminationlist[i].category){
        this.categiry = this.terminationlist[i].id;
        console.log(this.terminationlist[i].id)
        break;
      }
    }
    for(let i=0;i<this.employeelist.length;i++){
      if(rowdata.empname == this.employeelist[i].ename){
        this.employee= this.employeelist[i].id
        break;
      }
    }
    let data = {
      termid:rowdata.id,
      empid:this.employee,
      termination_date:rowdata.termination_date,
      category_id:this.categiry,
      term_status:"Cancelled",
      term_comment: rowdata.comment,
      actionby:this.userSession.id
    }
    console.log(data)
    this.ES.setEmployeeTermination(data).subscribe((res: any) => {
      if(res.status && res.data == 0){
        console.log(res.data)
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/ems/terminate"]));
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: 'Employee terminatin cancelled successfully'
        });

      }
      else{
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: 'Unable to cancel terminate Employee'
        });
      }
     })
    
   

  }
  getPageSizes(): number[] {
    if (this.dataSource.data.length > 20) {
      return [5, 10, 20, this.dataSource.data.length];
    }
    else {
      return [5, 10, 20];
    }
  }
  
}

