import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup,  Validators, FormBuilder,  } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from 'src/app/services/login.service';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { EmsService } from '../../ems.service';


export interface UserData {
  deptname: string;
  status: string;
  depthead: string;
  headcount: number;
  id: number;
  total: number;
}

@Component({
  selector: 'app-employee-checklist',
  templateUrl: './employee-checklist.component.html',
  styleUrls: ['./employee-checklist.component.scss']
})
export class EmployeeChecklistComponent implements OnInit {

  constructor(private emsService:EmsService) { }

  displayedColumns: string[] = ['sno','programtype','department','conductby','date','time','status'];
  displayedColumns2: string[] = ['sno','name','department','checklist','status'];
  dataSource : MatTableDataSource<UserData> = <any>[];
  dataSource2: MatTableDataSource<UserData> = <any>[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  onboardingCheckList: any = [];
  inductionProgramList: any = [];
  userSession:any;


  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.getOnboardingCheckList();
    this. getInductionPrograms();
  }

  getInductionPrograms() {
    this.emsService.getallEmployeeProgramSchedules(this.userSession.id,null).subscribe((res: any) => {
      if (res.status && res.data.length != 0) {
        this.inductionProgramList = res.data;
        this.dataSource = new MatTableDataSource(this.inductionProgramList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        //this.pageLoading = false;
      }
    })
  }


  getOnboardingCheckList() {
    this.emsService.getEmployeeBoardingCheckList(this.userSession.id,"Onboarding",null).subscribe((res: any) => {
      if (res.status && res.data.length != 0) {
        this.onboardingCheckList = res.data;
         this.dataSource2 = new MatTableDataSource(this.onboardingCheckList);
        this.dataSource2.paginator = this.paginator;
        this.dataSource2.sort = this.sort;
        //this.pageLoading = false;
      }
    })
  }
}
