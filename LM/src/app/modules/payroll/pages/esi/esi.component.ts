import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { PayrollService } from '../../payroll.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-esi',
  templateUrl: './esi.component.html',
  styleUrls: ['./esi.component.scss']
})
export class EsiComponent implements OnInit {

  constructor(private router: Router,private formBuilder: FormBuilder,private PR:PayrollService) { }
  esiRequestForm!: FormGroup;
  esidetails:any=[];
  salary:any;
  ngOnInit(): void {
    this.getesidetails();
    this.esiRequestForm = this.formBuilder.group(
      {
        esiNumber: ["",Validators.required],
        deductionCycle: ["Monthly",Validators.required],
        employeeContribution:[""],
        employersContribution:[""],
        employerCTCContribution:[""],
        effective_date:[""]
      });
  }
  setPayGroup(){     
    
  }
  cancel(){ 
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    this.router.navigate(["/Payroll/FinanceDashboard "]));   
     
    
  }
  /**Percentage of wages of employee to be contributed from the employee salary for ESI */
  getesidetails(){
    this.PR.getesidetails().subscribe((info:any)=>{
      if(info.status && info.data.length !=0) {
        this.esidetails = info.data;
      }
        for(let i=0 ; i<this.esidetails.length;i++){
          // Percentage of wages of employee to be contributed from the employee salary for ESI
          if(this.esidetails[i].id == 3){
            this.esiRequestForm.controls.employeeContribution.setValue(this.esidetails[i].value);
          }
          else if(this.esidetails[i].id ==4){
            this.esiRequestForm.controls.employersContribution.setValue(this.esidetails[i].value);
          }
          else if(this.esidetails[i].id ==2)
          {
            this.salary = this.esidetails[i].value;
          }
        }
    })

  }

}
