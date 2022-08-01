import { ReviewAndApprovalsComponent } from './../../dialog/review-and-approvals/review-and-approvals.component';
import { LeavesService } from './../../leaves.service';
import { Component, OnInit,ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {Router} from "@angular/router";
import { DatePipe} from '@angular/common';
import {MatDialog} from "@angular/material/dialog";
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { style } from '@angular/animations';
// import { ChartOptions, ChartType } from 'chart.js';
// import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {


  usersession:any;
  leavedata:any=[];
  holidaysList:any = [];
  holidaysListall:any = [];
  viewdata:any;
  allleaves:any=[]
  deletedata:any;
  datesToBeHighlighted:any;
  titleName:any;
  reason:any;
  calenderleaves:any=[];
  currentYear = new Date().getDate();
  myDateFilter:any;
  pipe = new DatePipe('en-US');
  today:any =new Date()
  isview:boolean=false;
  isdata:boolean=true;
  isholidays:boolean=false;
  maxall : number=20;
  holidaysColumns:string[]=['day','date','holiday']
  displayedColumns: string[] = ['appliedon','leavetype','fromdate','todate','days','status','approver','action'];
  dataSource: MatTableDataSource<any>=<any>[];
  holidaydatasource:MatTableDataSource<any>=<any>[];
  holidaysalldatasource:MatTableDataSource<any>=<any>[];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  // @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

  constructor(private router: Router,private LM:LeavesService,public datepipe: DatePipe,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.usersession = JSON.parse(sessionStorage.getItem('user') || '');
    this.dataSource.paginator = this.paginator;
    this.getleavehistory(null,null);
    this.getHolidaysList();
    this.getLeaveBalance();
    this.getuserleavecalender();
  }

  getuserleavecalender(){
    this.LM.getuserleavecalender(this.usersession.id).subscribe((result:any)=>{
      this.calenderleaves = result.data;
    
      console.log(this.calenderleaves)
      this.myDateFilter = (d: Date): boolean => {
        let isValid=false;
      this.calenderleaves.forEach((e:any) => {
        if(this.pipe.transform(e.edate, 'yyyy/MM/dd') == this.pipe.transform(d, 'yyyy/MM/dd')){
          isValid=true
          
        }
      });
  
        return isValid;
        // return (e.edate: Date): MatCalendarCellCssClasses => {
        //   if (date.getDate() === 1) {
        //     return 'special-date';
        //   } else {
        //     return 'special-date';
        //   }
        // };

       } 
  
    })

    

  }
 
  dateClass() {
    return (date: Date): MatCalendarCellCssClasses => {
      return this.calenderleaves.forEach((e: any) => {
        if (this.pipe.transform(e.edate, 'yyyy/MM/dd') == this.pipe.transform(date, 'yyyy/MM/dd')) {
          return 'special-date';
        }
        else {
          return date;
        }
      });
     
    };
  }
  getleavehistory(page:any,size:any){
    this.LM.getleavehistory(this.usersession.id,1,1000).subscribe((result:any)=>{
      this.allleaves = result;
      for(let i= 0; i<result.data.length;i++){
        if(result.data.length > 5){
          if(i === 5){
            break;
          }else {
            this.leavedata.push(result.data[i])
  
          }

        }
        else{
          this.leavedata.push(result.data[i])
        }
        
      }
      this.dataSource = new MatTableDataSource(this.leavedata);
     

    })
 
  }

  getHolidaysList() {
    this.LM.getHolidaysList(this.usersession.id).subscribe((result)=>{
      this.holidaysList = result;
      console.log(result)
      this.holidaysList = this.holidaysList.data[0];
      this.holidaydatasource = new MatTableDataSource(this.holidaysList);
    })
  }
  getLeaveBalance(){
    this.LM.getLeaveBalance(this.usersession.id).subscribe((result)=>{
      if(result.status){
        for(let t =0; t<result.data[0].length; t++){
          if(this.usersession.maritalstatus === "Married" && result.data[0][t].leavename === "Marriage Leave"){
            result.data[0].splice(t,1);
            if(this.usersession.gender === 'Male' && result.data[0][t].leavename === 'Maternity Leave'){
              result.data[0].splice(t,1);
            }else if(this.usersession.gender === "FeMale" && result.data[0][t].leavename === 'Paternity Leave') {
              result.data[0].splice(t,1);
            }
          }else {
            if(result.data[0][t].leavename === 'Maternity Leave' || result.data[0][t].leavename === 'Paternity Leave'){
              result.data[0].splice(t,1)
            }

          }
        }

        this.leavedata = result.data[0];
      }
    })
  }

  onSelect(event:any){
    this.today = event;
  }

view(data:any){
  this.isview=true;
  this.isdata=false;
  this.viewdata = data;
  console.log(data)
}
viewall(){
  
  this.LM.getHolidays(new Date().getFullYear(),this.usersession.worklocation,1,100).subscribe((result)=>{
    this.holidaysListall = result;
    
    this.holidaysListall = this.holidaysListall.data;
    console.log(this.holidaysListall )
    this.holidaysalldatasource = new MatTableDataSource( this.holidaysListall);
  })
  this.isdata=false;
  this.isholidays=true;
}
// console.log(this.allleaves)
close(){
  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    this.router.navigate(["/LeaveManagement/UserDashboard"]));
}

cancel(data:any){
  this.deletedata = data;
  this.titleName="Do you really want to cancel the leave?"
  this.openDialogcancel();
}
openDialogcancel(): void {
  const dialogRef = this.dialog.open(ReviewAndApprovalsComponent, {
    width: '500px',position:{top:`70px`},
    data: {name: this.titleName, reason: this.reason}
  });

  dialogRef.afterClosed().subscribe(result => {
  this.deletedata.actionreason =result.reason;
    console.log(this.deletedata)
    if(result!=''){
      console.log(this.deletedata)
      this.LM.cancelLeaveRequest(this.deletedata).subscribe((data)=>{
        if(data.status){
          console.log("hi")
        
        }
      })
    }
  });
}

delete(data:any){
  this.deletedata = data;
  this.titleName="Do you really want to delete the leave?"
  this.openDialogdelete();
}
openDialogdelete(): void {
  const dialogRef = this.dialog.open(ReviewAndApprovalsComponent, {
    width: '500px',position:{top:`70px`},
    data: {name: this.titleName, reason: this.reason}
  });

  dialogRef.afterClosed().subscribe(result => {
  this.deletedata.actionreason =result.reason;
    console.log(this.deletedata)
    if(result!=''){
      console.log(this.deletedata)
      this.LM.setDeleteLeaveRequest(this.deletedata).subscribe((data)=>{
        if(data.status){
          
        }
      })
    }
  });
}


}


