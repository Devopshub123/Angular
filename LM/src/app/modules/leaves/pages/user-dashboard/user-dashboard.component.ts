import { ReviewAndApprovalsComponent } from './../../dialog/review-and-approvals/review-and-approvals.component';
import { LeavesService } from './../../leaves.service';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { Component, OnInit,ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {Router} from "@angular/router";
import { DatePipe} from '@angular/common';
import {MatDialog} from "@angular/material/dialog";
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';
import { style } from '@angular/animations';
import { CalendarOptions, EventInput, FullCalendarComponent } from '@fullcalendar/angular'; // useful for typechecking
import { FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction';
import { LoginService } from 'src/app/services/login.service';
// import { ChartOptions, ChartType } from 'chart.js';
// import { BaseChartDirective } from 'ng2-charts';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;
  initialEvents: EventInput[] = [];
  calendarApi:any;
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev',
      center: 'title',
      right: 'next'
    },
    customButtons: {
      next: {

        click: this.nextMonth.bind(this),
      },
      prev: {
        click: this.prevMonth.bind(this),
      },

    },
    height:450,
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,

  };

  usersession:any;
  leavedata:any=[];
  leavebalance:any=[];
  holidaysList:any = [];
  holidaysListall:any = [];
  viewdata:any;
  allleaves:any=[]
  deletedata:any;
  datesToBeHighlighted:any;
  titleName:any;
  reason:any;
  msgLM16:any;
  msgLM17:any;
  msgLM73:any;
  msgLM74:any;
  leavsemaster:any=[]
  calenderleaves:any=[];
  arrayList:any=[];
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

  constructor(private router: Router,private LM:LeavesService,public datepipe: DatePipe,private ts :LoginService,public dialog: MatDialog,public spinner:NgxSpinnerService) { }


  ngOnInit(): void {
    this.getErrorMessages('LM16');
    this.getErrorMessages('LM17');
    this.getErrorMessages('LM73');
    this.getErrorMessages('LM74');
    this.usersession = JSON.parse(sessionStorage.getItem('user') || '');
    this.dataSource.paginator = this.paginator;
    this.getleavehistory(null,null);
    this.getHolidaysList();
    this.getLeaveBalance();
    this.getuserleavecalender();
  }

  getuserleavecalender(){
    this.spinner.show()
    // this.LM.getMastertablesforcalender('lm_leavesmaster','Active',1,100,'spryple_sanela').subscribe(data=>{
    //   this.leavsemaster = data.data;
    //
    // })
    this.LM.getuserleavecalender(this.usersession.id).subscribe((result:any)=>{
      this.spinner.hide();
      this.calenderleaves = result.data;
      this.arrayList = result.data;
      this.arrayList.forEach((e: any) => {
        let item =
          {
            title: e.ltype,
            start: e.edate, ///new Date(e.attendancedate).toISOString().replace(/T.*$/, ''),
            // color:e.color,
            // color:e.color==null?'yellow':e.color,
            color:e.color,
            icon:'fa-times-circle'

          }
        this.initialEvents.push(item);
      });
      this.calendarOptions.events = this.initialEvents;
      // this.myDateFilter = (d: Date): boolean => {
      //   let isValid=false;
      // this.calenderleaves.forEach((e:any) => {
      //   if(this.pipe.transform(e.edate, 'yyyy/MM/dd') == this.pipe.transform(d, 'yyyy/MM/dd')){
      //     isValid=true

      //   }
      // });

      //   return isValid;
        // return (e.edate: Date): MatCalendarCellCssClasses => {
        //   if (date.getDate() === 1) {
        //     return 'special-date';
        //   } else {
        //     return 'special-date';
        //   }
        // };

      //  }

    })



  }

  // dateClass() {
  //   return (date: Date): MatCalendarCellCssClasses => {
  //     return this.calenderleaves.forEach((e: any) => {
  //       if (this.pipe.transform(e.edate, 'yyyy/MM/dd') == this.pipe.transform(date, 'yyyy/MM/dd')) {
  //         return 'special-date';
  //       }
  //       else {
  //         return date;
  //       }
  //     });

  //   };
  // }
  dateClass() {
    return (date: Date): MatCalendarCellCssClasses => {
      const highlightDate = this.calenderleaves
        .map((edate:any) => new Date(edate))
        .some(
          (d:any) =>
            d.getDate() === date.getDate() &&
            d.getMonth() === date.getMonth() &&
            d.getFullYear() === date.getFullYear()
        );

      return highlightDate ? 'special-date' : '';
    };
  }
  getleavehistory(page:any,size:any){
    this.LM.getleavehistory(this.usersession.id,1,5).subscribe((result:any)=>{
      this.allleaves = result;
      this.leavedata= result.data;
      this.dataSource = new MatTableDataSource(this.leavedata);


    })

  }

  getHolidaysList() {
    this.LM.getHolidaysList(this.usersession.id).subscribe((result)=>{
      this.holidaysList = result;
      this.holidaysList = this.holidaysList.data[0];
      this.holidaydatasource = new MatTableDataSource(this.holidaysList);
    })
  }
  getLeaveBalance(){
    this.LM.getLeaveBalance(this.usersession.id).subscribe((result)=>{
      if(result.status){
        for(let i =0; i<result.data[0].length; i++){
          if ( result.data[0][i].leavename === "Marriage Leave" && this.usersession.maritalstatus === "Single") {
            this.leavebalance.push( result.data[0][i])

          } else if ( result.data[0][i].leavename === 'Maternity Leave'&& this.usersession.maritalstatus === "Married") {
            if (this.usersession.gender === 'Female') {
              this.leavebalance.push( result.data[0][i])
            }
          } else if ( result.data[0][i].leavename === 'Paternity Leave'&& this.usersession.maritalstatus === "Married") {
            if (this.usersession.gender === 'Male') {
              this.leavebalance.push( result.data[0][i])
            }
          }else if( result.data[0][i].leavename !== 'Paternity Leave' &&  result.data[0][i].leavename !== "Marriage Leave" && result.data[0][i].leavename !== 'Maternity Leave'){
            this.leavebalance.push( result.data[0][i])
          }
        // for(let t =0; t<result.data[0].length; t++){
        //   if(this.usersession.maritalstatus === "Married" && result.data[0][t].leavename === "Marriage Leave"){
        //     result.data[0].splice(t,1);
        //     if(this.usersession.gender === 'Male' && result.data[0][t].leavename === 'Maternity Leave'){
        //       result.data[0].splice(t,1);
        //     }else if(this.usersession.gender === "FeMale" && result.data[0][t].leavename === 'Paternity Leave') {
        //       result.data[0].splice(t,1);
        //     }
        //   }else {
        //     if(result.data[0][t].leavename === 'Maternity Leave' || result.data[0][t].leavename === 'Paternity Leave'){
        //       result.data[0].splice(t,1)
        //     }

        //   }
        }

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
}
viewall(){

  this.LM.getHolidays(new Date().getFullYear(),this.usersession.worklocation,1,100).subscribe((result)=>{
    this.holidaysListall = result;

    this.holidaysListall = this.holidaysListall.data;
    this.holidaysalldatasource = new MatTableDataSource( this.holidaysListall);
  })
  this.isdata=false;
  this.isholidays=true;
}
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
    if(result!=''){
      this.LM.cancelLeaveRequest(this.deletedata).subscribe((data)=>{
        if(data.status){
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/LeaveManagement/UserDashboard"]));
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: 'Leave request cancelled successfully.'
          });

        }
        else{
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: 'Unable to caancel leave request.'
          });
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
    if(result!=''){
      this.LM.setDeleteLeaveRequest(this.deletedata).subscribe((data)=>{
        if(data.status){
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/LeaveManagement/UserDashboard"]));
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: 'Leaverequest deleted successfully.'
          });

        }
        else
        {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: 'Unable to delete leaverequest.'
          });
        }
      })
    }
  });
}
nextMonth(): void {
  this.calendarApi = this.calendarComponent.getApi();
  this.calendarApi.next();
}
prevMonth(): void {
  this.calendarApi = this.calendarComponent.getApi();
  this.calendarApi.prev();
}
currentMonth(): void {
  this.calendarApi = this.calendarComponent.getApi();
  this.calendarApi.today();
}

  edit(leave:any){
    leave.URL = '/LeaveManagement/UserDashboard';
    this.router.navigate(['/LeaveManagement/LeaveRequest'],{state:{leaveData:leave}});
  }

  getErrorMessages(errorCode:any) {

    this.ts.getErrorMessages(errorCode,1,1).subscribe((result)=>{

      if(result.status && errorCode == 'LM16')
      {
        this.msgLM16 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM17')
      {
        this.msgLM17 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM73')
      {
        this.msgLM73 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM74')
      {
        this.msgLM74 = result.data[0].errormessage
      }


    })
  }

}


