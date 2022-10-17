import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavItem } from 'src/app/models/navItem';
import { LoginService } from 'src/app/services/login.service';
import { MainService } from 'src/app/services/main.service';
import { SideMenuService } from 'src/app/services/side-menu.service';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EmsService } from 'src/app/modules/ems/ems.service';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import { LeavesService } from 'src/app/modules/leaves/leaves.service';
import { DatePipe } from '@angular/common';
import { AttendanceService } from 'src/app/modules/attendance/attendance.service';
import { RequestData } from 'src/app/modules/attendance/models/Request';


@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss']
})
export class MainDashboardComponent implements OnInit {
  allModuleDetails:any=[];
  usersession:any;
  data :any;
  userRoles:any=[];
  menu: NavItem[]=[];
  firstRoute:any;
  compoff:any;
  showError: boolean = false;
  private unsubscriber: Subject<void> = new Subject<void>();
  constructor(private AMS : LoginService,private mainService:MainService,
    private sideMenuService: SideMenuService, private router: Router,
    private emsService: EmsService, private companyService: CompanySettingService,
    private LM:LeavesService,private attendanceService: AttendanceService,) {
      this.getCompoffleavestatus();
    this.data= sessionStorage.getItem('user')
    this.usersession = JSON.parse(this.data)

  }
  ///////////
  employeeInformationData: any = [];
  employeeId: any;
  employeeNameh: any;
  employeeCode: any;
  employeeDesignation: any;
  employeeJoinDate: any;
  employeeMobile: any;
  employeeDepartment: any;
  employeeEmail: any;
  userSession: any;
  announcementsDetails:any=[];
  onboardingDetails:any=[];
  inductionProgram:any=[];
  reportingManager:any=[];
  hrReportingManager:any=[];
financeManager:any=[]
  count:any;
  availableDepartments: any = [];
  leavebalance: any = [];
  notificationsData: any = [];
  selectedDate: any;
  pipe = new DatePipe('en-US');
  ////////////////
  ngOnInit(): void {
    this.selectedDate = this.pipe.transform(Date.now(), 'yyyy-MM-dd');
    this.getModules();
    history.pushState(null, '');

    fromEvent(window, 'popstate')
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((_) => {
        history.pushState(null, '');
        this.showError = true;
      });
    
     
      this.getDepartmentsMaster();
      this.getEmployeeInformationList();
      this.getEmpAnnouncements();
    this.getReportingManagerForEmp();
    this.getLeaveBalance();
    this.getEmployeeAttendanceNotifications();
  }
  getModules(){
    this.AMS.getModules('modulesmaster',null,1,100,'ems_qa').subscribe((result)=>{
      if(result && result.status){
        this.allModuleDetails = result.data;

      }
    })
  }

  getCompoffleavestatus(){
    this.mainService.getCompoffleavestatus().subscribe((result)=>{
     if(result.status){
       this.compoff = result.data.compoff_status;
     }
    })
   }



