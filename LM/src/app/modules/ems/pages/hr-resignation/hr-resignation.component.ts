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
  selector: 'app-hr-resignation',
  templateUrl: './hr-resignation.component.html',
  styleUrls: ['./hr-resignation.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class HrResignationComponent implements OnInit {
  hrOnboardingForm: any = FormGroup;
  checklistForm: any = FormGroup;
  pendingchecklist: any = [];
  employeeChecklists: any = [];
  min: any = new Date();
  max: any = new Date();
  isEdit: boolean = true;
  isSave: boolean = false;
  enable: any = null;
  istable: boolean = true;
  displayedColumns: string[] = ['sno', 'name', 'hiredate', 'joindate', 'status', 'action'];
  checklistdisplayedColumns: string[] = ['sno', 'dept', 'approver', 'checklist', 'status'];
  visibleList: any = ['Task Completed', 'Revoke new hire', 'Mark as not joining', 'Remove new hire'];
  checklistDataSource: MatTableDataSource<any> = <any>[];
  dataSource: MatTableDataSource<any> = <any>[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  selection = new SelectionModel<any>(true, []);
  public selectedChecklists: any = [];
  pageLoading = true;
  constructor(private formBuilder: FormBuilder, private router: Router, private emsService: EmsService,private dialog: MatDialog) { }
  checked = false;
  isAdd: boolean = false;
  isdata: boolean = true;
  pipe = new DatePipe('en-US');
  minDate = new Date('2000/01/01'); maxDate = new Date(Date.now() + (8.64e+7 * 90)).toISOString();
  employeeId: any;
  userSession: any;
  searchdate: any = null;
  isdisable:boolean=false;
  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.checklistForm = this.formBuilder.group(
      {
        employeeName: [],
        requestDate: [],
        designation: [],
        remarks: [],
        isChecked: [],
      });
    this.hrOnboardingForm = this.formBuilder.group(
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
    this.dataSource.paginator = this.paginator;
  }

  getPendingChecklist() {
    let data = {
      name: null,
      date: this.searchdate,
      eid: null,
      did:this.userSession.deptid
    }
    this.emsService.getEmployeResignationPendingChecklist(data).subscribe((res: any) => {
      if (res.status) {
        this.pendingchecklist = res.data;
        this.dataSource = new MatTableDataSource(this.pendingchecklist);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageLoading = false;
      }
    })
  }

  toggle(event: any, row: any) {
    let name = row.checklist_id;
    if (event.checked) {
      if (this.selectedChecklists.indexOf(name) === -1) {
        this.selectedChecklists.push(name);
        this.selection.select(row);
      }
      const selectedBox = this.selectedChecklists.length;
      const totalRows = this.checklistDataSource.data.length;
      if (selectedBox === totalRows) {
        this.isdisable = false;
      } 

    } else {
      const index = this.selectedChecklists.indexOf(name);
      if (index > -1) {
        this.selectedChecklists.splice(index, 1);
        this.selection.deselect(row);
        this.isdisable = true;
      }
    }
    console.log(this.selectedChecklists);
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

  addChecklistOverview(data: any) {
    this.isAdd = true;
    this.isdata = false;
    this.checklistForm.controls.employeeName.setValue(data.empname)
    this.checklistForm.controls.requestDate.setValue(this.pipe.transform(data.requestdate,'dd-MM-yyyy'))
    this.checklistForm.controls.designation.setValue(data.designation)
    this.employeeId = data.empid;
    this.getEmployeCheckListData();
  }

  getEmployeCheckListData() {
    this.emsService.getEmployeeBoardingCheckList(this.employeeId, "Offboarding", null).subscribe((res: any) => {
      if (res.status && res.data.length != 0) {
        this.employeeChecklists = res.data;
        for (let i = 0; i < res.data.length; i++){
          if (res.data[i].status != 'Completed') {
            this.isdisable = true;
          }else{
            this.selectedChecklists.push(res.data[i].checklist_id);
          }

        }
        this.checklistDataSource = new MatTableDataSource(this.employeeChecklists);
      }
    })
  }

  saveRequest() {
    if (this.selectedChecklists.length > 0) {
      let data = {
        cid: this.selectedChecklists,
        eid: this.employeeId,
        did: this.userSession.deptid,
        cmmt: this.checklistForm.controls.remarks.value,
        status: "Completed",
        fstatus: this.checked == true ? "Completed" : "Pending Checklist",
        category: "Offboarding",
        actionBy: this.userSession.id
      }
      this.emsService.setEmployeeChecklists(data).subscribe((res: any) => {
        if (res.status) {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/ems/hr-resignation"]));
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: "Data saved successfully"
          });
        } else {
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
  cancel() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/ems/hr-resignation"]));
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