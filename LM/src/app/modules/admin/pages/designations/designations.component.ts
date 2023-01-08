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
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { AdminService } from '../../admin.service';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { EmsService } from 'src/app/modules/ems/ems.service';
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
  msgEM94:any;
  msgEM93:any;
  msgEM96:any
  msgEM97:any;
  msgEM98:any;
  displayedColumns: string[] = ['sno','designation', 'status', 'Action'];
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
  constructor(private formBuilder: FormBuilder, private router: Router, private dialog: MatDialog,
     private LM: CompanySettingService, private adminService: AdminService,
     private emsService:EmsService) {
    this.getDesignation();
    this.dataSource = new MatTableDataSource(this.designationData);
  }

  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.getDesignation();
    this.getstatuslist();
    this.getMessages('EM1');
    this.getMessages('EM93');
    this.getMessages('EM97');
    this.getMessages('EM94')
    this.getMessages('EM93')
    this.getMessages('EM96')
    this.getMessages('EM97')
    this.getMessages('EM98')
    this.designationForm = this.formBuilder.group(
      {
        designation: ["",[Validators.required,this.noWhitespaceValidator()]],

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
              data:this.msgEM94
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
          data: this.msgEM93
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
          data: this.msgEM97
        });

      } else {
        this.ngOnInit();
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
          data: this.msgEM98
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
    console.log("data--",datas)
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
            data: this.msgEM96
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
        data: this.msgEM93
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
  getMessages(messageCode:any) {
    let data =
    {
      "code": messageCode,
      "pagenumber": 1,
      "pagesize": 1
    }
    this.emsService.getMessagesListApi(data).subscribe((result: any) => {
   if (result.status && messageCode == 'EM1') {
        this.errorDesName = result.data[0].message
      }
      else if (result.status && messageCode == 'EM93') {
        this.saveResponseMessage = result.data[0].message
      }
      else if (result.status && messageCode == 'EM97') {
        this.editResponseMessage = result.data[0].message
      }
      else if(result.status && messageCode == 'EM94')
      {
        this.msgEM94 = result.data[0].message
      }
      else if(result.status && messageCode == 'EM93')
      {
        this.msgEM93 = result.data[0].message
      }
      else if(result.status && messageCode == 'EM96')
      {
        this.msgEM96 = result.data[0].message
      }
      else if(result.status && messageCode == 'EM97')
      {
        this.msgEM97 = result.data[0].message
      }
      else if(result.status && messageCode == 'EM98')
      {
        this.msgEM98 = result.data[0].message
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
  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
}
}
