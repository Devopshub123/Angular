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
// import * as _moment from 'moment';
// import { Moment } from 'moment';

// const moment = _moment;
@Component({
  selector: 'app-user-compoff',
  templateUrl: './user-compoff.component.html',
  styleUrls: ['./user-compoff.component.scss']
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
 
  today:any=new Date();
  ishide:boolean=true;
  displayedColumns: string[] = ['appliedon','workeddate','hours','status','approver'];
  dataSource: MatTableDataSource<any>=<any>[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  constructor(private formBuilder: FormBuilder,private router: Router,private LM:LeavesService,public datepipe: DatePipe,public dialog: MatDialog) { 
    this.usersession = JSON.parse(sessionStorage.getItem('user') || '')
    this.year = this.today.getFullYear();
    this.month = this.today.getMonth();
    this.max = (new Date());
    // this.CompoffForm.empId.controls.setValue(this.usersession.id);
    // // this.compOff.empRollnumber=this.usersession.empid;
    // this.CompoffForm.empName.controls.setValue(this.usersession.firstname+' '+ this.usersession.lastname);

  }

  ngOnInit(): void {
    this.getCompOffMinWorkingHours();
    this.getCompOff();
    this.getCompoffCalender();
    this.getDurationforBackdatedCompoffLeave();
    this.CompoffForm=this.formBuilder.group(
      {
      empId: ["",Validators.required],        
      empName: ["",],
      workeddate:[""],
      hours:["",],
      minutes:["",],
      reason:["",]
      
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
    this.LM.getCompOff(this.usersession.id,this.usersession.rmid).subscribe((result)=> {
      console.log(result);
      if(result.status){
        this.compOffDetails = result.data;
        console.log(result.data)
        this.dataSource = new MatTableDataSource(this.compOffDetails);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })


  }
  // getCompoffCalender(){}
  getDurationforBackdatedCompoffLeave(){
    this.LM.getDurationforBackdatedCompoffLeave(this.calender).subscribe((result)=> {
      if(result.status){
        this.min = (new Date(this.today.setDate(this.today.getDate()-result.data[0].value)));
      }
    });
  
  }
  
  getCompoffCalender(){
    this.calender.employeeId=this.usersession.id;
    this.calender.year=this.year.toString()
    // this.calender.month='0'+(this.month+1).toString();
    // this.calender.month.length === 3?this.calender.month.substring(1):this.calender.month;
    this.LM.getCompoffCalender(this.calender).subscribe((result)=> {
      if(result.status) {
        // new Date(this.today.setDate(this.today.getDate()-result.data[0].value)
        console.log('result',result)
        for(let i= 0;i<result.data.length;i++){
          // this.compOffDates.push(new Date(result.data[i].edate))
          this.compOffDates.push((result.data[i].edate))
        }
        console.log(' this.compOffDates', this.compOffDates)
       
      //   this.compOffDateshide = (d: Date | null): boolean => {
      //     const date = d|| new Date().getDay();
         
      //     // return this.compOffDates;
      //     // return day !== 0
      //     return !this.compOffDates.find((x:any)=>x==date);
      // }
      }

    })


  }
  
  submit(){
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
      workedHours:this.CompoffForm.controls.hours.value
    }
    this.LM.setCompOff(data).subscribe((result)=> {
      if(result.status){
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate(["/LeaveManagement/UserCompOff"]));
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: 'Compoff registerd successfully.'
        });  
        
      }else{
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: 'Unable to register compoff.'
        });
      }
      
    })

  }
  cancel(){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate(["/LeaveManagement/UserCompOff"]));
  }
  onChangeHour(event:Event){}

}
