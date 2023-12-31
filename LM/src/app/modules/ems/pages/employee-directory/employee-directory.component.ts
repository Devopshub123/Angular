import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EncryptPipe } from 'src/app/custom-directive/encrypt-decrypt.pipe';
import { EmsService } from '../../ems.service';
export interface UserData {
  deptname: string;
  status: string;
  depthead: string;
  headcount: number;
  id: number;
  total: number;
}
@Component({
  selector: 'app-employee-directory',
  templateUrl: './employee-directory.component.html',
  styleUrls: ['./employee-directory.component.scss']
})
export class EmployeeDirectoryComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,private router: Router,private emsService:EmsService) { }
  dataSource : MatTableDataSource<UserData> = <any>[];
  employeeDirectoryForm!: FormGroup;
  changeText: boolean =false;
  ischecked:boolean=false;
  ishide:boolean=false;
  ishiding:boolean=false;
  ishideFilter:boolean=false;
  ishideonbord: boolean = false;
  employeeList: any = [];
  employeeFilteredList: any = [];
  encriptPipe= new EncryptPipe();
  ngOnInit(): void {
    this.employeeDirectoryForm=this.formBuilder.group(
      {
      dateoftermination: [new Date(),],
      reason: ["",],
      terminatecategory:["",],
      empname:["Sreeb",],
      selecttermination:[""],
      exitin:["",],
      searchempname:[""],
      editdate:[""]
      });
    this.getEmployeeList();
  }

  setonboarding(event:any){
    if(event.checked){
      this.ishideonbord = true;
    }else{
      this.ishideonbord = false;
    }
  }
  newHire() {
     this.router.navigate(["/ems/empInformation"],{state: {}});
    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    //   this.router.navigate(["/ems/empInformation"]));
  }

  editEmployee(id:any, data:any) {
   
    let empId=this.encriptPipe.transform(data.id.toString());

    this.router.navigate(["/ems/empInformation",{empId}])
 }

  getEmployeeList() {
    this.emsService.getEmployeeDirectoryList().subscribe((res: any) => {
      if (res.status && res.data.length != 0) {
        this.employeeList = res.data;
        console.log("dad-",this.employeeList)
        this.employeeFilteredList=this.employeeList;
     }
    })
  }
  applyFilter(event: Event) {
     const filterValue = (event.target as HTMLInputElement).value;
    let filterdata=this.employeeList.filter((m:any) =>
      m.ename.toString().toLowerCase().includes(filterValue.trim().toLowerCase())
      || m.designation.toString().toLowerCase().includes(filterValue.trim().toLowerCase())
    || m.location.toString().toLowerCase().includes(filterValue.trim().toLowerCase()));
      this.employeeFilteredList=filterdata;
      console.log("ghhh",this.employeeFilteredList)
  }
  search() {

  }
  clear() {
    this.ishideFilter = false;
  }

}
