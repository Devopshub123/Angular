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
  EM42 : any; /**Data saved successfully. */
  EM43  : any; /**Unable to save data. */
  EM65  : any; /**Induction status Updated sucessfully. */
  EM66: any; /**Unable to update induction status. */
  conductedByEmployeDataList: any = [];
  isEnable = false;
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
        conductBy: [[''],[Validators.required]],
        status:['']

      });
    this.inductionForm.get('department')?.valueChanges.subscribe((selectedValue: any) => {
      this.employeeList = [];
      this.conductedByEmployeDataList = [];
      this.EMS.getEmployeesListByDeptId(selectedValue).subscribe((data: { status: any; data: any; }) => {
        if (data.status) {
          this.isEnable = true;
          this.employeeList = data.data;
          }
       })
    })
  }


  edit(event: any, data: any) {
    this.isUpdate = true;
      this.inductionForm.controls.programType.setValue(data.program_id);
      this.inductionForm.controls.department.setValue(data.department_id);
      let emplist:any=[];
      let emp={};
      data.empids.forEach((e:any)=>{
            emp={
              "empid": e.empid,
              "employee_code": "",
              "empname": e.conductby
            }
           // this.inductionForm.controls.conductBy.(emp);
            emplist.push(emp);
            this.selectedEmployees.push(e.empid);
            this.inductionForm.controls.conductBy.value.push(emp);
        });
     // this.inductionForm.controls.conductBy.setValue(emplist);
      // this.employeeList.forEach((e: any)=>{
      //   e.empid = data.empids.empid;
      // })
  }

  save(event:any,info:any){
    if(this.inductionForm.valid) {
       this.inductionForm.controls.pid.value = info.id;
      this.submit();
    }
  }

  canceledit(event: any, id: any) {
    this.isUpdate = false;
    this.ngOnInit();
  }


  submit() {
    if (this.inductionForm.valid) {
      let data = {
        'id': null,
        'program_id': this.inductionForm.controls.programType.value,
        'department_id': this.inductionForm.controls.department.value,
        'status': 1,
        'empids': this.selectedEmployees,
        'actionby': this.userSession.id,
        'companyName':this.companyDBName
      }

      this.EMS.setInductionConductedBy(data).subscribe((result: any) => {
        if (result.status) {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data:this.EM42
          });
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["Admin/Induction-ConductedBy"]));
        } else {
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
    if (event.isUserInput && event.source.selected == false) {
      let index = this.selectedEmployees.indexOf(event.source.value.empid);
      this.selectedEmployees.splice(index, 1)

    } else {
      this.selectedEmployees.push(event.source.value.empid);
      console.log("val--", this.selectedEmployees)
    }
  }

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
        }else if (e.code == "EM42") {
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
    if (this.dataSource.data.length > 20) {
      return [5, 10, 20, this.dataSource.data.length];
    }
    else {
      return [5, 10, 20];
    }
  }
  close(){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/Admin/Induction-ConductedBy"]));
  }
}