  getrolescreenfunctionalities(id:any,date:any) {

    if (date) {
      if(id !=3){

        let data = {
        'empid': this.usersession.id,
        'moduleid': id
      };
      sessionStorage.setItem('activeModule', JSON.stringify(data));
      this.mainService.getRoleScreenFunctionalities(data).subscribe((res: any) => {
        this.menu = [];
        if (res.status) {
          this.menu = [];
          this.firstRoute = '';
          res.data.forEach((e: any) => {

            if (this.menu.length > 0) {
              var isvalid = true;
              this.menu.forEach((item) => {
                if (item.displayName == e.role_name && e.parentrole != 1) {
                  isvalid = false;
                  if (this.compoff) {
                    var itemnav = {
                      displayName: e.screen_name,
                      iconName: '',// e.role_name,
                      route: e.routename
                    }
                    item.children?.push(itemnav);

                  }
                  else {
                    if (e.screen_name == 'Comp off History') {
                    }
                    else {
                      var itemnav = {
                        displayName: e.screen_name,
                        iconName: '',// e.role_name,
                        route: e.routename
                      }
                      item.children?.push(itemnav);
                    }
                  }

                } else {
                  if (item.displayName == 'Self' && e.parentrole == 1) {
                    isvalid = false;
                    if (this.compoff) {
                      var itemnav = {
                        displayName: e.screen_name,
                        iconName: '',// e.role_name,
                        route: e.routename
                      }
                      item.children?.push(itemnav);
                    }
                    else {
                      if (e.screen_name == 'Comp Off') {
                      }
                      else {
                        var itemnav = {
                          displayName: e.screen_name,
                          iconName: '',// e.role_name,
                          route: e.routename
                        }
                        item.children?.push(itemnav);
                      }
                    }


                  }
                }
              })
              if (isvalid == true) {
                if (e.parentrole == 1) {
                  var navitem = {
                    displayName: 'Self',
                    iconName: '',//e.role_name,
                    children: [
                      {
                        displayName: e.screen_name,
                        iconName: '',// e.role_name,
                        route: e.routename
                      }

                    ]
                  };
                  this.menu.push(navitem)
                } else {
                  var item = {
                    displayName: e.role_name,
                    iconName: '',//e.role_name,
                    children: [
                      {
                        displayName: e.screen_name,
                        iconName: '',// e.role_name,
                        route: e.routename
                      }

                    ]
                  };
                  this.menu.push(item)
                }

              }
            } else {
              if (e.parentrole == 1) {
                var items = {
                  displayName: 'Self',
                  iconName: '',//e.role_name,
                  children: [
                    {
                      displayName: e.screen_name,
                      iconName: '',// e.role_name,
                      route: e.routename
                    }

                  ]
                };
                this.firstRoute = e.routename;
                this.menu.push(items)
              } else {
                var navtem = {
                  displayName: e.role_name,
                  iconName: '',//e.role_name,
                  children: [
                    {
                      displayName: e.screen_name,
                      iconName: '',// e.role_name,
                      route: e.routename
                    }

                  ]
                };
                this.firstRoute = e.routename;
                this.menu.push(navtem)

              }
            }
          });
          sessionStorage.setItem('sidemenu', JSON.stringify(this.menu));
          if (this.usersession.firstlogin == 'Y') {
            this.router.navigate(['/ChangePassword']);
          } else {
            this.router.navigate([this.firstRoute]);
          }

        }


      })
      }else {
        window.open('http://122.175.62.210:5050','_blank')

      }
    }

  }




  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }



  ///////////////
  getEmployeeInformationList() {
    this.employeeInformationData = [];
    this.emsService.getEmployeeInformationData(this.usersession.id,).subscribe((res: any) => {

      this.employeeInformationData = JSON.parse(res.data[0].json)[0];

      this.employeeNameh = this.employeeInformationData.firstname +' '+ this.employeeInformationData.lastname;
     this.employeeCode = this.employeeInformationData.empid;
     this.employeeJoinDate = this.employeeInformationData.dateofjoin;
     this.employeeMobile = this.employeeInformationData.contactnumber;
     this.employeeEmail = this.employeeInformationData.officeemail;
      this.employeeEmail = this.employeeInformationData.officeemail;
      //this.employeeDepartment =
      this.availableDepartments.forEach((e:any)=> {
        if (e.id ==  this.employeeInformationData.department) {
          this.employeeDepartment = e.deptname;
      }
      });

    })
  }
  getDepartmentsMaster() {
    this.companyService.getMastertable('departmentsmaster', 1, 1, 1000, 'ems_qa').subscribe(data => {
      if (data.status) {
        this.availableDepartments = data.data;
      }
    })
  }
employeeProfile() {
  let empId=this.usersession.id
  this.router.navigate(["/ems/employee-profile",{empId}])
}

getEmpAnnouncements(){
this.emsService.getEmpAnnouncements().subscribe((res: any) => {
  if(res && res.status){
    this.announcementsDetails = res.data;
   }
});
}

getReportingManagerForEmp(){
  this.emsService.getReportingManagerForEmp(this.usersession.id).subscribe((res: any) => {
    if(res && res.status){
      this.reportingManager=res.data;
    }
  });
  }
  
  getLeaveBalance() {
    this.LM.getLeaveBalance(this.usersession.id).subscribe((result) => {
      if(result && result.status){
        this.leavebalance = this.leaveTypes(result.data[0],true)
      }
    })
  }
  leaveTypes(leaveTypes:any,flag:boolean){
    var data = [];
    for (var i = 0; i < leaveTypes.length; i++) {
      if(flag){
        let total = leaveTypes[i].total.split('.')
        if(total[1] == '00'){
          leaveTypes[i].total = total[0];
        }
      }
      if (leaveTypes[i].leavename === "Marriage Leave" && this.usersession.maritalstatus === "Single") {
        data.push(leaveTypes[i])

      } else if (leaveTypes[i].leavename === 'Maternity Leave'&& this.usersession.maritalstatus === "Married") {
        if (this.usersession.gender === 'Female') {
          data.push(leaveTypes[i])
        }
      } else if (leaveTypes[i].leavename === 'Paternity Leave'&& this.usersession.maritalstatus === "Married") {
        if (this.usersession.gender === 'Male') {
          data.push(leaveTypes[i])
        }
      }else if(leaveTypes[i].leavename !== 'Paternity Leave' && leaveTypes[i].leavename !== "Marriage Leave" && leaveTypes[i].leavename !== 'Maternity Leave'){
        data.push(leaveTypes[i])
      }

    }
    return data;
  }
  getEmployeeAttendanceNotifications() {
    let data = {
      'manager_id': null,
      'employee_id': this.usersession.id,
      'date': this.selectedDate
    }
    this.attendanceService.getEmployeeAttendanceNotifications(data).subscribe((res: any) => {
      this.notificationsData = [];
      if (res.status) {
        this.notificationsData = res.data;
      }


    })
  }
  onRequestClick(elment: RequestData) {

    this.router.navigate(["/Attendance/Request"], { state: { userData: elment } });
  }
}
