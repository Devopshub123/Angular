import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { EmsService } from '../../ems.service';
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
  selector: 'app-hr-offboarding-checklist',
  templateUrl: './hr-offboarding-checklist.component.html',
  styleUrls: ['./hr-offboarding-checklist.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class HrOffboardingChecklistComponent implements OnInit {
  checklistForm!: FormGroup;
  hrOnboardingForm!: FormGroup;
  constructor(private formBuilder: FormBuilder, private router: Router,private emsService:EmsService,private dialog: MatDialog) { }
  dataSource: MatTableDataSource<any> = <any>[];
  displayedColumns: string[] = ['sno', 'name', 'hiredate','status', 'action'];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  pageLoading = true;
  checklistPoints: any=[ ]
  isAdd: boolean = false;
  isdata: boolean = true;
  pipe = new DatePipe('en-US');
  minDate = new Date('2000/01/01'); maxDate = new Date(Date.now() + (8.64e+7 * 90)).toISOString();
  pendingchecklist: any = [];
  selectedchecklists: any = [];
  userSession: any;
  employeeId: any;
  deptId: any;
  get checklistsFormArray() {
    return this.checklistForm.controls.selectedChecklist as FormArray;
  }
  employeestatus: any = [];
  isfrmChecked: any;
  datastatus: any;
  arr: any = [];
  searchdate: any = null;
  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.checklistForm = this.formBuilder.group(
      {
        name: [],
        terminateDate: [],
        designation: [],
        selectedChecklist: new FormArray([]),
      });
     
     this.checklistForm.controls.terminateDate.setValue(new Date());
    this.hrOnboardingForm=this.formBuilder.group(
      {
      searchDate: [],        
      statusUpdate: ["",],
      searchName: ["",],
     
      });
      this.hrOnboardingForm.get('searchDate')?.valueChanges.subscribe((selectedValue:any) => {
        this.searchdate = this.pipe.transform(selectedValue._d,'yyyy-MM-dd'),
        this.getPendingChecklist();
      })
      this.getPendingChecklist();
  }
  private addCheckboxes() {
    this.checklistPoints.forEach(() => this.checklistsFormArray.push(new FormControl(false)));
  }

  saveRequest() {
    const earningselectedIds = this.checklistForm.value.selectedChecklist
    .map((checked:any, i:any) => checked ? this.checklistPoints[i].checklist_id : null)
      .filter((v: any) => v !== null);

    if (earningselectedIds.length > 0) {
      let data = {
        cid:earningselectedIds,
        eid:this.employeeId,
        did:this.userSession.deptid,
        cmmt:null,
        status:"Completed",
        fstatus:"Pending Checklist",
        category:"Offboarding",
        actionBy:this.userSession.id
      }
      this.emsService.setEmployeeChecklists(data).subscribe((res: any) => {
        if (res.status) {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/ems/termination-checklist-department"]));
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
          data:"Data saved successfully"
        });
        }else {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
           data: "Data is not saved"
          });
        }
  
      })
    } else {
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position: { top: `70px` },
        disableClose: true,
        data:"Please select checklist"
      });
   } 


  }
  getPendingChecklist() {
    let data = {
      name: null,
      date: this.searchdate,
      eid: null,
      did:this.userSession.deptid
    }
    this.emsService.getEmployeTerminationPendingChecklist(data).subscribe((res: any) => {
      if (res.status) {
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
    this.router.navigate(["/ems/termination-checklist-department"]));
}
getPageSizes(): number[] {
   
  var customPageSizeArray = [];
  if (this.dataSource.data.length > 5) {
    customPageSizeArray.push(5);
  }
  if (this.dataSource.data.length > 10) {
    customPageSizeArray.push(10);
  }
  if (this.dataSource.data.length > 20) {
    customPageSizeArray.push(20);
  }
  customPageSizeArray.push(this.dataSource.data.length);
  return customPageSizeArray;
}
addChecklistOverview(data: any) {
  this.isAdd = true;
  this.isdata = false;
  this.datastatus=data.status;
  this.checklistForm.controls.name.setValue(data.empname)
  this.checklistForm.controls.terminateDate.setValue(this.pipe.transform(data.terminationdate,'dd-MM-yyyy'),)
  this.checklistForm.controls.designation.setValue(data.designation)
  this.employeeId = data.empid;
  this.deptId = data.department_id;
  this.getOffboardingCheckList();
}
getOffboardingCheckList() {
  this.emsService.getEmployeeBoardingCheckList(this.employeeId,"Offboarding",this.deptId).subscribe((res: any) => {
    if (res.status && res.data.length != 0) {
      this.checklistPoints = res.data;
      this.addCheckboxes();
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