import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import { FormGroup,FormControl,Validators, FormBuilder,ValidatorFn, AbstractControl, FormArray} from '@angular/forms';
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
import { NgxSpinnerService } from 'ngx-spinner';
/**for formarray validation */
function minSelectedCheckboxes(min = 1) {
  const validator: any = (formArray: FormArray) => {
    const totalSelected = formArray.controls
      // get a list of checkbox values (boolean)
      .map((control:any) => control.value)
      // total up the number of checked checkboxes
      .reduce((prev, next) => next ? prev + next : prev, 0);
    // if the total is not greater than the minimum, return the error message
    return totalSelected >= min ? null : { required: true };
  };
  return validator;
}
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
  constructor(private formBuilder: FormBuilder, private router: Router, public dialog: MatDialog,
    private ES: EmsService, private spinner: NgxSpinnerService,) {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.getEmsEmployeeColumnConfigurationValue();
   }
   showScroll: boolean | undefined;
  ngOnInit(): void {
    this.getEmsEmployeeColumnFilterData();
  }
  reortForm(){
    this.reportForm=this.formBuilder.group({
        empstatus:new FormArray([],minSelectedCheckboxes(Number(this.arrlist[0]))),
        emptype:new FormArray([],minSelectedCheckboxes(Number(this.arrlist[1]))),
        department:new FormArray([],minSelectedCheckboxes(Number(this.arrlist[2]))),
        designation:new FormArray([],minSelectedCheckboxes(Number(this.arrlist[3]))),
        location:new FormArray([],minSelectedCheckboxes(Number(this.arrlist[4]))),
        gender:new FormArray([],minSelectedCheckboxes(Number(this.arrlist[5]))),
        bloodgroup:new FormArray([],minSelectedCheckboxes(Number(this.arrlist[6]))),
        maritalstatus:new FormArray([],minSelectedCheckboxes(Number(this.arrlist[7]))),
        shift:new FormArray([],minSelectedCheckboxes(Number(this.arrlist[8]))),
        manager:new FormArray([],minSelectedCheckboxes(Number(this.arrlist[9]))),
    });
  }
  private addCheckempstatusboxes() {
    this.employeestatus.forEach(() => this.employeestatusFormArray.push(new FormControl(false)));
    if( this.arrlist[0]=='1'){
      this.employeestatusFormArray.setValue(this.empstatusids)
    }
  }
  private addemptypecheckbox() {
    this.emptype.forEach(() => this.emptypeFormArray.push(new FormControl(false)));
    if( this.arrlist[1]=='1'){
      this.emptypeFormArray.setValue(this.emptypeids)
    }
  }
  private adddeptcheckbox() {
    this.department.forEach(() => this.deptFormArray.push(new FormControl(false)));
    if( this.arrlist[2]=='1'){
      this.deptFormArray.setValue(this.departmentids)
    }
  }
  private adddescheckbox() {
    this.designation.forEach(() => this.desgFormArray.push(new FormControl(false)));
    if( this.arrlist[3]=='1'){
      this.desgFormArray.setValue(this.designationids)
    }
  }
  private addlocationcheckbox() {
    this.location.forEach(() => this.locationFormArray.push(new FormControl(false)));
    if( this.arrlist[4]=='1'){
      this.locationFormArray.setValue(this.locationid)
    }
  }
  private addgender() {
    this.gender.forEach(() => this.genderFormArray.push(new FormControl(false)));
    if( this.arrlist[5]=='1'){
      this.genderFormArray.setValue(this.genderid)
    }
  }
  private addbloodgroup() {
    this.bloodgroup.forEach(() => this.bloodgroupFormArray.push(new FormControl(false)));
    if( this.arrlist[6]=='1'){
      this.bloodgroupFormArray.setValue(this.bloodgroupid)
    }
  }
  private addmaritalstatus() {
    this.maritalstatus.forEach(() => this.maritalstatusFormArray.push(new FormControl(false)));
    if( this.arrlist[7]=='1'){
      this.maritalstatusFormArray.setValue(this.maritalstatusid)
    }
  }
  private addshift() {
    this.shift.forEach(() => this.shiftFormArray.push(new FormControl(false)));
    if( this.arrlist[8]=='1'){
      this.shiftFormArray.setValue(this.shiftid)
    }
  }
  private addmanager() {
    this.manager.forEach(() => this.managerFormArray.push(new FormControl(false)));
    if( this.arrlist[9]=='1'){
      this.managerFormArray.setValue(this.managerid)
    }
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
  /** */
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
      this.search();

    }

  }
  clearreport(){
    this.ishide = true;
    this.isview = false;
  }

  popup(){
    let dialogRef = this.dialog.open(ReportpopupComponent, {
      width: '390px',position:{top:`130px`},
      disableClose: true,
    });
  }

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
      }
      this.filter()
    })

  }
  search() {
    this.spinner.show();
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
     if(this.reportForm.valid){
         this.ES.getEmsEmployeeDataForReports(data2).subscribe((res: any) => {
        this.allfilterdata = [];
        this.dataSource = new MatTableDataSource(<any>[]);
      if (res.status && res.data.length != 0) {
        this.allfilterdata = res.data;
        this.dataSource = new MatTableDataSource(this.allfilterdata);
         }
        this.ishide = true;
        this.isview = false;
         })
         this.spinner.hide();
     }
     else {
      this.spinner.hide();
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position:{top:`70px`},
        disableClose: true,
        data: 'Please select at least one option while filtering a field.'
      });
     }
  }
  getEmsEmployeeColumnConfigurationValue(){
    this.ES.getEmsEmployeeColumnConfigurationValue(this.userSession.id).subscribe((result:any)=>{
      this.arrlist = JSON.parse(JSON.stringify(result.data[0].configurations)).split(',');
      this.reortForm()
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
}
