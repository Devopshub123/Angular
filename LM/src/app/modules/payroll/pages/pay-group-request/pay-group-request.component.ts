import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup,FormArray,FormControl,ValidatorFn,Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { PayrollService } from '../../payroll.service';
import { MatDialog } from '@angular/material/dialog'; 
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';

/**For dynamic form(earning and deduction) validation */
function minSelectedCheckboxes(min = 1) {
  const validator: any = (formArray: FormArray) => {
    const totalSelected = formArray.controls
      // get a list of checkbox values (boolean)
      .map((control:any) => control.value)
      // total up the number of checked checkboxes
      .reduce((prev, next) => next ? prev + next : prev, 0);
    // if the total is not greater than the minimum, return the error message
    return totalSelected >= min ? null : { required: true };
  };
  return validator;
}

@Component({
  selector: 'app-pay-group-request',
  templateUrl: './pay-group-request.component.html',
  styleUrls: ['./pay-group-request.component.scss']
})
export class PayGroupRequestComponent implements OnInit {
  payGroupRequestForm!: FormGroup;
  earningData:any=[];
  deductionData:any=[];
  minstartrange:any;
  minendrange:any;
  arrayValue:any=[];
  messagesList:any=[];
  payrollIncomeGroups:any;
  payGroupnameValidation:boolean=true;
  PR1:any;
  PR2:any;
  PR3:any;
  PR6:any;
  PR23:any;
  PR30:any;
  PR33:any;
  isEarnings:boolean = true;
  isDeductions:boolean = true;
  public maxValue: number = 9999999999999.00;
  public minValue: number = 1;
  get earningsFormArray() {
    return this.payGroupRequestForm.controls.earnings as FormArray;
  }
  get deductionFormArray() {
    return this.payGroupRequestForm.controls.deducts as FormArray;
  }
  constructor(private formBuilder: FormBuilder,private router: Router,private PR:PayrollService,private dialog: MatDialog) {
    this.getpayrollsections();
    this.getpayrollincomegroups();
  }

