import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup,FormControl,Validators, FormBuilder, AbstractControl} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PopupComponent,PopupConfig } from '../popup/popup.component';
import { MatDialog } from '@angular/material/dialog'; 
import { LoginService } from 'src/app/services/login.service';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export interface UserData {
  department:string;
  status: string;
}

@Component({
  selector: 'app-deparment',
  templateUrl: './deparment.component.html',
  styleUrls: ['./deparment.component.scss']
})
export class DeparmentComponent implements OnInit {
  departmentForm!: FormGroup;
  department:any;
  issubmitted: boolean=false;
  isvalid:boolean=false;
  isView:boolean=false;
  isAdd:boolean=false;
  isdata:boolean=true;
  isEdit:boolean=true;
  isSave:boolean=false;
  displayedColumns: string[] = ['department','status','Action'];
  departmentData:any=[];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  // @ViewChild(MatPaginator)
  // paginator!: MatPaginator;

  constructor(private formBuilder: FormBuilder,private dialog: MatDialog,private LM:CompanySettingService) {
    this.getDepartments();
    this.dataSource = new MatTableDataSource(this.departmentData);
  }

  ngOnInit(): void {
    this.getDepartments();
    this.departmentForm=this.formBuilder.group(
      {
        department:["",Validators.required],
        
      },
    );
  }
  setdepartment(){
    console.log("sdf",this.departmentForm.controls.department.value);
    this.department = this.departmentForm.controls.department.value;
    var data = {
      departmentName:this.department
    }
    
    if(this.departmentForm.valid){
      this.LM.setDepartments(data).subscribe((data) => {
        if (data.status) {
          this.departmentForm.reset();
          this.isdata = true;
          this.isAdd = false;
          this.ngOnInit();
          const dialog: PopupConfig = {
            title: 'Designation Added Successfully',
            close: 'OK',
            
          };
          this.dialog.open(PopupComponent, { width: '600px', data: dialog });
         
        } else {
          const dialog: PopupConfig = {
            title: 'Unable to insert designation',
            close: 'OK',
            
          };
          this.dialog.open(PopupComponent, { width: '600px', data: dialog });
          
        }

      })

    }

  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  Add(){
    this.isAdd = true;
    this.isdata = false;
  }
  cancel(){
    this.departmentForm.reset();
    this.isAdd = false;
    this.isdata = true;
    // this.designationForm.controls.designation = ''
   
  }
  edit(){
    this.isEdit=false;
    this.isSave=true;

  }
  save(){
    this.isEdit=true;
    this.isSave=false;

  }
  canceledit(){
    this.isEdit=true;
    this.isSave=false;


  }
  getDepartments(){
    this.LM.getDepartments('departmentsmaster',null,1,100,'boon_client').subscribe((info)=>{
      if(info.status && info.data.length !=0) {
        console.log(info.data);
        this.departmentData = info.data;
        this.dataSource =this.departmentData;
        // this.count = info.data[0].total;
      }

    })

  }


}
