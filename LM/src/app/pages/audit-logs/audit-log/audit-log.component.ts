import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup,  Validators, FormBuilder, ValidationErrors, ValidatorFn, AbstractControl,  } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _moment from 'moment';
import { AdminService } from 'src/app/modules/admin/admin.service';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { EncryptPipe } from 'src/app/custom-directive/encrypt-decrypt.pipe';
import { EmsService } from 'src/app/modules/ems/ems.service';
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
  selector: 'app-audit-log',
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class AuditLogComponent implements OnInit {
  auditLogForm: any = FormGroup;
  constructor(private formBuilder: FormBuilder, private router: Router,
    private adminService: AdminService, private companyService: CompanySettingService,
    private dialog: MatDialog, public spinner: NgxSpinnerService,private emsService: EmsService) { }
    minDate = new Date('2000/01/01');
  maxDate = new Date();
  newHiredList: any = [];
  displayedColumns: string[] = ['sno','empid','name','desig','date','screen','type','action'];
  dataSource : MatTableDataSource<any> = <any>[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  pageLoading = true;
  screensList = [{
    id:1,screen:"All"
  }]
  ngOnInit(): void {
    this.auditLogForm=this.formBuilder.group(
      {
      fromDate: [""],
      toDate: [""],
      screenName:[""],
      });
    this.getNewHiredList();
  }
  getNewHiredList() {
    this.emsService.getNewHiredEmployeeList(null).subscribe((res: any) => {
      if (res.status && res.data.length != 0) {
        this.newHiredList = res.data;
        this.dataSource = new MatTableDataSource(this.newHiredList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageLoading = false;
      }
    })
  }
  searchForm() {
  
  }
  clear() {
    
  }
  details() {
    
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
     if (this.dataSource.paginator) {
       this.dataSource.paginator.firstPage();
    }
  }
  pdfDownload() {
    
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
