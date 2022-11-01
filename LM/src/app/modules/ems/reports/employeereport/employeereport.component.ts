import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { FormGroup,FormControl,Validators, FormBuilder, AbstractControl, FormArray} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ReportpopupComponent } from '../../pages/reportpopup/reportpopup.component'; 
import { EmsService } from '../../ems.service';
import * as XLSX from "xlsx";
import { TextFieldModule } from '@angular/cdk/text-field';
import { EventListenerFocusTrapInertStrategy } from '@angular/cdk/a11y';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';

export interface PeriodicElement {
  id: number;
  name: string;
  mobile: number;
  email: string;
  education: string;
  location:string;
  designation:string;
}
const Sample_Data: PeriodicElement[] = [
  {id: 1, name: 'Sreeb Tech', mobile: 9666313001, email: 'sreeb@gmail.com',location:'Hitech city',designation:'HR',education:'B.Tech'},
  {id: 2, name: 'Sanela', mobile: 966666666, email: 'sanela@gmail.com',location:'Kondapur',designation:'Employee',education:'B.Tech'},
  {id: 3, name: 'Sriram Hardwaress', mobile: 898989898, email: 'ram@gmail.com',location:'Madhapor',designation:'Software',education:'B.Tech'},
  {id: 4, name: 'ABC Tech', mobile: 568975698, email: 'abc@gmail.com',location:'Gachibowli',designation:'Tester',education:'M.Tech'},
  {id: 5, name: 'Soft Soluntions', mobile: 9638527415, email: 'soft@gmail.com',location:'Gachibowli',designation:'Software',education:'B.Tech'},
  {id: 6, name: 'Dell ', mobile: 1478963255, email: 'dell@gmail.com',location:'Gachibowli',designation:'Employee',education:'M.Tech'},
  {id: 7, name: 'Tech Mahindra', mobile: 1234569874, email: 'techm@gmail.com',location:'Hitech city',designation:'Software',education:'M.Tech'},
  {id: 8, name: 'Wipro', mobile: 8745693215, email: 'wipro@gmail.com',location:'Hyderabad',designation:'Manager',education:'M.Tech'},
  {id: 9, name: 'Accenture', mobile: 7896541236, email: 'accenture@gmail.com',location:'Kondapur',designation:'Testing',education:'B.Tech'},
  {id: 10, name: 'TATA Consultency', mobile: 6589471230, email: 'tcs@gmail.com',location:'Kondapur',designation:'Testing',education:'B.Tech'},
  {id: 11, name: 'Cognizent', mobile: 3269857410, email: 'cognizent@gmail.com',location:'Hyderabad',designation:'HR',education:'Degree'},
];
@Component({
  selector: 'app-employeereport',
  templateUrl: './employeereport.component.html',
  styleUrls: ['./employeereport.component.scss']
})
export class EmployeereportComponent implements OnInit {
  reportForm:any= FormGroup;
  userSession:any;
  ishide:boolean=true;
  isview:boolean=false;
  ischecked:boolean=false;
  ishidestatus:boolean=false;
  addflagcheckboxes:boolean=false;
  ishiding=[0,0,0,0,0,0,0,0,0,0]
  ids=[0,1,2,3,4,5,6,7,8,9]
  arrlist:any=[];
  allfilterdata: any = [];
  displayedColumns2: string[] = [];
  displayedColumns3:string[] = [];
  filterlist:any=[];
  filterlist2:any=[];
  employeestatus:any=[];
  estatus:any=[];
emptype:any=[];
department:any=[];
designation:any=[];
location:any=[];
gender:any=[];
bloodgroup:any=[];
shift:any=[];
manager:any=[]
maritalstatus:any=[];
empstatusids:any=[];
  emptypeids: any=[];
  departmentids: any=[];
  designationids: any=[];
  locationid: any=[];
  genderid: any=[];
  shiftid: any=[];
  bloodgroupid: any=[];
  managerid: any=[];
  maritalstatusid: any=[];
  valid:boolean=true;
get employeestatusFormArray() {
  return this.reportForm.controls.empstatus as FormArray;
}
get emptypeFormArray() {
  return this.reportForm.controls.emptype as FormArray;
}
get deptFormArray() {
  return this.reportForm.controls.department as FormArray;
}
get desgFormArray() {
  return this.reportForm.controls.designation as FormArray;
}
get locationFormArray() {
  return this.reportForm.controls.location as FormArray;
}
get genderFormArray() {
  return this.reportForm.controls.gender as FormArray;
}
get bloodgroupFormArray() {
  return this.reportForm.controls.bloodgroup as FormArray;
}
get shiftFormArray() {
  return this.reportForm.controls.shift as FormArray;
}
get managerFormArray() {
  return this.reportForm.controls.manager as FormArray;
}
get maritalstatusFormArray() {
  return this.reportForm.controls.maritalstatus as FormArray;
}
  arr: string[] = ['sno','name','email','mobile'];
  dataSource : MatTableDataSource<any> = <any>[];
  
 
  
