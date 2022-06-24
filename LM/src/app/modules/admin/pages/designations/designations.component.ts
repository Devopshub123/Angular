import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup,FormControl,Validators, FormBuilder, AbstractControl} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PopupComponent, PopupConfig } from '../../../../pages/popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from 'src/app/services/login.service';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export interface UserData {
  id:number;
  designation:string;
  status: string;
}
@Component({
  selector: 'app-designations',
  templateUrl: './designations.component.html',
  styleUrls: ['./designations.component.scss']
})

export class DesignationsComponent implements OnInit {
  designationForm!: FormGroup;
  designation:any;
  errorDesName:any='';
  saveResponseMessage:any='';
  editResponseMessage:any='';
  issubmitted: boolean=false;
  isvalid:boolean=false;
  isView:boolean=false;
  isAdd:boolean=false;
  isdata:boolean=true;
  isEdit:boolean=true;
  isSave:boolean=false;
  valid:boolean=false;
  displayedColumns: string[] = ['designation','status','Action'];
  designationData:any=[];
  arrayValue:any=[{Value:'Active',name:'Active '},{Value:'Inactive',name:'Inactive'}];
  enable:any=null;
  dataSource: MatTableDataSource<UserData>;

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private formBuilder: FormBuilder,private dialog: MatDialog,private LM:CompanySettingService) {
    this.getDesignation();
    this.dataSource = new MatTableDataSource(this.designationData);
  }

  ngOnInit(): void {
    this.getDesignation();
    this.getErrorMessages('LM1');
    this.getErrorMessages('LM30');
    this.getErrorMessages('LM31');
    this.designationForm=this.formBuilder.group(
      {
        designation:["",Validators.required],
        
      },
    );
  }
  validatedesignation(data:any){
    for(let i=0;i<this.designationData.length;i++){
        if(data===this.designationData[i].designation){
          this.valid = false;
          break;          
        }
        else{
          this.valid = true;
        }
    }
    return this.valid;
  }
  setdesignations(){
    this.validatedesignation(this.designationForm.controls.designation.value)
    this.designation = this.designationForm.controls.designation.value;
    let designationdata = {
      designationName: this.designation
    }
    if(this.designationForm.valid){
      if(this.valid){
        this.LM.setDesignation(designationdata).subscribe((data) => {
          this.valid = false;
          if (data.status) {
            this.ngOnInit();
            this.designationForm.reset();
            this.isdata = true;
            this.isAdd = false;
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
        });
      }
      else{
        const dialog: PopupConfig = {
          title: 'Designation Already Existed',
          close: 'OK',
        };
        this.dialog.open(PopupComponent, { width: '600px', data: dialog });
      }
    }
  }
  status(status:any,id:any,deptname:any){
    let data = {
      id:id,
      deptname: deptname,
      status:status,
      tableName:'employee',
      columnName:'department',     
      depthead: null,
      headcount: null
    }
    this.LM.designationstatus(data).subscribe((result)=> {
      if(result.status){
        this.ngOnInit();
        const dialog: PopupConfig = {
          title: 'Designation Status Updated Successfully',
          close: 'OK',
        };
        this.dialog.open(PopupComponent, { width: '600px', data: dialog });
      }else{
        this.ngOnInit();
        const dialog: PopupConfig = {
          title: 'This designation have active employees. So we are unable to inactivate this designation now. Please move those employee to another designation and try again',
          close: 'OK',     
        };
        this.dialog.open(PopupComponent, { width: '600px', data: dialog });
      }
    })
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  // ngAfterViewInit() {
  //   this.dataSource.paginator = this.paginator;
  //   this.dataSource.sort = this.sort;
  // }
  Add(){
    this.isAdd = true;
    this.isdata = false;
  }
  cancel(){
    this.designationForm.reset();
    this.isAdd = false;
    this.isdata = true; 
  }
  edit(event:any,i:any){
    console.log(i)
    this.enable = i;
    this.isEdit=false;
    this.isSave=true;

  }
  save(event:any,id:any,desname:any){
    this.validatedesignation(desname)
    this.enable = null;
    this.isEdit=true;
    this.isSave=false;
    if(this.valid){
      this.LM.putDesignation({id: id, name: desname}).subscribe((data) => {
        if (data.status) {
          this.enable = null;
          this.getDesignation();
          const dialog: PopupConfig = {
            title: 'Designation Updated Successfully',
            close: 'OK',            
          };
          this.dialog.open(PopupComponent, { width: '600px', data: dialog });  
        } else {
          const dialog: PopupConfig = {
            title: 'Unable To Update Designation',
            close: 'OK',            
          };
          this.dialog.open(PopupComponent, { width: '600px', data: dialog });        
        }
      })
    }
    else{
      this.ngOnInit();
      const dialog: PopupConfig = {
        title: 'Designation Already Existed',
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
  getDesignation(){
    this.LM.getDesignation('designationsmaster',null,1,100,'boon_client').subscribe((info)=>{
      if(info.status && info.data.length !=0) {
        console.log(info.data);
        this.designationData = info.data;
        console.log(this.designationData[5].designation);
        this.dataSource = new MatTableDataSource(this.designationData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      }
    })
  }
  getErrorMessages(errorCode:any) {
    this.LM.getErrorMessages(errorCode,1,1).subscribe((result)=>{
      if(result.status && errorCode == 'LM1')
      {
        this.errorDesName = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM30')
      {
        this.saveResponseMessage = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM31')
      {
        this.editResponseMessage = result.data[0].errormessage
      }

    })
  }

}
