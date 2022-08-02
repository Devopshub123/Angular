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
  constructor(private formBuilder: FormBuilder,private router: Router,private LM:CompanySettingService,private dialog: MatDialog) { }
  
  selectAll(select: MatSelect, values:any, array:any) {
    this.ishide = true;
    this.ischecked = true;
    select.value = values;
    array = values;
    // console.log(this.selectedYears); // selectedYears is still undefined
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
    this.LM.getactiveWorkLocation({id:null,companyName:'boon_client'}).subscribe((result)=>{
      this.worklocationDetails=result.data;
      console.log(this.worklocationDetails)
    })

  }
  itemdata(): FormArray {
    return this.HolidayForm.get("edu") as FormArray
  }
  submit(){
    console.log(this.HolidayForm.controls.holiday.value)
    console.log(this.HolidayForm.controls.branch.value)
    console.log(this.HolidayForm.controls.holiday.value)
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
    console.log(this.selecteditems)
    // if(this.HolidayForm.controls.holiday.value !== null && this.holidays.holidayName !== null ){}
    this.LM.setHolidays(this.selecteditems,'boon_client').subscribe((data) => {

      if(data.status){
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/Admin/Holidays"]));
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: 'Holiday added successfully'
        });
       
        

      }else {
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: 'Unable to add holiday'
        });
        
        // Swal.fire({title:data.message,color:"red",showCloseButton: true});
      }
    })
  }
  add(){
    this.isview = false;
    this.isadd = true;

  }
  /**Search functionality */
  applyFilter(event: Event) {
    console.log(event)
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    
  }
  getHolidays(year:any,locationId:any){
    
    this.LM.getHolidays(year,locationId,1,100).subscribe((result)=>{
      console.log(result.data)
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
          data: 'Holiday deleted successfully'
        });
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/Admin/Holidays"]));
      }else {
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: 'Unable to to delete holiday'
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
    // this.HolidayForm.controls.department.setValue('');
    console.log(row)
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
    console.log(data)
    this.LM.putHolidays(data, 'boon_client').subscribe((data) => {
    
      this.isadd= true;
      if (data.status) {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/Admin/Holidays"]));
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: 'Holiday updated successfully'
        });
        
         
        

      } else {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/Admin/Holidays"]));
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: 'Unable to to update holiday'
        });
        
        // Swal.fire({title:this.msgLM49,color:"red",showCloseButton: true});
      }
    })
  }


}
