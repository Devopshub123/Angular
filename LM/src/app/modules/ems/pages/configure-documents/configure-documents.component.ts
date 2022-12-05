import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup,  Validators, FormBuilder, ValidatorFn, ValidationErrors, AbstractControl,  } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from 'src/app/services/login.service';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { AdminService } from 'src/app/modules/admin/admin.service';
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
  selector: 'app-configure-documents',
  templateUrl: './configure-documents.component.html',
  styleUrls: ['./configure-documents.component.scss']
})
export class ConfigureDocumentsComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private router: Router, private dialog: MatDialog,
              private LM: CompanySettingService, private adminService: AdminService,private emsService: EmsService,) { }

  documentTypeForm!: FormGroup;
  pipe = new DatePipe('en-US');
  isAdd: boolean = false;
  isdata: boolean = true;
  isEdit: boolean = true;
  isSave: boolean = false;
  enable: any = null;
  valid: boolean = false;

  displayedColumns: string[] = ['sno','termination', 'status', 'Action'];
  documentDataList: any = [];
  statusList: any;
  dataSource: MatTableDataSource<UserData> = <any>[];
  pageLoading = true;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  documentId!: number;
  userSession:any;
  documentName:any;

  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.getstatuslist();
    this.getDocuments();
    this.documentTypeForm = this.formBuilder.group(
      {
        document: ["",[Validators.required,this.noWhitespaceValidator()]],
      },
    );
  }
  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }


  ngAfterViewInit() {

  }

  Add() {
    this.isAdd = true;
    this.isdata = false;
    this.documentTypeForm.controls.document.setValue('')
  }

  cancel() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/Admin/configure-documents"]));
  }

  edit(w: any, i: any) {
    this.documentTypeForm.controls.document.setValue(i.category);
    this.enable = i.id;
    this.isEdit = false;
    this.isSave = true;
  }
  validateData(data: any) {
    if (this.documentDataList.length < 0) {
      this.valid = true;
    }
    else {
      if (this.documentDataList.length > 0) {
        for (let i = 0; i < this.documentDataList.length; i++) {
          if (data.trim().toLowerCase() === this.documentDataList[i].category.trim().toLowerCase()) {
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

  saveDocument() {
    if (this.documentTypeForm.valid) {
      this.validateData(this.documentTypeForm.controls.document.value)
      this.documentName = this.documentTypeForm.controls.document.value;
      let data = {
        document_id:null,
        document_category: this.documentName,
        document_status: 1,
        actionby: this.userSession.id,
      };
      if (this.valid) {
        this.emsService.saveDocumentCategory(data).subscribe((res: any) => {
          this.valid = false;
          if (res.status && res.data.statuscode == 0) {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
              this.router.navigate(["/Admin/configure-documents"]));
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
             data:"Data saved sucessfully"
            });

          } else {
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
             data: "Data is not saved"
            });
          }
        });
      }
      else {
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
          data:  "Data is already exists"
        });

      }
    }
  }
  updateData(document: any,value:any){
    if (this.documentTypeForm.valid) {
      this.validateData(document)
      this.documentName = document;
      let data = {
        document_id  :value.id ,
        document_category: this.documentName,
        document_status: value.status,
        actionby: this.userSession.id,
      };
      if (this.valid) {
        this.emsService.saveDocumentCategory(data).subscribe((res: any) => {
          this.valid = false;
          if (res.status && res.data.statuscode == 0) {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
              this.router.navigate(["/Admin/configure-documents"]));
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
             data:"Data updated sucessfully"
            });

          } else {
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
             data: "Data is not updated"
            });
          }
        });
      }
      else {
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
          data:  "Data is already exists"
        });

      }
    }
  }
  ////////

  statusUpdate(status:any,value:any) {
    let data = {
      document_id  :value.id ,
      document_category: value.category,
      document_status: status,
      actionby: this.userSession.id,
    };

      this.emsService.saveDocumentCategory(data).subscribe((res: any) => {
      this.valid = false;
      if (res.status && res.data.statuscode == 0) {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/Admin/configure-documents"]));
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
         data:"Status updated sucessfully"
        });

      } else {
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
         data: "Status is not updated"
        });
      }
    });

  }

  canceledit(event: any, id: any) {
    this.enable = null;
    this.isEdit = true;
    this.isSave = false;
    this.ngOnInit();

  }
  getDocuments() {
    this.emsService.getDocumentCategoryList().subscribe((res: any) => {
      if (res.status && res.data.length != 0) {
        this.documentDataList = res.data;
        this.dataSource = new MatTableDataSource(this.documentDataList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageLoading = false;
      }
    })
  }

  getstatuslist(){
    this.LM.getstatuslists().subscribe((result:any) => {
      if(result.status){
        this.statusList = result.data;
      }

    })
  }

  getErrorMessages(errorCode:any) {

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

