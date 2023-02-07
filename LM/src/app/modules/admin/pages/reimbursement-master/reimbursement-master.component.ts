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
  selector: 'app-reimbursement-master',
  templateUrl: './reimbursement-master.component.html',
  styleUrls: ['./reimbursement-master.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ReimbursementMasterComponent implements OnInit {
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
  displayedColumns: string[] = ['sno','reimbursement','amount','department','date','status','action'];
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
  constructor(private formBuilder: FormBuilder, private router: Router, private LM: CompanySettingService,
    private dialog: MatDialog, private ts: LoginService,private emsService: EmsService) { }


  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.reimbursementForm=this.formBuilder.group(
      {
      reimbursementType: ["",[Validators.required,this.noWhitespaceValidator()]],
      nameInSlip: ["",this.noWhitespaceValidator()],
      amount: ["",Validators.required],
      date: ["",Validators.required],
      status: ["",Validators.required],

      });
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


  cancel(){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/Admin/Reimbursement"]));
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
