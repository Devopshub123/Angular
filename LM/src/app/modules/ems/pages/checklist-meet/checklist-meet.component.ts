import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import { EmsService } from '../../ems.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { isThisSecond } from 'date-fns';
// import { ResourceLimits } from 'worker_threads';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { environment } from 'src/environments/environment';

import * as _moment from 'moment';
// import {default as _rollupMoment} from 'moment';
const moment = _moment;

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
  selector: 'app-checklist-meet',
  templateUrl: './checklist-meet.component.html',
  styleUrls: ['./checklist-meet.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ChecklistMeetComponent implements OnInit {
  checklistForm!: FormGroup;
  displayedColumns = [
    'sno',
    'ptype',
    'department',
    'conductby',
    'date',
    'stime',
    'etime',
    'status',
    'action',
  ];
  addChecklistColumns = ['select', 'sno', 'name', 'date', 'status'];
  programViewColumns = [ 'sno', 'name', 'date', 'status'];
  dataSource: MatTableDataSource<any> = <any>[];
  dataSource2: MatTableDataSource<any> = <any>[];
  dataSource3: MatTableDataSource<any> = <any>[];
  programViewdataSource: MatTableDataSource<any> = <any>[];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatPaginator) paginator1!: MatPaginator;
  @ViewChild(MatPaginator) paginator2!: MatPaginator;
  selection = new SelectionModel<any>(true, []);
  pageLoading = true;
  pageLoading1 = true;
  pageLoading2 = true;
  isRequestView = false;
  isEditView = false;
  uniqueId: any = '';
  pipe = new DatePipe('en-US');
  messagesDataList: any = [];
  requiredField: any;
  requiredOption: any;
  dataSave: any;
  dataNotSave: any;
  deptdata: any = null;
  desdata: any = null;
  allmails: any = [];
  alldata: any = [];
  allempid: any = [];
  allesid: any = [];
  scheduleid: any;
  availableDesignations: any = [];
  availableDepartments: any = [];
  availableprogramtypes: any = [];
  conductlist: any = [];
  min: any;
  mintime: any;
  mdate: any = new Date();
  isAdd: boolean = false;
  isAddChecklist: boolean = false;
  isUpdateChecklist: boolean = false;
  isedit: boolean = false;
  isCancel: boolean = false;
  isView: boolean = false;
  isdata: boolean = true;
  userSession: any;
  companyList: any = ['Attended', 'Not Attended'];
  rolesList: any = ['Manager', 'Admin', 'HR', 'Staff'];
  minDate = new Date('2000/01/01'); maxDate = new Date("2200/01/01");
  companyDBName:any = environment.dbName;
  getdata: any;
  scheduleEmployees: any = [];
  scheduleProgramAssignedEmployees: any = [];
  companyName: any;
  scheduledId: any;
  programName: any;
  emailsList: any = [];
  employeeEmailData: any = [];
  constructor(private formBuilder: FormBuilder,private router: Router,public dialog: MatDialog,private companyServices: CompanySettingService,private EMS:EmsService) {

  }
  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.getDepartmentsMaster();
    this.getDesignationsMaster();
    this.getProgramsMaster(null);
    this.getProgramSchedules(null, null);
    this.getEmployeeEmailData();
    this.dataSource.paginator = this.paginator;
    this.checklistForm = this.formBuilder.group(
      {
        programType: ['',Validators.required],
        department: ['',Validators.required],
        conductBy: ['',Validators.required],
        date: ['',Validators.required],
        starttime: ['',Validators.required],
        endtime:['',Validators.required],
        designation: ['',Validators.required],
        description: [],
        cancelReason: [''],
        updatestatus:['Attended']

      });
    // this.checklistForm.controls.date.setValue(new Date()  );
    this.checklistForm
      .get('starttime')
      ?.valueChanges.subscribe((selectedValue) => {
        this.min = selectedValue;
        this.mintime = selectedValue;
      });
    this.checklistForm
      .get('endtime')
      ?.valueChanges.subscribe((selectedValue) => {
        if (this.mintime == selectedValue) {
          selectedValue = '';
          this.checklistForm.get('endtime')?.setValue('');
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: 'Please change endtime',
          });
          dialogRef.afterClosed().subscribe((result) => {
            this.checklistForm.get('endtime')?.setValue('');
          });
        } else if (
          this.pipe.transform(this.mintime, 'HH:mm') ==
          this.pipe.transform(selectedValue, 'HH:mm')
        ) {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: 'Please change endtime',
          });
          dialogRef.afterClosed().subscribe((result) => {
            this.checklistForm.get('endtime')?.setValue('');
          });
        }
      });
    this.checklistForm
      .get('department')
      ?.valueChanges.subscribe((selectedValue) => {
        this.deptdata = selectedValue;
        if (this.desdata != null) {
          this.coductedby(this.deptdata, this.desdata);
        }
      });
    this.checklistForm
      .get('designation')
      ?.valueChanges.subscribe((selectedValue) => {
        this.desdata = selectedValue;
        if (this.deptdata != null) {
          this.coductedby(this.deptdata, this.desdata);
        }
      });
  }
  getDesignationsMaster() {
    this.companyServices
      .getMastertable('designationsmaster', 1, 1, 1000, this.companyDBName)
      .subscribe((data) => {
        if (data.status) {
          this.availableDesignations = data.data;
        }
      });
  }
  getDepartmentsMaster() {
    this.companyServices
      .getMastertable('departmentsmaster', 1, 1, 1000, this.companyDBName)
      .subscribe((data) => {
        if (data.status) {
          this.availableDepartments = data.data;
        }
      });
  }
  getProgramsMaster(pId: any) {
    this.companyServices
      .getMastertable('ems_programs_master', 1, 1, 1000, this.companyDBName)
      .subscribe((data) => {
        if (data.status) {
          this.availableprogramtypes = data.data;
        }
      });
  }

  getProgramSchedules(id: any, data: any) {
    this.EMS.getProgramSchedules(id, data).subscribe((result: any) => {
      if (result.status) {
        this.dataSource = new MatTableDataSource(result.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageLoading = false;
      }
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.programViewdataSource.paginator = this.paginator1;
    this.dataSource2.paginator = this.paginator2;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  saveRequest() {
    if (this.checklistForm.valid) {
      let data = {
        scheduleId: null,
        programId: this.checklistForm.controls.programType.value,
        conductedby: this.checklistForm.controls.conductBy.value,
        description: this.checklistForm.controls.description.value,
        status:"Scheduled",
        scheduleDate:
          this.pipe.transform(
            this.checklistForm.controls.date.value,
            'yyyy-MM-dd'
          ) +
          ' ' +
          this.pipe.transform(
            this.checklistForm.controls.date.value,
            'HH:mm:ss'
          ),
        startTime: this.pipe.transform(
          this.checklistForm.controls.starttime.value,
          'HH:mm:ss'
        ),
        endTime: this.pipe.transform(
          this.checklistForm.controls.endtime.value,
          'HH:mm:ss'
        ),
        department: this.checklistForm.controls.department.value,
        designation: this.checklistForm.controls.designation.value,
        actionby: this.userSession.id,
      };
      this.EMS.setProgramSchedules(data).subscribe((res: any) => {
        if (res.status && res.data == 0) {
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => this.router.navigate(['/ems/induction-program']));
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: 'Program schedule successfully',
          });
        } else if(res.status && res.data == 1) {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: 'Scheduled Program already',
          });
        }else {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: 'Unable to Program scheduled.',
          });
        }
      });
    }
  }
  resetform() {}

  editRequest(data: any) {
    this.isAdd = true;
    this.isdata = false;
    this.isView = false;
    this.isCancel = false;
    this.isedit = true;
    this.scheduledId = data.id;
    this.programName = data.program_name;
    (this.scheduleid = data.id),
      this.checklistForm.controls.programType.setValue(data.program_id),
      this.checklistForm.controls.department.setValue(data.department),
      this.checklistForm.controls.designation.setValue(data.designation),
      this.checklistForm.controls.conductBy.setValue(data.conducted_by),
      this.checklistForm.controls.description.setValue(data.description),
      this.checklistForm.controls.date.setValue(new Date(data.schedule_date)),
      this.checklistForm.controls.starttime.setValue(
        new Date(data.schedule_date + ' ' + data.schedule_starttime)
      ),
      this.checklistForm.controls.endtime.setValue(
        new Date(data.schedule_date + ' ' + data.schedule_endtime)
      );
    this.getInductionProgramAssignedEmployesList();
  }
  updating(data: any) {
    this.selection = new SelectionModel();
    this.dataSource2 = new MatTableDataSource();
    this.isUpdateChecklist = true;
    this.isAddChecklist = false;
    this.isdata = false;
    this.isAdd = false;
    this.isView = false;
    this.isCancel = false;
    this.scheduleid=data.id;
    this.EMS.getallEmployeeProgramSchedules(null,data.id).subscribe((res: any) => {
      this.dataSource2 = new MatTableDataSource(res.data)
      this.dataSource2.paginator = this.paginator2;
        this.pageLoading2 = false;
      this.selection = new SelectionModel(res.data)

    })
  }
  updateRequest() {
    if (this.checklistForm.valid) {
      let data = {
        scheduleId: this.scheduleid,
        programId: this.checklistForm.controls.programType.value,
        conductedby: this.checklistForm.controls.conductBy.value,
        description: this.checklistForm.controls.description.value,
        status:"Rescheduled",
        scheduleDate:
          this.pipe.transform(
            this.checklistForm.controls.date.value,
            'yyyy-MM-dd'
          ) +
          ' ' +
          this.pipe.transform(
            this.checklistForm.controls.date.value,
            'HH:mm:ss'
          ),
        startTime: this.pipe.transform(
          this.checklistForm.controls.starttime.value,
          'HH:mm:ss'
        ),
        endTime: this.pipe.transform(
          this.checklistForm.controls.endtime.value,
          'HH:mm:ss'
        ),
        department: this.checklistForm.controls.department.value,
        designation: this.checklistForm.controls.designation.value,
        actionby: this.userSession.id,
        //// email data
        emails: this.emailsList,
        programName: this.programName,
        programDate: this.pipe.transform(this.checklistForm.controls.date.value, 'yyyy-MM-dd'),
        emaildata:this.employeeEmailData
      };

      this.EMS.setProgramSchedules(data).subscribe((res: any) => {
        this.scheduleid = '';
        if (res.status && res.data == 0) {
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => this.router.navigate(['/ems/induction-program']));
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: 'Program schedule update successfully',
          });
        } else if(res.status && res.data == 1) {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: 'Scheduled Program already',
          });
        } else {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: 'Unable to update Program scheduled.',
          });
        }
      });
    }
  }
  cancelProgram(data: any) {
    this.isAdd = true;
    this.isdata = false;
    this.isedit = false;
    this.isCancel = true;
    this.isView = false;
    this.scheduledId = data.id;
    (this.scheduleid = data.id),
      this.checklistForm.controls.programType.setValue(data.program_id),
      this.checklistForm.controls.programType.disable(),
      this.checklistForm.controls.department.setValue(data.department),
      this.checklistForm.controls.department.disable(),
      this.checklistForm.controls.designation.setValue(data.designation),
      this.checklistForm.controls.designation.disable(),
      this.checklistForm.controls.conductBy.setValue(data.conducted_by),
      this.checklistForm.controls.conductBy.disable(),
      this.checklistForm.controls.description.setValue(data.description),
      this.checklistForm.controls.description.disable(),
      this.checklistForm.controls.date.setValue(new Date(data.schedule_date)),
      this.checklistForm.controls.date.disable(),
      this.checklistForm.controls.starttime.setValue(new Date(data.schedule_date + ' ' + data.schedule_starttime)),
      this.checklistForm.controls.starttime.disable(),
      this.checklistForm.controls.endtime.setValue(new Date(data.schedule_date + ' ' + data.schedule_endtime))
      this.checklistForm.controls.endtime.disable()
      this.getInductionProgramAssignedEmployesList();
  }

  programCancelRequest() {
    if (this.checklistForm.controls.cancelReason.valid) {
      let data = {
        scheduleId: this.scheduleid,
        programId: this.checklistForm.controls.programType.value,
        conductedby: this.checklistForm.controls.conductBy.value,
        description: this.checklistForm.controls.description.value,
        reason: this.checklistForm.controls.cancelReason.value,
        status:"Cancelled",
        scheduleDate:
          this.pipe.transform(
            this.checklistForm.controls.date.value,
            'yyyy-MM-dd'
          ) +
          ' ' +
          this.pipe.transform(
            this.checklistForm.controls.date.value,
            'HH:mm:ss'
          ),
        startTime: this.pipe.transform(
          this.checklistForm.controls.starttime.value,
          'HH:mm:ss'
        ),
        endTime: this.pipe.transform(
          this.checklistForm.controls.endtime.value,
          'HH:mm:ss'
        ),
        department: this.checklistForm.controls.department.value,
        designation: this.checklistForm.controls.designation.value,
        actionby: this.userSession.id,
        emails: this.emailsList,
        emaildata:this.employeeEmailData
      };
       this.EMS.setProgramSchedules(data).subscribe((res: any) => {
         this.scheduleid = '';
         if (res.status) {
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => this.router.navigate(['/ems/induction-program']));
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: 'Program schedule cancelled successfully',
          });
        }  else {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: 'Unable to cancel Program scheduled.',
          });
        }
      });
    }

  }
  viewProgram(data: any) {
    this.isAdd = true;
    this.isdata = false;
    this.isedit = false;
    this.isCancel = false;
    this.isView = true;
    (this.scheduleid = data.id),
      this.checklistForm.controls.programType.setValue(data.program_id),
      this.checklistForm.controls.programType.disable(),
      this.checklistForm.controls.department.setValue(data.department),
      this.checklistForm.controls.department.disable(),
      this.checklistForm.controls.designation.setValue(data.designation),
      this.checklistForm.controls.designation.disable(),
      this.checklistForm.controls.conductBy.setValue(data.conducted_by),
      this.checklistForm.controls.conductBy.disable(),
      this.checklistForm.controls.description.setValue(data.description),
      this.checklistForm.controls.description.disable(),
      this.checklistForm.controls.date.setValue(new Date(data.schedule_date)),
      this.checklistForm.controls.date.disable(),
      this.checklistForm.controls.starttime.setValue(new Date(data.schedule_date + ' ' + data.schedule_starttime)),
      this.checklistForm.controls.starttime.disable(),
      this.checklistForm.controls.endtime.setValue(new Date(data.schedule_date + ' ' + data.schedule_endtime))
    this.checklistForm.controls.endtime.disable(),
    this.checklistForm.controls.cancelReason.setValue(data.reason),
    this.checklistForm.controls.cancelReason.disable()
    this.EMS.getActiveScheduleEmployeeList(data.id).subscribe(
      (res: any) => {
        this.scheduleProgramAssignedEmployees = res.data;
        this.programViewdataSource = new MatTableDataSource(res.data);
        this.programViewdataSource.paginator = this.paginator1;
        this.pageLoading1 = false;

      }
    );
  }

  deleteRequest(event: any) {}

  requestView(event: any) {
    this.isAddChecklist = true;
    this.isUpdateChecklist = false;
    this.isdata = false;
    this.isAdd = false;
    this.isView = false;
    this.scheduleid = event.id;
    this.EMS.getallEmployeeProgramSchedules(null, event.id).subscribe(
      (res: any) => {
        this.scheduleEmployees = res.data;
      }
    );
    this.EMS.getEmployeesForProgramSchedule(event.id).subscribe(
      (result: any) => {
        this.dataSource2 = new MatTableDataSource(result.data);
        this.dataSource2.paginator = this.paginator2;
        this.pageLoading2 = false;
        this.selection = new SelectionModel(result.data);
        if (this.scheduleEmployees.length > 0) {
          this.scheduleEmployees.forEach((e: any) => {
            result.data.forEach((i: any) => {
              if (e.empid == i.id) {
                this.selection.select(i);
              }
            });
          });
        }
      }
    );
  }
  Add() {
    //this.checklistForm.controls.companyName.setValue('');
    this.isAdd = true;
    this.isView = false;
    this.isdata = false;
  }
  coductedby(e1: any, e2: any) {
    this.EMS.getDepartmentEmployeesByDesignation(e1, e2).subscribe(
      (result: any) => {
        if (result.status) {
          this.conductlist = result.data;
        }
      }
    );
  }

  cancel(){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/ems/induction-program"]));
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource2.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource2.data.forEach(row => this.selection.select(row));
  }
  updateSchedue() {
    if (this.selection.selected.length > 0) {
      this.alldata = this.selection.selected;
      for (let i = 0; i < this.alldata.length; i++) {
        this.allmails.push(this.alldata[i].officeemail);
        this.allempid.push(this.alldata[i].empid);
        this.allesid.push(this.alldata[i].id);
      }
      let data = {
        esid: this.allesid,
        scheduleid: this.scheduleid,
        empid: this.allempid,
        status: this.checklistForm.controls.updatestatus.value,
        actionby: this.userSession.id,
        email: this.allmails,
      };
      this.EMS.updateselectEmployeesProgramSchedules(data).subscribe(
        (result: any) => {
          if (result.status) {
            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => this.router.navigate(['/ems/induction-program']));
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
              data: 'Employee Program schedule updated successfully',
            });
          } else {
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
              data: 'Unable to to update employee program schedule',
            });
          }
        }
      );
    } else {
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position: { top: `70px` },
        disableClose: true,
        data: 'Please select employees',
      });
    }
  }

  meetingSchedule() {
    // this.allmails.push(personal_email)
    this.alldata = this.selection.selected;
    for (let i = 0; i < this.alldata.length; i++) {
      this.allmails.push(this.alldata[i].officeemail);
      this.allempid.push(this.alldata[i].id);
    }
    let data = {
      esid: null,
      scheduleid: this.scheduleid,
      empid: this.allempid,
      status: 'Pending',
      actionby: this.userSession.id,
      email: this.allmails,
      emaildata:this.employeeEmailData
    };
    this.EMS.setselectEmployeesProgramSchedules(data).subscribe(
      (result: any) => {
        if (result.status) {
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => this.router.navigate(['/ems/induction-program']));
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: 'Program schedule mails send successfully',
          });
        } else {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: 'Unable to to send mails',
          });
        }
      }
    );
  }
  getPageSizes(): number[] {
    if (this.dataSource.data.length > 20) {
      return [5, 10, 20, this.dataSource.data.length];
    }
    else {

      return [5, 10, 20];
    }
  }
  getInductionProgramAssignedEmployesList() {
   this.emailsList = [];
   let data = [];
    this.EMS.getInductionProgramAssignedEmployees(this.scheduledId)
      .subscribe((res: any) => {
         data = res.data;
        for (let i = 0; i < data.length; i++) {
          this.emailsList.push(data[i].officeemail);
         }
      })
  }
  getEmployeeEmailData() {
   this.employeeEmailData =[]
    this.EMS.getEmployeeEmailDataByEmpid(this.userSession.id)
      .subscribe((res: any) => {
        this.employeeEmailData = JSON.parse(res.data[0].jsonvalu)[0];
       })
  }
}
