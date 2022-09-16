import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PopupComponent, PopupConfig } from '../../../../pages/popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from 'src/app/services/login.service';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { LeavesService } from 'src/app/modules/leaves/leaves.service';

export interface UserData {
  deptname: string;
  status: string;
  depthead: string;
  headcount: number;
  id: number;
  total: number;
}

@Component({
  selector: 'app-deparment',
  templateUrl: './deparment.component.html',
  styleUrls: ['./deparment.component.scss']
})
export class DeparmentComponent implements OnInit {
  departmentForm!: FormGroup;
  department: any;
  issubmitted: boolean = false;
  isvalid: boolean = false;
  isView: boolean = false;
  isAdd: boolean = false;
  isdata: boolean = true;
  isEdit: boolean = true;
  isSave: boolean = false;
  enable: any = null;
  valid: boolean = false;
  msgLM1:any;
  msgLM23:any
  msgLM26:any;
  msgLM27:any;
  msgLM57:any;
  msgLM60:any;
  msgLM122:any;
  msgLM123:any;
  msgLM124:any;
  msgLM125:any
  msgLM126:any;
  msgLM127:any;
  displayedColumns: string[] = ['department', 'status', 'Action'];
  departmentData: any = [];
  arrayValue: any = [{ Value: 'Active', name: 'Active ' }, { Value: 'Inactive', name: 'Inactive' }];
  dataSource: MatTableDataSource<UserData> = <any>[];
  pageLoading = true;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private formBuilder: FormBuilder, private router: Router, private dialog: MatDialog, private LM: CompanySettingService,private ts:LoginService) {

  }

  ngOnInit(): void {
    this.getErrorMessages('LM1')
    this.getErrorMessages('LM23')
    this.getErrorMessages('LM26')
    this.getErrorMessages('LM27')
    this.getErrorMessages('LM57')
    this.getErrorMessages('LM60')
    this.getErrorMessages('LM122')
    this.getErrorMessages('LM123')
    this.getErrorMessages('LM124')
    this.getErrorMessages('LM125')
    this.getErrorMessages('LM126')
    this.getErrorMessages('LM127')
    this.getDepartments();
    this.departmentForm = this.formBuilder.group(
      {
        department: ["", Validators.required],

      },
    );
  }
  validatedepartments(data: any) {
    if (this.departmentData.length < 0) {
      this.valid = true;

    }
    else {
      if (this.departmentData.length > 0) {

        for (let i = 0; i < this.departmentData.length; i++) {
          if (data.toLowerCase() === this.departmentData[i].deptname.toLowerCase() ) {
            this.valid = false;
            break;
          }
          else {
            this.valid = true;
          }
        }
      }
    }

  }
  setdepartment() {
    this.validatedepartments(this.departmentForm.controls.department.value)
    this.department = this.departmentForm.controls.department.value;
    var data = {
      departmentName: this.department

    }

    if (this.departmentForm.valid) {
      if (this.valid) {
        this.LM.setDepartments(data).subscribe((data) => {
          this.valid = false;
          if (data.status) {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
              this.router.navigate(["/Admin/Department"]));
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
              data: this.msgLM60
            });


          } else {
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
              data: this.msgLM26
            });
          }
        })
      }
      else {
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
          data: this.msgLM127
        });


      }

    }

  }
  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }
  Add() {
    this.isAdd = true;
    this.isdata = false;
    this.departmentForm.controls.department.setValue('')
  }
  cancel() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/Admin/Department"]));
    // this.enable = null;
    // this.departmentForm.reset();
    // this.isAdd = false;
    // this.isdata = true;
    // this.getDepartments();

  }
  status(status: any, id: any, deptname: any) {

    let data = {
      deptname: deptname,
      tableName: 'employee_departments',
      columnName: 'departmentid',
      id: id,
      status: status
    }
    this.LM.updateStatus(data).subscribe((result) => {
      if (result.status) {
        this.ngOnInit();
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
          data: this.msgLM125
        });

      } else {
        this.ngOnInit();
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
          data: this.msgLM124
        });
      }
    })
  }
  edit(w: any, i: any) {
    this.departmentForm.controls.department.setValue(i.deptname);
    this.enable = i.id;
    this.isEdit = false;
    this.isSave = true;
    // VOFormElement.get('VORows').at(i).get('isEditable').patchValue(false);

  }
  save(event: any, id: any, deptname: any) {
    this.validatedepartments(deptname)
    this.enable = null;
    this.isEdit = true;
    this.isSave = false;

    if (this.valid) {

      this.LM.putDepartments({ id: id, name: deptname }).subscribe((data) => {
        if (data.status) {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/Admin/Department"]));
          // this.enable = null;
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: this.msgLM126
          });
          this.getDepartments();

        } else {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: this.msgLM27
          });
        }
      })
    }
    else {
      this.ngOnInit();
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position: { top: `70px` },
        disableClose: true,
        data: this.msgLM127
      });

    }



  }
  canceledit(event: any, id: any) {
    this.enable = null;
    this.isEdit = true;
    this.isSave = false;
    this.ngOnInit();

  }
  getDepartments() {
    this.LM.getDepartments('departmentsmaster', null, 1, 100, 'spryple_sanela').subscribe((info) => {
      if (info.status && info.data.length != 0) {
        this.departmentData = info.data;
        this.dataSource = new MatTableDataSource(this.departmentData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageLoading = false;
      }

    })

  }
  getPageSizes(): number[] {
    if (this.dataSource.data.length > 20) {
      return [5, 10, 20, this.dataSource.data.length];
    }
    else {

      return [5, 10, 20];
    }
  }
  getErrorMessages(errorCode:any) {

    this.ts.getErrorMessages(errorCode,1,1).subscribe((result)=>{

      if(result.status && errorCode == 'LM1')
      {
        this.msgLM1 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM26')
      {
        this.msgLM26 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM27')
      {
        this.msgLM27 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM57')
      {
        this.msgLM57 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM60')
      {
        this.msgLM60 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM122')
      {
        this.msgLM122 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM123')
      {
        this.msgLM123 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM124')
      {
        this.msgLM124 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM125')
      {
        this.msgLM125 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM126')
      {
        this.msgLM126 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM127')
      {
        this.msgLM127 = result.data[0].errormessage
      }

    })
  }


}
