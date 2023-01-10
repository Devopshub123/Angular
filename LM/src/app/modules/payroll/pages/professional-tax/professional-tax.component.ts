import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormGroup,FormControl,Validators, FormBuilder,FormArray, AbstractControl} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PayrollService } from '../../payroll.service';
import { CompanySettingService } from 'src/app/services/companysetting.service';

@Component({
  selector: 'app-professional-tax',
  templateUrl: './professional-tax.component.html',
  styleUrls: ['./professional-tax.component.scss'],
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
export class ProfessionalTaxComponent implements OnInit {
  expandedElement:any;
  professionalGroupRequestForm!: FormGroup;
  employeeprofessionaltax:any=[];
  employerprofessionaltax:any=[];
  dataSource1:any;
  datas: any;
  employerstates:any=[];
  emps:any=[]
  worklocationDetails: any;
  employeedata: any;
  constructor(private router:Router,private formBuilder: FormBuilder,private PR:PayrollService,private LM:CompanySettingService) { 
    this.getemployerprofessionaltax();
    this.getemployeeprofessionaltax();
  }
  displayedColumns: string[] = ['SNo', 'State','PT_Slabs','Action'];
  displayedColumnsRequest: string[] = ['Start_Range', 'End_Range','Monthly_Tax_Amount','Description'];
  displayedColumnsEmployer: string[] = ['Branch_Name', 'Yearly_Tax_Amount','Description'];
  // isEmployeeExpansion:any = [true,true,true,true,true,true];
  // isEmployerExpansion:any = [true,true,true,true,true,true];
  isEmployeeExpansion:any = [];
  isEmployerExpansion:any = [];
  dataSource :any;
  employeeprofessionaltaxdata:any=[]
  dataSource2 :any;
  ngOnInit(): void {
   
    this.professionalGroupRequestForm = this.formBuilder.group(
      {
        state: [""],
        deduction_cycle:  [""],
        effective_date:  [""],       
        details:this.formBuilder.array([]) ,
      });
  }
  onRequestClick(){     
    this.router.navigate(["/Payroll/ProfessionalTaxRequest"],{state: {}}); 
  }
  onViewClick(element:any){  
   /* this.router.navigate(["/Payroll/InvestmentRequest"],{state: {userData:element}}); */
  }
  onEditClick(element:any){  
   /* this.router.navigate(["/Payroll/InvestmentRequest"],{state: {userData:element}}); */
  }
  /**Employer professional tax details*/
  getemployerprofessionaltax(){
    this.datas=[];
    this.employerprofessionaltax=[];
    this.PR.getemployerprofessionaltax().subscribe((info:any)=>{
      if(info.status && info.data.length >0) {
        this.datas=info.data
        for(let i=0;i<this.datas.length;i++){
          this.isEmployerExpansion.push(true);
          this.employerstates.push(this.datas[i].state);
        }
        this.employerprofessionaltax = info;
      }
    })

  }
/**Employee professional tax details */
  getemployeeprofessionaltax(){
    this.employeeprofessionaltax=[];
    this.PR.getemployeeprofessionaltax().subscribe((info:any)=>{
      if(info.status && info.data.length >0) {
        this.employeeprofessionaltax = info.data;
        for(let i=0;i<this.employeeprofessionaltax.length;i++){
          this.isEmployeeExpansion.push(true);
          this.employeeprofessionaltaxdata.push( JSON.parse(this.employeeprofessionaltax[i].salary_range))  
        }
         return this.dataSource1 = this.employeeprofessionaltaxdata
      }
    })
  }
  details(): FormArray {
    return this.professionalGroupRequestForm.get("details") as FormArray
  }
  /** */
  validateExpansion(element:any,index:any)
  {
      if(element == 'employer')
      {
        this.isEmployerExpansion[index] = !this.isEmployerExpansion[index];
      }
      else if(element == 'employee')
      {
        this.isEmployeeExpansion[index] = !this.isEmployeeExpansion[index];
      }      
  }

}
