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
import { MatSelect } from '@angular/material/select';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import * as _moment from 'moment';
import { ComfirmationDialogComponent } from 'src/app/pages/comfirmation-dialog/comfirmation-dialog.component';
import { EmsService } from 'src/app/modules/ems/ems.service';
// import {default as _rollupMoment} from 'moment';
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
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class HolidaysComponent implements OnInit {
  HolidayForm:any= FormGroup;
  selectedBranch:any=[];
  worklocationDetails:any=[];
  holidaysDetails:any=[];
  maxDate = new Date();
  isadd:boolean=false;
  isview:boolean=true;
  isEdit:boolean=true;
  isSave:boolean=false;
  ishide:boolean =false;
  ischecked:boolean=false;
  enable:any=null;
  selecteditems:any=[];
  msgEM1:any;
  msgEM2:any;
  msgEM126:any;
  msgEM127:any;
  msgEM125:any;
  msgEM114:any;
  msgEM116:any;
  msgEM115:any;
  pipe = new DatePipe('en-US');
  page = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [10, 25, 50, 'All'];
  displayedColumns: string[] = ['sno','holiday','date','day','location','action'];
  dataSource: MatTableDataSource<any>=<any>[];

  pageLoading=true;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  userSession: any;
  companyDBName:any = environment.dbName;
  constructor(private formBuilder: FormBuilder,private router: Router,
    private LM:CompanySettingService,private dialog: MatDialog,private ts:LoginService,
    private emsService:EmsService) { }

  selectAll(select: MatSelect, values:any, array:any) {
        this.ishide = true;
    this.ischecked = true;
    select.value = values;
    array = values;
    this.HolidayForm.controls.branch.setValue(array)


  }

  deselectAll(select: MatSelect) {
    this.ishide = false;
    this.ischecked = false
    this.selectedBranch = [];
    select.value = [];
    this.HolidayForm.controls.branch.setValue('')

  }
  // equals(objOne:any, objTwo:any) {
  //   if (typeof objOne !== 'undefined' && typeof objTwo !== 'undefined') {
  //     // return objOne.id === objTwo.id;
  //   }
  // }
  ngOnInit(): void {
    this.getMessages('EM1')
    this.getMessages('LM2')
    this.getMessages('LM3')
    this.getMessages('LM23')
    this.getMessages('EM125')
    this.getMessages('EM127')
    this.getMessages('EM126')
    this.getMessages('EM114')
    this.getMessages('EM115')
    this.getMessages('EM116')
    this.getWorkLocation();
    this.getHolidays(null,null);
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.HolidayForm=this.formBuilder.group(
      {
      holiday: ["",[Validators.required,this.noWhitespaceValidator()]],
      date: ["",Validators.required],
      branch: ["",Validators.required],
      itemdata: this.formBuilder.array([])
    });
  }
  getWorkLocation(){
    this.LM.getactiveWorkLocation({id:null,companyName:this.companyDBName}).subscribe((result)=>{
      this.worklocationDetails=result.data;
    })

  }
  itemdata(): FormArray {
    return this.HolidayForm.get("edu") as FormArray
  }
  submit() {
    console.log("hello")
    if (this.HolidayForm.valid) {
      let location = this.HolidayForm.controls.branch.value;
      // let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      location.forEach((e: any) => {
        this.selecteditems.push(({
          id: '',
          description: this.HolidayForm.controls.holiday.value,
          date: new Date(this.HolidayForm.controls.date.value),
          location: e.city,
          created_by: this.userSession.id,
          created_on: this.pipe.transform(new Date(), 'yyyy-MM-dd') + ' ' + this.pipe.transform(new Date(), 'HH:mm:ss'),

        }));
      });
      console.log("dataaa--",this.selecteditems)
      // if(this.HolidayForm.controls.holiday.value !== null && this.holidays.holidayName !== null ){}
      // this.LM.setHolidays(this.selecteditems, this.companyDBName).subscribe((data) => {

      //   if (data.status) {
      //     this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      //       this.router.navigate(["/Admin/Holidays"]));
      //     let dialogRef = this.dialog.open(ReusableDialogComponent, {
      //       position: { top: `70px` },
      //       disableClose: true,
      //       data: this.msgEM114
      //     });



      //   } else {
      //     let dialogRef = this.dialog.open(ReusableDialogComponent, {
      //       position: { top: `70px` },
      //       disableClose: true,
      //       data: this.msgEM125
      //     });

      //     // Swal.fire({title:data.message,color:"red",showCloseButton: true});
      //   }
      // })
    }

  }
  add(){
    this.isview = false;
    this.isadd = true;
    this.HolidayForm.controls.holiday.setValue()
    this.HolidayForm.controls.branch.value
    this.HolidayForm.controls.holiday.value

  }
  /**Search functionality */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }
  getHolidays(year:any,locationId:any){

    this.LM.getHolidays(year,locationId,1,100).subscribe((result)=>{
      if(result.status) {
        this.holidaysDetails = result.data;

        for (let i = 0; i < this.holidaysDetails.length; i++) {
          this.holidaysDetails[i].city = this.holidaysDetails[i].cityname;
          this.holidaysDetails[i].date = (this.holidaysDetails[i].date)
        }
        this.dataSource = new MatTableDataSource(this.holidaysDetails);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageLoading=false;
        // this.count = result.data.length >0?result.data[0].total:0;
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
  deleteHolidayPopup(event:any,holidayId:any) {
    let dialogRef = this.dialog.open(ComfirmationDialogComponent, {
      position: { top: `70px` },
      disableClose: true,
      data: { message: "Are you sure you want to delete ?", YES: 'YES', NO: 'NO' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'YES') {
        this.deleteHoliday(event,holidayId)
      }
    });
  }
  deleteHoliday(event:any,holidayId:any){

    this.LM.deleteHoliday(holidayId).subscribe(data=>{

      if(data.status){
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: this.msgEM116
        });
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/Admin/Holidays"]));
      }else {
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: this.msgEM127
        });



      }

    })
  }
  cancel(){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/Admin/Holidays"]));

  }
  edit(event:any,row:any){
    for(let i=0;i<this.worklocationDetails.length;i++){
      if(this.worklocationDetails[i].cityname == row.cityname){
        this.HolidayForm.controls.branch.setValue(this.worklocationDetails[i].city)
        break;
      }
    }
    this.enable = row.id;
    this.isEdit=false;
    this.isSave=true;
    this.HolidayForm.controls.holiday.setValue(row.description)
    // this.HolidayForm.controls.branch.setValue(row.cityname)
    this.HolidayForm.controls.date.setValue(new Date(row.date))
  }
  canceledit(event:any,id:any){
    this.enable = null;
    this.isEdit=true;
    this.isSave=false;
    this.ngOnInit();

  }
  update(event:any,id:any,holiday:any,city:any,date:any){
    let data ={
      description:holiday,
      id:id,
      branch:city,
      date:date

    }
    this.LM.putHolidays(data, this.companyDBName).subscribe((data) => {

      this.isadd= true;
      if (data.status) {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/Admin/Holidays"]));
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: this.msgEM115
        });




      } else {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/Admin/Holidays"]));
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: this.msgEM126
        });

        // Swal.fire({title:this.msgEM126,color:"red",showCloseButton: true});
      }
    })
  }
  getMessages(messageCode:any) {
    let data =
    {
      "code": messageCode,
      "pagenumber": 1,
      "pagesize": 1
    }
    this.emsService.getMessagesListApi(data).subscribe((result: any) => {
      if(result.status && messageCode == 'EM1')
      {
        this.msgEM1 = result.data[0].message
      }
      else if(result.status && messageCode == 'LM3')
      {
        this.msgEM2 = result.data[0].message
      }
      else if(result.status && messageCode == 'EM114')
      {
        this.msgEM114 = result.data[0].message
      }
      else if(result.status && messageCode == 'EM126')
      {
        this.msgEM126 = result.data[0].message
      }
      else if(result.status && messageCode == 'EM125')
      {
        this.msgEM125 = result.data[0].message
      }
      else if(result.status && messageCode == 'EM127')
      {
        this.msgEM127 = result.data[0].message
      }
      else if(result.status && messageCode == 'EM115')
      {
        this.msgEM115 = result.data[0].message
      }
      else if(result.status && messageCode == 'EM116')
      {
        this.msgEM116 = result.data[0].message
      }

    })
  }
  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
}

}
