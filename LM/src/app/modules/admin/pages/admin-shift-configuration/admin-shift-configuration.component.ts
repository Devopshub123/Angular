import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/modules/admin/admin.service';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { environment } from 'src/environments/environment';

import * as _moment from 'moment';
import { AttendanceService } from 'src/app/modules/attendance/attendance.service';
import { CompanySettingService } from 'src/app/services/companysetting.service';
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
  selector: 'app-admin-shift-configuration',
  templateUrl: './admin-shift-configuration.component.html',
  styleUrls: ['./admin-shift-configuration.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class AdminShiftConfigurationComponent implements OnInit {

  requestform: any = FormGroup;
  searchform: any = FormGroup;
  minFromDate: Date;
  maxFromDate: Date | null;
  minToDate: Date | null;
  maxToDate: Date;
  currentDate: Date = new Date();
  pipe = new DatePipe('en-US');
  todayWithPipe: any;
  displayedColumns: string[] = ["select", 'id', 'empid', 'empname', 'shiftname', 'fromdate', 'todate','weekoffs'];
  dataSource: MatTableDataSource<any> = <any>[];
  ATT74:any;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  arrayList: any = [];
  userSession: any;
  shiftDataList: any=[];
  employeesData: any;
  weekDaysDetails:any=[];
  workingDays: any = [];
  weekoffs: any=[];
  selectedEmps: any=[];

  pageLoading = true;
  messagesDataList: any = [];
  requiredOption: any;
  dataSave: any;
  dataNotSave: any;
  recordExist: any;
  companyDBName: any = environment.dbName;
  availableDepartments: any = [];
  isShow = false;
  constructor(private formBuilder: FormBuilder, private attendanceService: AttendanceService,
    public dialog: MatDialog, public datePipe: DatePipe, private router: Router,
    private companyService: CompanySettingService,private adminService: AdminService
  ) {
    this.userSession = JSON.parse(sessionStorage.getItem('user') ?? '');
    this.minFromDate = new Date();
    this.minFromDate.setDate(this.currentDate.getDate()+1);
    this.maxFromDate = new Date();
    this.maxFromDate.setDate(this.currentDate.getFullYear() + 1);
    this.minToDate = new Date();
    this.minToDate.setDate(this.currentDate.getDate()+1);
    this.maxToDate = new Date();
    this.maxToDate.setDate(this.currentDate.getFullYear() + 1);
    this.arrayList = [];
    // let obj={
    //   "manager_empid":this.userSession.id,
    //   "department_id":null
    // }
    // this.attendanceService.getEmployeeConfigureShifts(obj).subscribe((res) => {
    //   if (res.status) {
    //     this.arrayList = res.data;
    //     this.dataSource = new MatTableDataSource(this.arrayList);
    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sort = this.sort;
    //     this.pageLoading=false;
    //   } else {
    //     this.arrayList = [];
    //     this.dataSource = new MatTableDataSource(this.arrayList);
    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sort = this.sort;
    //   }
    // })

  }
  selection = new SelectionModel<any>(true, []);


  ngOnInit(): void {
    this.getMessagesList();
    this.todayWithPipe = this.pipe.transform(Date.now(), 'dd/MM/yyyy');
    this.searchform = this.formBuilder.group(
      {
        department: ['', Validators.required],
      });
    this.requestform = this.formBuilder.group(
      {
        shift: ['', Validators.required],
        fromDate: ['', Validators.required],
        toDate: ['', Validators.required],
      });
    this.getDepartmentsMaster();
    this.getWeekDays();
    this.getActiveShiftIds();
//    this.getEmployeeConfigureShifts();
    this.dataSource.paginator = this.paginator;
    }

  ngAfterViewInit() {

  }
  get f(): { [key: string]: AbstractControl } {
    return this.requestform.controls;
  }

  fromDateChange(type: string, event: any) {
    this.minToDate = event.value['_d']
    if (event.value['_d'] !== null) {
      this.maxToDate = new Date(
        event.value['_i'].year+1,
        event.value['_i'].month,
        event.value['_i'].date - 31
        // event!.value.getFullYear()+1,
        // event!.value.getMonth(),
        // event!.value.getDate()
      );
    }
  }

  toDateChange(type: string, event: MatDatepickerInputEvent<Date>) {
    // this.maxFromDate = event.value;
    // if (event.value !== null) {
    //   this.minFromDate = new Date(
    //     event!.value.getFullYear(),
    //     event!.value.getMonth(),
    //     event!.value.getDate()
    //   );
    // }
  }

  getActiveShiftIds() {
    this.attendanceService.getActiveShiftIds().subscribe((res) => {
      if (res.status) {
           this.shiftDataList = res.data;

      }
    })
  }

  getWeekDays() {
    this.weekDaysDetails=[];
    this.workingDays=[];
    this.attendanceService.getMastertable('week_master', null, 1, 10, this.companyDBName).subscribe(data => {
         if(data.status){
          this.weekDaysDetails = data.data;
             data.data.forEach((i:any)=>{
              let obj={"id":i.id,"name":i.week_name}
              this.workingDays.push(obj);
             })
         }


    })

  }

  getEmployeeConfigureShifts() {
    if (this.searchform.valid) {
      this.arrayList = [];
      let obj = {
        "manager_empid": null,
        "department_id": this.searchform.controls.department.value,
      }
      this.attendanceService.getEmployeeConfigureShifts(obj).subscribe((res) => {
        if (res.status) {
          this.isShow = true;
          this.arrayList = res.data;
          this.dataSource = new MatTableDataSource(this.arrayList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.pageLoading=false;
        } else {
          this.arrayList = [];
          this.dataSource = new MatTableDataSource(this.arrayList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      })
    } else {
      
    }
  };

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  saveShiftConfiguration() {

    if (this.requestform.invalid) {
      return;
    } else {
   if(this.selection.selected.length>0){
    this.selectedEmps=[];
    this.selection.selected.forEach((e:any)=>{
      this.selectedEmps.push(e.empid);
    });
    let obj = {
      "shift_id": this.requestform.controls.shift.value,
      "from_date": this.pipe.transform(new Date(this.requestform.controls.fromDate.value ?? ''), 'yyyy-MM-dd'),//this.datePipe.transform(this.requestform.controls.fromDate.value, "y-MM-d"),
      "to_date": this.pipe.transform(new Date(this.requestform.controls.toDate.value ?? ''), 'yyyy-MM-dd'),//this.requestform.controls.toDate.value,
      "weekoffs": JSON.stringify(this.weekoffs),
      "empids": JSON.stringify(this.selectedEmps)

    };
    this.attendanceService.setEmployeeConfigureShift(obj).subscribe((res) => {
      if (res.status) {
        let resMessage: any;
              if (res.message == "dataSaved") {
                resMessage = this.dataSave
              } else {
                resMessage = this.dataNotSave
              }
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
          data: resMessage
        });
        this.resetform();
        // this. getAttendanceRequestListByEmpId();
      }
    })
   }else{
     this.dialog.open(ReusableDialogComponent, {
       position: { top: `70px` },
       disableClose: true,
       data: "Select atleast one employee."
     });
    return;
   }


    }
  }

  resetform() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/Admin/admin-shift"]));

  }

  checkCheckBoxvalue(event: any, data: any) {

    if (event.checked == true) {
      this.weekoffs.push(data.id);
      this.workingDays.forEach((e:any,index:any) => {
        if (e.id == data.id){
         this.workingDays.splice(index, 1);
        }
      });

    } else {
      this.weekoffs.forEach((a:any,index:any)=>{
        if (a == data.id){
          this.weekoffs.splice(index, 1);
         }
      })
      let obj={"id":data.id,"name":data.week_name}
      this.workingDays.push(obj);
    }
  }
   /** Whether the number of selected elements matches the total number of rows. */
   isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    // if there is a selection then clear that selection
    if (this.isSomeSelected()) {
      this.selection.clear();
    } else {
      this.isAllSelected()
        ? this.selection.clear()
        : this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }

  isSomeSelected() {
    return this.selection.selected.length > 0;
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

  getMessagesList() {
    let data =
     {
       "code": null,
       "pagenumber":1,
       "pagesize":100
   }
   this.adminService.getMessagesListApi(data).subscribe((res:any)=>{
     if(res.status) {
       this.messagesDataList = res.data;
       this.messagesDataList.forEach((e: any) => {
        if (e.code == "ATT2") {
         this.requiredOption = e.message
        } else if (e.code == "ATT69") {
          this.dataSave =e.message
        } else if (e.code == "ATT70") {
          this.dataNotSave =e.message
        } else if (e.code == "ATT74") {
          this.ATT74 =e.message
        }
      })
     }
     else {
       this.messagesDataList = [];
     }

   })
  }
  
  getDepartmentsMaster() {
    this.companyService.getMastertable('departmentsmaster', 1, 1, 1000, this.companyDBName).subscribe(data => {
      if (data.status) {
        this.availableDepartments = data.data;
      }
    })
  }

}
