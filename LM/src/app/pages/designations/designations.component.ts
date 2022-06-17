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
  id:number;
  designation:string;
  status: string;
}
// const arrayList = [
//   {"id":1,"designation":"fgfg","status":"active"},
//   // {"id":2,"designation":"fgfcvg","status":"active"},
//   // {"id":3,"designation":"fgfcfvg","status":"active"},
//   // {"id":4,"designation":"fgfcvg","status":"active"},
//   // {"id":5,"designation":"fgcfg","status":"active"},
// ];

@Component({
  selector: 'app-designations',
  templateUrl: './designations.component.html',
  styleUrls: ['./designations.component.scss']
})

export class DesignationsComponent implements OnInit {
  designationForm!: FormGroup;
  designation:any
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
  enable:any=null;
  dataSource: MatTableDataSource<UserData>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  // @ViewChild(MatPaginator)
  // paginator!: MatPaginator;

  constructor(private formBuilder: FormBuilder,private dialog: MatDialog,private LM:CompanySettingService) {
    this.getDesignation();
    // if(this.designationData){

      this.dataSource = new MatTableDataSource(this.designationData);
      console.log(this.designationData)
    // }
    
    
    // console.log("hh",this.dataSource)
  }

  ngOnInit(): void {
    this.getDesignation();
    this.designationForm=this.formBuilder.group(
      {
        designation:["",Validators.required],
        
      },
    );
  }
  validatedesignation(data:any){
    console.log("ghhgh",data,this.valid)
    for(let i=0;i<this.designationData.length;i++){
        if(data===this.designationData[i].designation){
          this.valid = false;
          break
          
        }
        else{
          this.valid = true;
        }
    }
    return this.valid;
  }
  setdesignations(){
    this.validatedesignation(this.designationForm.controls.designation.value)
    console.log("sdf",this.designationForm.controls.designation.value);
    this.designation = this.designationForm.controls.designation.value;
    var data = {
      designationName: this.designation
    }
    
    if(this.designationForm.valid){
      if(this.valid){
        this.LM.setDesignation(data).subscribe((data) => {
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
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  Add(){
    this.isAdd = true;
    this.isdata = false;
  }
  cancel(){
    this.designationForm.reset();
    this.isAdd = false;
    this.isdata = true; 
  }
  edit(w:any,i:any){
    console.log(i)
    this.enable = i;
    this.isEdit=false;
    this.isSave=true;

  }
  save(event:any,id:any,deptname:any){
    console.log("save",id,deptname)
    this.enable = null;
    this.isEdit=true;
    this.isSave=false;

  }
  canceledit(event:any,id:any){
    console.log("cancel",id)
    this.enable = null;
    this.isEdit=true;
    this.isSave=false;


  }
  getDesignation(){
    this.LM.getDesignation('designationsmaster',null,1,100,'boon_client').subscribe((info)=>{
      if(info.status && info.data.length !=0) {
        console.log(info.data);
        this.designationData = info.data;
        console.log(this.designationData[5].designation)
        // this.dataSource =this.designationData;
        // this.count = info.data[0].total;
      }

    })

  }

}
