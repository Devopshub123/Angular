import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NavItem } from 'src/app/models/navItem';
import { LoginService } from 'src/app/services/login.service';
import { MainService } from 'src/app/services/main.service';
import { SideMenuService } from 'src/app/services/side-menu.service';
import { BehaviorSubject, fromEvent, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EmsService } from 'src/app/modules/ems/ems.service';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import { LeavesService } from 'src/app/modules/leaves/leaves.service';
import { DatePipe } from '@angular/common';
import { AttendanceService } from 'src/app/modules/attendance/attendance.service';
import { RequestData } from 'src/app/modules/attendance/models/Request';
import { MatSidenav } from '@angular/material/sidenav';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationComponent } from 'src/app/modules/leaves/dialog/confirmation/confirmation.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReusableDialogComponent } from '../reusable-dialog/reusable-dialog.component';
import { environment } from 'src/environments/environment';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _moment from 'moment';
import { th } from 'date-fns/locale';

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
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class MainDashboardComponent implements OnInit {
  allModuleDetails: any = [];
  usersession: any;
  data: any;
  userRoles: any = [];
  menu: NavItem[] = [];
  firstRoute: any;
  compoff: any;
  showError: boolean = false;
  private unsubscriber: Subject<void> = new Subject<void>();
  companyDBName: any = environment.dbName;
  constructor(
    private AMS: LoginService,
    private mainService: MainService,
    private sideMenuService: SideMenuService,
    private router: Router,
    private emsService: EmsService,
    private companyService: CompanySettingService,
    private LM: LeavesService,
    private attendanceService: AttendanceService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
    this.getCompoffleavestatus();
    this.data = sessionStorage.getItem('user');
    this.usersession = JSON.parse(this.data);
  }
  ///////////
  employeeInformationData: any = [];
  employeeId: any;
  employeeNameh: any;
  employeeCode: any;
  employeeDesignation: any;
  employeeJoinDate: any;
  employeeMobile: any;
  empReportingManager: any;
  employeeEmail: any;
  announcementsDetails: any = [];
  onboardingDetails: any = [];
  inductionProgram: any = [];
  reportingManager: any = [];
  hrReportingManager: any = [];
  financeManager: any = [];
  count: any;
  availableDepartments: any = [];
  leavebalance: any = [];
  notificationsData: any = [];
  selectedDate: any;
  pipe = new DatePipe('en-US');
  availableDesignations: any = [];
  isReadMore = false;
  showToggle: any;
  mode: any;
  openSidenav: boolean | undefined;
  private screenWidth$ = new BehaviorSubject<number>(window.innerWidth);

  @ViewChild('sidenav')
  matSidenav!: MatSidenav;

  file: any;
  profileId: any = null;
  profileInfo: any = null;
  imageurls = [
    {
      base64String: 'assets/img/profile.jpg',
    },
  ];
  base64String: any;
  name: any;
  imagePath: any;
  formData: FormData = new FormData();
  isFileImage: boolean = false;
  progressInfos: any = [];
  selectedFiles: any;
  previews: any = [];
  isRemoveImage: boolean = true;
  teamLeavesData: boolean = false;
  teamAttendanceData: boolean = false;
  leavesRequestData: any = [];
  employeesLeaveList: any = [];
  isManager: boolean = false;
  requestData: any;
  requestType: string = '';
  teamAttendanceCountData: boolean = false;
  minDate = new Date('2000/01/01');
  maxDate = new Date();
 attendanceForm: any = FormGroup;
  date: any;
  isAttendanceModule: boolean = false;
  isLeaveModule: boolean = false;
  employeeAttendanceCountData:any=[]
  workFromHometData:any=[]
  workFromOfficeData:any=[]
  absentEmployeesData:any=[]
  ////////////////
  ngOnInit(): void {
    this.spinner.show();
    if (
      this.usersession.roles[0].role_id == 2 ||
      this.usersession.roles[0].role_id == 6
    ) {
      this.isManager = true;
    }
    this.getScreenWidth().subscribe((width) => {
      if (width < 640) {
        this.showToggle = 'show';
        this.mode = 'over';
        this.openSidenav = false;
      } else if (width > 640) {
        this.showToggle = 'hide';
        this.mode = 'side';
        this.openSidenav = true;
      }
    });
    this.selectedDate = this.pipe.transform(Date.now(), 'yyyy-MM-dd');
    this.getModules();
    this.getDesignationsMaster();
    history.pushState(null, '');
    fromEvent(window, 'popstate')
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((_) => {
        history.pushState(null, '');
        this.showError = true;
      });
    this.getReportingManagerForEmp();
    this.getEmployeeInformationList();
    this.getEmpAnnouncements();
    this.getLeaveBalance();
    this.getEmployeeAttendanceNotifications();
    this.announcementsDetails = this.announcementsDetails.map((item: any) => ({
      ...item,
      showMore: false,
    }));
    this.getDocumentsEMS();
    this.getSelfAttendanceCount();
    this.spinner.hide();
    this.attendanceForm = this.formBuilder.group(
      {
        currentDate: [new Date()],
      });
      console.log("datee--",this.date)
    this.attendanceForm.get('currentDate')?.valueChanges.subscribe((selectedValue:any) => {
      this.getTeamAttendanceCount();
     
   
    })
  }
  getModules() {
    this.AMS.getModules(
      'modulesmaster',
      null,
      1,
      100,
      this.companyDBName
    ).subscribe((result) => {
      if (result && result.status) {
        this.allModuleDetails = result.data;
        this.allModuleDetails.forEach((e:any)=>{
          if (e.id == 4) {
             this.isAttendanceModule = true;
          } else if (e.id == 2) {
              this.isLeaveModule = true;
          } 
        })
       }
    });
  }

  getCompoffleavestatus() {
    this.mainService.getCompoffleavestatus().subscribe((result) => {
      if (result.status) {
        this.compoff = result.data.compoff_status;
      }
    });
  }

  getrolescreenfunctionalities(id: any, date: any) {
    if (date) {
      if (id != 3) {
        let data = {
          empid: this.usersession.id,
          moduleid: id,
        };
        sessionStorage.setItem('activeModule', JSON.stringify(data));
        this.mainService
          .getRoleScreenFunctionalities(data)
          .subscribe((res: any) => {
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
                          iconName: '', // e.role_name,
                          route: e.routename,
                        };
                        item.children?.push(itemnav);
                      } else {
                        if (e.screen_name == 'Comp off History') {
                        } else {
                          var itemnav = {
                            displayName: e.screen_name,
                            iconName: '', // e.role_name,
                            route: e.routename,
                          };
                          item.children?.push(itemnav);
                        }
                      }
                    } else {
                      if (item.displayName == 'Self' && e.parentrole == 1) {
                        isvalid = false;
                        if (this.compoff) {
                          var itemnav = {
                            displayName: e.screen_name,
                            iconName: '', // e.role_name,
                            route: e.routename,
                          };
                          item.children?.push(itemnav);
                        } else {
                          if (e.screen_name == 'Comp Off') {
                          } else {
                            var itemnav = {
                              displayName: e.screen_name,
                              iconName: '', // e.role_name,
                              route: e.routename,
                            };
                            item.children?.push(itemnav);
                          }
                        }
                      }
                    }
                  });
                  if (isvalid == true) {
                    if (e.parentrole == 1) {
                      var navitem = {
                        displayName: 'Self',
                        iconName: '', //e.role_name,
                        children: [
                          {
                            displayName: e.screen_name,
                            iconName: '', // e.role_name,
                            route: e.routename,
                          },
                        ],
                      };
                      this.menu.push(navitem);
                    } else {
                      var item = {
                        displayName: e.role_name,
                        iconName: '', //e.role_name,
                        children: [
                          {
                            displayName: e.screen_name,
                            iconName: '', // e.role_name,
                            route: e.routename,
                          },
                        ],
                      };
                      this.menu.push(item);
                    }
                  }
                } else {
                  if (e.parentrole == 1) {
                    var items = {
                      displayName: 'Self',
                      iconName: '', //e.role_name,
                      children: [
                        {
                          displayName: e.screen_name,
                          iconName: '', // e.role_name,
                          route: e.routename,
                        },
                      ],
                    };
                    this.firstRoute = e.routename;
                    this.menu.push(items);
                  } else {
                    var navtem = {
                      displayName: e.role_name,
                      iconName: '', //e.role_name,
                      children: [
                        {
                          displayName: e.screen_name,
                          iconName: '', // e.role_name,
                          route: e.routename,
                        },
                      ],
                    };
                    this.firstRoute = e.routename;
                    this.menu.push(navtem);
                  }
                }
              });
              sessionStorage.removeItem('sidemenu');
              sessionStorage.setItem('sidemenu', JSON.stringify(this.menu));
              if (this.requestType == 'AttendanceApproval') {
                this.router.navigate(['/Attendance/Approval'], {
                  state: {
                    userData: this.requestData,
                    url: 'ManagerDashboard',
                  },
                });
              } else if (this.requestType == 'AttendanceRequest') {
                this.router.navigate(['/Attendance/Request'], {
                  state: { userData: this.requestData },
                });
              } else if (this.requestType == 'LeaveRequest') {
                this.router.navigate(['/LeaveManagement/ReviewAndApprovals'], {
                  state: { leaveData: this.requestData, isleave: true },
                });
              }
              else if (this.requestType == 'ReviewAndApprovals') {
                this.router.navigate(['/LeaveManagement/ReviewAndApprovals'],
                { state: { leaveData: this.requestData ,isleave:true}
              });
              } else {
                if (this.usersession.firstlogin == 'Y') {
                  this.router.navigate(['/ChangePassword']);
                } else {
                  this.router.navigate([this.firstRoute]);
                }
              }
            }
          });
      } else {
        window.open('http://122.175.62.210:5050', '_blank');
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
    this.emsService
      .getEmployeeInformationData(this.usersession.id)
      .subscribe((res: any) => {
        this.employeeInformationData = JSON.parse(res.data[0].json)[0];
        this.employeeNameh =
          this.employeeInformationData.firstname +
          ' ' +
          this.employeeInformationData.middlename +
          ' ' +
          this.employeeInformationData.lastname;
        this.employeeCode = this.employeeInformationData.empid;
        this.employeeJoinDate = this.employeeInformationData.dateofjoin;
        this.employeeMobile = this.employeeInformationData.contactnumber;
        this.availableDesignations.forEach((e: any) => {
          if (e.id == this.employeeInformationData.designation) {
            this.employeeDesignation = e.designation;
          }
        });
      });
  }

  getEmpAnnouncements() {
    this.emsService.getEmpAnnouncements().subscribe((res: any) => {
      if (res && res.status) {
        this.announcementsDetails = res.data;
      }
    });
  }

  getReportingManagerForEmp() {
    this.reportingManager = [];
    this.empReportingManager = '';
    this.emsService
      .getReportingManagerForEmp(this.usersession.id)
      .subscribe((res: any) => {
        if (res && res.status) {
          if(res.data.length>0){
            this.reportingManager = res.data;
            this.empReportingManager = this.reportingManager[0].managername;
          }

        }
      });
  }

  getLeaveBalance() {
    this.leavebalance = [];
    this.teamLeavesData = false;
    this.LM.getLeaveBalance(this.usersession.id).subscribe((result) => {
      if (result && result.status) {
        this.leavebalance = this.leaveTypes(result.data[0], true);
      }
    });
  }
  leaveTypes(leaveTypes: any, flag: boolean) {
    var data = [];
    for (var i = 0; i < leaveTypes.length; i++) {
      if (flag) {
        let total = leaveTypes[i].total.split('.');
        if (total[1] == '00') {
          leaveTypes[i].total = total[0];
        }
      }
      if (
        leaveTypes[i].leavename === 'Marriage Leave' &&
        this.usersession.maritalstatus === 'Single'
      ) {
        data.push(leaveTypes[i]);
      } else if (
        leaveTypes[i].leavename === 'Maternity Leave' &&
        this.usersession.maritalstatus === 'Married'
      ) {
        if (this.usersession.gender === 'Female') {
          data.push(leaveTypes[i]);
        }
      } else if (
        leaveTypes[i].leavename === 'Paternity Leave' &&
        this.usersession.maritalstatus === 'Married'
      ) {
        if (this.usersession.gender === 'Male') {
          data.push(leaveTypes[i]);
        }
      } else if (
        leaveTypes[i].leavename !== 'Paternity Leave' &&
        leaveTypes[i].leavename !== 'Marriage Leave' &&
        leaveTypes[i].leavename !== 'Maternity Leave'
      ) {
        data.push(leaveTypes[i]);
      }
    }
    return data;
  }

  getEmployeeAttendanceNotifications() {
    this.notificationsData = [];
    this.teamAttendanceData = false;
    let data = {
      manager_id: null,
      employee_id: this.usersession.id,
      date: this.selectedDate,
    };
    this.attendanceService
      .getEmployeeAttendanceNotifications(data)
      .subscribe((res: any) => {
        this.notificationsData = [];
        if (res.status) {
          this.notificationsData = res.data;
        }
      });
  }
  attendanceRequest(element: RequestData) {
    this.requestData = element;
    this.requestType = 'AttendanceRequest';
    this.getrolescreenfunctionalities(4, true);
    //  this.router.navigate(["/Attendance/Request"], { state: { userData: this.requestData } });
  }
  leaverequest(){
    this.router.navigate(["/LeaveManagement/LeaveRequest"]);
  }



  approveRequest(element: any) {
    this.requestData = element;
    this.requestType = 'AttendanceApproval';
    this.getrolescreenfunctionalities(4, true);
    //  this.router.navigate(["/Attendance/Approval"], { state: { userData: this.requestData ,url:'ManagerDashboard' } });
  }

  getDesignationsMaster() {
    this.companyService
      .getMastertable('designationsmaster', 1, 1, 1000, this.companyDBName)
      .subscribe((data) => {
        if (data.status) {
          this.availableDesignations = data.data;
        }
      });
  }

  trimString(text: any, length: any) {
    return text.length > length ? text.substring(0, length) + '...' : text;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth$.next(event.target.innerWidth);
  }
  getScreenWidth(): Observable<number> {
    return this.screenWidth$.asObservable();
  }

  onSelectFile(event: any) {
    this.isRemoveImage = false;
    // this.imageurls = [];
    this.file = null;
    this.file = event.target.files[0];
    this.fileImageToggler();
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.imageurls.push({ base64String: event.target.result });
        };
        reader.readAsDataURL(event.target.files[i]);
      }
      this.saveImage(true);
    }
  }

  fileImageToggler() {
    this.isFileImage = !this.isFileImage;
  }

  getDocumentsEMS() {
    let input = {
      employeeId: this.usersession.id,
      candidateId: null,
      moduleId: 1,
      filecategory: 'PROFILE',
      requestId: null,
      status: null,
    };
    this.mainService.getDocumentsForEMS(input).subscribe((result: any) => {
      //this.documentDetails = [];
      if (result && result.status) {
        if (result.data.length > 0) {
          this.profileId = result.data[0].id;
          this.profileInfo = JSON.stringify(result.data[0]);
          this.mainService
            .getDocumentOrImagesForEMS(result.data[0])
            .subscribe((imageData) => {
              if (imageData.success) {
                let TYPED_ARRAY = new Uint8Array(imageData.image.data);
                const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
                  return data + String.fromCharCode(byte);
                }, '');

                let base64String = btoa(STRING_CHAR);
                this.imageurls[0].base64String =
                  'data:image/png;base64,' + base64String;
              } else {
                this.isRemoveImage = false;
                this.imageurls = [
                  {
                    base64String: 'assets/img/profile.jpg',
                  },
                ];
              }
            });
        }
      }
    });
  }

  saveImage(flag: boolean) {
    if (this.file) {
      if (this.file.size <= 1024000) {
        this.saveNewImage();
      } else {
        // this.dialog.open(ConfirmationComponent, {
        //   position: {top: `70px`},
        //   disableClose: true,
        //   data:{Message:this.LM117,url: '/LeaveManagement/saveNewImage'}
        // });
      }
    } else {
      //this.saveNewImage()
    }
  }
  saveNewImage() {
    this.spinner.show();
    {
      this.LM.getFilepathsMaster(1).subscribe((result) => {
        if (result && result.status) {
          let data = {
            id: this.profileId ? this.profileId : null,
            employeeId: this.usersession.id,
            candidateId: 0,
            filecategory: 'PROFILE',
            moduleId: 1,
            documentnumber: '',
            fileName: this.file.name,
            modulecode: result.data[0].module_code,
            requestId: null,
            status: 'Submitted',
          };
          this.mainService.setFilesMasterForEMS(data).subscribe((res) => {
            if (res && res.status) {
              let info = JSON.stringify(res.data[0]);
              this.formData.append('info', info);
              this.formData.append('file', this.file);
              this.LM.setProfileImage(this.formData).subscribe((res) => {
                this.formData.delete('file');
                this.formData.delete('info');
                this.spinner.hide();
                if (res && res.status) {
                  if (this.profileId) {
                    this.companyService
                      .removeImage(this.profileInfo)
                      .subscribe((res) => {});
                  }
                  let dialogRef = this.dialog.open(ReusableDialogComponent, {
                    position: { top: `70px` },
                    disableClose: true,
                    data: 'Image uploaded successfully',
                  });
                  this.router
                    .navigateByUrl('/', { skipLocationChange: true })
                    .then(() => this.router.navigate(['/MainDashboard']));
                } else {
                  let dialogRef = this.dialog.open(ReusableDialogComponent, {
                    position: { top: `70px` },
                    disableClose: true,
                    data: 'Image uploading failed',
                  });
                }
                this.file = null;
                this.getDocumentsEMS();
                this.isRemoveImage = true;

              });
            } else {
              this.spinner.hide();
              this.LM.deleteFilesMaster(result.data[0].id).subscribe(
                (data) => {}
              );
              this.getDocumentsEMS();
              let dialogRef = this.dialog.open(ReusableDialogComponent, {
                position: { top: `70px` },
                disableClose: true,
                data: 'Image uploading failed',
              });
            }
          });
        } else {
          //this.getUploadImage();
          this.spinner.hide();
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: 'Image uploading failed',
          });
        }
      });
    }
  }
  getMyTeamApprovals(){
    this.getPendingAttendanceRequestListByEmpId();
    this.getLeavesForApprovals();
  }
  getPendingAttendanceRequestListByEmpId() {
    this.notificationsData = [];
    this.teamAttendanceData = true;
    this.attendanceService
      .getPendingAttendanceListByManagerEmpId(this.usersession.id)
      .subscribe((res: any) => {
        if (res.status) {
          this.notificationsData = res.data;
        } else {
          this.notificationsData = [];
        }
      });
  }
  getLeavesForApprovals() {
    //this.teamLeavesData = true;
    this.leavesRequestData = [];
    this.LM.getLeavesForApprovals(this.usersession.id).subscribe((res: any) => {
        if (res.status) {
        this.leavesRequestData = res.data;
      } else {
      }
    });
  }
  leaveReview(leave: any) {
    this.requestData = leave;
    this.requestType = 'LeaveRequest';
    this.requestData.url = '/LeaveManagement/ManagerDashboard';
    this.getrolescreenfunctionalities(2, true);
  }

  leaveReviewAndApprovals(leave:any){
    this.requestData = leave;
    this.requestType = 'ReviewAndApprovals';
    this.requestData.url = '/LeaveManagement/ManagerDashboard';
    this.getrolescreenfunctionalities(2, true);
  //  leave.url = '/LeaveManagement/ManagerDashboard'
  //  this.router.navigate(["/LeaveManagement/ReviewAndApprovals"], { state: { leaveData: leave ,isleave:true} });
    }
  getCurrentLeaveEmployees() {
    this.teamLeavesData = true;
    this.employeesLeaveList = [];
    this.LM.getApprovedLeaves(this.usersession.id).subscribe((res: any) => {
      if (res.status) {
        if (res.data.length > 0) {
          res.data.forEach((e: any) => {
            this.employeesLeaveList.push(e);
          });
        }
      } else {
        this.employeesLeaveList = [];
      }
    });
  }
  getSelfAttendanceCount() {
    this.employeeAttendanceCountData =[]
    let mid =  null;
     let eid = this.usersession.id;
    let date = this.pipe.transform(new Date, 'yyyy-MM-dd');
    this.teamAttendanceCountData = false;
    this.mainService.getEmployeeAttendanceCounts(mid,eid,date).subscribe((result) => {
      if (result.status) {
        this.employeeAttendanceCountData = result.data;
      }
    });

  }

  getTeamAttendanceCount() {
    this.employeeAttendanceCountData =[]
    this.teamAttendanceCountData = true;
    let mid =  this.usersession.id;
     let eid = null;
    let date =this.pipe.transform( this.attendanceForm.controls.currentDate.value,'yyyy-MM-dd');
    this.mainService.getEmployeeAttendanceCounts(mid,eid,date).subscribe((result) => {
      if (result.status) {
        this.employeeAttendanceCountData = result.data;
        console.log("res-data-", this.employeeAttendanceCountData)
        this.workFromHometData = JSON.parse(this.employeeAttendanceCountData.wfh_details)[0];
        console.log("res-data-", this.employeeAttendanceCountData)
      }
    });
  }
}
