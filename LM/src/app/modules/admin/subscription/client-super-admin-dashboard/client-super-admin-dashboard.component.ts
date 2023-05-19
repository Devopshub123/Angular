import { ChangeDetectorRef, Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NavItem } from 'src/app/models/navItem';
import { MainService } from 'src/app/services/main.service';
import { BehaviorSubject, fromEvent, Observable, Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import { Moment} from 'moment';
import * as _moment from 'moment';
import { ChartComponent } from 'angular2-chartjs';
import { ChartData, ChartOptions, Color } from 'chart.js';
import { AdminService } from '../../admin.service';
import { CompanySettingService } from 'src/app/services/companysetting.service';
// import {default as _rollupMoment} from 'moment';
const moment =  _moment;
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
@Component({
  selector: 'app-client-super-admin-dashboard',
  templateUrl: './client-super-admin-dashboard.component.html',
  styleUrls: ['./client-super-admin-dashboard.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ClientSuperAdminDashboardComponent implements OnInit {
  companyDBName: any = environment.dbName;
  pipe = new DatePipe('en-US');
  dashBoardForm: any = FormGroup;
  currentYear: any = new Date();
  companyName: any;
  minDate = new Date('2000/01/01');
  maxDate = new Date();

  @ViewChild(ChartComponent)
  chart!: ChartComponent;
    // location wise pie chart
	locPieChartType:any;
	locPieChartdata:any;
  locPieChartoptions: any;
    // attendance wise dounut chart
  	attDonutChartType:any;
    attDonutChartdata:any;
  attDonutChartoptions: any;
    // department wise leave line chart
deptWiseLeavepieChartType :any;
deptWiseLeavepieChartData: any;
  deptWiseLeavepieoptions: any;
  // shift by dept emps chart
 vbarChartType: any;
  vbarChartData: any;
  vbaroptions: any;

locByDeptEmpsdoughChartType :any;
locByDeptEmpsdoughnutChartOptions: any ;
locByDeptEmpsdoughnutChartData: any;
// ----------
  newEmployeeStatusCount: any;
  exitEmployeeStatusCount: any;
  totalLeaveCount: any;
  pendingLeaveCount: any;
  rejectedLeaveCount: any;
  shiftId: any;
  shiftDataList: any = [];

  allLocationsNameList: any = [];
  allLocationsTotalCount: any = [];

  locationByDepartmentNameLis: any = [];
  locationByDepartmentCountLis: any = [];
  locationId: any;

  shiftByDepartmentNameList: any = [];
  shiftByDepartmentCountList: any = [];

  attendanceTypeList: any = [];
  attendanceCountList: any = [];

  departmentWiseLeaveNameList: any = [];
  departmentWiseLeaveCountList: any = [];

 workLocationList:any=[]
 allShiftList:any=[]

 deptWisePayrollNameList: any = [];
  deptWisePayrollMonthList: any = [];
  deptWisePayrollSumList: any = [];
  deptWisePayrollYearList: any = [];
  // bar chart
  deptWisePayrollBarChartType: any;
  deptWisePayrollBarChartOptions: any;
  deptWisePayrollBarChartData: any ;

//   barChartOptions = {
//     scaleShowVerticalLines: false,
//     responsive: true
//   };
// barChartLabels :any= ['2012', '2013', '2014', '2015', '2016', '2017', '2018'];
// barChartType :any= 'bar';
// barChartLegend :any= true;
// barChartData: ChartData<'bar'> = {
//     labels: this.barChartLabels,
//     datasets: [
//   {
//         data: [55, 60, 75, 82, 56, 62, 80],
//         label: 'Company A',
//         categoryPercentage: 1,
//         backgroundColor: 'rgba(105,159,177,0.2)',
//       borderColor: 'rgba(105,159,177,1)',
//       },
//       { data: [58, 55, 60, 79, 66, 57, 90],
//         label: 'Company B',
//         categoryPercentage: 1,
//         backgroundColor: 'rgba(77,20,96,0.3)',
//         borderColor: 'rgba(77,20,96,1)',
//        }
//     ]
// };
  // location wise pie chart

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    private adminService: AdminService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private LMS: CompanySettingService
  ) {
    this.companyName = sessionStorage.getItem('companyName');
    this.dashBoardForm = this.formBuilder.group(
      {
        location: ["",],
        shiftName: ["",],
        employeeStatusMonthDate: [new Date()],
        attendanceWiseDate: [new Date()],
        deptWiseleavesDate: [new Date()],
        leaveStatusDate: [new Date()],
      });
    this.getLocationWiseEmployeeCount();
      this.getWorkLocation();
      this.getNewAndExitEmployeeCountByMonth();
      this.dashBoardForm.get('employeeStatusMonthDate')?.valueChanges.subscribe((selectedValue: any) => {
        this.getNewAndExitEmployeeCountByMonth();
      })
    this.getAttendanceEmployeesCountByDate();
    this.getDepartmentWiseLeavesCountByMonth();
    this.getActiveShiftList();
    this.getDepartmentWisePayrollListByMonth();
  }



  ngOnInit(): void {
    this.dashBoardForm.get('location')?.valueChanges.subscribe((selectedValue: any) => {
      this.locationId = selectedValue;
      if (selectedValue != '' || selectedValue != null) {
        this.getLocationIdByDeptWiseEmpList();
      }
    })

    this.dashBoardForm.get('shiftName')?.valueChanges.subscribe((selectedValue: any) => {
      if (selectedValue != '' || selectedValue != null) {
        this.shiftId = selectedValue;
        this.getShiftIdByDeptEmploeeList();
      }
    })

    this.dashBoardForm.get('attendanceWiseDate')?.valueChanges.subscribe((selectedValue: any) => {
      if (selectedValue != '' || selectedValue != null) {
        this.getAttendanceEmployeesCountByDate();
      }
    })

    this.getLeavesTypesCountByMonth();
      this.dashBoardForm.get('leaveStatusDate')?.valueChanges.subscribe((selectedValue:any) => {
        this.getLeavesTypesCountByMonth();
      })

      this.dashBoardForm.get('deptWiseleavesDate')?.valueChanges.subscribe((selectedValue:any) => {
        this.departmentWiseLeaveNameList = [];
        this.departmentWiseLeaveCountList = [];
        this.getDepartmentWiseLeavesCountByMonth();
      })
  }
  getWorkLocation() {
    // this.companyService.getActiveBranchCities()
    // .subscribe((result: any) => {
    //   if (result.status) {
    //     this.workLocationList = JSON.parse(result.data);
    //     this.locationId = this.workLocationList.id;
    //     this.dashBoardForm.controls.location.setValue(this.workLocationList.id);
    //   }
    // })
    this.LMS.getactiveWorkLocation({ id: null, companyName: this.companyName }).subscribe((result) => {
      this.workLocationList = result.data;
      this.locationId = result.data[0].id;
      this.dashBoardForm.controls.location.setValue(result.data[0].id);
     })
  }


  getLocationWiseEmployeeCount() {
    this.adminService.getLocationWiseEmployeeCount().subscribe((res: any) => {
      if (res.status && res.data) {
        res.data.forEach((e: any) => {
          if (e.location == null) {
            this.allLocationsTotalCount = [];
          } else {
            this.allLocationsNameList.push(e.location);
            this.allLocationsTotalCount.push(e.count);
          }
        })
      }
      this.locPieChartType = 'pie';
      this.locPieChartdata = {
        labels: this.allLocationsNameList,
        datasets: [
          {
            backgroundColor: ["#ffa1b5", "#86c7f3", "#ffe29a", "#838c95", "#7FDBFF"],
            data:this.allLocationsTotalCount
          }
        ]
      }
      this.locPieChartoptions = {
        responsive: true,
        maintainAspectRatio: false,
        legend: { position: 'bottom' }
        // scales:{
        //     // yAxes: [{
        //     //   gridLines: {
        //     //     beginAtZero: true,
        //     //     display: false
        //     //   },
        //     //   ticks: {
        //     //     min: 0,
        //     //     stepSize: 1,
        //     //     fixedStepSize: 1,
        //     //   }
        //     // }],
        //     // xAxes: [{
        //     // 	beginAtZero: true,
        //     // 	display: false,
        //     // 	gridLines: {
        //     // 		display: false
        //     // 	},
        //     // 	ticks: {
        //     // 		min: 0,
        //     // 		stepSize: 1,
        //     // 		fixedStepSize: 1,
        //     // 	}
        //     // }],
        //   }

    }
  });
  }

  getAttendanceEmployeesCountByDate() {
    this.attendanceTypeList = [];
    this.attendanceCountList = [];
   let date = this.pipe.transform(this.dashBoardForm.controls.attendanceWiseDate.value, 'yyyy-MM-dd');
    this.adminService.getAttendanceEmployeesCountByDate(date).subscribe((res: any) => {
      if (res.status && res.data) {
        Object.keys(res.data[0]).forEach((e: any) => {
          this.attendanceTypeList.push(e);
        })
        Object.values(res.data[0]).forEach((e: any) => {
          this.attendanceCountList.push(e);
        })
        this.attDonutChartType = 'doughnut';
        this.attDonutChartdata = {
          labels: this.attendanceTypeList,
          datasets: [
            {
              backgroundColor: ["#a7c957", "#c385d8", "#e56b6f"],
              data:this.attendanceCountList
            }
          ]
        }
        this.attDonutChartoptions = {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '65%',
          legend: { position: 'bottom' }

      }
      }
    });


  }

  getDepartmentWiseLeavesCountByMonth() {
    let date = this.pipe.transform(this.dashBoardForm.controls.deptWiseleavesDate.value, 'yyyy-MM-dd');
    this.adminService.getDepartmentWiseLeavesCountByMonth(date).subscribe((res: any) => {
      if (res.status && res.data) {
        res.data.forEach((e: any) => {
          if (e.deptname == null) {
            this.departmentWiseLeaveCountList = [];
          } else {
            this.departmentWiseLeaveNameList.push(e.deptname);
            this.departmentWiseLeaveCountList.push(e.count);
          }

         })
      }
      this.deptWiseLeavepieChartType = 'pie';
      this.deptWiseLeavepieChartData = {
        labels: this.departmentWiseLeaveNameList,
        datasets: [
          {

            data: this.departmentWiseLeaveCountList,
            backgroundColor: ["#22a7f0", "#ffe29a", "#838c95", "#7FDBFF"],
          }
        ]
      }
      this.deptWiseLeavepieoptions = {
        responsive: true,
        maintainAspectRatio: false,
        legend: { position: 'bottom' }
    }
    });
  }

  getActiveShiftList() {
    this.adminService.getAllShifts().subscribe((res) => {
      if (res.status && res.data.length > 0) {
        this.shiftDataList = res.data;
        this.shiftId = this.shiftDataList[0].shiftid;
        this.dashBoardForm.controls.shiftName.setValue(res.data[0].shiftid);
      }
    })
  }

  getShiftIdByDeptEmploeeList() {
    this.shiftByDepartmentNameList = [];
    this.shiftByDepartmentCountList = [];
    this.adminService.getDepartmentWiseEmployeeCountByShift(this.shiftId).subscribe((res: any) => {
      if (res.status && res.data) {
        res.data.forEach((e: any) => {
          if (e.deptname ==null) {
            this.shiftByDepartmentCountList = [];
          }
          this.shiftByDepartmentNameList.push(e.deptname);
          this.shiftByDepartmentCountList.push(e.count);
         })
      }
      this.vbarChartType = 'horizontalBar';
      this.vbarChartData = {
        labels: this.shiftByDepartmentNameList,
        datasets: [
          {

            data: this.shiftByDepartmentCountList,
            backgroundColor: [
              '#5e569b',
              '#9080ff',
              '#48446e',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
          ],
          }
        ]
      }
      this.vbaroptions = {
        indexAxis: 'y',
        legend: { display: false },
        scales: {
          xAxes: [{
              display: true,
              ticks: {
                  suggestedMin: 5, //min
                  suggestedMax: 300 //max
              }
          }]
      }
    }
    });
  }

  // --------
  getLocationIdByDeptWiseEmpList() {
    this.locationByDepartmentNameLis = [];
    this.locationByDepartmentCountLis = [];
    this.adminService.getDepartmentWiseEmployeeCountByLocation(this.locationId).subscribe((res: any) => {
      if (res.status && res.data.length > 0) {
        res.data.forEach((e: any) => {
          if (e.deptname == null) {
            this.locationByDepartmentCountLis = [];
          } else {
            this.locationByDepartmentNameLis.push(e.deptname);
            this.locationByDepartmentCountLis.push(e.count);
          }
          })
         this.locByDeptEmpsdoughChartType = 'doughnut';
         this.locByDeptEmpsdoughnutChartData = {
           labels: this.locationByDepartmentNameLis,
           datasets: [
             {
               backgroundColor: ["#118ab2", "#ffd166","#06d6a0","#28acaf","#ef476f"],
              //  backgroundColor: ["#0080ff", "#eda2f2", "#ffa69e", "#ff8fa3", "#ffb3c1"],
               data:this.locationByDepartmentCountLis
             }
           ]
         }
         this.locByDeptEmpsdoughnutChartOptions = {
          responsive: true,
          maintainAspectRatio: false,
           cutout: '65%',
           legend: { position: 'bottom' }

       }
      } else {

       }
     });


   }
// -----------------------
  date = new FormControl(moment());

  attendanceMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.dashBoardForm.controls.attendanceWiseDate.setValue(ctrlValue);
    datepicker.close();
  }

  empStatusMonth(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.dashBoardForm.controls.employeeStatusMonthDate.setValue(ctrlValue);
    datepicker.close();
  }

  leaveMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.dashBoardForm.controls.leaveStatusDate.setValue(ctrlValue);
    datepicker.close();
  }

  deptLeaveMonth(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.dashBoardForm.controls.deptWiseleavesDate.setValue(ctrlValue);
    datepicker.close();
  }

  getNewAndExitEmployeeCountByMonth() {
    let date = this.pipe.transform(this.dashBoardForm.controls.employeeStatusMonthDate.value, 'yyyy-MM-dd');
    this.adminService.getNewAndExitEmployeeCountByMonth(date).subscribe((res: any) => {
      if (res.status && res.data.length > 0) {
        this.newEmployeeStatusCount = res.data[0].new_emp_count;
        this.exitEmployeeStatusCount = res.data[0].exit_emp_count;
      }
    });
  }

  getLeavesTypesCountByMonth() {
    let date = this.pipe.transform(this.dashBoardForm.controls.leaveStatusDate.value, 'yyyy-MM-dd');
    this.adminService.getLeavesTypesCountByMonth(date).subscribe((res: any) => {
      if (res.status && res.data.length > 0) {
        this.totalLeaveCount = res.data[0].today_leave_count;
        this.pendingLeaveCount = res.data[0].pending_count;
        this.rejectedLeaveCount = res.data[0].rejected_count;
      }
    });
  }

  getDepartmentWisePayrollListByMonth() {
    let date = this.pipe.transform(this.currentYear, 'yyyy-MM-dd');
    this.adminService.getDepartmentWiseMonthlySalaries(date).subscribe((res: any) => {
      if (res.status && res.data) {
        res.data.forEach((e: any) => {
          this.deptWisePayrollNameList.push(e.deptname);
          this.deptWisePayrollMonthList.push(e.MonthName);
          this.deptWisePayrollSumList.push(e.sum);
          this.deptWisePayrollYearList.push(e.year);
         })
      }
      this.deptWisePayrollBarChartType = 'bar';
      this.deptWisePayrollBarChartData = {
        labels: this.deptWisePayrollMonthList,
        datasets: [
          {
            label: this.deptWisePayrollNameList,
            data: this.deptWisePayrollSumList,
            backgroundColor: [
              '#003f5c',
              '#665191'
          ],
          borderColor: [
            '#003f5c',
            '#665191',
          ],
          borderWidth: 1
          },

          //   data: this.deptWisePayrollSumList,
          //   backgroundColor: [
          //     'rgba(54, 162, 235, 0.2)',
          // ],
          // borderColor: [
          //     'rgba(54, 162, 235, 1)',
          // ],
          // borderWidth: 1
          // }
        ]
      }
      this.deptWisePayrollBarChartOptions = {
        scales: {
          yAxes: [{
              display: true,
              ticks: {
                  suggestedMin: 10000, //min
                  // suggestedMax: 100 //max
              }
          }]
      }

    }
    });
  }

  showSpinner() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 1000); // 2 seconds
  }
}


