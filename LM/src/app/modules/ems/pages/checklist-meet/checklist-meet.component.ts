import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import {EmsService} from '../../ems.service'
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { isThisSecond } from 'date-fns';
// import { ResourceLimits } from 'worker_threads';
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
  selector: 'app-checklist-meet',
  templateUrl: './checklist-meet.component.html',
  styleUrls: ['./checklist-meet.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],

})
export class ChecklistMeetComponent implements OnInit {
  checklistForm!: FormGroup;
  displayedColumns = ['sno','ptype','department','conductby','date','stime','etime','status','action'];
  addChecklistColumns = ['select', 'sno', 'name', 'date', 'status'];
  dataSource : MatTableDataSource<any>=<any>[];
  dataSource2 :  MatTableDataSource<any>=<any>[];
  dataSource3:MatTableDataSource<any>=<any>[];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  selection = new SelectionModel<any>(true, []);
  pageLoading = true;
  isRequestView = false;
  isEditView=false;
  uniqueId: any = '';
  pipe = new DatePipe('en-US');
  messagesDataList: any = [];
  requiredField: any;
  requiredOption: any;
  dataSave: any;
  dataNotSave: any;
  deptdata:any=null;
  desdata:any=null;
  allmails:any=[];
  alldata:any=[];
  allempid:any=[];
  allesid:any=[];
  scheduleid:any;
  availableDesignations:any=[];
  availableDepartments:any=[];
  availableprogramtypes:any=[];
  conductlist:any=[];
  min:any
  mintime:any;
  mdate:any=new Date();
  isAdd:boolean=false;
  isAddChecklist:boolean=false;
  isUpdateChecklist:boolean=false;
  isedit:boolean=false;
  isdata: boolean = true;
  userSession:any;
  companyList: any = ['Attended','Not Attended'];
  rolesList: any = ['Manager', 'Admin', 'HR', 'Staff'];
  minDate = new Date('2000/01/01'); maxDate = new Date("2200/01/01");
  constructor(private formBuilder: FormBuilder,private router: Router,public dialog: MatDialog,private companyServices: CompanySettingService,private EMS:EmsService) {

  }
  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.getDepartmentsMaster();
    this.getDesignationsMaster();
    this.getProgramsMaster(null);
    this.getProgramSchedules(null,null);
    this.getnewHiredDetails();
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
        updatestatus:['Attended']

      });
    // this.checklistForm.controls.date.setValue(new Date()  );
    this.checklistForm.get('starttime')?.valueChanges.subscribe(selectedValue => {
      this.min=selectedValue;
      this.mintime=selectedValue;

    })
       this.checklistForm.get('endtime')?.valueChanges.subscribe(selectedValue => {
      if(this.mintime == selectedValue ){ 
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: 'Please change endtime'
        });  
      }else if(this.pipe.transform(this.mintime, 'HH:mm')==this.pipe.transform(selectedValue, 'HH:mm')){
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: 'Please change endtime'
        });  

      }
    })
    this.checklistForm.get('department')?.valueChanges.subscribe(selectedValue => {
      this.deptdata=selectedValue;
      if(this.desdata!=null){
        this.coductedby(this.deptdata,this.desdata)
      }

    })
    this.checklistForm.get('designation')?.valueChanges.subscribe(selectedValue => {
      this.desdata=selectedValue;
      if(this.deptdata!=null){
        this.coductedby(this.deptdata,this.desdata)
      }

    })

  }
  getDesignationsMaster() {
    this.companyServices.getMastertable('designationsmaster', 1, 1, 1000, 'ems').subscribe(data => {
      if(data.status){
      this.availableDesignations = data.data;
      }
    })
  }
  getDepartmentsMaster() {
    this.companyServices.getMastertable('departmentsmaster', 1, 1, 1000, 'ems').subscribe(data => {
      if(data.status){
        this.availableDepartments = data.data;
      }
    })
  }
  getProgramsMaster(pId:any){
    this.companyServices.getMastertable('ems_programs_master', 1, 1, 1000, 'ems').subscribe(data => {
      if(data.status){
        this.availableprogramtypes = data.data;
      }
    })
  }

  getProgramSchedules(id: any,data:any){
    this.EMS.getProgramSchedules(id,data).subscribe((result: any) => {
      if(result.status){
        this.dataSource = new MatTableDataSource(result.data)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
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
  //req.body.scheduleId,req.body.programId,req.body.sDescription,req.body.conductedby,
  //req.body.scheduleDate,req.body.startTime,req.body.endTime,req.body.actionby
  sendrequests(){

  }
  saveRequest() {
    if(this.checklistForm.valid){
      let data = {
        scheduleId:null,
        programId:this.checklistForm.controls.programType.value,
        conductedby:this.checklistForm.controls.conductBy.value,
        Description:this.checklistForm.controls.description.value,
        scheduleDate:this.pipe.transform(this.checklistForm.controls.date.value,'yyyy-MM-dd')+' '+this.pipe.transform(this.checklistForm.controls.date.value, 'HH:mm:ss'),
        startTime:this.pipe.transform(this.checklistForm.controls.starttime.value, 'HH:mm:ss'),
        endTime:this.pipe.transform(this.checklistForm.controls.endtime.value, 'HH:mm:ss'),
        department:this.checklistForm.controls.department.value,
        designation:this.checklistForm.controls.designation.value,
        actionby:this.userSession.id

      }
      this.EMS.setProgramSchedules(data).subscribe((res: any) => {
        if(res.status ){
          console.log(res.data)
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/ems/induction-program"]));
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: 'Program schedule successfully'
          });

        }
        else{
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: 'Unable to Program scheduled.'
          });
        }

      })
    }

  }
  resetform() {

  }

  editRequest(data: any) {
    console.log(data)
    this.isAdd = true;
    this.isdata = false;
    this.isedit =true;
    this.scheduleid=data.id,
    this.checklistForm.controls.programType.setValue(data.program_id),
    this.checklistForm.controls.department.setValue(data.department),
    this.checklistForm.controls.designation.setValue(data.designation),
    this.checklistForm.controls.conductBy.setValue(data.conducted_by),
    this.checklistForm.controls.description.setValue(data.description),
    this.checklistForm.controls.date.setValue(new Date(data.schedule_date)),
    this.checklistForm.controls.starttime.setValue(new Date(data.schedule_date+' '+data.schedule_starttime)),
    this.checklistForm.controls.endtime.setValue(new Date(data.schedule_date+' '+data.schedule_endtime))

  }
  updating(data:any){
    this.selection=new SelectionModel()
    this.dataSource2 =new MatTableDataSource()
    // this.dataSource2=new MatTableDataSource(any)
    this.isUpdateChecklist = true;
    this.isAddChecklist = false;
    this.isdata = false;
    this.isAdd = false;
    console.log(data)
    this.scheduleid=data.id;
    this.EMS.getallEmployeeProgramSchedules(null,data.id).subscribe((res: any) => {
      this.dataSource2 = new MatTableDataSource(res.data)
      this.selection = new SelectionModel(res.data)

    })
    // get_employee_program_schedules
    //get_employees_for_program_schedule

  }
  updateRequest(){
    if(this.checklistForm.valid){
      let data = {
        scheduleId:this.scheduleid,
        programId:this.checklistForm.controls.programType.value,
        conductedby:this.checklistForm.controls.conductBy.value,
        Description:this.checklistForm.controls.description.value,
        scheduleDate:this.pipe.transform(this.checklistForm.controls.date.value,'yyyy-MM-dd')+' '+this.pipe.transform(this.checklistForm.controls.date.value, 'HH:mm:ss'),
        startTime:this.pipe.transform(this.checklistForm.controls.starttime.value, 'HH:mm:ss'),
        endTime:this.pipe.transform(this.checklistForm.controls.endtime.value, 'HH:mm:ss'),
        department:this.checklistForm.controls.department.value,
        designation:this.checklistForm.controls.designation.value,
        actionby:this.userSession.id

      }
      this.EMS.setProgramSchedules(data).subscribe((res: any) => {
        console.log(res.data)
        this.scheduleid='';
        if(res.status ){
          console.log(res.data)
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/ems/induction-program"]));
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: 'Program schedule update successfully'
          });

        }
        else{
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: 'Unable to update Program scheduled.'
          });
        }

      })
    }

  }
  deleteRequest(event: any) {
  }

  requestView(event: any) {
    this.isAddChecklist = true;
    this.isUpdateChecklist = false;
    this.isdata = false;
    this.isAdd = false;
    console.log(event)
    this.scheduleid=event.id;
    this.EMS.getEmployeesForProgramSchedule(event.id).subscribe((result:any)=>{
      console.log(result)
      this.dataSource2 = new MatTableDataSource(result.data)
      this.selection = new SelectionModel(result.data)
    })
  }
  Add(){
    //this.checklistForm.controls.companyName.setValue('');
    this.isAdd = true;
    this.isdata = false;
  }
  coductedby(e1:any,e2:any){
    this.EMS.getDepartmentEmployeesByDesignation(e1,e2).subscribe((result: any) => {
      if(result.status){
       this.conductlist = result.data;

      }
    })

  }
  getnewHiredDetails(){
    // this.EMS.getEmployeesForProgramSchedule(null).subscribe((result:any)=>{
    //   console.log(result)
    //   this.dataSource2 = new MatTableDataSource(result.data)
    //   // this.selection = new SelectionModel(result.data)(true, []);
    //   this.selection = new SelectionModel(result.data)
    // })
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
  logSelections(){
    if(this.selection.selected.length >0){
      this.alldata=this.selection.selected;
      for(let i=0;i<this.alldata.length;i++){
        this.allmails.push(this.alldata[i].officeemail)
        this.allempid.push(this.alldata[i].empid)
        this.allesid.push(this.alldata[i].id)
  
      }
      let data = {
        esid:this.allesid,
        scheduleid:this.scheduleid,
        empid:this.allempid,
        status:this.checklistForm.controls.updatestatus.value,
        actionby:this.userSession.id,
        email:this.allmails
      }
      this.EMS.updateselectEmployeesProgramSchedules(data).subscribe((result:any)=>{
        if (result.status){
     this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
       this.router.navigate(["/ems/induction-program"]));
     let dialogRef = this.dialog.open(ReusableDialogComponent, {
       position:{top:`70px`},
       disableClose: true,
       data: 'employee Program schedule updated successfully'
     });
  
   }
   else{
     let dialogRef = this.dialog.open(ReusableDialogComponent, {
       position:{top:`70px`},
       disableClose: true,
       data: 'Unable to to update employee program schedule'
     });
   }
  
   })

    }else{
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position:{top:`70px`},
        disableClose: true,
        data: 'Please select employees'
      });

    }
   
 

  }

  logSelection() {

      // this.allmails.push(personal_email)
      this.alldata=this.selection.selected;
      for(let i=0;i<this.alldata.length;i++){
        this.allmails.push(this.alldata[i].officeemail)
        this.allempid.push(this.alldata[i].id)
      }
      let data = {
        esid:null,
        scheduleid:this.scheduleid,
        empid:this.allempid,
        status:'pending',
        actionby:this.userSession.id,
        email:this.allmails
      }
      this.EMS.setselectEmployeesProgramSchedules(data).subscribe((result:any)=>{
        console.log(result)
           if (result.status){
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/ems/induction-program"]));
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: 'Program schedule mails send successfully'
        });

      }
      else{
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: 'Unable to to send mails'
        });
      }

      })
    //   this.EMS.setProgramSchedulemail(this.allmails).subscribe((result: any) => {
    //   if (result.status){
    //     this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    //       this.router.navigate(["/ems/induction-program"]));
    //     let dialogRef = this.dialog.open(ReusableDialogComponent, {
    //       position:{top:`70px`},
    //       disableClose: true,
    //       data: 'Program schedule mails send successfully'
    //     });

    //   }
    //   else{
    //     let dialogRef = this.dialog.open(ReusableDialogComponent, {
    //       position:{top:`70px`},
    //       disableClose: true,
    //       data: 'Unable to to send mails'
    //     });
    //   }


    // })

}
// export interface PeriodicElement {
//   id: number;
//   name: string;
//   mobile: number;
//   email: string;
//   address: string;
//   type: string;
// }
// const Sample_Data: PeriodicElement[] = [
//   {id: 1, name: 'Sreeb Tech', mobile: 9666313001, email: 'sreeb@gmail.com',address:'Hitech city',type:'Software'},
//   {id: 2, name: 'Sanela', mobile: 966666666, email: 'sanela@gmail.com',address:'Kondapur',type:'Hardware'},
//   {id: 3, name: 'Sriram Hardwaress', mobile: 898989898, email: 'ram@gmail.com',address:'Madhapor',type:'Network'},
//   {id: 4, name: 'ABC Tech', mobile: 568975698, email: 'abc@gmail.com',address:'Gachibowli',type:'Stationary'},
//   {id: 5, name: 'Soft Soluntions', mobile: 9638527415, email: 'soft@gmail.com',address:'Gachibowli',type:'Software'},
//   {id: 6, name: 'Dell ', mobile: 1478963255, email: 'dell@gmail.com',address:'Gachibowli',type:'Software'},
//   {id: 7, name: 'Tech Mahindra', mobile: 1234569874, email: 'techm@gmail.com',address:'Hitech city',type:'Hardware'},
//   {id: 8, name: 'Wipro', mobile: 8745693215, email: 'wipro@gmail.com',address:'Hyderabad',type:'Hardware'},
//   {id: 9, name: 'Accenture', mobile: 7896541236, email: 'accenture@gmail.com',address:'Kondapur',type:'Network'},
//   {id: 10, name: 'TATA Consultency', mobile: 6589471230, email: 'tcs@gmail.com',address:'Kondapur',type:'Hardware'},
//   {id: 11, name: 'Cognizent', mobile: 3269857410, email: 'cognizent@gmail.com',address:'Hyderabad',type:'Network'},
// ];

// export interface PeriodicElement2 {
//   name: string;
//   position: number;
//   weight: number;
//   symbol: string;
// }

// const ELEMENT_DATA: PeriodicElement2[] = [
//   {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
//   {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
//   {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
//   {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
//   {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
//   {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
//   {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
//   {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},

// ];
}
