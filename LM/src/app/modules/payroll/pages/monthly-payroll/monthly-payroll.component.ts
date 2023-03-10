import {SelectionModel} from '@angular/cdk/collections';
import {Component,OnInit,ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {FormBuilder,FormGroup,FormArray,FormControl,ValidatorFn,Validators} from '@angular/forms';
import { PayrollService } from '../../payroll.service';
import { MatDialog } from '@angular/material/dialog'; 
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { ignoreElements } from 'rxjs/operators';


/**
 * @title Table with selection
 */

@Component({
  selector: 'app-monthly-payroll',
  templateUrl: './monthly-payroll.component.html',
  styleUrls: ['./monthly-payroll.component.scss']
})
export class MonthlyPayrollComponent implements OnInit {
  monthlyPayrollForm!: FormGroup;
  userSession: any;
  financeyears:any=[];
  monthyear:any=[];
  year_value:any;
  month_value:any;
  monthforemplist:any;
  yearforemplist:any;
  arrdata:any=[];
  hide:boolean=false;
  messagesList:any=[];
  PR27:any;
  PR28:any;
  PR46:any;
  
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // displayedColumns: string[] = ['select','position','empid',  'name', 'designation', 'worklocation'];
  displayedColumns: string[] = ['select','empid',  'name', 'designation', 'worklocation'];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);

  constructor(private router: Router,private formBuilder: FormBuilder,private PR:PayrollService,private dialog: MatDialog,) {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
   }

  ngOnInit(): void {
    this.getFinancialYears();
    this.getMessagesList();
    this.monthlyPayrollForm = this.formBuilder.group(
      {
        Month_year: ["",],
        financial_year:  ["", ],
      });
      this.monthlyPayrollForm.get('financial_year')?.valueChanges.subscribe((selectedValue:any) => {
        // this.yearforemplist = selectedValue;
        this.Month_Year(selectedValue);
      })
      this.monthlyPayrollForm.get('Month_year')?.valueChanges.subscribe((selectedValue:any) => {
        this.month_value = selectedValue;
        for(let m=0;this.monthyear.length;m++){
          if(this.monthyear[m].month_value ==  this.month_value ){
            this.yearforemplist = this.monthyear[m].year_value;
            break;
          }
        }
        this.getEmployeeListForSalaryProcessing(this.yearforemplist,this.month_value);
      })
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  logSelection() {
    this.selection.selected.forEach((s:any) => console.log(s.employee_code));
  }
  /** getFinancialYears Data*/
  getFinancialYears(){
    this.PR.getFinancialYears().subscribe((result:any)=>{
      if(result.status && result.data.length>0){
        this.financeyears = result.data;
      }
      else{
        this.financeyears=[]
      }
    })
  }
  /**Month and Year Data */
  Month_Year(data:any){
    // this.monthyear=[{"month_year":"October-2022","return_value":"1"},{"month_year":"November-2022","return_value":"2"}]
    this.PR.Month_Year(data).subscribe((result:any)=>{
      if(result.status && result.data.length>0){
        this.monthyear = result.data;
      }
      else{
        this.monthyear=[]
      }
    })
  }  
/**Caluculate salary for selected employees */
caluculateMonthlySalary(){
  this.arrdata = []
 this.selection.selected.forEach((s:any) => this.arrdata.push(s.id));
 if(this.arrdata.length>0){
  if(this.monthlyPayrollForm.valid){
    for(let i=0;i<this.monthyear.length;i++){
      if(this.monthyear[i].month_value == this.month_value){
        this.year_value = this.monthyear[i].year_value;
      }
    }
    let data={
      year_value:Number(this.year_value),
      month_value:this.month_value,
      financial_year_value:this.monthlyPayrollForm.controls.financial_year.value,
      created_by_value:this.userSession.id,
      employee_list:this.arrdata
      // employee_list:this.dataSource.data.length == this.arrdata.length?null:this.arrdata
    }
    console.log("data,",data)
    this.PR.updateMonthlySalary(data).subscribe((result:any)=>{
      if(result.status){
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/Payroll/MonthlyPayroll"])); 
         let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: this.PR27
        });
      }
      else{
         let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: this.PR28
        });
      }
    
    })

  }

 }
 else{
  let dialogRef = this.dialog.open(ReusableDialogComponent, {
    position:{top:`70px`},
    disableClose: true,
    data:this.PR46
  });
 }
  
  
}
/**Cancel requests */
cancel(){
  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    this.router.navigate(["/Payroll/MonthlyPayroll"]));  
}      
/**Success and error messages list */
getMessagesList() {
  let data =
    {
      "code": null,
      "pagenumber":1,
      "pagesize":1000
    }
  this.PR.getErrorMessages(null,1,1000).subscribe((res:any)=>{
    if(res.status && res.data && res.data.length >0) {
      this.messagesList = res.data;
      this.messagesList.forEach((e: any) => {
        if (e.code == "PR27") {
          this.PR27 = e.message
        } else if (e.code == "PR28") {
          this.PR28 =e.message
        }
        else if (e.code == "PR46") {
          this.PR46 =e.message
        }
      })

    }

  })
}
 /**getEmployees List for caluculate monthly salary */ 
 getEmployeeListForSalaryProcessing(year:any,month:any){
  this.PR.getEmployeeListForSalaryProcessing(year,month).subscribe((result:any)=>{
    if(result.status && result.data.length>0){
      this.dataSource = new MatTableDataSource<any>(result.data);
      this.hide = true;
    }
    else{
      this.dataSource = new MatTableDataSource<any>([]);
    }
  })
}   
  
 
}
