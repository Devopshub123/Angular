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
import { ChartDataset } from 'chart.js';
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
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    private mainService: MainService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
  ) {
    this.dashBoardForm = this.formBuilder.group(
      {
        monthDate: [new Date()],
        yearDate: [new Date()],
        revenueDate: [new Date()],
      });
  }

  minDate = new Date('2000/01/01');
  maxDate = new Date();
  activationCountForMonth: any;
  activationCountForYear: any;
  sprypleClientsCount: any = [];
  revenueCount: any;
  yearWiseChartYear: any = [];
  yearWiseChartClients: any = [];
  monthWiseChartMonth: any = [];
  monthWiseChartClients: any = [];
 
  // vertical bar--------------------------

  vbarChartOptions: ChartOptions = {
    responsive: true,
  };
  vbarChartLabels: any = ['Apple', 'Banana', 'Kiwifruit', 'Blueberry', 'Orange', 'Grapes'];
  vbarChartType: any = 'bar';
  vbarChartLegend = true;
  vbarChartPlugins = [];
  vbarChartData: ChartData<'bar'> = {
    labels: this.vbarChartLabels,
    datasets: [
      {
        label: "Month",
        data: [45, 37, 60, 70, 46, 33],
        backgroundColor: ['#28acaf'],
        hoverBackgroundColor: ['#28acaf'],
      }
    ]
  };
  vbaroptions:any= {
    indexAxis: 'y',
}

// pie chart
pieChartType :any= 'pie';
pieChartLabels: any = ['HYD', 'BNGLR', 'CHEN','USA',];
pieChartData: ChartData<'pie'> = {
  labels: this.pieChartLabels,
  datasets: [
    {
      data: [30, 50, 20,35],
    }
  ],
  
  // options: {
  //   responsive: true,
  //   maintainAspectRatio: true,
  //   plugins: {
  //     labels: {
  //       render: 'percentage',
  //       fontColor: ['green', 'white', 'red'],
  //       precision: 2
  //     }
  //   },
  // }
};
pieoptions = {    
  is3D:true
};
// doughnut chart
doughChartType :any= 'doughnut';
  doughnutChartLabels: any = ['IT', 'HR', 'Finance','Admin','HH','LLL'];
  doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      {
        data: [30, 50, 20, 35,25,46],
        backgroundColor: [ '#088395',
        '#19A7CE',
        '#62CDFF',
        '#87CBB9',
        '#6DA9E4',
        '#B0DAFF',
],
        // hoverBackgroundColor: ["darkred", "darkgreen", "darkblue"],
        hoverBorderColor: ["grey"]
      }
    ]
  };
  dnoptions:any= {
    cutout: '65%',
    aspectRatio: 1,
  }
  // bar chart
  barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
barChartLabels :any= ['2012', '2013', '2014', '2015', '2016', '2017', '2018'];
barChartType :any= 'bar';
barChartLegend :any= true;  
barChartData: ChartData<'bar'> = {
    labels: this.barChartLabels,
    datasets: [
  {
        data: [55, 60, 75, 82, 56, 62, 80], 
        label: 'Company A',
        categoryPercentage: 1,
        backgroundColor: 'rgba(105,159,177,0.2)',
      borderColor: 'rgba(105,159,177,1)',
      },
      { data: [58, 55, 60, 79, 66, 57, 90], 
        label: 'Company B',
        categoryPercentage: 1,
        backgroundColor: 'rgba(77,20,96,0.3)',
        borderColor: 'rgba(77,20,96,1)',
       }
    ]
};
  ngOnInit(): void {



    this.dashBoardForm.get('monthDate')?.valueChanges.subscribe((selectedValue: any) => {
       this.getActivationCountByMonth();
      })
    
      this.dashBoardForm.get('yearDate')?.valueChanges.subscribe((selectedValue:any) => {
        this.getActivationCountByYear();
      })
    
      this.dashBoardForm.get('revenueDate')?.valueChanges.subscribe((selectedValue:any) => {
        this.getRevenueCountByMonth();
      })
    
  }

// -----------------------
  date = new FormControl(moment());
  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.dashBoardForm.controls.monthDate.setValue(ctrlValue);
    datepicker.close();
  }

  setMonthAndYear2(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.dashBoardForm.controls.yearDate.setValue(ctrlValue);
    datepicker.close();
  }

  setMonthAndYear3(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value!;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.dashBoardForm.controls.revenueDate.setValue(ctrlValue);
    datepicker.close();
  }
  getClientsCountByMonth() {
    let date = this.pipe.transform(this.currentYear, 'yyyy-MM-dd');
    this.mainService.getMonthWiseClientsCountByYear(date).subscribe((res: any) => {
      if (res.status && res.data) {
        Object.keys(res.data[0]).forEach((e: any) => {
          this.monthWiseChartMonth.push(e);
        })
        Object.values(res.data[0]).forEach((e: any) => {
          this.monthWiseChartClients.push(e);
        })
      }
    });
    
  }
  getClientsCountByYear() {
    this.mainService.getYearWiseClientsCount().subscribe((res: any) => {
      if (res.status && res.data) {
         res.data.forEach((e: any) => {
          this.yearWiseChartClients.push(e.total_clients);
          this.yearWiseChartYear.push(e.year); 
         })
       }
     });
   }
  getActivationCountByMonth() {
    let date = this.pipe.transform(this.dashBoardForm.controls.monthDate.value, 'yyyy-MM-dd');
    this.mainService.getSprypleActivationsCountByMonth(date).subscribe((res: any) => {
      if (res.status && res.data) {
        this.activationCountForMonth = res.data[0].count;
       }
     });
  }
  
 getActivationCountByYear() {
  let date = this.pipe.transform(this.dashBoardForm.controls.yearDate.value, 'yyyy-MM-dd');
  this.mainService.getSprypleActivationsCountByYear(date).subscribe((res: any) => {
     if(res.status && res.data) {
       this.activationCountForYear = res.data[0].count;
     }
   });
 }
  
 getSprypleClientsStatusWiseList() {
  this.sprypleClientsCount = [];
  this.mainService.getSprypleClientsStatusWiseCount().subscribe((res: any) => {
     if(res.status && res.data) {
       this.sprypleClientsCount = res.data[0];
     }
   });
 }
  
 getRevenueCountByMonth() {
  let date = this.pipe.transform(this.dashBoardForm.controls.revenueDate.value, 'yyyy-MM-dd');
  this.revenueCount = [];
  this.mainService.getSprypleRevenueByMonth(date).subscribe((res: any) => {
     if(res.status && res.data) {
       this.revenueCount = res.data[0].count != null ? res.data[0].count.toFixed(2):0;
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


