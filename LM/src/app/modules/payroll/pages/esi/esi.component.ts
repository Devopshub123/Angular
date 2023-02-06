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
  companyEsiRequestForm!: FormGroup;
  esidetails:any=[];
  displayedColumns: string[] = ['sno','state','esi','config'];
  dataSource:any=[];
  getStateEsiDetails:any=[]
  salary:any;
  ngOnInit(): void {
    this.getesidetails();
    this.getStatesForEsi();
    this.esiRequestForm = this.formBuilder.group(
      {
        esiNumber: ["",Validators.required],
        deductionCycle: ["Monthly",Validators.required],
        employeeContribution:[""],
        employersContribution:[""],
        employerCTCContribution:[''],
        includectc:[""],
        effective_date:[""]
      });
      this.companyEsiRequestForm = this.formBuilder.group(
        {
          esiNumber: ["",Validators.required],
          state:[""]
        });
  }
  cancel(){ 
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    this.router.navigate(["/Payroll/FinanceDashboard "]));   
     
    
  }
  setPayGroup(){}
  /**Percentage of wages of employee to be contributed from the employee salary for ESI */
  getesidetails(){
    this.PR.getesidetails().subscribe((info:any)=>{
      if(info.status && info.data.length !=0) {
        this.esidetails = info.data;
      }
        for(let i=0 ; i<this.esidetails.length;i++){
          // Percentage of wages of employee to be contributed from the employee salary for ESI
          if(this.esidetails[i].id == 3){
            this.esiRequestForm.controls.employeeContribution.setValue(this.esidetails[i].value+' % of Gross Pay');
          }
          else if(this.esidetails[i].id ==4){
            this.esiRequestForm.controls.employersContribution.setValue(this.esidetails[i].value+' % of Gross Pay');
          }
          else if(this.esidetails[i].id ==2)
          {
            this.salary = this.esidetails[i].value;
          }
        }
    })

  }

  // get_states_for_esi
  getStatesForEsi(){
    this.PR.getStatesForEsi().subscribe((result:any)=>{
      if(result.status&&result.data.length>0){
        this.getStateEsiDetails = result.data;
     
      }
      else{
        this.getStateEsiDetails = [];
      }
    });
    
  }
  /**setEsiForState */
  setEsiForState(){
    let data ={
      esi_number:this.companyEsiRequestForm.controls.esiNumber.value,
      state_id:this.companyEsiRequestForm.controls.state.value
    }
    console.log(this.companyEsiRequestForm.controls.esiNumber.value)
    console.log(this.companyEsiRequestForm.controls.state.value)
    console.log("setEsiForStatedata",data);
    this.PR.setEsiForState(data).subscribe((result:any)=>{
      if(result.status){
        console.log("result",result);
      }
      
    });

  }
  /**setCompanyEsiValues */
  setCompanyEsiValues(){
    console.log(this.esiRequestForm.controls.includectc.value)
    let data ={
      include_employer_contribution_in_ctc:this.esiRequestForm.controls.includectc.value?1:0
    }
    console.log("setCompanyEsiValues",data)
    this.PR.setCompanyEsiValues(data).subscribe((result:any)=>{
      if(result.status){
        console.log("result",result);
      }
      
    });

  }

}
