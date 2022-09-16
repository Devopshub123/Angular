import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup,FormControl,Validators, FormBuilder, AbstractControl, FormArray} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PopupComponent,PopupConfig } from '../../../../pages/popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { OnlyNumberDirective } from 'src/app/custom-directive/only-number.directive';
import { LoginService } from 'src/app/services/login.service';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSelect } from '@angular/material/select';
import { analyzeAndValidateNgModules } from '@angular/compiler';
@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.scss']
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
  msgLM1:any;
  msgLM2:any;
  msgLM3:any;
  msgLM23:any
  msgLM49:any;
  msgLM48:any;
  msgLM47:any;
  msgLM69:any;
  msgLM106:any;
  msgLM105:any;
  page = 1;
  count = 0;
  tableSize = 10;
  tableSizes = [10, 25, 50, 'All'];
  displayedColumns: string[] = ['holiday','date','day','location','action'];
  dataSource: MatTableDataSource<any>=<any>[];

  pageLoading=true;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  constructor(private formBuilder: FormBuilder,private router: Router,private LM:CompanySettingService,private dialog: MatDialog,private ts:LoginService) { }

  selectAll(select: MatSelect, values:any, array:any) {
    this.ishide = true;
    this.ischecked = true;
    select.value = values;
    array = values;
  }

  deselectAll(select: MatSelect) {
    this.ishide = false;
    this.ischecked = false
    this.selectedBranch = [];
    select.value = [];
  }
  // equals(objOne:any, objTwo:any) {
  //   if (typeof objOne !== 'undefined' && typeof objTwo !== 'undefined') {
  //     // return objOne.id === objTwo.id;
  //   }
  // }
  ngOnInit(): void {
    this.getErrorMessages('LM1')
    this.getErrorMessages('LM2')
    this.getErrorMessages('LM3')
    this.getErrorMessages('LM23')
    this.getErrorMessages('LM47')
    this.getErrorMessages('LM48')
    this.getErrorMessages('LM49')
    this.getErrorMessages('LM69')
    this.getErrorMessages('LM105')
    this.getErrorMessages('LM106')
    this.getWorkLocation();
    this.getHolidays(null,null);
    this.HolidayForm=this.formBuilder.group(
      {
      holiday: ["",Validators.required],
      date: ["",Validators.required],
      branch: ["",Validators.required],
      itemdata: this.formBuilder.array([])
    });
  }
  getWorkLocation(){
    this.LM.getactiveWorkLocation({id:null,companyName:'spryple_sanela'}).subscribe((result)=>{
      this.worklocationDetails=result.data;
    })

  }
  itemdata(): FormArray {
    return this.HolidayForm.get("edu") as FormArray
  }
  submit(){
    let location = this.HolidayForm.controls.branch.value;
    // let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    location.forEach((e:any) => {
      this.selecteditems.push(({
        id:'',
        description: this.HolidayForm.controls.holiday.value,
        date: this.HolidayForm.controls.date.value,
        location:e.city

      }));
    });
    // if(this.HolidayForm.controls.holiday.value !== null && this.holidays.holidayName !== null ){}
    this.LM.setHolidays(this.selecteditems,'spryple_sanela').subscribe((data) => {

      if(data.status){
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/Admin/Holidays"]));
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: this.msgLM69
        });



      }else {
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: this.msgLM47
        });

        // Swal.fire({title:data.message,color:"red",showCloseButton: true});
      }
    })
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
  delete(event:any,holidayId:any){

    this.LM.deleteHoliday(holidayId).subscribe(data=>{

      if(data.status){
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: this.msgLM106
        });
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/Admin/Holidays"]));
      }else {
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: this.msgLM48
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
    this.LM.putHolidays(data, 'spryple_sanela').subscribe((data) => {

      this.isadd= true;
      if (data.status) {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/Admin/Holidays"]));
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: this.msgLM105
        });




      } else {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/Admin/Holidays"]));
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: this.msgLM49
        });

        // Swal.fire({title:this.msgLM49,color:"red",showCloseButton: true});
      }
    })
  }
  getErrorMessages(errorCode:any) {

    this.ts.getErrorMessages(errorCode,1,1).subscribe((result)=>{

      if(result.status && errorCode == 'LM1')
      {
        this.msgLM1 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM2')
      {
        this.msgLM2 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM3')
      {
        this.msgLM3 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM69')
      {
        this.msgLM69 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM49')
      {
        this.msgLM49 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM47')
      {
        this.msgLM47 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM50')
      {
        this.msgLM48 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM105')
      {
        this.msgLM105 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM106')
      {
        this.msgLM106 = result.data[0].errormessage
      }

    })
  }


}
