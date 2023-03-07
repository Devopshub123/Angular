import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormGroup, FormBuilder,FormArray,FormControl, Validators, AbstractControl } from '@angular/forms';
import { Component, OnInit,ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PayrollService } from '../../payroll.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog'; 
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
@Component({
  selector: 'app-pay-group',
  templateUrl: './pay-group.component.html',
  styleUrls: ['./pay-group.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ])
  ]
})
export class PayGroupComponent implements OnInit {
  payGroupRequestForm!: FormGroup;  
  isEarnings:boolean = true;
  earningData:any=[];
  deductionData:any=[];
  isDeductions:boolean = true;
  expandedElement:any;
  messagesList:any;
  PR47:any;
  PR48:any;
  arrayValue:any=[];
  pageLoading = true;
  get earningsFormArray() {
    return this.payGroupRequestForm.controls.earnings as FormArray;
  }
  get deductionFormArray() {
    return this.payGroupRequestForm.controls.deducts as FormArray;
  }
  constructor(private router:Router,private formBuilder: FormBuilder,private PR:PayrollService,private dialog: MatDialog) { 
    this.getpayrollsections();
  }
  displayedColumns: string[] = ['Name', 'Start_Range','End_Range','Earnings','Deductions','Status','Action'];
  // dataSource = ELEMENT_DATA;
  dataSource: MatTableDataSource<any> = <any>[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  
  ngOnInit(): void {
    this.getpayrollincomegroups();
    this.getMessagesList();
    this.payGroupRequestForm = this.formBuilder.group(
      {
        payNameGroup: ["", Validators.required],
        start_range:  [""],
        end_range:  [""],
        descriptions: [""],
        status: [""],
        basic:[""],
        hra:[""],
        conveyance:[""],
        fixedAllowance:[""],
        esi:[""],
        tds:[""],
        loanDeductions:[""],
        insurance:[""],
        earnings: new FormArray([]),
        deducts: new FormArray([])

      });
  }
  private addCheckboxes() {
    this.earningData.forEach(() => this.earningsFormArray.push(new FormControl(false)));
  }
  private adddeductCheckboxes() {
    this.deductionData.forEach(() => this.deductionFormArray.push(new FormControl(false)));
  }
  getdeductionsalarycomponent(data:any){
    this.PR.getdeductionsalarycomponent(data).subscribe((info:any)=>{
      if(info.status && info.data.length !=0) {
        this.deductionData=info.data
        this.adddeductCheckboxes();
      }
    })

  }
  getearningsalarycomponent(data:any){   
    this.PR.getearningsalarycomponent(data).subscribe((info:any)=>{
      if(info.status && info.data.length !=0) {
        this.earningData = info.data 
        this.addCheckboxes();
      }
    })
  }
   /** Get payroll section master*/
   getpayrollsections(){
    this.PR.getpayrollsections().subscribe((info:any)=>{
      if(info.status && info.data.length !=0) {
        for(let i=0;i< info.data.length;i++){
          if(info.data[i].section == 'Earnings'){
            this.getearningsalarycomponent(info.data[i].id);
          }
          else if(info.data[i].section == 'Deductions'){
            this.getdeductionsalarycomponent(info.data[i].id);
          }          
        }
      }
    })

  }
  onRequestClick(){     
    this.router.navigate(["/Payroll/PayGroupRequest"],{state: {}}); 
  }
  onViewClick(element:any){  
    // this.payGroupRequestForm.setValue([1,2,3]);
    // this.earningsFormArray.setValue([1,5])
    // let data = [1,2]
    // this.payGroupRequestForm.value.earnings
    // .map((checked:any, i:any) => checked ? data[i]: null)
    // .filter((v:any) => v !== null);
    // this.payGroupRequestForm.value.earnings.filter(data[i] => !data[i])
   /* this.router.navigate(["/Payroll/InvestmentRequest"],{state: {userData:element}}); */
  }
  validateExpansion(element:any)
  {
      if(element == 'earnings')
      {
        this.isEarnings = !this.isEarnings;
      }
      else if(element == 'deductions')
      {
        this.isDeductions = !this.isDeductions;
      }      
  }
   /**Set Paygroup */
   setPayGroup(){  
    const earningselectedIds = this.payGroupRequestForm.value.earnings
      .map((checked:any, i:any) => checked ? this.earningData[i].id : null)
      .filter((v:any) => v !== null);
    const deductselectedIds = this.payGroupRequestForm.value.deducts
    .map((checked:any, i:any) => checked ? this.deductionData[i].id : null)
    .filter((v:any) => v !== null);   
    if(this.payGroupRequestForm.valid){   
      let data ={
        group:this.payGroupRequestForm.controls.payNameGroup.value,
        from:this.payGroupRequestForm.controls.start_range.value,
        to:this.payGroupRequestForm.controls.end_range.value,
        status:this.payGroupRequestForm.controls.status.value,
        description:this.payGroupRequestForm.controls.descriptions.value,
        component:earningselectedIds.concat(deductselectedIds)
      }
      this.PR.setincomegroup(data).subscribe((info:any)=>{
        if(info.status){
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/Payroll/PayGroup"])); 
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: this.PR47
          });         
        }else {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: this.PR48
          });  
        }
      })      
    }   
  }
  /** */
  getpayrollincomegroups(){
    this.PR.getpayrollincomegroups().subscribe((info:any)=>{
      if(info.status && info.data.length !=0) {
        // this.dataSource = info.data
        this.dataSource = new MatTableDataSource(info.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageLoading = false;
        // if (info.data.length > 20) {
        //   this.pageLoading = false;
        // }
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
  cancel(){}
  navigate(data:any){
    console.log("data",data)
    this.router.navigate(['/Payroll/Earnings'],{state:{data:data}});
  }

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
          if (e.code == "PR47") {
            this.PR47 = e.message
          } else if (e.code == "PR48") {
            this.PR48 =e.message
          }
        
        })
  
      }
  
    })
  }
}
