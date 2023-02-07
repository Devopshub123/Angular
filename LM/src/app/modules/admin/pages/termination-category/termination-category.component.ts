import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup,  Validators, FormBuilder, ValidatorFn, AbstractControl, ValidationErrors,  } from '@angular/forms';
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
  selector: 'app-termination-category',
  templateUrl: './termination-category.component.html',
  styleUrls: ['./termination-category.component.scss']
})
export class TerminationCategoryComponent implements OnInit {
  terminationCategoryForm!: FormGroup;
  userSession:any;
  pipe = new DatePipe('en-US');
  isAdd: boolean = false;
  isdata: boolean = true;
  isEdit: boolean = true;
  isSave: boolean = false;
  enable: any = null;
  valid: boolean = false;
  displayedColumns: string[] = ['sno','termination', 'status', 'Action'];
  statusList: any;
  dataSource: MatTableDataSource<UserData> = <any>[];
  pageLoading = true;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  terminationList:any=[]
  terminationName: any;
  constructor(private formBuilder: FormBuilder, private router: Router,
    private dialog: MatDialog, private LM: CompanySettingService,
    private ts: LoginService, private adminService: AdminService) { }

  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.getstatuslist();
    this.getDepartments();
    this.terminationCategoryForm = this.formBuilder.group(
      {
        terminationCategory: ["",[Validators.required,this.noWhitespaceValidator()]],
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
    this.terminationCategoryForm.controls.terminationCategory.setValue('')
  }

  cancel() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/Admin/Termination-Category"]));
  }

  edit(w: any, i: any) {
    this.terminationCategoryForm.controls.terminationCategory.setValue(i.category);
    this.enable = i.id;
    this.isEdit = false;
    this.isSave = true;
  }
  validateData(data: any) {
    if (this.terminationList.length == 0) {
      this.valid = true;
    }
    else {
      if (this.terminationList.length > 0) {
        for (let i = 0; i < this.terminationList.length; i++) {
          if (data.trim().toLowerCase() === this.terminationList[i].category.trim().toLowerCase()) {
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
  save() {
    if (this.terminationCategoryForm.valid) {
      this.validateData(this.terminationCategoryForm.controls.terminationCategory.value)
      this.terminationName = this.terminationCategoryForm.controls.terminationCategory.value;
      let data = {
        termination_id:null,
        termination_category: this.terminationName,
        termination_status: 1,
        actionby: this.userSession.id,
      };

      if (this.valid) {
        this.adminService.saveTerminationCategory(data).subscribe((res: any) => {
          this.valid = false;
          if (res.status && res.data.statuscode == 0) {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
              this.router.navigate(["/Admin/Termination-Category"]));
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
          data:  "Data  already exists"
        });

      }
    }
  }
//////////
update(name: any,value:any) {
  if (this.terminationCategoryForm.valid) {
    this.validateData(name)
    this.terminationName = name;
    let data = {
      termination_id:value.id,
      termination_category: this.terminationName,
      termination_status: value.status,
      actionby: this.userSession.id,
    };

    if (this.valid) {
      this.adminService.saveTerminationCategory(data).subscribe((res: any) => {
        this.valid = false;
        if (res.status && res.data.statuscode == 0) {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/Admin/Termination-Category"]));
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
           data:"Data updated sucessfully"
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

  //////////
  // save() {
  //   const invalid = [];
  //   const controls = this.terminationCategoryForm.controls;
  //   for (const name in controls) {
  //     if (controls[name].invalid) {
  //         invalid.push(name);
  //     }
  //   }
  //   if (this.terminationCategoryForm.valid) {
  //     let data = {
  //       termination_id:null,
  //       termination_category: this.terminationCategoryForm.controls.terminationCategory.value,
  //       termination_status: 1,
  //       actionby: this.userSession.id,
  //     };

  //     this.adminService.saveTerminationCategory(data).subscribe((res: any) => {
  //       this.valid = false;
  //       if (res.status && res.data.statuscode == 0) {
  //         this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
  //           this.router.navigate(["/Admin/Termination-Category"]));
  //         let dialogRef = this.dialog.open(ReusableDialogComponent, {
  //           position: { top: `70px` },
  //           disableClose: true,
  //          data:"Data saved sucessfully"
  //         });

  //       } else {
  //         let dialogRef = this.dialog.open(ReusableDialogComponent, {
  //           position: { top: `70px` },
  //           disableClose: true,
  //          data: "Data is not saved"
  //         });
  //       }
  //     });

  //    } else {

  //   }

  // }

  // update( name: any,value:any) {
  //   const invalid = [];
  //   const controls = this.terminationCategoryForm.controls;
  //   for (const name in controls) {
  //     if (controls[name].invalid) {
  //         invalid.push(name);
  //     }
  //   }
  //   if (this.terminationCategoryForm.valid) {
  //     let data = {
  //       termination_id:value.id,
  //       termination_category: name,
  //       termination_status: value.status,
  //       actionby: this.userSession.id,
  //     };

  //     this.adminService.saveTerminationCategory(data).subscribe((res: any) => {
  //       this.valid = false;
  //       if (res.status && res.data.statuscode == 0) {
  //         this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
  //           this.router.navigate(["/Admin/Termination-Category"]));
  //         let dialogRef = this.dialog.open(ReusableDialogComponent, {
  //           position: { top: `70px` },
  //           disableClose: true,
  //          data:"Data saved sucessfully"
  //         });

  //       } else {
  //         let dialogRef = this.dialog.open(ReusableDialogComponent, {
  //           position: { top: `70px` },
  //           disableClose: true,
  //          data: "Data is not saved"
  //         });
  //       }
  //     });

  //    } else {

  //   }
  // }

  statusUpdate(status:any,value:any) {
    let data = {
      termination_id:value.id,
      termination_category: value.category,
      termination_status: status,
      actionby: this.userSession.id,
    };

    this.adminService.saveTerminationCategory(data).subscribe((res: any) => {
      this.valid = false;
      if (res.status && res.data.statuscode == 0) {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/Admin/Termination-Category"]));
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
         data:"Status updated sucessfully"
        });

      } else {
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
         data: "Unable to update"
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
  getDepartments() {
    this.adminService.getTerminationCategoryList().subscribe((res: any) => {
      if (res.status && res.data.length != 0) {
        this.terminationList = res.data;
        this.dataSource = new MatTableDataSource(this.terminationList);
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
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
