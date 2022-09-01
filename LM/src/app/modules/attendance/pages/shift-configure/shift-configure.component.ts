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
import { AttendanceService } from '../../attendance.service';

@Component({
  selector: 'app-shift-configure',
  templateUrl: './shift-configure.component.html',
  styleUrls: ['./shift-configure.component.scss']
})
export class ShiftConfigureComponent implements OnInit {

  requestform!: FormGroup;
  minFromDate: Date;
  maxFromDate: Date | null;
  minToDate: Date | null;
  maxToDate: Date;
  currentDate: Date = new Date();
  pipe = new DatePipe('en-US');
  todayWithPipe: any;
  displayedColumns: string[] = ["select", 'id', 'empid', 'empname', 'shiftname', 'fromdate', 'todate','weekoffs'];
  dataSource: MatTableDataSource<any> = <any>[];

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
  constructor(private formBuilder: FormBuilder, private attendanceService: AttendanceService,
    public dialog: MatDialog, public datePipe: DatePipe, private router: Router,private adminService: AdminService
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
    let obj={
      "manager_empid":this.userSession.id,
      "department_id":null
    }
    this.attendanceService.getEmployeeConfigureShifts(obj).subscribe((res) => {
      if (res.status) {
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

  }
  selection = new SelectionModel<any>(true, []);


  ngOnInit(): void {
    this.getMessagesList();
    this.todayWithPipe = this.pipe.transform(Date.now(), 'dd/MM/yyyy');
    this.requestform = this.formBuilder.group(
      {
        shift: ['', Validators.required],
        fromDate: ['', Validators.required],
        toDate: ['', Validators.required],
      });

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

  fromDateChange(type: string, event: MatDatepickerInputEvent<Date>) {
    this.minToDate = event.value;
    if (event.value !== null) {
      this.maxToDate = new Date(
        event!.value.getFullYear()+1,
        event!.value.getMonth(),
        event!.value.getDate()
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
    this.attendanceService.getMastertable('week_master', null, 1, 10, 'keerthi_hospitals').subscribe(data => {
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
    this.arrayList = [];
    let obj={
      "manager_empid":this.userSession.id,
      "department_id":null
    }
    this.attendanceService.getEmployeeConfigureShifts(obj).subscribe((res) => {
      if (res.status) {
        this.arrayList = res.data;
        this.dataSource = new MatTableDataSource(this.arrayList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      } else {
        this.arrayList = [];
        this.dataSource = new MatTableDataSource(this.arrayList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  };
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  saveConsultation() {

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
    return;
   }


    }
  }
  resetform() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/Attendance/ShiftConfigure"]));

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
    console.log(this.selection.selected);
    return this.selection.selected.length > 0;
  }
  getPageSizes(): number[] {
    if (this.dataSource.data.length > 20) {
      return [5, 10, 20, this.dataSource.data.length];
    }
    else {
     return [5, 10, 20];
    }
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
        }
      })
     }
     else {
       this.messagesDataList = [];
     }

   })
 }
}

