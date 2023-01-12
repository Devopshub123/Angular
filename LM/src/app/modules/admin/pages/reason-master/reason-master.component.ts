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
import { AdminService } from '../../admin.service';

export interface UserData {
  deptname: string;
  status: string;
  depthead: string;
  headcount: number;
  id: number;
  total: number;
}

@Component({
  selector: 'app-reason-master',
  templateUrl: './reason-master.component.html',
  styleUrls: ['./reason-master.component.scss']
})
export class ReasonMasterComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private router: Router, private dialog: MatDialog,
              private LM: CompanySettingService, private adminService: AdminService) { }

  reasonsForm!: FormGroup;
  pipe = new DatePipe('en-US');
  isAdd: boolean = false;
  isdata: boolean = true;
  isEdit: boolean = true;
  isSave: boolean = false;
  enable: any = null;
  valid: boolean = false;
  PageLoading = true;
  displayedColumns: string[] = ['sno','termination', 'status', 'Action'];
  reasonsDataList: any = [];
  statusList: any;
  dataSource: MatTableDataSource<UserData> = <any>[];
  pageLoading = true;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  reasonId!: number;
  userSession:any;
  messagesDataList: any = [];
  requiredField: any;
  requiredOption: any;
  dataSave: any;
  dataNotSave: any;
  reason: any;
  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.getstatuslist();
    this.getReasons();
    this.reasonsForm = this.formBuilder.group(
      {
        reason: ["" ,[Validators.required,this.noWhitespaceValidator()]],
      },
    );
    this.getMessagesList();
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
    this.reasonsForm.controls.reason.setValue('')
  }

  cancel() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/Admin/Reason"]));
  }

  edit(w: any, i: any) {
    this.reasonsForm.controls.reason.setValue(i.reason);
    this.enable = i.id;
    this.isEdit = false;
    this.isSave = true;
  }

  validateData(data: any) {
    if (this.reasonsDataList.length == 0) {
      this.valid = true;
    }
    else {
      if (this.reasonsDataList.length > 0) {
        for (let i = 0; i < this.reasonsDataList.length; i++) {
          if (data.trim().toLowerCase() === this.reasonsDataList[i].reason.trim().toLowerCase()) {
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

  saveReason() {
    if (this.reasonsForm.valid) {
      this.validateData(this.reasonsForm.controls.reason.value)
      this.reason = this.reasonsForm.controls.reason.value;
      let data = {
        reason: this.reason,
        reason_status: 1,
        actionby: this.userSession.id,
      };
      if (this.valid) {
        this.adminService.saveReasonData(data).subscribe((res: any) => {
          this.valid = false;
          if (res.status && res.data.statuscode == 0) {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
              this.router.navigate(["/Admin/Reason"]));
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
             data:"Reason saved sucessfully"
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

  updateData( reason: any,value:any) {
    if (this.reasonsForm.valid) {
      this.validateData(reason)
      let data = {
        reason_id :value.id ,
        reason: reason,
        reason_status: value.status,
        actionby: this.userSession.id,
      };
      if (this.valid) {
        this.adminService.saveReasonData(data).subscribe((res: any) => {
          this.valid = false;
          if (res.status && res.data.statuscode == 0) {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
              this.router.navigate(["/Admin/Reason"]));
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
             data:"Reason updated sucessfully"
            });

          } else {
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
             data: "Data is not update"
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

//   saveReason() {
//     const invalid = [];
//     const controls = this.reasonsForm.controls;
//     for (const name in controls) {
//       if (controls[name].invalid) {
//           invalid.push(name);
//       }
//     }
//     if (this.reasonsForm.valid) {
//       let data = {
//         reason: this.reasonsForm.controls.reason.value,
//         reason_status: 1,
//         actionby: this.userSession.id,
//       };

//       this.adminService.saveReasonData(data).subscribe((res: any) => {
//         this.valid = false;
//         if (res.status && res.data.statuscode == 0) {
//           this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
//             this.router.navigate(["/Admin/Reason"]));
//           let dialogRef = this.dialog.open(ReusableDialogComponent, {
//             position: { top: `70px` },
//             disableClose: true,
//            data:"Reason saved sucessfully"
//           });

//         } else {
//           let dialogRef = this.dialog.open(ReusableDialogComponent, {
//             position: { top: `70px` },
//             disableClose: true,
//            data: "Data is not saved"
//           });
//         }
//       });
//      } else {

//     }
//  }

  // updateData( reason: any,value:any) {
  //   const invalid = [];
  //   const controls = this.reasonsForm.controls;
  //   for (const name in controls) {
  //     if (controls[name].invalid) {
  //         invalid.push(name);
  //     }
  //   }
  //   if (this.reasonsForm.valid) {
  //     let data = {
  //       reason_id :value.id ,
  //       reason: reason,
  //       reason_status: value.status,
  //       actionby: this.userSession.id,
  //     };
  //       this.adminService.saveReasonData(data).subscribe((res: any) => {
  //       this.valid = false;
  //       if (res.status && res.data.statuscode == 0) {
  //         this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
  //           this.router.navigate(["/Admin/Reason"]));
  //         let dialogRef = this.dialog.open(ReusableDialogComponent, {
  //           position: { top: `70px` },
  //           disableClose: true,
  //          data:"Reason updated sucessfully"
  //         });

  //       } else {
  //         let dialogRef = this.dialog.open(ReusableDialogComponent, {
  //           position: { top: `70px` },
  //           disableClose: true,
  //          data: "Data is not updated"
  //         });
  //       }
  //     });

  //    }

  // }



  statusUpdate(status: any, value: any) {
    let data = {
      reason_id :value.id ,
      reason: value.reason,
      reason_status: status,
      actionby: this.userSession.id,
    };

    this.adminService.saveReasonData(data).subscribe((res: any) => {
      this.valid = false;
      if (res.status && res.data.statuscode == 0) {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/Admin/Reason"]));
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
         data:"Status updated sucessfully"
        });

      } else {
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
         data: "Unable to update status"
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
  getReasons() {
    this.adminService.getAllReasonsList().subscribe((res: any) => {
      if (res.status && res.data.length != 0) {
        this.reasonsDataList = res.data;
        this.dataSource = new MatTableDataSource(this.reasonsDataList);
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

  getMessagesList() {
    let data =
     {
       "code": null,
       "pagenumber":1,
       "pagesize":100
   }
   this.adminService.getMessagesListApi(data).subscribe((res:any)=>{
     if(res.status) {
       this.messagesDataList = res.data;
       this.messagesDataList.forEach((e: any) => {
        if (e.code == "ATT1") {
         this.requiredField = e.message
        } else if (e.code == "ATT2") {
          this.requiredOption =e.message
        } else if (e.code == "ATT11") {
          this.dataSave =e.message
        } else if (e.code == "ATT12") {
          this.dataNotSave =e.message
        }
      })
     } else {
       this.messagesDataList = [];
     }

   })
 }
 alphabetKeyPress(event: any,) {
  const pattern = /[a-zA-Z ]/;
    let inputChar = String.fromCharCode(event.charCode);
  if (event.keyCode != 8 && !pattern.test(inputChar)) {
    event.preventDefault();
   }
}
getPageSizes(): number[] {
  if (this.dataSource.data.length > 20) {
    return [5, 10, 20, this.dataSource.data.length];
  }
  else {

    return [5, 10, 20];
  }
}
applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}
}

