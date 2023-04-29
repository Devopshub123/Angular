import { Component, ElementRef, OnInit, ViewChild  } from '@angular/core';
import { FormGroup,FormControl,Validators, FormBuilder, AbstractControl, FormArray, ValidatorFn, ValidationErrors} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {EmsService} from '../../ems.service'
import {AdminService} from'../../../admin/admin.service';
import {ReusableDialogComponent} from '../../../../pages/reusable-dialog/reusable-dialog.component'
import { CompanySettingService } from 'src/app/services/companysetting.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-induction-conducted-by-master',
  templateUrl: './induction-conducted-by-master.component.html',
  styleUrls: ['./induction-conducted-by-master.component.scss']
})
export class InductionConductedByMasterComponent implements OnInit {
  inductionForm:any= FormGroup;
  isUpdate: boolean = false;

  displayedColumns: string[] = ['sno', 'programtype', 'department', 'employee', 'status', 'action'];
  dataSource: MatTableDataSource<any>=<any>[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  userSession:any;
  companyDBName:any = environment.dbName;
   availableDepartments: any = [];
  availableprogramtypes: any = [];
  employeeList: any = [];
  array: any = [];
  flag: boolean = true;
  constructor(private dialog: MatDialog, private formBuilder: FormBuilder,
    private companyServices: CompanySettingService, private router: Router,
    private EMS: EmsService, private adminService: AdminService) { }
  pageLoading = true;
  searchTextboxControl = new FormControl();
  selectedEmployees: any = [];
  deptId: any;
  statusList: any;
  messagesDataList: any = [];
  EM2: any; /**Please select an option. */
  EM5 : any; /**Record already existed. */
  EM7 : any; /**Updated successfully. */
  EM8 : any; /**Unable to updated,Please try again later. */
  EM41 : any; /**Data saved successfully. */
  EM42 : any; /**Data saved successfully. */
  EM43  : any; /**Unable to save data. */
  EM65  : any; /**Induction status Updated sucessfully. */
  EM66: any; /**Unable to update induction status. */
  conductedByEmployeDataList: any = [];
  isEnable = false;
  formControlList: any = [];
  isFormCtrlValid = false;
  ishide:boolean=true;
  conductId:any = null;
  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') ?? '');
    this.getProgramTypeMaster();
    this.getDepartmentsMaster();
    this.getstatuslist();
    this.getMessagesList();
    this.getConductedByEmployeesList();
    this.inductionForm=this.formBuilder.group(
      {
        programType: ["",[Validators.required]],
        department: ["",[Validators.required]],
        conductBy: [[],[Validators.required]],
        status:['']

      });
    this.inductionForm.get('department')?.valueChanges.subscribe((selectedValue: any) => {
      this.employeeList = [];
      this.conductedByEmployeDataList = [];
      // this.array=[];
      // this.selectedEmployees=[];
      this.EMS.getEmployeesListByDeptId(selectedValue).subscribe((data: { status: any; data: any; }) => {
        if (data.status) {
          this.isEnable = true;
          this.employeeList = data.data;
          this.getConductByElementsOnEdit();
          }
       })
    })
  }
  Add(){
    this.ishide = false;
  }

  edit(event: any, data: any) {
    this.isUpdate = true;
    this.ishide = false;
    this.selectedEmployees=[];
    this.array=[];
    this.flag = false;
    this.conductId = data.id;
    console.log(data)
    console.log(data.empids.length)
    this.inductionForm.controls.programType.setValue(data.program_id);
    this.inductionForm.controls.department.setValue(data.department_id);
    for(let i=0;i<data.empids.length;i++){
      this.array.push(data.empids[i]);
      this.selectedEmployees.push(data.empids[i].empid);
      // if(this.array.length ==0){
      //   this.array.push(data.empids[i]);
      //   console.log(this.array)
      //   this.selectedEmployees.push(data.empids[i].empid);
      // }
      // else if(this.array.length > 0 && !this.checkRoleExistence(data.empids[i].empid)){
      //   this.array.push(data.empids[i]);
      //   this.selectedEmployees.push(data.empids[i].empid);
      //   console.log(this.selectedEmployees)
      // }

    }
      // this.inductionForm.controls.programType.setValue(data.program_id);
      // this.inductionForm.controls.department.setValue(data.department_id);
      // this.inductionForm.controls.conductBy.setValue(this.array);

      let emplist:any=[];
      let emp={};

    //   data.empids.forEach((e:any)=>{
    //         emp={
    //           "empid": e.empid,
    //           "employee_code": "",
    //           "empname": e.conductby
    //         }
    //         emplist.push(emp);
    //         this.selectedEmployees.push(e.empid);
    //         this.inductionForm.controls.conductBy.value.push(emp);
    //     });

    //  this.inductionForm.controls.conductBy.setValue(emplist);
    //   this.employeeList.forEach((e: any)=>{
    //     e.empid = data.empids.empid;
    //   })
  }

  save(event:any,info:any){
    if (this.inductionForm.valid) {

       this.inductionForm.controls.pid.value = info.id;
      this.submit();
    }
  }

  canceledit(event: any, id: any) {
    this.isUpdate = false;
    this.ngOnInit();
  }


