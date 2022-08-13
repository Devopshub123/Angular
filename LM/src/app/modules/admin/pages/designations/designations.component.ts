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
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';

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
  pageLoading=true;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private formBuilder: FormBuilder,private router: Router,private dialog: MatDialog,private LM:CompanySettingService) {
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
    if(this.designationData.length<0){
      this.valid=true;

    }
    else{
      for(let i=0;i<this.designationData.length;i++){
        if(data===this.designationData[i].designation){
          this.valid = false;
          break;          
        }
        else{
          this.valid = true;
        }
    }
    }
  }
  setdesignations(){
    if(this.designationForm.valid){
    this.validatedesignation(this.designationForm.controls.designation.value)
    this.designation = this.designationForm.controls.designation.value;
    let designationdata = {
      designationName: this.designation
    }    
      if(this.valid){
        this.LM.setDesignation(designationdata).subscribe((data) => {
          this.valid = false;
          if (data.status) {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
              this.router.navigate(["/Admin/Designation"]));
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position:{top:`70px`},
              disableClose: true,
              data: 'Designation added successfully'
            });
           
          } else {
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position:{top:`70px`},
              disableClose: true,
              data: 'Designation already existed'
            });
                       
          }  
        });
      }
      else{
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: 'Designation already existed'
        });
        
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
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: 'Designation status updated successfully'
        });
     
      }else{
        this.ngOnInit();
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data:'This designation have active employees. So we are unable to inactivate this designation now. Please move those employee to another designation and try again',
        });
      }
    })
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  Add(){
    this.isAdd = true;
    this.isdata = false;
    this.designationForm.controls.designation.setValue('')
    
  }
  cancel(){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/Admin/Designation"]));
    // this.designationForm.reset();
    // this.isAdd = false;
    // this.isdata = true; 
    // this.getDesignation();
  }
  edit(event:any,i:any){
    this.designationForm.controls.designation.setValue(i.designation)
    this.enable = i.id;
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
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/Admin/Designation"]));
          this.enable = null;
          this.getDesignation();
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data:'Designation updated successfully',
          });
        
        } else {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data:'Designation alreay existed',
          });
                  
        }
      })
    }
    else{
      this.ngOnInit();
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position:{top:`70px`},
        disableClose: true,
        data:'Designation already existed',
      });
    }        
  }
  canceledit(event:any,id:any){
    this.enable = null;
    this.isEdit=true;
    this.isSave=false;
    this.ngOnInit();
  }
  getDesignation(){
    this.LM.getDesignation('designationsmaster',null,1,100,'keerthi_hospitals').subscribe((info)=>{
      if(info.status && info.data.length !=0) {
        this.designationData = info.data;
        this.dataSource = new MatTableDataSource(this.designationData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageLoading=false;

      }
    })
    
  }
  getPageSizes(): number[] {
    if (this.dataSource.data.length > 20) {
      return [5, 10, 20, this.dataSource.data.length];
    }
    else {

     return [5, 10, 20];
    }
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
