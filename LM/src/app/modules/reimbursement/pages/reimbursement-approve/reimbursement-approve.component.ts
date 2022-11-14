import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup,FormControl,Validators, FormBuilder, AbstractControl, FormArray, ValidationErrors, ValidatorFn} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from 'src/app/services/login.service';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import * as _moment from 'moment';
import { ComfirmationDialogComponent } from 'src/app/pages/comfirmation-dialog/comfirmation-dialog.component';
import { EmsService } from 'src/app/modules/ems/ems.service';
import { MatSelect } from '@angular/material/select';
const moment =  _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
@Component({
  selector: 'app-reimbursement-approve',
  templateUrl: './reimbursement-approve.component.html',
  styleUrls: ['./reimbursement-approve.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ReimbursementApproveComponent implements OnInit {
  reimbursementForm:any= FormGroup;
  maxDate = new Date();
  isadd:boolean=false;
  isview:boolean=true;
  isEdit:boolean=true;
  isSave:boolean=false;
  ishide:boolean =false;
  ischecked:boolean=false;
  pipe = new DatePipe('en-US');
  page = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [10, 25, 50, 'All'];
  displayedColumns: string[] = ['sno','id','date','amount','approvedAmount','status','action'];
  dataSource: MatTableDataSource<any>=<any>[];

  pageLoading=true;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  userSession: any;
  companyDBName: any = environment.dbName;
  messagesDataList: any = [];
  EM1: any;
  EM2: any;
  EM3: any;
  EM42: any;
  EM43: any;
  EM13: any;
  EM14: any;
  EM18: any;
  constructor(private formBuilder: FormBuilder, private router: Router, private LM: CompanySettingService,
    private dialog: MatDialog, private ts: LoginService,private emsService: EmsService) { }

    reimbursementTypeList: any = [
    { id: 1, name: "Certificate" },
    { id: 2, name: "Learning" },
    { id: 3, name: "Fuel" },
    { id: 4, name: "Driver" },
    { id: 5, name: "Telephone" },
    { id: 6, name: "Travel Allowance" },
    { id: 7, name: "Vehicle Maintenance" },
    { id: 7, name: "Team Lunch" },
    ];
    employesList: any = [
      { id: 1, name: "Prasad" },
      { id: 2, name: "Vamsi" },
      { id: 3, name: "Venkat Reddy" },
      { id: 4, name: "Rakesh" },
      { id: 5, name: "Balakrishna" },
      { id: 6, name: "Srikanth" },
      { id: 7, name: "Pawan" },
      { id: 7, name: "Raghu" },
      ];
  filename: any;
  file: any;
  fileURL: any;
  isedit: boolean = false;
  editFileName: any;
  isFile: boolean = true;
  formData: any;
  selectedBranch: any = [];
  isEmployees: boolean = false;
  isinvoice: boolean = false;
  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.reimbursementForm=this.formBuilder.group(
      {
      empId: [""],
      empName: ["",Validators.required],
      reimbursementType: ["",Validators.required],
      requestDate: [""],
      billDate: ["",Validators.required],
      billNum: [""],
      billAmount: ["",Validators.required],
      approveAmount: ["",Validators.required],
      employess: [""],
        attachedFile: [""],
        itemdata: this.formBuilder.array([])

      });
      this.reimbursementForm.get('reimbursementType')?.valueChanges.subscribe((selectedValue: number) => {
        if (selectedValue == 1) {
          this.isinvoice = true;
          this.isEmployees = false;
         }
        else if(selectedValue == 7){
          this.isEmployees = true;
          this.isinvoice = true;
        } else {
          this.isEmployees = false;
          this.isinvoice = false;
        }
      })
    this.getMessagesList();
  }

  add(){
    this.isview = false;
    this.isadd = true;
  }
  submit() {
    
  }
  /**Search functionality */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }

  getPageSizes(): number[] {
    if (this.dataSource.data.length > 20) {
      return [5, 10, 20, this.dataSource.data.length];
    }
    else {

     return [5, 10, 20];
    }
  }
  selectAll(select: MatSelect, values:any, array:any) {
    this.ishide = true;
this.ischecked = true;
select.value = values;
array = values;
this.reimbursementForm.controls.employess.setValue(array)

  }
  itemdata(): FormArray {
    return this.reimbursementForm.get("edu") as FormArray
  }

deselectAll(select: MatSelect) {
this.ishide = false;
this.ischecked = false
this.selectedBranch = [];
select.value = [];
this.reimbursementForm.controls.employess.setValue('')

}


  onSelectFile(event: any) {
    if (event.target.files.length != 0) {
      if (event.target.files[0].size <= 2097152) {
        this.file = event.target.files[0];
        var pdf = this.file.name.split('.');
        if (pdf[pdf.length - 1] == 'pdf' || pdf[pdf.length - 1] == 'jpg' || pdf[pdf.length - 1] == 'png') {
          this.isFile = true;
          this.formData.append('file', this.file, this.file.name);
        } else {
          this.isFile = false;
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: this.EM13
          });
         }
      } else {
        this.isFile = false;
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
          data: this.EM14
        });
      }
    } else {
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position: { top: `70px` },
        disableClose: true,
        data: this.EM18
      });
      // th
    }
  }
  deleteIcon(){
    this.isedit = false;
    this.reimbursementForm.controls.attachedFile.setValue('')
  }

  delete() {
    this.isedit = false;
  }
  cancel(){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/Reimbursement/ReimbursementRequest"]));
  }

  getMessagesList() {
    let data =
    {
      "code": null,
      "pagenumber": 1,
      "pagesize": 100
    }
    this.emsService.getMessagesListApi(data).subscribe((res: any) => {
      if (res.status) {
        this.messagesDataList = res.data;
        this.messagesDataList.forEach((e: any) => {
          if (e.code == "EM1") {
            this.EM1 = e.message
          } else if (e.code == "EM2") {
            this.EM2 = e.message
          } else if (e.code == "EM3") {
            this.EM3 = e.message
          } else if (e.code == "EM42") {
            this.EM42 = e.message
          } else if (e.code == "EM43") {
            this.EM43 = e.message
          }
          
        })
      } else {
        this.messagesDataList = [];
      }

    })
  }

  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }
  
numberOnly(event: any): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}

alphabetKeyPress(event: any,) {
  const pattern = /[a-zA-Z ]/;
  let inputChar = String.fromCharCode(event.charCode);
  if (event.keyCode != 8 && !pattern.test(inputChar)) {
    event.preventDefault();
  }
}
}