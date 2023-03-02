import { LeavesService } from './../../leaves.service';
import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup,FormControl,Validators, FormBuilder, AbstractControl, FormArray} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {MatDialog} from "@angular/material/dialog";
import { DatePipe} from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';


import * as _moment from 'moment';
import { EmsService } from 'src/app/modules/ems/ems.service';
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
  selector: 'app-user-compoff',
  templateUrl: './user-compoff.component.html',
  styleUrls: ['./user-compoff.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class UserCompoffComponent implements OnInit {
  max:any ;
  min:any;
  CompoffForm:any= FormGroup;
  compOffDates:any=[];
  compOffDateshide:any=[];

  minimumHours:any=[];
  usersession:any=[];
  calender:any={};
  compOffDetails:any=[];
  year:any;
  month:any;
  msgLM79: any;
  msgLM137: any;
  msgLM1: any;
  msgLM3: any;
  msgLM7: any;
  msgLM136: any;

  today:any=new Date();
  ishide:boolean=true;
  isview:boolean=false;
  displayedColumns: string[] = ['appliedon','workeddate','hours','status','approver','action'];
  dataSource: MatTableDataSource<any>=<any>[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  currentYear = new Date().getDate();
  myDateFilter:any;
  pipe = new DatePipe('en-US');
  constructor(private formBuilder: FormBuilder, private router: Router, private LM: LeavesService,
    public datepipe: DatePipe, public dialog: MatDialog,private EMS:EmsService) {
    this.usersession = JSON.parse(sessionStorage.getItem('user') || '')
    this.year = this.today.getFullYear();
    this.month = this.today.getMonth();
    this.max = (new Date());
    // this.CompoffForm.empId.controls.setValue(this.usersession.id);
    // // this.compOff.empRollnumber=this.usersession.empid;
    // this.CompoffForm.empName.controls.setValue(this.usersession.firstname+' '+ this.usersession.lastname);

    // this.myDateFilter = (d: Date): boolean => {
    //  // const year = (d || new Date()).getDate();
    //   //return year >= this.currentYear -1 && year <= this.currentYear + 1;

    //  return [1, 5, 10, 21].indexOf(+d.getDate()) == -1
    // }
  }
  employeeEmailData: any = [];
  employeeId: any;
  ngOnInit(): void {

    this.getErrorMessages('LM1')
    this.getErrorMessages('LM3')
    this.getErrorMessages('LM79')
    this.getErrorMessages('LM76')
    this.getErrorMessages('LM7')
    this.getErrorMessages('LM117')
    this.getErrorMessages('LM136')

    // msgLM136
    this.getCompOffMinWorkingHours();
    this.getCompOff();
    this.getCompoffCalender();
    this.getDurationforBackdatedCompoffLeave();
    this.CompoffForm=this.formBuilder.group(
      {
      empId: [""],
      empName: ["",],
      workeddate:["",Validators.required],
      hours:["",Validators.required],
      minutes:["",],
      reason:["",Validators.required],
      status:[''],
      rejectreason:['']

    });
    this.CompoffForm.get('hours')?.valueChanges.subscribe((selectedValue:any) => {
      if(selectedValue == 24){
        this.CompoffForm.controls.minutes.setValue('00')
        this.ishide = false;
      }
      else{
        this.ishide = true;
      }
    })
    this.getEmployeeEmailData();
  }

  getCompOffMinWorkingHours(){
    this.LM.getCompOffMinWorkingHours().subscribe((result)=> {
      if(result.status){
        for(let i=result.data[0].value;i<=24;i++){
          this.minimumHours.push({value:i})
        }
      }
    })

  }
  // getCompOff(){}
  getCompOff(){
    this.LM.getCompOff(this.usersession.id,null).subscribe((result)=> {
      if(result.status){
        this.compOffDetails = result.data;
        this.dataSource = new MatTableDataSource(this.compOffDetails);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })


  }

  getDurationforBackdatedCompoffLeave(){
    this.LM.getDurationforBackdatedCompoffLeave(this.calender).subscribe((result)=> {
      var tempDate = this.today.setDate(this.today.getDate()-result.data[0].value)
      if(result.status){
        this.min = (new Date(this.usersession.dateofjoin)>(tempDate)) ? new Date(this.usersession.dateofjoin): new Date(tempDate);
      }
    });

  }
  // getCompoffCalender(){}
  // getDurationforBackdatedCompoffLeave(){
  //   this.LM.getDurationforBackdatedCompoffLeave(this.calender).subscribe((result)=> {
  //     if(result.status){
  //       this.min = (new Date(this.usersession.dateofjoin)>(new Date(this.today.setDate(this.today.getDate()-result.data[0].value)))) ? new Date(this.usersession.dateofjoin): (new Date(this.today.setDate(this.today.getDate()-result.data[0].value)));
  //     }
  //   });
  //
  // }

  getCompoffCalender(){
    this.calender.employeeId=this.usersession.id;
    this.calender.year=this.year.toString()
    // this.calender.month='0'+(this.month+1).toString();
    // this.calender.month.length === 3?this.calender.month.substring(1):this.calender.month;
    this.LM.getCompoffCalender(this.calender).subscribe((result)=> {
      if(result.status) {
        // new Date(this.today.setDate(this.today.getDate()-result.data[0].value)
        for(let i= 0;i<result.data.length;i++){
          let date=result.data[i].edate +' ' +'00:00:00'
          this.compOffDates.push(new Date(date))
          // this.compOffDates.push((result.data[i].edate))
        }


    this.myDateFilter = (d: Date): boolean => {
      let isValid=false;
      //  const year = (d || new Date()).getDate();
      //  if(year >= this.currentYear -1 && year <= this.currentYear + 1){
      //   isValid=true
      //  }else{
      //   isValid=false;
      //  }
    //  let index = this.compOffDates.findIndex((e:any) =>this.pipe.transform(e, 'yyyy/MM/dd')=== this.pipe.transform(d, 'yyyy/MM/dd'));
    this.compOffDates.forEach((e:any) => {
      if(this.pipe.transform(e, 'yyyy/MM/dd') == this.pipe.transform(d, 'yyyy/MM/dd')){
        isValid=true
      }
    });

      return isValid;


     }
      }

    })


  }

  submit() {
    if (this.CompoffForm.valid) {
    
    let data={
      rmId:this.usersession.roles[0].rmid,
      id:null,
      remarks:null,
      status:'Submitted',
      empRollnumber:this.usersession.id,
      empName:this.usersession.firstname+' '+ this.usersession.lastname,
      empId:this.usersession.id,
      workedMinutes:this.CompoffForm.controls.minutes.value?this.CompoffForm.controls.minutes.value:0,
      workDate:this.datepipe.transform(this.CompoffForm.controls.workeddate.value, 'yyyy-MM-dd'),
      reason:this.CompoffForm.controls.reason.value,
      workedHours: this.CompoffForm.controls.hours.value,
      emaildata:this.employeeEmailData
    }
    this.LM.setCompOff(data).subscribe((result)=> {
      if(result.status){
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate(["/LeaveManagement/UserCompOff"]));
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: this.msgLM136
        });

      }else{
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: this.msgLM137
        });
      }

    })
  }

  }
  view(data:any){
    this.isview= true;
    console.log(data)
    this.CompoffForm.controls.empId.setValue()
    this.CompoffForm.controls.empName.setValue(1)
    this.CompoffForm.controls.workeddate.setValue(new Date(data.comp_off_date))  
    this.CompoffForm.controls.hours.setValue(data.worked_hours) 
    this.CompoffForm.controls.minutes.setValue(data.worked_minutes==0?"00":data.worked_minutes) 
    this.CompoffForm.controls.reason.setValue(data.reason) 
    this.CompoffForm.controls.status.setValue(data.status) 
    this.CompoffForm.controls.rejectreason.setValue(data.remarks) 
  }
  cancel(){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate(["/LeaveManagement/UserCompOff"]));
  }
  onChangeHour(event:Event){}
  getErrorMessages(errorCode:any)
  {

    this.LM.getErrorMessages(errorCode, 1, 1).subscribe((result) => {

      if (result.status && errorCode == 'LM79') {
        this.msgLM79 = result.data[0].errormessage
      }
      else if (result.status && errorCode == 'LM136') {
        this.msgLM136 = result.data[0].errormessage
      }
      else if (result.status && errorCode == 'LM1') {
        this.msgLM1 = result.data[0].errormessage
      } else if (result.status && errorCode == 'LM3') {
        this.msgLM3 = result.data[0].errormessage
      }else if (result.status && errorCode == 'LM7') {
        this.msgLM7 = result.data[0].errormessage
      }else if (result.status && errorCode == 'LM137') {
        this.msgLM137 = result.data[0].errormessage
      }

    })
  }
  getEmployeeEmailData() {
    this.employeeEmailData = [];
    this.EMS.getEmployeeEmailDataByEmpid(this.usersession.id)
      .subscribe((res: any) => {
        this.employeeEmailData = JSON.parse(res.data[0].jsonvalu)[0];
      })
}
}
