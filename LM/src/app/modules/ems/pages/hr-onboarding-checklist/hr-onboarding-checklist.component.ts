import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { FormGroup,FormControl,Validators, FormBuilder, AbstractControl, FormArray} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EmsService } from '../../ems.service';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import * as _moment from 'moment';
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
  selector: 'app-hr-onboarding-checklist',
  templateUrl: './hr-onboarding-checklist.component.html',
  styleUrls: ['./hr-onboarding-checklist.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class HrOnboardingChecklistComponent implements OnInit {
  checklistForm!: FormGroup;
  hrOnboardingForm!: FormGroup;
  constructor(private formBuilder: FormBuilder, private router: Router,private emsService:EmsService,private dialog: MatDialog) { }
  dataSource: MatTableDataSource<any> = <any>[];
  displayedColumns: string[] = ['sno', 'name', 'hiredate', 'joindate', 'status', 'action'];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  pageLoading = true;
  checklistPoints: any=[ ]
  isAdd: boolean = false;
  isdata: boolean = true;
  datastatus:any;
  arr:any=[];
  pipe = new DatePipe('en-US');
  minDate = new Date('2000/01/01'); maxDate = new Date(Date.now() + (8.64e+7 * 90)).toISOString();
  pendingchecklist: any = [];
  selectedchecklists: any = [];
  userSession: any;
  employeeId: any;
  deptId: any;
  // get employeestatusFormArray() {
  //   return this.checklistForm.controls.selectedChecklist as FormArray;
  // }
  get checklistsFormArray() {
    return this.checklistForm.controls.selectedChecklist as FormArray;
  }
  employeestatus: any = [];
  isfrmChecked:any;
  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.checklistForm = this.formBuilder.group(
      {
        name: [],
        joinDate: [],
        designation: [],
        selectedChecklist: new FormArray([]),
      });
     
     this.checklistForm.controls.joinDate.setValue(new Date());
    this.hrOnboardingForm=this.formBuilder.group(
      {
      searchDate: [],        
      statusUpdate: ["",],
      searchName: ["",],
     
      });
      this.getPendingChecklist();
  }
  private addCheckboxes() {
    this.checklistPoints.forEach(() => this.checklistsFormArray.push(new FormControl(false)));
  }
  componentMethodName(event: any, isChecked: boolean) 
  {
    if (isChecked) {
      this.selectedchecklists.push(event.target.value)
    }
    else {
      let index = this.selectedchecklists.indexOf(event.target.value);
      this.selectedchecklists.splice(index, 1);
    }
  }
  saveRequest() {
    const earningselectedIds = this.checklistForm.value.selectedChecklist
    .map((checked:any, i:any) => checked ? this.checklistPoints[i].checklist_id : null)
    .filter((v:any) => v !== null);
    let data ={
      cid:earningselectedIds,
      eid:this.employeeId,
      did:this.userSession.deptid,
      cmmt:null,
      status:"Completed",
      fstatus:"Pending Checklist",
      category:"Onboarding",
      actionBy:this.userSession.id
    }
    console.log(earningselectedIds)
   
    // this.emsService.setEmployeeChecklists(data).subscribe((res: any) => {
    //   if (res.status) {
    //     this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    //     this.router.navigate(["/ems/onboarding-checklist-department"]));
    //   let dialogRef = this.dialog.open(ReusableDialogComponent, {
    //     position: { top: `70px` },
    //     disableClose: true,
    //     data:"Data added successfully"
    //   });
    //   }else {
    //     let dialogRef = this.dialog.open(ReusableDialogComponent, {
    //       position: { top: `70px` },
    //       disableClose: true,
    //      data: "Data is not added"
    //     });
    //   }

    // })
  }
  getPendingChecklist() {
    this.emsService.getEmployePendingChecklist(null,null,null,this.userSession.deptid).subscribe((res: any) => {
      if (res.status && res.data.length != 0) {
        this.pendingchecklist = res.data;
        this.dataSource = new MatTableDataSource(this.pendingchecklist);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageLoading = false;
      }
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  cancel() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    this.router.navigate(["/ems/onboarding-checklist-department"]));
}
getPageSizes(): number[] {
  if (this.dataSource.data.length > 20) {
    return [5, 10, 20, this.dataSource.data.length];
  }
  else {

   return [5, 10, 20];
  }
}
addChecklistOverview(data: any) {
  this.datastatus=data.status;
  this.isAdd = true;
  this.isdata = false;
  this.checklistForm.controls.name.setValue(data.empname)
  this.checklistForm.controls.joinDate.setValue(this.pipe.transform(data.dateofjoin,'dd-MM-yyyy'),)
  this.checklistForm.controls.designation.setValue(data.designation)
  this.employeeId = data.empid;
  this.deptId = data.department_id;
  this.getOnboardingCheckList();
  // this.checklistsFormArray.setValue(1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1)
}
getOnboardingCheckList() {
  this.emsService.getEmployeeBoardingCheckList(this.employeeId,"Onboarding",this.userSession.deptid).subscribe((res: any) => {
    if (res.status && res.data.length != 0) {
      this.checklistPoints = res.data;
      console.log(this.checklistPoints)
      this.addCheckboxes();
      // if(this.datastatus == 'Pending'){
        for(let i=0;i<this.checklistPoints.length;i++){
          if(this.checklistPoints[i].status == 'Completed'){
            this.arr.push(1)
          }
          else{
            this.arr.push(0)
          }
         
          }
         
        this.checklistsFormArray.setValue(this.arr)

     
    }
  })
}

}
