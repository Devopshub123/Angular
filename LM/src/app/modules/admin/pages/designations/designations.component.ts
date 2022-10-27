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
import { AdminService } from '../../admin.service';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
export interface UserData {
  id: number;
  designation: string;
  status: string;
}
@Component({
  selector: 'app-designations',
  templateUrl: './designations.component.html',
  styleUrls: ['./designations.component.scss']
})

export class DesignationsComponent implements OnInit {
  designationForm!: FormGroup;
  designation: any;
  errorDesName: any = '';
  saveResponseMessage: any = '';
  editResponseMessage: any = '';
  issubmitted: boolean = false;
  isvalid: boolean = false;
  isView: boolean = false;
  isAdd: boolean = false;
  isdata: boolean = true;
  isEdit: boolean = true;
  isSave: boolean = false;
  valid: boolean = false;
  userSession:any;
  pipe = new DatePipe('en-US');
  msgLM128:any;
  msgLM129:any;
  msgLM130:any
  msgLM131:any;
  msgLM132:any;
  displayedColumns: string[] = ['designation', 'status', 'Action'];
  designationData: any = [];
  arrayValue: any;
  enable: any = null;
  dataSource: MatTableDataSource<UserData>;

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  pageLoading = true;
  companyDBName:any = environment.dbName;
  constructor(private formBuilder: FormBuilder, private router: Router, private dialog: MatDialog, private LM: CompanySettingService, private adminService: AdminService) {
    this.getDesignation();
    this.dataSource = new MatTableDataSource(this.designationData);
  }

  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.getDesignation();
    this.getstatuslist();
    this.getErrorMessages('LM1');
    this.getErrorMessages('LM30');
    this.getErrorMessages('LM31');
    this.getErrorMessages('LM128')
    this.getErrorMessages('LM129')
    this.getErrorMessages('LM130')
    this.getErrorMessages('LM131')
    this.getErrorMessages('LM132')
    this.designationForm = this.formBuilder.group(
      {
        designation: ["", Validators.required],

      },
    );
  }
  validatedesignation(data: any) {
    if (this.designationData.length == 0) {
      this.valid = true;

    }

    else {
      if (this.designationData.length > 0) {
        for (let i = 0; i < this.designationData.length; i++) {
          if (data.toLowerCase() === this.designationData[i].designation.toLowerCase()) {
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
  setdesignations() {
    if (this.designationForm.valid) {
      this.validatedesignation(this.designationForm.controls.designation.value)
      this.designation = this.designationForm.controls.designation.value;
      let designationdata = {
        designationName: this.designation,
        created_by:this.userSession.id,
       created_on:this.pipe.transform(new Date(), 'yyyy-MM-dd')+' '+this.pipe.transform(new Date(), 'HH:mm:ss'),
        companyDBName:this.companyDBName
      }
      if (this.valid) {
        this.LM.setDesignation(designationdata).subscribe((data) => {
          this.valid = false;
          if (data.status) {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
              this.router.navigate(["/Admin/Designation"]));
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
              data:this.msgLM128
            });

          } else {
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
              data: this.saveResponseMessage
            });
          }
        });
      }
      else {
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
          data: this.msgLM129
        });

      }
    }
  }
  status(status: any, id: any, deptname: any) {
    let data = {
      id: id,
      deptname: deptname,
      status: status,
      tableName: 'employee_designations',
      columnName: 'designationid',
      depthead: null,
      headcount: null
    }
    this.LM.designationstatus(data).subscribe((result) => {
      if (result.status) {
        this.ngOnInit();
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
          data: this.msgLM131
        });

      } else {
        this.ngOnInit();
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
          data: this.msgLM132
        });
      }
    })
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  Add() {
    this.designationForm.controls.designation.setValue('');
    this.isAdd = true;
    this.isdata = false;
  }
  cancel() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/Admin/Designation"]));
    // this.designationForm.reset();
    // this.isAdd = false;
    // this.isdata = true;
    // this.getDesignation();
  }
  edit(event: any, i: any) {
    this.designationForm.controls.designation.setValue(i.designation)
    this.enable = i.id;
    this.isEdit = false;
    this.isSave = true;

  }
  save(event: any, id: any, desname: any,datas:any) {
    this.validatedesignation(desname)
    this.enable = null;
    this.isEdit = true;
    this.isSave = false;
    if (this.valid) {
      let data={
        id:id,
        name:desname,
        created_by: datas.created_by,
        created_on:datas.created_on,
        status:datas.status,
        updated_by:this.userSession.id,
        updated_on:this.pipe.transform(new Date(), 'yyyy-MM-dd')+' '+this.pipe.transform(new Date(), 'HH:mm:ss'),
      }
      this.LM.putDesignation(data).subscribe((data) => {
        if (data.status) {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/Admin/Designation"]));
          this.enable = null;
          this.getDesignation();
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: this.msgLM130
          });


        } else {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: this.editResponseMessage
          });

        }
      })
    }
    else {
      this.ngOnInit();
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position: { top: `70px` },
        disableClose: true,
        data: this.msgLM129
      });
    }
  }
  canceledit(event: any, id: any) {
    this.enable = null;
    this.isEdit = true;
    this.isSave = false;
    this.ngOnInit();
  }
  getstatuslist(){
    this.LM.getstatuslists().subscribe((result:any) => {
      console.log(result)
      if(result.status){
        this.arrayValue = result.data;
      }

    })
  }
  getDesignation() {
    this.LM.getDesignation('designationsmaster', null, 1, 100, this.companyDBName).subscribe((info) => {
      if (info.status && info.data.length != 0) {
        this.designationData = info.data;
        this.dataSource = new MatTableDataSource(this.designationData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageLoading = false;
      }
    })
  }
  getErrorMessages(errorCode: any) {
    this.LM.getErrorMessages(errorCode, 1, 1).subscribe((result) => {
      if (result.status && errorCode == 'LM1') {
        this.errorDesName = result.data[0].errormessage
      }
      else if (result.status && errorCode == 'LM30') {
        this.saveResponseMessage = result.data[0].errormessage
      }
      else if (result.status && errorCode == 'LM31') {
        this.editResponseMessage = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM128')
      {
        this.msgLM128 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM129')
      {
        this.msgLM129 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM130')
      {
        this.msgLM130 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM131')
      {
        this.msgLM131 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM132')
      {
        this.msgLM132 = result.data[0].errormessage
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
}
