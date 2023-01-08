import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PopupComponent, PopupConfig } from '../../../../pages/popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from 'src/app/services/login.service';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { LeavesService } from 'src/app/modules/leaves/leaves.service';
import { startTransition } from 'preact/compat';
import { environment } from 'src/environments/environment';
import { EmsService } from 'src/app/modules/ems/ems.service';
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
  userSession:any;
  pipe = new DatePipe('en-US');
  issubmitted: boolean = false;
  isvalid: boolean = false;
  isView: boolean = false;
  isAdd: boolean = false;
  isdata: boolean = true;
  isEdit: boolean = true;
  isSave: boolean = false;
  enable: any = null;
  valid: boolean = false;
  msgEM1:any;
  msgEM84:any;
  msgEM85:any;
  msgEM88:any;
  msgEM89:any;
  msgEM90:any
  msgEM91:any;
  msgEM92:any;
  todayDate:any=new Date();
  displayedColumns: string[] = ['sno','department', 'status', 'Action'];
  departmentData: any = [];
  arrayValue: any;
  // arrayValue: any = [{ Value: 'Active', name: 'Active ' }, { Value: 'Inactive', name: 'Inactive' }];
  dataSource: MatTableDataSource<UserData> = <any>[];
  pageLoading = true;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  companyDBName:any = environment.dbName;
  constructor(private formBuilder: FormBuilder, private router: Router,
    private dialog: MatDialog, private LM: CompanySettingService,private ts:LoginService,
    private emsService:EmsService) {

  }

  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.getstatuslist();
    this.getMessages('EM1')
    this.getMessages('EM84')
    this.getMessages('EM85')
    this.getMessages('LM57')
    this.getMessages('EM88')
    this.getMessages('EM89')
    this.getMessages('EM90')
    this.getMessages('EM91')
    this.getMessages('EM92')
    this.getDepartments();
    this.departmentForm = this.formBuilder.group(
      {
        department: ["",[Validators.required,this.noWhitespaceValidator()]],

      },
    );
  }
  validatedepartments(data: any) {
    if (this.departmentData.length ==0) {
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
      departmentName: this.department,
      created_by:this.userSession.id,
      created_on:this.pipe.transform(new Date(), 'yyyy-MM-dd')+' '+this.pipe.transform(new Date(), 'HH:mm:ss'),
      companyDBName:this.companyDBName
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
              data: this.msgEM88
            });


          } else {
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
              data: this.msgEM84
            });
          }
        })
      }
      else {
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
          data: this.msgEM92
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
          data: this.msgEM90
        });

      } else {
        this.ngOnInit();
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
          data: this.msgEM89
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
  save(event: any, id: any, deptname: any,datas:any) {
    this.validatedepartments(deptname)
    this.enable = null;
    this.isEdit = true;
    this.isSave = false;

    if (this.valid) {
      let data={
        id:id,
        name:deptname,
        created_by: datas.created_by,
        created_on:datas.created_on,
        status:datas.status,
        updated_by:this.userSession.id,
        updated_on:this.pipe.transform(new Date(), 'yyyy-MM-dd')+' '+this.pipe.transform(new Date(), 'HH:mm:ss'),
      }
      this.LM.putDepartments(data).subscribe((data) => {
        if (data.status) {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/Admin/Department"]));
          // this.enable = null;
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: this.msgEM91
          });
          this.getDepartments();

        } else {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: this.msgEM85
          });
        }
      })
    }
    else {
      this.ngOnInit();
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position: { top: `70px` },
        disableClose: true,
        data: this.msgEM92
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
    this.LM.getDepartments('departmentsmaster', null, 1, 100, this.companyDBName).subscribe((info:any) => {
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
  getstatuslist(){
    this.LM.getstatuslists().subscribe((result:any) => {
      if(result.status){
        this.arrayValue = result.data;
      }

    })
  }
  getMessages(messageCode:any) {
    let data =
    {
      "code": messageCode,
      "pagenumber": 1,
      "pagesize": 1
    }
    this.emsService.getMessagesListApi(data).subscribe((result: any) => {

      if(result.status && messageCode == 'EM1')
      {
        this.msgEM1 = result.data[0].message
      }
      else if(result.status && messageCode == 'EM84')
      {
        this.msgEM84 = result.data[0].message
      }
      else if(result.status && messageCode == 'EM85')
      {
        this.msgEM85 = result.data[0].message
      }
       else if(result.status && messageCode == 'EM88')
      {
        this.msgEM88 = result.data[0].message
      }

      else if(result.status && messageCode == 'EM89')
      {
        this.msgEM89 = result.data[0].message
      }
      else if(result.status && messageCode == 'EM90')
      {
        this.msgEM90 = result.data[0].message
      }
      else if(result.status && messageCode == 'EM91')
      {
        this.msgEM91 = result.data[0].message
      }
      else if(result.status && messageCode == 'EM92')
      {
        this.msgEM92 = result.data[0].message
      }

    })
  }
  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
}

}