  ngOnInit(): void { 
    this.getMessagesList();
    this.payGroupRequestForm = this.formBuilder.group(
      {
        payNameGroup: ["", Validators.required],
        start_range:  ["", Validators.required],
        end_range:  ["", Validators.required],
        descriptions: [""],
        status: ["To Be Configured", Validators.required],
        basic:[""],
        hra:[""],
        conveyance:[""],
        fixedAllowance:[""],
        esi:[""], 
        tds:[""],
        loanDeductions:[""],
        insurance:[""],
        earnings: new FormArray([],minSelectedCheckboxes(1)),
        deducts: new FormArray([])

      });
      this.payGroupRequestForm.get('start_range')?.valueChanges.subscribe(selectedValue=>{
        this.minstartrange = selectedValue;
        console.log(selectedValue)
        this.payGroupRequestForm.controls.end_range.setValue('');
      })
      this.payGroupRequestForm.get('end_range')?.valueChanges.subscribe(selectedValue=>{
        console.log(selectedValue)
        this.minendrange = selectedValue;
      })
      
  }
  /**Add checkboxes for Earning components (dynamically added) */
  private addCheckboxes() {
    this.earningData.forEach(() => this.earningsFormArray.push(new FormControl(false)));
    // this.earningsFormArray.setValue([1])
  }
  /**Add checkboxes for deduct components (dynamically added) */
  private adddeductCheckboxes() {
    this.deductionData.forEach(() => this.deductionFormArray.push(new FormControl(false)));
  }
  /**get Deduction component details */
  getdeductionsalarycomponent(data:any){
    this.deductionData = [];
    this.PR.getdeductionsalarycomponent(data).subscribe((info:any)=>{
      if(info.status && info.data.length >0) {
        this.deductionData=info.data
        this.adddeductCheckboxes();
      }
    })

  }
  /**Get Earning component details */
  getearningsalarycomponent(data:any){   
    this.earningData = [];
    this.PR.getearningsalarycomponent(data).subscribe((info:any)=>{
      if(info.status && info.data.length >0) {
        for(let i=0;i<info.data.length;i++){
          if(info.data[i].component != 'Other Allowance'){
            this.earningData.push( info.data[i])
          }
        }
        // this.earningData = info.data 
        this.addCheckboxes();
      }
    })
  }
 /** Get payroll section master*/
  getpayrollsections(){
    this.PR.getpayrollsections().subscribe((info:any)=>{
      if(info.status && info.data.length >0) {
        console.log(info.data);
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
   /** */
   getpayrollincomegroups(){
    this.PR.getpayrollincomegroups().subscribe((info:any)=>{
      if(info.status && info.data.length !=0) {
        this.payrollIncomeGroups = info.data
      }
      else{
        this.payrollIncomeGroups =[]
      }
    })

  }
  /**Set Paygroup(Configure components) */
  setPayGroup(){
    // payNameGroup start_range end_range status
    if(this.payGroupRequestForm.controls.payNameGroup.valid && this.payGroupRequestForm.controls.status.valid&&this.payGroupRequestForm.controls.end_range.valid&& this.payGroupRequestForm.controls.start_range.valid){
      for(let i =0;i<this.payrollIncomeGroups.length;i++){
        if(this.payGroupRequestForm.controls.payNameGroup.value == this.payrollIncomeGroups[i].group_name){
          this.payGroupnameValidation =false;
          break;
        }
        else{
          this.payGroupnameValidation =true;
        }
      }
      
      if(this.minstartrange> this.minendrange){
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: this.PR33
        }); 
  
      }
     
      else{
        const earningselectedIds = this.payGroupRequestForm.value.earnings
        .map((checked:any, i:any) => checked ? this.earningData[i].id : null)
        .filter((v:any) => v !== null);
        const deductselectedIds = this.payGroupRequestForm.value.deducts
        .map((checked:any, i:any) => checked ? this.deductionData[i].id : null)
        .filter((v:any) => v !== null);
        console.log(earningselectedIds);
        console.log(deductselectedIds);
        console.log(this.payGroupRequestForm.valid)
        if(this.payGroupnameValidation){
          if(this.payGroupRequestForm.valid){   
            let data ={
              group:this.payGroupRequestForm.controls.payNameGroup.value,
              from:this.payGroupRequestForm.controls.start_range.value,
              to:this.payGroupRequestForm.controls.end_range.value,
              status:this.payGroupRequestForm.controls.status.value,
              description:this.payGroupRequestForm.controls.descriptions.value,
              component:earningselectedIds.concat(deductselectedIds)
            }
          console.log(data)
            this.PR.setincomegroup(data).subscribe((info:any)=>{
              if(info.status){
                this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
                  this.router.navigate(["/Payroll/PayGroup"])); 
                let dialogRef = this.dialog.open(ReusableDialogComponent, {
                  position:{top:`70px`},
                  disableClose: true,
                  data: this.PR2
                });
              }else {
                let dialogRef = this.dialog.open(ReusableDialogComponent, {
                  position:{top:`70px`},
                  disableClose: true,
                  data: this.PR3
                });  
              }
            })      
          }
          else{
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position:{top:`70px`},
              disableClose: true,
              data: this.PR6
            }); 
          }  
  
        }
        else{
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: this.PR23
          }); 
  
        } 
        
      } 

    }
     
  }
  cancel(){    
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/Payroll/PayGroup"])); 
    
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
          if (e.code == "PR2") {
            this.PR2 = e.message
          } else if (e.code == "PR3") {
            this.PR3 =e.message
          }
          else if (e.code == "PR6") {
            this.PR6 =e.message
          }
          else if (e.code == "PR23") {
            this.PR23 =e.message
          }
          else if (e.code == "PR1") {
            this.PR1 =e.message
          }
          else if (e.code == "PR30") {
            this.PR30 =e.message
          }
          else if (e.code == "PR33") {
            this.PR33 =e.message
          }
        })

      }

    })
  }
}
