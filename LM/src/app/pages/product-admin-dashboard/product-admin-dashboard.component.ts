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
  selector: 'app-product-admin-dashboard',
  templateUrl: './product-admin-dashboard.component.html',
  styleUrls: ['./product-admin-dashboard.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ProductAdminDashboardComponent implements OnInit {
  companyDBName: any = environment.dbName;
  pipe = new DatePipe('en-US');
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    private mainService: MainService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private formBuilder: FormBuilder
  ) {
  }
  dashBoardForm: any = FormGroup;
  minDate = new Date('2000/01/01');
  maxDate = new Date();
  activationCountForMonth: any;
  activationCountForYear: any;
  sprypleClientsCount: any = [];
  revenueCount: any;
  ngOnInit(): void {

    this.dashBoardForm = this.formBuilder.group(
      {
        monthDate: [new Date()],
        yearDate: [new Date()],
        revenueDate: [new Date()],
      });
    this.getActivationCountByMonth();
    this.getActivationCountByYear();
    this.getSprypleClientsStatusWiseList();
    this.getRevenueCountByMonth();

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
       this.revenueCount = res.data[0].count != null ? res.data[0].count:0;
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
