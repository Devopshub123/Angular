import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl,Validators, FormBuilder,FormArray, AbstractControl} from '@angular/forms';
export interface ProfessionalRequestGroupElement {
  Start_Range: string;  
  End_Range: string;
  Monthly_Tax_Amount: string;
  Description:string;
  Action:string;  
}
const ELEMENT_DATA: ProfessionalRequestGroupElement[] = [
  {Start_Range: '', End_Range: '',Monthly_Tax_Amount:'',Description:'',Action:'Edit'},
  {Start_Range: '', End_Range: '',Monthly_Tax_Amount:'',Description:'',Action:'Edit'},
  {Start_Range: '', End_Range: '',Monthly_Tax_Amount:'',Description:'',Action:'Edit'}
];
@Component({
  selector: 'app-professional-tax-request',
  templateUrl: './professional-tax-request.component.html',
  styleUrls: ['./professional-tax-request.component.scss']
})
export class ProfessionalTaxRequestComponent implements OnInit {
  professionalGroupRequestForm!: FormGroup;
  constructor(private formBuilder: FormBuilder) { }
  displayedColumns: string[] = ['Start_Range', 'End_Range','Monthly_Tax_Amount','Description','Action'];
  dataSource = ELEMENT_DATA;
  ngOnInit(): void {
    this.professionalGroupRequestForm = this.formBuilder.group(
      {
        state: [""],
        deduction_cycle:  [""],
        effective_date:  [""],       
        details:this.formBuilder.array(ELEMENT_DATA) ,
      });
      
  }
  setPayGroup(){     
    
  }
  cancel(){     
    
  }
  details(): FormArray {
    return this.professionalGroupRequestForm.get("details") as FormArray
  }
  onEditClick(element:any){  
    console.log("Element",element);
   /* this.router.navigate(["/Payroll/InvestmentRequest"],{state: {userData:element}}); */
  }
}
