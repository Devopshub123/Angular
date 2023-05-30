import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup,  Validators, FormBuilder, ValidationErrors, ValidatorFn, AbstractControl,  } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as _moment from 'moment';
import { AdminService } from 'src/app/modules/admin/admin.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
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
  selector: 'app-shift-change-request',
  templateUrl: './shift-change-request.component.html',
  styleUrls: ['./shift-change-request.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ShiftChangeRequestComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private router: Router,
    private adminService: AdminService,public spinner:NgxSpinnerService) {
     }
  shiftRequestForm: any = FormGroup;
  userSession: any;
  pipe = new DatePipe('en-US');
  maxDate = new Date();
  minDate = new Date();
  toShiftList:any=[]
  messagesDataList: any = [];
  requiredField: any;
  requiredOption: any;
  dataSave: any;
  dataNotSave: any;
  isvalid: boolean = false;
  EM43: any;
  EM55: any;
  companyDBName: any = environment.dbName;
 
  displayedColumns: string[] = ['sno','fromshift','toshift','fromdate','todate','status','action'];
  dataSource : MatTableDataSource<any> = <any>[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  pageLoading = true;
  isNew: boolean = false;
  isShow: boolean = true;
  isUpdate: boolean = false;
  todayWithPipe: any;
  ngOnInit(): void {
    this.todayWithPipe = this.pipe.transform(Date.now(), 'dd-MM-yyyy');
    this.shiftRequestForm=this.formBuilder.group(
      {
      appliedDate: [{ value: this.todayWithPipe, disabled: true }],
      currentShift: [{ value: "", disabled: true }],
      fromShift: ["",[Validators.required]],
      toShift: ["",[Validators.required]],
      fromDate: ["",[Validators.required]],
      toDate: ["",[Validators.required]],
      reason: ["",[Validators.required]],

      });
    this.getMessagesList();

  }

  newRequest() {
      this.isNew = true;
      this.isShow = false;
      this.isUpdate = false;
   
  }
  submit() {

    this.saveShiftRequest()
  }
  saveShiftRequest() {
    if (this.shiftRequestForm.valid) {
     this.spinner.show()
      let data = {
       };


    } else {
      this.spinner.hide();
      }
    
  }
  editRequest(id: any, data: any) {

  }
  getShiftRequestList() {

  }

  
  deleteRequest(id:any, data:any) {

  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
     if (this.dataSource.paginator) {
       this.dataSource.paginator.firstPage();
    }
  }
  cancel() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    this.router.navigate(["/Attendance/Shift-change-request"]));
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
        if (e.code == "EM1") {
         this.requiredField = e.message
        } else if (e.code == "EM2") {
          this.requiredOption =e.message
        }else if (e.code == "EM43") {
          this.EM43 =e.message
        }else if (e.code == "EM55") {
          this.EM55 =e.message
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
  // 

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

