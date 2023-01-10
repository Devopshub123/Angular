import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PayrollService } from '../../payroll.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog'; 
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
@Component({
  selector: 'app-epf',
  templateUrl: './epf.component.html',
  styleUrls: ['./epf.component.scss']
})
export class EpfComponent implements OnInit {
  employeecontribution: any=[];
  employercontribution: any=[];
  enable:boolean = true;
  mindate :any;
  MaxPfWageForEmployerContribution: any;
  pipe = new DatePipe('en-US');
  messagesList:any=[];
  PR25:any;
  PR26:any;

  constructor(private formBuilder: FormBuilder,private PR:PayrollService,private router: Router,private dialog: MatDialog,) { }
  epfRequestForm!: FormGroup;
  employeeContributionCTCColor:any = 'primary';
  allComplete: boolean = false;
  employeeContributionCTCIndeterminate: boolean = false;  
  checkboxes = [{
    name: 'Include Employers EDLI contribution in the CTC',
    value: true,
    color:'primary'
  }, {
    name: 'Include admin charge in the CTC',
    value: true,
    color:'primary' 
  },
  //  {
  //   name: 'Only Employee and Employer Contribution',
  //   value: true,
  //   color:'primary'
  // }
];
  abryColor:any = 'primary';
  allabryComplete: boolean = false;
  abryIndeterminate: boolean = false;  
  abryCheckBoxes = [{
    name: 'Include Employees EDLI contribution in the CTC',
    value: true,
    color:'#80286a'
  }, {
    name: 'Include admin charge in the CTC',
    value: true,
    color:'#80286a' 
  },
  //  {
  //   name: 'Only Employee and Employer Contribution',
  //   value: true,
  //   color:'primary'
  // }
];
  ngOnInit(): void {
    this.getEpfDetails();
    this.getEmployeeEpfContributionOptions();
    this.getEmployerEpfContributionOptions();
    this.getStatutoryMaxPfWageForEmployerContribution();
    this.getMessagesList();
    this.epfRequestForm = this.formBuilder.group(
    {
      epfNumber: [""],
      deductionCycle: ["Monthly"],
      employeeContribution:[""],
      employersContribution:[""],
      employerCTCContribution:[""],
      effective_date:[""],
      checkboxes: this.formBuilder.array(this.checkboxes.map(x => false)),
      abryCheckBoxes: this.formBuilder.array(this.abryCheckBoxes.map(x => false)),
      pfRestrict:[""]
    });
  }
  /**set Company Epf Values */
  setEpf(){
    if(this.epfRequestForm.valid){
      let data ={
        pf_number:this.epfRequestForm.controls.epfNumber.value,
        actual_pf_wage_or_restricted_pf_wage_for_employer_contribution:this.epfRequestForm.controls.employersContribution.value,
        actual_pf_wage_or_restricted_pf_wage_for_employee_contribution:this.epfRequestForm.controls.employeeContribution.value ,
        include_employer_contribution_in_ctc_value:this.allComplete?1:0,
        include_employer_edli_contribution_in_ctc_value:this.epfRequestForm.controls.checkboxes.value[0]&&this.allComplete?1:0,
        include_admin_charges_in_ctc_value:this.epfRequestForm.controls.checkboxes.value[1]&&this.allComplete?1:0,
        consider_all_comp_if_pf_wage_is_lt_statutory_value:this.epfRequestForm.controls.pfRestrict.value?1:0,
        effective_fdate:this.pipe.transform(this.epfRequestForm.controls.effective_date.value, 'yyyy-MM-dd'),
      }
      this.PR.setCompanyEpfValues(data).subscribe((result:any)=>{
        if(result.status){
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
             this.router.navigate(["/Payroll/EPF"])); 
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: this.PR25
          });
          
        }
        else{
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: this.PR26
          });
        }
      })

    }
    
  }
  cancel(){  
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    this.router.navigate(["/Payroll/EPF"]));   
    
  }
  updateAllComplete(index:any,checkBox:any) {    
    if(checkBox === 'employeeContribution')
    {
    var checkboxControl = (this.epfRequestForm.controls.checkboxes as FormArray);   
    if(checkboxControl.value.filter((t: any) => t).length > 0 && checkboxControl.value.filter((t: any) => t).length < 3)
    {
      this.employeeContributionCTCIndeterminate = true;
      this.allComplete = false;
    }
    else if(checkboxControl.value.filter((t: any) => t).length === 3)
    {
      this.employeeContributionCTCIndeterminate = false;
      this.allComplete = true;
    }
    }
    else if(checkBox === 'abryScheme') {
      var checkboxControl = (this.epfRequestForm.controls.abryCheckBoxes as FormArray);   
      if(checkboxControl.value.filter((t: any) => t).length > 0 && checkboxControl.value.filter((t: any) => t).length < 3)
      {
        this.abryIndeterminate = true;
        this.allabryComplete = false;
      }
      else if(checkboxControl.value.filter((t: any) => t).length === 3)
      {
        this.abryIndeterminate = false;
        this.allabryComplete = true;
      }
  
    }
  }  
  setAll(completed: boolean,checkBox:any) {    
    if(checkBox === 'employeeContribution')
    {
    /*  console.log('employeeContribution')
    var checkboxControl = (this.epfRequestForm.controls.checkboxes as FormArray);       
    checkboxControl.setValue(
      checkboxControl.value.map((value:any, i:any) => !value ? true : false)
    ); */
    this.allComplete = !this.allComplete;
    }
    else if(checkBox === 'abryScheme')
    {
    /*  console.log('abryScheme');
    var checkboxControl = (this.epfRequestForm.controls.abryCheckBoxes as FormArray);       
    checkboxControl.setValue(
      checkboxControl.value.map((value:any, i:any) => !value ? true : false)
    ); */
    this.allabryComplete = !this.allabryComplete;
    }    
  } 
  /*getEmployeeEpfContributionOptions */
  getEmployeeEpfContributionOptions(){
    this.PR.getEmployeeEpfContributionOptions().subscribe((result:any)=>{
      if(result.status && result.data[0].length>0){
        this.employeecontribution = result.data[0]
      }
      else{
        this.employeecontribution = []
      }
    });
  }
  /*getEmployerEpfContributionOptions*/
  getEmployerEpfContributionOptions(){
    this.PR.getEmployerEpfContributionOptions().subscribe((result:any)=>{
      if(result.status && result.data[0].length>0){
        this.employercontribution = result.data[0]
      }
      else{
        this.employercontribution = []
      }
    });
  }
  /**flag changes */
  edit(){
    this.enable = false;
    this.mindate=new Date();
    this.epfRequestForm.controls.effective_date.setValue(new Date());

  }
  /**getEpfDetails*/
  getEpfDetails(){
    this.PR.getEpfDetails().subscribe((result:any)=>{
      console.log(result)
      if(result.status && result.data.length>0){
        this.epfRequestForm.controls.epfNumber.setValue(result.data[0].epf_number);
        this.epfRequestForm.controls.employersContribution.setValue(result.data[0].actual_pf_wage_or_restricted_pf_wage_for_employer_contribution);
        this.epfRequestForm.controls.employeeContribution.setValue(result.data[0].actual_pf_wage_or_restricted_pf_wage_for_employee_contribution);
        this.epfRequestForm.controls.pfRestrict.setValue(Number(result.data[0].consider_all_comp_if_pf_wage_is_lt_statutory_value));
        this.epfRequestForm.controls.effective_date.setValue(new Date(result.data[0].effective_from_date));
        this.allComplete=result.data[0].include_employer_contribution_in_ctc_value=="1"?true:false;
        this.epfRequestForm.controls.checkboxes.setValue([Number(result.data[0].include_employer_edli_contribution_in_ctc_value),Number(result.data[0].include_admin_charges_in_ctc_value)])
      }
      this.mindate = result.data[0].effective_from_date==undefined || null?new Date():new Date()
      
    });

  }

  // getStatutoryMaxPfWageForEmployerContribution
  getStatutoryMaxPfWageForEmployerContribution(){
    this.PR.getStatutoryMaxPfWageForEmployerContribution().subscribe((result:any)=>{
      if(result.status && result.data[0].length > 0){
        this.MaxPfWageForEmployerContribution = result.data[0][0].value;
      }
    })
  }
  /**to get error and success messages data */
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
          if (e.code == "PR25") {
            this.PR25 = e.message
          }
          else if (e.code == "PR26") {
            this.PR26 =e.message
          }
        })

      }

    })
  }
}