  submit() {
    // if (this.inductionForm.controls.conductBy.value[0] =="") {
    //   this.isFormCtrlValid = true;
    //&& this.inductionForm.controls.conductBy.value[0] !=""
    // }
    if (this.inductionForm.valid ) {
      let data = {
        'id': this.conductId,
        'program_id': this.inductionForm.controls.programType.value,
        'department_id': this.inductionForm.controls.department.value,
        'status': 1,
        'empids': this.selectedEmployees,
        'actionby': this.userSession.id,
        //'companyName':this.companyDBName
      }
      this.EMS.setInductionConductedBy(data).subscribe((result: any) => {
        if (result.status && result.data == 0) {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data:this.EM42
          });
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["Admin/Induction-ConductedBy"]));
        } else if (result.status && result.data == 1) {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data:this.EM41
          });
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["Admin/Induction-ConductedBy"]));
        }  else {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data:this.EM43
          });
         }

      });
    }
  }

  statusUpdate(status: any, info:any) {
      let data = {
        'id': info.id,
        'status': status,
      }
      this.EMS.updateInductionConductedByStatus(data).subscribe((result: any) => {
        if(result.status){
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["Admin/Induction-ConductedBy"]));
          this.dialog.open(ReusableDialogComponent, {
            position: {top: `70px`},
            disableClose: true,
            data: this.EM65
          });

        }else{
           this.dialog.open(ReusableDialogComponent, {
            position: {top: `70px`},
            disableClose: true,
            data: this.EM66
          });

        }
      })


  }

  getConductedByEmployeesList(){
    this.EMS.getConductedByEmployeesList().subscribe((result:any) => {
      if (result.status) {
        this.conductedByEmployeDataList = result.data;
        this.conductedByEmployeDataList.forEach((e: any)=>{
          e.empids = JSON.parse(e.empids);
        })
        this.dataSource = new MatTableDataSource(this.conductedByEmployeDataList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageLoading = false;
      }
    })
  }

  getProgramTypeMaster() {
    this.availableprogramtypes=[];
    this.companyServices
      .getMastertable('ems_programs_master', 1, 1, 1000, this.companyDBName)
      .subscribe((data) => {
        if (data.status) {
          this.availableprogramtypes = data.data;
        }
      });
  }

  getDepartmentsMaster() {
    this.companyServices
      .getMastertable('departmentsmaster', 1, 1, 1000, this.companyDBName)
      .subscribe((data) => {
        if (data.status) {
          this.availableDepartments = data.data;
        }
      });
  }

  openedSearch(e:any) {
    this.searchTextboxControl.patchValue('');
  }

  clearSearch(event:any) {
    event.stopPropagation();
    this.searchTextboxControl.patchValue('');
  }

  selectedEmployesChange(event: any) {
    // this.selectedEmployees=[];
    if (event.isUserInput && event.source.selected == false) {
      let index = this.selectedEmployees.indexOf(event.source.value);
      this.selectedEmployees.splice(index, 1)

    } else {
      if(!this.selectedEmployees.includes(event.source.value.empid)) {
        this.selectedEmployees.push(event.source.value.empid);
      }
       // this.inductionForm.controls.conductBy.setValue('');
      // this.inductionForm.controls.conductBy.setValue( this.selectedEmployees);
    }
  }
  // selectedEmployesChange(event: any) {
  //   if (event.isUserInput && event.source.selected == false) {
  //     let index = this.selectedEmployees.indexOf(event.source.value.empid);
  //     this.selectedEmployees.splice(index, 1)

  //   } else {
  //     this.selectedEmployees.push(event.source.value.empid);
  //     console.log("val--", this.selectedEmployees)
  //   }
  // }
  getstatuslist(){
    this.companyServices.getstatuslists().subscribe((result:any) => {
      if(result.status){
        this.statusList = result.data;
      }

    })
  }

  getMessagesList() {
    let data =
     {
       "code": null,
       "pagenumber":1,
       "pagesize":1000
    }

   this.adminService.getEMSMessagesList(data).subscribe((res:any)=>{
     if(res.status) {
       this.messagesDataList = res.data;
       this.messagesDataList.forEach((e: any) => {
        if (e.code == "EM2") {
         this.EM2 = e.message
        } else if (e.code == "EM5") {
          this.EM5 =e.message
        }else if (e.code == "EM7") {
          this.EM7 =e.message
        }else if (e.code == "EM8") {
          this.EM8 =e.message
        }else if (e.code == "EM41") {
          this.EM41 =e.message
        } else if (e.code == "EM42") {
          this.EM42 =e.message
        }else if (e.code == "EM43") {
          this.EM43 =e.message
        }else if (e.code == "EM65") {
          this.EM65 =e.message
        }else if (e.code == "EM66") {
          this.EM66 =e.message
        }
         })
     } else {
       this.messagesDataList = [];
     }

   })


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
  close(){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/Admin/Induction-ConductedBy"]));
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getConductByElementsOnEdit(){
 
    if(this.isUpdate) {
      this.inductionForm.controls.conductBy.setValue(this.array);
    }
  }
  compareFn(option1:any,option2:any){
    return option1.empid === option2.empid;
  }
  checkRoleExistence(roleParam: any):boolean {
    return this.array.some(  (conduct:any) => conduct.empid === roleParam);
  }
}
