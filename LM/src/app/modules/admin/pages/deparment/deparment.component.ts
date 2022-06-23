import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup,FormControl,Validators, FormBuilder, AbstractControl} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PopupComponent,PopupConfig } from '../../../../pages/popup/popup.component';
import { MatDialog } from '@angular/material/dialog'; 
import { LoginService } from 'src/app/services/login.service';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export interface UserData {
  deptname:string;
  status: string;
  depthead:string;
  headcount: number;
  id:number;
  total:number;
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
  enable:any=null;
  valid:boolean = false;
  displayedColumns: string[] = ['department','status','Action'];
  departmentData:any=[];
  arrayValue:any=[{Value:'active',name:'Active'},{Value:'inactive',name:'Inactive'}];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

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
  validatedepartments(data:any){
    console.log("ghhgh",data,this.valid)
    for(let i=0;i<this.departmentData.length;i++){
        if(data === this.departmentData[i].deptname){
          this.valid = false;
          break;          
        }
        else{
          this.valid = true;
        }
    }
    return this.valid;
  }
  setdepartment(){
    this.validatedepartments(this.departmentForm.controls.department.value)
    this.department = this.departmentForm.controls.department.value;
    var data = {
      departmentName:this.department
    }
    
    if(this.departmentForm.valid){
      if(this.valid){
        this.LM.setDepartments(data).subscribe((data) => {
          this.valid = false;
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
      else{
        const dialog: PopupConfig = {
          title: 'Department Already Existed',
          close: 'OK',
          
        };
        this.dialog.open(PopupComponent, { width: '600px', data: dialog });

      }
      
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
    this.enable = null;
    this.departmentForm.reset();
    this.isAdd = false;
    this.isdata = true;

  }
  status(status:any,id:any,deptname:any){
    
    let data = {
      deptname:deptname,
    tableName:'employee',
    columnName :'department',
    id:id,
    status:status
    }
    this.LM.updateStatus(data).subscribe((result)=> {
      if(result.status){
        this.ngOnInit();
        const dialog: PopupConfig = {
          title: 'Department Status Updated Successfully',
          close: 'OK',
          
        };
        this.dialog.open(PopupComponent, { width: '600px', data: dialog });


      }else{
        this.ngOnInit();
        const dialog: PopupConfig = {
          title: 'This department have active employees. So we are unable to inactivate this department now. Please move those employee to another department and try again',
          close: 'OK',
          
        };
        this.dialog.open(PopupComponent, { width: '600px', data: dialog });


      }
    })
  }
  edit(w:any,i:any){
    console.log(i)
    this.enable = i;
    this.isEdit=false;
    this.isSave=true;
    // VOFormElement.get('VORows').at(i).get('isEditable').patchValue(false);

  }
  save(event:any,id:any,deptname:any){
    this.validatedepartments(deptname)
    console.log("save",id,deptname)
    this.enable = null;
    this.isEdit=true;
    this.isSave=false;
    
    if(this.valid){
      this.LM.putDepartments({id: id, name: deptname}).subscribe((data) => {
        if (data.status) {
          this.enable = null;
          const dialog: PopupConfig = {
            title: 'Department Updated SuccesFully',
            close: 'OK',
            
          };
          this.dialog.open(PopupComponent, { width: '600px', data: dialog });      
          // this.getDepartments();
          this.ngOnInit();
        } else {
          
          const dialog: PopupConfig = {
            title: 'Unable to Update Department',
            close: 'OK',
            
          };
          this.dialog.open(PopupComponent, { width: '600px', data: dialog });
        }
      })
    }
    else{
      this.ngOnInit();
      const dialog: PopupConfig = {
        title: 'Department Already Existed',
        close: 'OK',
        
      };
      this.dialog.open(PopupComponent, { width: '600px', data: dialog });

    }

  

  }
  canceledit(event:any,id:any){
    console.log("cancel",id)
    this.enable = null;
    this.isEdit=true;
    this.isSave=false;
    this.ngOnInit();

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
