import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormGroup, FormBuilder,FormArray,FormControl, Validators, AbstractControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PayrollService } from '../../payroll.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog'; 
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
// import { AssignPaygroupPopupComponent } from
import { AssignPaygroupPopupComponent } from '../assign-paygroup-popup/assign-paygroup-popup.component';
export interface PayGroupElement {
  Name: string;  
  Start_Range: string;
  End_Range: string;
  Earnings: string;
  Deductions: string;
  Status: string
  Action:string;  
}
const ELEMENT_DATA: PayGroupElement[] = [
  {Name: 'Grade 1', Start_Range: '0',End_Range:'20,000',Earnings:'Basic,HRA',Deductions:'ESI',Status:'Active',Action:'View'},
  {Name: 'Grade 2', Start_Range: '0',End_Range:'20,000',Earnings:'Basic,HRA',Deductions:'ESI',Status:'Active',Action:'View'},
  {Name: 'Grade 3', Start_Range: '0',End_Range:'20,000',Earnings:'Basic,HRA',Deductions:'ESI',Status:'Active',Action:'View'}
];
@Component({
  selector: 'app-assign-pay-group',
  templateUrl: './assign-pay-group.component.html',
  styleUrls: ['./assign-pay-group.component.scss'],
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
export class AssignPayGroupComponent implements OnInit {
  payGroupRequestForm!: FormGroup;
  Assignpaygroupform!: FormGroup; 
  isEarnings:boolean = true;
  earningData:any=[];
  deductionData:any=[];
  isDeductions:boolean = true;
  expandedElement:any;
  arrayValue:any=[];
  empdata:any=[];
  hide:boolean=false;
  activedata: any;
  paygroupid:any;
  messagesList:any=[];
  ComponentWiseValuesForPayGroupAssignment:any=[];
  arr:any=[];
  arrdata:any=[];
  PR1:any;
  PR30:any;
  PR31:any;
  PR32:any;
  PR35:any;
  PR36:any;

  constructor(private router:Router,private formBuilder: FormBuilder,private PR:PayrollService,private dialog: MatDialog) { 
    this.getEmployeesForAssignPaygroup();
  }
  displayedColumns: string[] = ['radio','Name', 'Start_Range','End_Range','Earnings','Deductions'];
  dataSource!: MatTableDataSource<any>;
  
  ngOnInit(): void {
    this.getMessagesList();
    this.Assignpaygroupform = this.formBuilder.group(
      {
        empName:["",Validators.required],
        CTC:["",Validators.required],
        payGroup:[""]
      })
  }
  /**For this CTC get paygroups */
  getPayGroupsForCtc(){
    if(this.Assignpaygroupform.controls.CTC.valid){
      this.PR.getPayGroupsForCtc(this.Assignpaygroupform.controls.CTC.value).subscribe((result:any)=>{
        if(result.status && result.data.length>0){
        this.dataSource = result.data
        this.hide=true;
        }
      })
    }
    
    
  }
  /**Employees list for assigning paygroup */
  getEmployeesForAssignPaygroup(){
    this.PR.getEmployeesForAssignPaygroup().subscribe((result:any)=>{
      if(result.status  && result.data.length>0){
        this.empdata =result.data;
      }
    })
  }
/** Active components values for paygroup*/
getActiveComponentsValuesForPayGroup(data:any){
  this.PR.getActiveComponentsValuesForPayGroup(data).subscribe((result:any)=>{
    if(result.status  && result.data.length>0){
      this.activedata = result.data;
    }
  })

}
data(element:any){
  console.log(element)
  this.paygroupid = element.id
  let data ={
    CTC:this.Assignpaygroupform.controls.CTC.value,
    paygroupid:element.id
  }
  this.PR.getComponentWiseValuesForPayGroupAssignment(data).subscribe((result:any)=>{
    if(result.status && result.data.length>0){
      for(let i=0;i<result.data.length;i++){
        if(result.data[i].component_type == "Earnings"){
          this.ComponentWiseValuesForPayGroupAssignment.push(result.data[i])
        }
      }
      let dialogRef = this.dialog.open(AssignPaygroupPopupComponent, {
    width: '600px',position:{top:`70px`},
    disableClose: true,
    data:result.data      
  });

    }
    

  })
} 
  /** */

  cancel(){  
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/Payroll/FinanceDashboard"]));    
  }
  /**assign paygroup for employee */
  
  assignPayGroup(){
    
    const componentsdata:any = {};
    for(let i=0;i<this.ComponentWiseValuesForPayGroupAssignment.length;i++){
      componentsdata[this.ComponentWiseValuesForPayGroupAssignment[i].component_short_name] = this.ComponentWiseValuesForPayGroupAssignment[i].amount_value;
    }
    let data ={
      empid:this.Assignpaygroupform.controls.empName.value,
      CTC:this.Assignpaygroupform.controls.CTC.value,
      paygroupid:this.paygroupid,
      data:componentsdata
    }
    this.PR.assignPayGroup(data).subscribe((result:any)=>{
      if(result.status){ 
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/Payroll/AssignPayGroup"]));
      // let dialogRef = this.dialog.open(AssignPaygroupPopupComponent, {
      //   width: '600px',position:{top:`70px`},
      //   disableClose: true,
      //   data:this.ComponentWiseValuesForPayGroupAssignment     
      // });
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position:{top:`70px`},
        disableClose: true,
        data: this.PR35
      });

      }
      else{
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: this.PR36
        });

      }
    })
  }
  getComponentWiseValuesForPayGroupAssignment(datas:any){
  console.log(datas)
  let data ={
    CTC:this.Assignpaygroupform.controls.CTC.value,
    paygroupid:datas.id
  }
  this.PR.getComponentWiseValuesForPayGroupAssignment(data).subscribe((result:any)=>{
    console.log(result);
    // let dialogRef = this.dialog.open(AssignPaygroupPopupComponent, {
  //   width: '390px',position:{top:`70px`},
  //   disableClose: true,
  //   data:datas      
  // });

  })
  
  

 }
 clear(){
  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
  this.router.navigate(["/Payroll/AssignPayGroup"]));  
  
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
          if (e.code == "PR1") {
            this.PR1 = e.message
          } else if (e.code == "PR30") {
            this.PR30 =e.message
          }
          else if (e.code == "PR31") {
            this.PR31 =e.message
          }
          else if (e.code == "PR32") {
            this.PR32 =e.message
          }
          else if (e.code == "PR35") {
            this.PR35 =e.message
          }
          else if (e.code == "PR35") {
            this.PR36 =e.message
          }
        })
      }

    })
  }
}



//  let dialogRef = this.dialog.open(ReusableDialogComponent, {
//           position:{top:`70px`},
//           disableClose: true,
//           data: 'Salary sheet for the selected employees is generated successfully.'
//         });