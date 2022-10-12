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
@Component({
  selector: 'app-hr-offboarding-checklist',
  templateUrl: './hr-offboarding-checklist.component.html',
  styleUrls: ['./hr-offboarding-checklist.component.scss']
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
  isfrmChecked:any;
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
      this.getPendingChecklist();
  }
  private addCheckboxes() {
    this.checklistPoints.forEach(() => this.checklistsFormArray.push(new FormControl(false)));
  }
  // componentMethodName(event: any, isChecked: boolean) 
  // {
  //   if (isChecked) {
  //     this.selectedchecklists.push(event.target.value)
  //   }
  //   else {
  //     let index = this.selectedchecklists.indexOf(event.target.value);
  //     this.selectedchecklists.splice(index, 1);
  //   }
  // }
  saveRequest() {
    const earningselectedIds = this.checklistForm.value.selectedChecklist
    .map((checked:any, i:any) => checked ? this.checklistPoints[i].checklist_id : null)
    .filter((v:any) => v !== null);
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
      console.log(data)
      this.emsService.setEmployeeChecklists(data).subscribe((res: any) => {
        if (res.status) {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/ems/termination-checklist-department"]));
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
          data:"Data added successfully"
        });
        }else {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
           data: "Data is not added"
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
    this.emsService.getEmployeTerminationPendingChecklist(null,null,null,this.userSession.deptid).subscribe((res: any) => {
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
    this.router.navigate(["/ems/termination-checklist-department"]));
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
  this.isAdd = true;
  this.isdata = false;
  this.checklistForm.controls.name.setValue(data.empname)
  this.checklistForm.controls.terminateDate.setValue(data.terminationdate)
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

    }
  })
}

}