import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { AdminService } from '../../admin.service';

export interface UserData {
  sno:string;
  code: string;
  message:string;
  action: number;
}

@Component({
  selector: 'app-lm-message-master',
  templateUrl: './lm-message-master.component.html',
  styleUrls: ['./lm-message-master.component.scss']
})
export class LmMessageMasterComponent implements OnInit {

  errorMessagesForm!: FormGroup;
  isEdit:boolean=true;
  isSave:boolean=false;
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
    private adminService: AdminService) {

  }
  ngOnInit(): void {
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
        const toSelect = this.messagesDataList.find((res: { errormessage: string; }) => res.errormessage.trim().toLowerCase() ==rmessage.toLowerCase());
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
       "errorcode": rcode,
       "screenname": screenname,
       "errormessage": rmessage,
      }]
    this.adminService.setErrorMessages(dataList).subscribe((res: any) => {
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position: { top: `70px` },
        disableClose: true,
        data:res.message
      });
      dialogRef.afterClosed().subscribe(result => {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate(["/Admin/LM-MessageMaster"]));
      });

      // if (res.status) {
      //   let resMessage: any;
      //   if (res.data == "dataSaved") {
      //     resMessage = this.dataUpdate
      //   } else {
      //     resMessage = this.dataNotUpdate
      //   }
      //     let dialogRef = this.dialog.open(ReusableDialogComponent, {
      //       position: { top: `70px` },
      //       disableClose: true,
      //       data:res.message
      //     });
      //     window.location.reload();
      //     this.getMessagesList();
      //   } else {
      //     let dialogRef = this.dialog.open(ReusableDialogComponent, {
      //       position: { top: `70px` },
      //       disableClose: true,
      //       data: this.dataNotUpdate
      //     });
      //     this.getMessagesList();
      //   }
      }

      )
}

  edit(w: any, res: any) {
    this.errorMessagesForm.controls.message.setValue(res.errormessage);
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
    //  let data =
    //   {
    //     "code": null,
    //     "pagenumber":1,
    //     "pagesize":1000
    // }
    this.adminService.getErrorMessages(null,1,1000).subscribe((res:any)=>{
      this.messagesDataList=[];
      if(res.status) {
        this.messagesDataList = res.data;
        this.messagesDataList.forEach((e: any) => {
          if (e.errorcode == "LM1") {
           this.requiredField = e.errormessage
          }
          // else if (e.code == "ATT71") {
          //   this.recordExist =e.message
          // }else if (e.code == "ATT72") {
          //   this.dataUpdate =e.message
          // } else if (e.code == "ATT73") {
          //   this.dataNotUpdate =e.message
          // }
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
