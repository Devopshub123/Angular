import { Component, OnInit, ViewChild  } from '@angular/core';
import { FormGroup,FormControl,Validators, FormBuilder, AbstractControl, FormArray} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { EmsService } from '../../ems.service';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';


@Component({
  selector: 'app-users-login',
  templateUrl: './users-login.component.html',
  styleUrls: ['./users-login.component.scss']
})
export class UsersLoginComponent implements OnInit {
  usersloginForm:any= FormGroup;
  designations:any=[];
  min:any=new Date();
  max:any=new Date();
  isview:boolean=true;
  ishide:boolean=false;
  pageLoading = true;
  displayedColumns: string[] = ['sno','empname','email','userid','action'];
  // dataSource = new MatTableDataSource<PeriodicElement>(Sample_Data);
  dataSource: MatTableDataSource<any>=<any>[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;


  constructor(private formBuilder: FormBuilder,private router: Router,private ES:EmsService,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getUserLoginData();
    this.usersloginForm=this.formBuilder.group(
      {
        empname: [""],
        email:["",] ,
        userid:["",Validators.required],
        password:["",Validators.required],
        status: [""],
        empid:[""],

    });
  }
  // Add(){
  //   this.ishide = true;
  //   this.isview = false;
  // }
  close(){
    // this.ishide = false;
    // this.isview = true;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/ems/users-login"]));

  }
  edit(event:any,data:any){
    this.ishide = true;
    this.isview = false;
    this.usersloginForm.controls.empname.setValue(data.empname);
    this.usersloginForm.controls.email.setValue(data.officeemail);
    this.usersloginForm.controls.userid.setValue(data.login=null?data.login:data.officeemail);
    this.usersloginForm.controls.status.setValue('Active');
    this.usersloginForm.controls.empid.setValue(data.id);
    


  }
  delete(){}

  getUserLoginData(){
    this.ES.getUserLoginData().subscribe((res: any) => {
      if (res.status && res.data.length != 0) {
        this.dataSource = new MatTableDataSource(res.data)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }
  submit(){
    if(this.usersloginForm.valid){
      let data ={
        empid:this.usersloginForm.controls.empid.value,
        userid:this.usersloginForm.controls.userid.value,
        password:this.usersloginForm.controls.password.value,
        status:this.usersloginForm.controls.status.value
    }
    this.ES.usersLogin(data).subscribe((res:any)=>{
      if(res.status){
        console.log("HI")
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/ems/users-login"]));
          this.ishide = true;
        this.isview = false;
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: 'Password  updated successfully. '
        });

      }
      else {
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: 'Unable to updated password.'
        });

      }

    })
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
