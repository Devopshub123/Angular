import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  AbstractControl,
  FormArray,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EmsService } from '../../ems.service';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { AdminService } from 'src/app/modules/admin/admin.service';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-users-login',
  templateUrl: './users-login.component.html',
  styleUrls: ['./users-login.component.scss'],
})
export class UsersLoginComponent implements OnInit {
  @HostListener('window:scroll')
  usersloginForm: any = FormGroup;
  designations: any = [];
  min: any = new Date();
  max: any = new Date();
  isview: boolean = true;
  ishide: boolean = false;
  pageLoading = true;
  EM134: any;
  EM135: any;
  displayedColumns: string[] = [
    'sno',
    'empname',
    'email',
    'userid',
    'status',
    'action',
  ];
  // dataSource = new MatTableDataSource<PeriodicElement>(Sample_Data);
  dataSource: MatTableDataSource<any> = <any>[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  companyName: any;
  companyDBName:any = environment.dbName;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private ES: EmsService,
    public dialog: MatDialog,
    private EM: AdminService,
    private companyServices: CompanySettingService
  ) {}
  userLoginList: any = [];
  ngOnInit(): void {
    this.getUserLoginData();
    this.getMessageList();
    this.getCompanyInformation();
    this.usersloginForm = this.formBuilder.group({
      empname: [''],
      email: [''],
      userid: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
        ],
      ],
      password: [{ value: 'Welcome1!', disabled: true }, Validators.required],
      status: [''],
      empid: [''],
    });
  }
  close() {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/Admin/users-login']));
  }
  edit(event: any, data: any) {
    this.ishide = true;
    this.isview = false;
    this.usersloginForm.controls.empname.setValue(data.empname);
    this.usersloginForm.controls.email.setValue(data.officeemail);
    this.usersloginForm.controls.userid.setValue(
      (data.login = 'null' ? data.login : data.officeemail)
    );
    this.usersloginForm.controls.status.setValue('Active');
    this.usersloginForm.controls.empid.setValue(data.id);
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }
  delete() {}

  getUserLoginData() {
    this.ES.getUserLoginData().subscribe((res: any) => {
      if (res.status && res.data.length != 0) {
        this.userLoginList = res.data;
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        if (res.data.length > 20) {
          this.pageLoading = false;
        }
      }
    });
  }
  submit() {
    if (this.usersloginForm.valid) {
      if (this.userLoginList != undefined) {
        const email = this.userLoginList.find(
          (value: any) =>
            value.login ==
            this.usersloginForm.controls.userid.value.trim().toLowerCase()
        );
        if (email != undefined) {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            disableClose: true,
            data: 'User ID is already exist',
          });
        } else {
          this.saveUserLogin();
        }
      } else {
        this.saveUserLogin();
      }
    }
  }
  saveUserLogin() {
    if (this.usersloginForm.valid) {
      let data = {
        empname:this.usersloginForm.controls.empname.value,
        email:this.usersloginForm.controls.email.value,
        empid: this.usersloginForm.controls.empid.value,
        userid: this.usersloginForm.controls.userid.value,
        password: this.usersloginForm.controls.password.value,
        status: this.usersloginForm.controls.status.value,
        companyname:this.companyName
      };
      this.ES.usersLogin(data).subscribe((res: any) => {
        if (res.status) {
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => this.router.navigate(['/Admin/users-login']));
          this.ishide = true;
          this.isview = false;
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: this.EM134,
          });
        } else {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: this.EM135,
          });
        }
      });
    }
  }
  getPageSizes(): number[] {
    if (this.dataSource.data.length > 20) {
      return [5, 10, 20, this.dataSource.data.length];
    } else {
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
  getMessageList(){
    let info={
      "code": null,
      "pagenumber":1,
      "pagesize":1000
    }
    this.EM.getEMSMessagesList(info).subscribe((result: any) => {
      if(result && result.status){
        for(let i=0;i<result.data.length;i++){
          if(result.data[i].code =='EM134'){
            this.EM134=result.data[i].message;

          }else if(result.data[i].code =='EM135'){
            this.EM135=result.data[i].message;

          }
        }

      }

    })

  }
  getCompanyInformation(){
    this.companyServices.getCompanyInformation('companyinformation',null,1,10,this.companyDBName).subscribe((data:any)=>{
      if(data.status && data.data.length!=0) {
        this.companyName=data.data[0].companyname;

      }else {
        }

    })

  }
}
