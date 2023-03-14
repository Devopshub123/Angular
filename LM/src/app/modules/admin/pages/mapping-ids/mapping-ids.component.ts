import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ReportsService } from 'src/app/modules/reports/reports.service';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-mapping-ids',
  templateUrl: './mapping-ids.component.html',
  styleUrls: ['./mapping-ids.component.scss']
})
export class MappingIdsComponent implements OnInit {

  mappingIdsForm!: FormGroup;
  pipe = new DatePipe('en-US');
  todayWithPipe: any;
  displayedColumns: string[] = ['sno', 'biometricid', 'empid', 'empname'];
  dataSource: MatTableDataSource<any> = <any>[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  arrayList: any = [];
  workTypeData: any;
  userSession: any;
  pageLoading = true;
  isAdd: boolean = false;
  isdata: boolean = true;
  constructor(private formBuilder: FormBuilder, private adminService: AdminService,
    public dialog: MatDialog, public datePipe: DatePipe, private router: Router, public reportsService: ReportsService
  ) {

  }
  employeelist: any;
  ngOnInit(): void {

    this.mappingIdsForm = this.formBuilder.group(
      {
        biometricid: ['', Validators.required],
        empid: ['', Validators.required],
      });
    this.userSession = JSON.parse(sessionStorage.getItem('user') ?? '');
    this.getEmployeelist();
    this.getMappingIdsList();
  }
  ngAfterViewInit() {

  }
  Add() {
    this.isAdd = true;
    this.isdata = false;
  }

  getEmployeelist() {
    this.reportsService.getTotalEmployeslist().subscribe((res: any) => {
      if (res.status) {
        this.employeelist = [];
        this.employeelist = res.data;

      }

    });
  }
  getMappingIdsList() {
    this.arrayList = [];
    let obj = {
      "boon_emp_id": null,
      "biometric_id": null,
    };
    this.adminService.getIntegrationEmpidsLookup(obj).subscribe((res: any) => {
      if (res.status) {
        this.arrayList = res.data;
        this.dataSource = new MatTableDataSource(this.arrayList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageLoading=false;
      } else {
        this.arrayList = [];
        this.dataSource = new MatTableDataSource(this.arrayList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  };
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  saveMappingIds() {
    if (this.mappingIdsForm.invalid) {
      return;
    } else {
      if (this.arrayList.length > 0) {
     let index = this.arrayList.findIndex((e:any) => e.deviceempid === parseInt(this.mappingIdsForm.controls.biometricid.value) 
          ||  e.boonempid === this.mappingIdsForm.controls.empid.value);
         if(index >= 0){
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: "Already mapped the selected employee or bio-metric id"
          });
         }else{
          let obj = {
            "boon_emp_id": this.mappingIdsForm.controls.empid.value,
            "biometric_id": this.mappingIdsForm.controls.biometricid.value,
          };
  
          this.adminService.setIntegrationEmpidsLookup(obj).subscribe((res: any) => {
            if (res.status) {
              let dialogRef = this.dialog.open(ReusableDialogComponent, {
                position: { top: `70px` },
                disableClose: true,
                data: res.message
              });
              this.resetform();
              // this. getAttendanceRequestListByEmpId();
            }
          })
         }
      }
      else{
        let obj = {
          "boon_emp_id": this.mappingIdsForm.controls.empid.value,
          "biometric_id": this.mappingIdsForm.controls.biometricid.value,
        };

        this.adminService.setIntegrationEmpidsLookup(obj).subscribe((res: any) => {
          if (res.status) {
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
              data: res.message
            });
            this.resetform();
            // this. getAttendanceRequestListByEmpId();
          }
        })
      }
    }
  }
  resetform() {

    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/Admin/MappingIds"]));
  }
  getPageSizes(): number[] {
    var customPageSizeArray = [];
    
    if (this.dataSource.data.length > 5) {
      customPageSizeArray.push(5);
    }
    if (this.dataSource.data.length > 10) {
      customPageSizeArray.push(10);
    }
    if (this.dataSource.data.length > 20) {
      customPageSizeArray.push(20);
     
    }
    customPageSizeArray.push(this.dataSource.data.length);
    return customPageSizeArray;
  }

}