  @ViewChild('TABLE') table!: ElementRef;  
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  constructor(private formBuilder: FormBuilder,private router: Router,public dialog: MatDialog,private ES:EmsService,) {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.getEmsEmployeeColumnConfigurationValue();
   }

  ngOnInit(): void {
    // this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.getEmsEmployeeColumnFilterData();
    
    this.reportForm=this.formBuilder.group(
      {
        empstatus:new FormArray([]),
        emptype:new FormArray([]),
        department:new FormArray([]),
        designation:new FormArray([]),
        location:new FormArray([]),
        gender:new FormArray([]),
        bloodgroup:new FormArray([]),
        maritalstatus:new FormArray([]),
        shift:new FormArray([]),
        manager:new FormArray([]),
        // empstatus: new FormArray([]),
    });
  }
  private addCheckempstatusboxes() {
    this.employeestatus.forEach(() => this.employeestatusFormArray.push(new FormControl(false)));
    if( this.arrlist[0]=='1'){
      this.employeestatusFormArray.setValue(this.empstatusids)
    }
      // this.arrlist[0]='1'?this.employeestatusFormArray.setValue(this.empstatusids):this.employeestatusFormArray.setValue([]);
  }
  private addemptypecheckbox() {
    this.emptype.forEach(() => this.emptypeFormArray.push(new FormControl(false)));
    if( this.arrlist[1]=='1'){
      this.emptypeFormArray.setValue(this.emptypeids)
    }
    // this.arrlist[1]='1' ?this.emptypeFormArray.setValue(this.emptypeids):this.emptypeFormArray.setValue([]);
  }
  private adddeptcheckbox() {
    this.department.forEach(() => this.deptFormArray.push(new FormControl(false)));
    if( this.arrlist[2]=='1'){
      this.deptFormArray.setValue(this.departmentids)
    }
    // this.arrlist[2]='1' ?this.deptFormArray.setValue(this.departmentids):this.deptFormArray.setValue([]);
  }
  private adddescheckbox() {
    this.designation.forEach(() => this.desgFormArray.push(new FormControl(false)));
    if( this.arrlist[3]=='1'){
      this.desgFormArray.setValue(this.designationids)
    }
    // this.arrlist[3]='1' ?this.desgFormArray.setValue(this.designationids):this.desgFormArray.setValue([]);
  }
  private addlocationcheckbox() {
    this.location.forEach(() => this.locationFormArray.push(new FormControl(false)));
    if( this.arrlist[4]=='1'){
      this.locationFormArray.setValue(this.locationid)
    }
    // this.arrlist[4]='1' ?this.locationFormArray.setValue(this.locationid):this.locationFormArray.setValue([]);
  }
  private addgender() {
    this.gender.forEach(() => this.genderFormArray.push(new FormControl(false)));
    if( this.arrlist[5]=='1'){
      this.genderFormArray.setValue(this.genderid)
    }
    // this.arrlist[5]='1' ?this.genderFormArray.setValue(this.genderid):this.genderFormArray.setValue([]);
  }
  private addbloodgroup() {
    this.bloodgroup.forEach(() => this.bloodgroupFormArray.push(new FormControl(false)));
    if( this.arrlist[6]=='1'){
      this.bloodgroupFormArray.setValue(this.bloodgroupid)
    }
    // this.arrlist[6]='1' ?this.bloodgroupFormArray.setValue(this.bloodgroupid):this.bloodgroupFormArray.setValue([]);
  }
  private addmaritalstatus() {
    this.maritalstatus.forEach(() => this.maritalstatusFormArray.push(new FormControl(false)));
    if( this.arrlist[7]=='1'){
      this.maritalstatusFormArray.setValue(this.maritalstatusid)
    }
    // this.arrlist[7]='1' ?this.maritalstatusFormArray.setValue(this.maritalstatusid):this.maritalstatusFormArray.setValue([]);
  }
  private addshift() {
    this.shift.forEach(() => this.shiftFormArray.push(new FormControl(false)));
    if( this.arrlist[8]=='1'){
      this.shiftFormArray.setValue(this.shiftid)
    }
    // this.arrlist[8]='1' ?this.shiftFormArray.setValue(this.shiftid):this.shiftFormArray.setValue([]);
  }
  private addmanager() {
    this.manager.forEach(() => this.managerFormArray.push(new FormControl(false)));
    if( this.arrlist[9]=='1'){
      this.managerFormArray.setValue(this.managerid)
    }
    // this.arrlist[9]='1' ?this.managerFormArray.setValue(this.managerid):this.managerFormArray.setValue([]);
  }
  empstatus(event:any,id:any){
    if(event.checked){
      for(let i=0;i<this.ids.length;i++){
        if(id == this.ids[i] && event.checked){
          this.ishiding[i]  = 1;
        
        }else{
          this.ishiding[i]=0;
        }
      } 

    }
    else{
      this.ishiding[id]=0;
    }
     
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  filter(){
    this.ishide = false;
    this.isview = true;
    if(!this.addflagcheckboxes){
      this.addCheckempstatusboxes();
      this.addshift();
      this.addmaritalstatus();
      this.addmanager();
      this.addlocationcheckbox();
      this.adddescheckbox();
      this.adddeptcheckbox();
      this.addemptypecheckbox();
      this.addbloodgroup();
      this.addgender();

    }
   
  }
  clearreport(){
    this.ishide = true;
    this.isview = false;

  }
 
  popup(){
    let dialogRef = this.dialog.open(ReportpopupComponent, {
      width: '390px',position:{top:`70px`},
      disableClose: true,
      
    });
  }
  view(event:any,data:any){
    console.log(data)
    this.reportForm.controls.empname.setValue(data.name)
    this.reportForm.controls.education.setValue(data.education)
    this.reportForm.controls.contact.setValue(data.mobile)
    this.reportForm.controls.email.setValue(data.email)
    this.reportForm.controls.designation.setValue("Software")

    this.ishide = false;
    this.isview = true;
  }
  setAll(event:any){}
  cancel(){
    this.ishide = true;
    this.isview = false;
  }
  exportAsXLSX() {
    const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(document.getElementById('table'));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employee_Report');
    /* save to file */
    XLSX.writeFile(wb, 'Employee_Report.xlsx');

  }
  getEmsEmployeeColumnFilterData(){
    this.ES.getEmsEmployeeColumnFilterData().subscribe((result:any)=>{
      console.log(result.data)
      for(let i=0;i<result.data.length;i++){
        if(result.data[i].column_name == 'Employee Status'){
         this.employeestatus.push(result.data[i]);
        this.empstatusids.push(result.data[i].id)
        }
        if(result.data[i].column_name == 'Employee Type'){
          this.emptype.push(result.data[i]);
          this.emptypeids.push(result.data[i].id)
          
         }
         if(result.data[i].column_name == "Department"){
          this.department.push(result.data[i]);
          this.departmentids.push(result.data[i].id);
         }
         if(result.data[i].column_name == 'Designation'){
          this.designation.push(result.data[i])
          this.designationids.push(result.data[i].id)
         }
         if(result.data[i].column_name == 'Location'){
          this.location.push(result.data[i])
          this.locationid.push(result.data[i].id)
         }
         if(result.data[i].column_name == 'Gender'){
          this.gender.push(result.data[i])
          this.genderid.push(result.data[i].id)
         }
         if(result.data[i].column_name == 'Blood Group'){
          this.bloodgroup.push(result.data[i])
          this.bloodgroupid.push(result.data[i].id)
         }
         if(result.data[i].column_name == 'Shift'){
          this.shift.push(result.data[i])
          this.shiftid.push(result.data[i].id)
         }
         if(result.data[i].column_name == 'Reporting Manager'){
          this.manager.push(result.data[i])
          this.managerid.push(result.data[i].id)
         }
         if(result.data[i].column_name == 'Marital Status'){
          this.maritalstatus.push(result.data[i])
          this.maritalstatusid.push(result.data[i].id)
         }
        //  this.employeestatusFormArray.setValue(this.empstatusids)
      }
      // this.bloodgroupFormArray.setValue([1,2])
      // console.log(this.empstatusids)
      // return this.employeestatusFormArray.setValue(this.empstatusids)
      
      
   

    })

  }
  search(){
    this.addflagcheckboxes = true;
    const empstatus = this.reportForm.value.empstatus
      .map((checked:any, i:any) => checked ? this.employeestatus[i].id : null)
      .filter((v:any) => v !== null);
      const emptype = this.reportForm.value.emptype
      .map((checked:any, i:any) => checked ? this.emptype[i].id : null)
      .filter((v:any) => v !== null);
      const dept = this.reportForm.value.department
      .map((checked:any, i:any) => checked ? this.department[i].id : null)
      .filter((v:any) => v !== null);
      const desg = this.reportForm.value.designation
      .map((checked:any, i:any) => checked ? this.designation[i].id : null)
      .filter((v:any) => v !== null);
      const location = this.reportForm.value.location
      .map((checked:any, i:any) => checked ? this.location[i].id : null)
      .filter((v:any) => v !== null);
      const gender = this.reportForm.value.gender
      .map((checked:any, i:any) => checked ? this.gender[i].id : null)
      .filter((v:any) => v !== null);
      const bloodgroup = this.reportForm.value.bloodgroup
      .map((checked:any, i:any) => checked ? this.bloodgroup[i].id : null)
      .filter((v:any) => v !== null);
      const shift = this.reportForm.value.shift
      .map((checked:any, i:any) => checked ? this.shift[i].id : null)
      .filter((v:any) => v !== null);
      const maritalstatus = this.reportForm.value.maritalstatus
      .map((checked:any, i:any) => checked ? this.maritalstatus[i].id : null)
      .filter((v:any) => v !== null);
      const manager = this.reportForm.value.manager
      .map((checked:any, i:any) => checked ? this.manager[i].id : null)
      .filter((v:any) => v !== null);
      

     let data2 ={
      empid:this.userSession.id,
      empstatus:empstatus,
      emptype:emptype,
      dept:dept,
      desg:desg,
      location:location,
      gender:gender,
      bloodgroup:bloodgroup,
      shift:shift,
      maritalstatus:maritalstatus,
      manager:manager


     }

    this.ES.getEmsEmployeeDataForReports(data2).subscribe((res: any) => {
        this.allfilterdata = []
      if (res.status && res.data.length != 0) {
        this.allfilterdata = res.data;
        this.dataSource = new MatTableDataSource(this.allfilterdata);
         }
        
        
        this.ishide = true;
        this.isview = false;
        // this.employeestatus=[];
        // this.estatus =[];
        // this.emptype=[];
        // this.department=[];
        // this.designation=[];
        // this.location=[];
        // this.gender=[];
        // this.bloodgroup=[];
        // this.shift=[];
        // this.manager=[]
        // this.maritalstatus=[]
        // this.getEmsEmployeeColumnConfigurationValue();
        
      })
   
  }
  getEmsEmployeeColumnConfigurationValue(){
    this.ES.getEmsEmployeeColumnConfigurationValue(this.userSession.id).subscribe((result:any)=>{
      this.arrlist = JSON.parse(JSON.stringify(result.data[0].configurations)).split(',');
      for (let i=0;i<this.arrlist.length;i++){
        if((this.arrlist[i]) == '1'){
          if(i==0){
            this.displayedColumns2.push('empstatus')
          }
          else if(i==1){
            this.displayedColumns2.push('emptype')
          }
        
          else if(i==2){
            this.displayedColumns2.push('dept')
          }
          else if(i==3){
            this.displayedColumns2.push('desg')
          }
          else if( i==4){
            this.displayedColumns2.push('location')
          }
          else if(i==5){
            this.displayedColumns2.push('gender')
          }
          else if( i==6){
            this.displayedColumns2.push('blood')
          }
          else if(i==7){
            this.displayedColumns2.push('marital')
          }
          else if( i==8){
            this.displayedColumns2.push('shift')
          }
          else if( i==9){
            this.displayedColumns2.push('manager')
          }
          
        }
        
      }
      this.displayedColumns3=this.arr.concat(this.displayedColumns2)
    })
  
  }
  clear(){
    this.ishide = true;
    this.isview = false;
  }

}
