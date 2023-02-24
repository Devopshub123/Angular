import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { AdminService } from '../../admin.service';
import { PayrollService } from 'src/app/modules/payroll/payroll.service'; 

export interface UserData {
  sno:string;
  code: string;
  message:string;
  action: number;
}

@Component({
  selector: 'app-payroll-messages',
  templateUrl: './payroll-messages.component.html',
  styleUrls: ['./payroll-messages.component.scss']
})
export class PayrollMessagesComponent implements OnInit {

  errorMessagesForm!: FormGroup;
  isEdit:boolean=true;
  isSave:boolean=false;
  userSession:any=[];
  enable:any=null;
  valid: boolean = false;
  displayedColumns: string[] = ['sno','code','screenName','message','action'];
  messagesDataList:any=[];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  pageLoading = true;
  requiredField: any;
  dataUpdate: any;
  dataNotUpdate: any;
  recordExist: any;
  constructor(private formBuilder: FormBuilder, private router: Router, private dialog: MatDialog,
    private adminService: PayrollService) {

  }
  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.getMessagesList();
    this.errorMessagesForm=this.formBuilder.group(
      {
        code:[],
        message:["",Validators.required],
     },
    );
  }

  submit(event: any, rcode: any, rmessage: any, screenname:any) {
    if (this.errorMessagesForm.valid) {
      if (rmessage.length == 0) {
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
          data: this.requiredField
        });
       }
      else {
        const toSelect = this.messagesDataList.find((res: { message: string; }) => res.message.trim().toLowerCase() ==rmessage.toLowerCase());
        if(toSelect!=undefined){
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: this.recordExist
          });
       }
        else{
          this.save(rcode,rmessage,screenname)
        }
      }
    }
  }
  save(rcode: any, rmessage: any, screenname:any) {
    let dataList =[
      {
       "code": rcode,
       "message": rmessage,
       "screenname": screenname,
       "userid":this.userSession.id

      }]

    this.adminService.setErrorMessages(dataList).subscribe((res: any) => {
      if (res.status) {
        let resMessage: any;
        if (res.data == "dataSaved") {
          resMessage = this.dataUpdate
        } else {
          resMessage = this.dataNotUpdate
        }
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data:'Message updated successfully'//resMessage
          });
          window.location.reload();
          this.getMessagesList();
        } else {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: 'Unable to update message'//this.dataNotUpdate
          });
          this.getMessagesList();
        }
      }

      )
}

  edit(w: any, res: any) {
    this.errorMessagesForm.controls.message.setValue(res.message);
    this.enable = res.id;
    this.isEdit=false;
    this.isSave=true;

  }
  canceledit(event:any,id:any){
    this.enable = null;
    this.isEdit=true;
    this.isSave=false;
    this.ngOnInit();

  }
  getMessagesList() {
     let data =
      {
        "code": null,
        "pagenumber":1,
        "pagesize":1000
    }
    this.adminService.getErrorMessages(null,1,1000).subscribe((res:any)=>{
      if(res.status) {

        this.messagesDataList = res.data;
        this.messagesDataList.forEach((e: any) => {
          if (e.code == "PR1") {
           this.requiredField = e.message
          } else if (e.code == "PR37") {
            this.recordExist =e.message
          }else if (e.code == "PR38") {
            this.dataUpdate =e.message
          } else if (e.code == "PR39") {
            this.dataNotUpdate =e.message
          }
        })
        this.dataSource = new MatTableDataSource(this.messagesDataList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageLoading=false;
      } else {
        this.messagesDataList = [];
        this.dataSource = new MatTableDataSource(this.messagesDataList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }

    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
     if (this.dataSource.paginator) {
       this.dataSource.paginator.firstPage();
    }
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
