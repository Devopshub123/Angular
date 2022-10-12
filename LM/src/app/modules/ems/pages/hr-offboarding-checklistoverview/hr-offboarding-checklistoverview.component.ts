import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { EmsService } from '../../ems.service';
export interface UserData {
  deptname: string;
  status: string;
  depthead: string;
  headcount: number;
  id: number;
  total: number;
}
@Component({
  selector: 'app-hr-offboarding-checklistoverview',
  templateUrl: './hr-offboarding-checklistoverview.component.html',
  styleUrls: ['./hr-offboarding-checklistoverview.component.scss']
})
export class HrOffboardingChecklistoverviewComponent implements OnInit {
  hrOnboardingForm:any= FormGroup;
  checklistForm:any= FormGroup;
  pendingchecklist:any=[];
  masterChecklistData: any = [];
  min:any=new Date();
  max:any=new Date();
  isEdit: boolean = true;
  isSave: boolean = false;
  enable: any = null;
  isterminate:boolean=false;
  istable:boolean=true;
  displayedColumns: string[] = ['sno', 'name', 'hiredate', 'joindate', 'status', 'action'];
  checklistdisplayedColumns: string[] = ['sno', 'dept', 'approver', 'checklist', 'status'];
  visibleList: any = ['Task Completed', 'Revoke new hire', 'Mark as not joining','Remove new hire'];
  checklistDataSource: MatTableDataSource<UserData> = <any>[];
  selection = new SelectionModel<UserData>(true, []);
  public endorsementIds: string[] = [];
  dataSource: MatTableDataSource<UserData> = <any>[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  pageLoading = true;
  constructor(private formBuilder: FormBuilder,private router: Router,private emsService:EmsService,private dialog: MatDialog) { }
  checked = false;
  isAdd: boolean = false;
  isdata: boolean = true;
  pipe = new DatePipe('en-US');
  minDate = new Date('2000/01/01'); maxDate = new Date(Date.now() + (8.64e+7 * 90)).toISOString();
  employeeId: any;
  public selectedChecklists: any = [];
  userSession: any;
  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.checklistForm = this.formBuilder.group(
      {
        employeeName: [],
        joiningDate: [],
        designation: [],
        remarks: [],
        isChecked: [],
      });
    this.hrOnboardingForm=this.formBuilder.group(
      {
      searchDate: [],        
      statusUpdate: ["",],
      searchName: ["",],
     
      });
    this.getPendingChecklist(null,null,null,null);
      this.dataSource.paginator = this.paginator;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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
  }
  close(){
    this.isterminate=false;
    this.istable=true;
  }
  edit(w: any, i: any){
    this.hrOnboardingForm.controls.editdate.setValue(new Date(i.date));
    this.enable = i.id;
    this.isEdit = false;
    this.isSave = true;
  }
  canceledit(event: any, id: any) {
    this.enable = null;
    this.isEdit = true;
    this.isSave = false;
    this.ngOnInit();

  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  addChecklistOverview(data: any) {
    this.isAdd = true;
    this.isdata = false;
    this.checklistForm.controls.employeeName.setValue(data.empname)
    this.checklistForm.controls.joiningDate.setValue(data.dateofjoin)
    this.checklistForm.controls.designation.setValue(data.designation)
    this.employeeId = data.empid;
    this.getEmployeCheckListData();
  }

  getPendingChecklist(ename:any,date:any,eid:any,did:any) {
    this.emsService.getEmployeTerminationPendingChecklist(ename,date,eid,did).subscribe((res: any) => {
      if (res.status && res.data.length != 0) {
        this.pendingchecklist = res.data;
        this.dataSource = new MatTableDataSource(this.pendingchecklist);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageLoading = false;
      }
    })
  }

  getEmployeCheckListData() {
    this.emsService.getEmployeeBoardingCheckList(this.employeeId,"Offboarding",null).subscribe((res: any) => {
      if (res.status && res.data.length != 0) {
         this.masterChecklistData = res.data;
         this.checklistDataSource = new MatTableDataSource(this.masterChecklistData);
       }
     })
  }
  toggle(event: any, row: any) {
    let cid = row.checklist_id;
    if (event.checked) {
      if (this.selectedChecklists.indexOf(cid) === -1) {
        this.selectedChecklists.push(cid);
        this.selection.select(row);
      }

    } else {
      const index = this.selectedChecklists.indexOf(cid);
      if (index > -1) {
        this.selectedChecklists.splice(index, 1);
        this.selection.deselect(row);
      }
    }
   }
  saveRequest() {
    let data ={
      cid:this.selectedChecklists,
      eid:this.employeeId,
      did:this.userSession.deptid,
      cmmt:null,
      status:"Completed",
      fstatus:"Pending Checklist",
      category:"Onboarding",
      actionBy:this.userSession.id
    }
console.log(data)
  //  this.emsService.setEmployeeChecklists(data).subscribe((res: any) => {
  //   if (res.status) {
  //     this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
  //     this.router.navigate(["/ems/hr-onboarding"]));
  //   let dialogRef = this.dialog.open(ReusableDialogComponent, {
  //     position: { top: `70px` },
  //     disableClose: true,
  //     data:"Data saved successfully"
  //   });
  //   }else {
  //     let dialogRef = this.dialog.open(ReusableDialogComponent, {
  //       position: { top: `70px` },
  //       disableClose: true,
  //      data: "Data is not saved"
  //     });
  //   }

  // }) 
  }
  cancel() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    this.router.navigate(["/ems/offboarding-checklistoverview"]));
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
