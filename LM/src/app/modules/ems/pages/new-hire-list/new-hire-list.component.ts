import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup,  Validators, FormBuilder,  } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { EmsService } from '../../ems.service';
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
  selector: 'app-new-hire-list',
  templateUrl: './new-hire-list.component.html',
  styleUrls: ['./new-hire-list.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class NewHireListComponent implements OnInit {

  constructor(private emsService:EmsService,private router: Router) { }

  displayedColumns: string[] = ['sno','name','mobile','joinDate','hireDate','email','status','action'];
  dataSource : MatTableDataSource<any> = <any>[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  onboardingCheckList: any = [];
  inductionProgramList: any = [];
  userSession:any;
  pageLoading = true;

  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.getOnboardingCheckList();
  }
  getOnboardingCheckList() {
    this.emsService.getNewHiredEmployeeList(null).subscribe((res: any) => {
      if (res.status && res.data.length != 0) {
        this.onboardingCheckList = res.data;
        this.dataSource = new MatTableDataSource(this.onboardingCheckList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageLoading = false;
      }
    })
  }
  newHire(){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/ems/newHire"]));
  }
  editEmployee(id:any, data:any) {
     let candId=data.candidate_id;
     this.router.navigate(["/ems/empInformation",{candId}])
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
     if (this.dataSource.paginator) {
       this.dataSource.paginator.firstPage();
    }
  }
  getPageSizes(): number[] {
    if (this.dataSource.data.length > 20) {
      return [5, 10, 20, this.dataSource.data.length];
    }
    else {

     return [5, 10, 20];
    }
  }
}

