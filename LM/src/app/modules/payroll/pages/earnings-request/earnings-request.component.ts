import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import { PayrollService } from '../../payroll.service';
import { ActivatedRoute, Router } from '@angular/router';
import {DatePipe,Location} from "@angular/common";
import { MatDialog } from '@angular/material/dialog'; 
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { ConfirmationDialogueComponent } from '../confirmation-dialogue/confirmation-dialogue.component';
@Component({
  selector: 'app-earnings-request',
  templateUrl: './earnings-request.component.html',
  styleUrls: ['./earnings-request.component.scss']
})
export class EarningsRequestComponent implements OnInit {
  earningsRequestForm!: FormGroup;
  isShowCalculatedAmount: any = '';
  isShowSalaryDayText: boolean = false;
  isShowSubPrbCheckBoxes: boolean = false;
  isShowSubFpbCheckBoxes: boolean = false;
  isShowSubEPFContributionCheckBoxes: boolean = false;
  isShowSubESICContributionCheckBoxes: boolean =false;
  customColor:any = 'primary';
  earn:any;
  data: any;
  senddata:any=[];
  earndata: any;
  dataofvalues: any;
  hide:boolean=false;
  otherhide:boolean=true;
  messagesList:any=[];
  validationMessage:any;
  validationvalue:any;
  PR1:any;
  PR4:any;
  PR5:any;
  PR9:any;
  PR10:any;
  popupflag:boolean=true;
  arrayValue:any=[{Value:0,name:'Flat Amount'},{Value:1,name:'Percentage'}];
  arrayPayValue:any=[{Value:0,name:'Active'},{Value:1,name:'Inactive'}];
  constructor(private location:Location,private sanitizer:DomSanitizer,private formBuilder: FormBuilder,private PR:PayrollService,private dialog: MatDialog,private router: Router) {
    this.earndata = this.location.getState();
    if(this.earndata.Earndata==undefined){
      this.router.navigate(["Payroll/PayGroup"]);
    }else{
      this.otherAllowance(this.earndata.Earndata.pigcm_id);
    this.senddata =this.earndata.paygroupdata.data; 
    this.getComponentEditableConfigurations(this.earndata.Earndata.component_id)
    this.getPayGroupComponentValues(this.earndata.Earndata.pigcm_id);
    this.getComponentConfiguredValuesForPayGroup(this.earndata.Earndata.pigcm_id,1);
    console.log("this.earndata.Earndata",this.earndata.Earndata)
   
    
    if(this.earndata.Earndata.component_name == 'Basic Salary' || this.earndata.Earndata.component_name =='House Rent Allowance' ){
      this.hide=true;
      this.status(1)

    }
    else if(this.earndata.Earndata.component_name == 'Other Allowance'){
      this.otherhide = false;

    }
    else{
      this.hide=false;
      this.status(1)
    }

    }
    
   }
  ngOnInit(): void {
    this.getMessagesList();
  }
  earningrequestform(){
    this.earningsRequestForm = this.formBuilder.group(
      {
        payGroup: [""],
        componentType:[""],
        namePaySlip:["",Validators.required],
        monthly_salary:  [''],
        flat_amount:["",Validators.required],
        basic_percentage:  [""],
        status: [""],
        ess:[""],
        taxableComponenet:[""],
        prb:[""],
        esic:[""],
        fbp:[""],
        fbpAmount:[""],
        epf_contribution:[""],
        epf_option_contribution:[""],
        showComponent:[""],
        percentage:["",Validators.required]
      });
      this.status(1)
      // this.earningsRequestForm.get('epf_contribution')?.valueChanges.subscribe(selectedValue => {
     
      //  if(selectedValue){
      //   this.isShowSubEPFContributionCheckBoxes =true;

      //  }
       
      // })

  }
  cancel(){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/Payroll/Earnings",{state:{data:this.senddata}}])); 

  }
  status(status:any){
   if(status == 0)
    {
      if(this.popupflag){
        let dialogRef = this.dialog.open(ConfirmationDialogueComponent, {
          position: { top: `70px`},
          
          disableClose: true,
          data: { message:'Configuration of a component as a flat amount results in the generation of unassigned amounts for different CTC values. To handle this amount, Other Allowance component will be added to this pay group.', YES: 'YES', NO: 'NO' },
        });
        dialogRef.afterClosed().subscribe((result:boolean) => {
          console.log("HI")
          if (result) {
            console.log("HI inside")
            // this.isShowCalculatedAmount = "basicPercentage"
            this.isShowCalculatedAmount = "Flat Amount";
  
            this.getComponentConfiguredValuesForPayGroup(this.earndata.Earndata.pigcm_id,0)
  
          }
          else   {
            this.isShowCalculatedAmount = "basicPercentage"
            this.earningsRequestForm.controls.monthly_salary.setValue(1);
            this.getComponentConfiguredValuesForPayGroup(this.earndata.Earndata.pigcm_id,1)
            // this.isShowCalculatedAmount = "Flat Amount"
            
          }
        });

      }
      else{
        this.isShowCalculatedAmount = "Flat Amount";

        this.getComponentConfiguredValuesForPayGroup(this.earndata.Earndata.pigcm_id,0)
        
      }
       
      //  let dialogRef = this.dialog.open(ReusableDialogComponent, {
      //   position:{top:`70px`},
      //   disableClose: true,
       
      //   data:`Configuration of a component as a flat amount results in the generation of unassigned amounts for different CTC values. To handle this amount, Other Allowance component will be added to this pay group.
      //   Yes, add Other Allowance component to this pay group and configure this component as a flat amount.
      //   No, configure this component as a percentage of Basic Salary.`
      // });
  

    }
    else if(status == 1)
    {
       this.isShowCalculatedAmount = "basicPercentage"
       this.getComponentConfiguredValuesForPayGroup(this.earndata.Earndata.pigcm_id,1)
    }
  }
  updateCheckBoxStatus(status:any) {
    if(status == 'prb')
    {
    this.isShowSubPrbCheckBoxes = !this.isShowSubPrbCheckBoxes;
    }
    else if(status == 'fbp')
    {
      this.isShowSubFpbCheckBoxes = !this.isShowSubFpbCheckBoxes;
    }
    else if(status == 'epf_contribution')
    {
      this.isShowSubEPFContributionCheckBoxes = !this.isShowSubEPFContributionCheckBoxes;
    }
    else if(status == 'esic')
    {
      this.isShowSubESICContributionCheckBoxes = !this.isShowSubESICContributionCheckBoxes;
    }
  }
  /**Component cofiguration values enable or disable with this values */
  getComponentEditableConfigurations(data:any){
    this.PR.getComponentEditableConfigurations(data).subscribe((result:any)=>{
      if(result.status){
        this.data = result.data[0][0];
      }
      else{
        this.data=[];
      }
      
    })

  }
  /**GetPaygroup component values assigning to earning request form */
  getPayGroupComponentValues(id:any){
    this.earningrequestform();
    this.earndata.Earndata.component_name == 'Basic Salary' || this.earndata.Earndata.component_name =='House Rent Allowance'?this.earningsRequestForm.controls.monthly_salary.setValue(1):this.earningsRequestForm.controls.monthly_salary.setValue(0);

    this.dataofvalues=[];  
    this.PR.getPayGroupComponentValues(id).subscribe((result:any)=>{
      if(result.status){
        console.log("dataofvalues", result.data[0][0])
        this.dataofvalues = result.data[0][0];
        this.earningsRequestForm.controls.payGroup.setValue(this.dataofvalues.group_name);
        this.earningsRequestForm.controls.componentType.setValue(this.dataofvalues.component_name);
        this.earningsRequestForm.controls.namePaySlip.setValue(this.dataofvalues.component_name);
        this.earningsRequestForm.controls.ess.setValue(this.dataofvalues.is_this_component_a_part_of_employee_salary_structure);
        this.earningsRequestForm.controls.taxableComponenet.setValue(this.dataofvalues.is_this_component_taxable);
        this.earningsRequestForm.controls.prb.setValue(this.dataofvalues.calculate_on_pro_rata_basis);
        this.earningsRequestForm.controls.epf_contribution.setValue(this.dataofvalues.consider_for_epf_contribution);
        this.earningsRequestForm.controls.showComponent.setValue(this.dataofvalues.show_this_component_in_payslip);
        this.earningsRequestForm.controls.esic.setValue(this.dataofvalues.consider_for_esi_contribution);
        this.earningsRequestForm.controls.epf_option_contribution.setValue(this.dataofvalues.epf_always==1?'always':'only_pf');
        this.dataofvalues.is_percentage_or_flat_amount==0? this.earningsRequestForm.controls.flat_amount.setValue(this.dataofvalues.component_value): this.earningsRequestForm.controls.percentage.setValue(this.dataofvalues.component_value)
        this.earningsRequestForm.controls.monthly_salary.setValue(this.dataofvalues.is_percentage_or_flat_amount==null?1:this.dataofvalues.is_percentage_or_flat_amount);  
        this.status(this.dataofvalues.is_percentage_or_flat_amount==null?1:this.dataofvalues.is_percentage_or_flat_amount);      
      }
      
    })
  }
  
  configurePayGroupComponent(){
    console.log("hi")
    let flatorpercentagevalidation = this.earningsRequestForm.controls.monthly_salary.value==0?this.earningsRequestForm.controls.flat_amount.value:this.earningsRequestForm.controls.percentage.value;
    console.log("flatorpercentagevalidation",flatorpercentagevalidation)
    if(this.earningsRequestForm.controls.namePaySlip.valid && (this.earningsRequestForm.controls.flat_amount.valid || this.earningsRequestForm.controls.percentage.valid)|| (!this.otherhide)){
      if((flatorpercentagevalidation <= Number(this.validationvalue) )&&flatorpercentagevalidation!=''){
        /**Configure component values and changed to active state */
      if(this.earndata.Earndata.status=="To Be Configured" || this.earndata.Earndata.status=="Configuration In Progress"){
        let data ={
          pigcm_id_value:this.dataofvalues.pigcm_id,
          is_percentage_or_flat_amount_value:this.earningsRequestForm.controls.monthly_salary.value,
          input_value:this.earningsRequestForm.controls.monthly_salary.value==0?this.earningsRequestForm.controls.flat_amount.value:this.earningsRequestForm.controls.percentage.value,
          parent_component_id_value:this.earndata.Earndata.component_name == 'Basic Salary'?"15":"1",
          display_name_value:this.earningsRequestForm.controls.namePaySlip.value,
          is_this_component_a_part_of_employee_salary_structure_value: this.earningsRequestForm.controls.taxableComponenet.value,
          calculate_on_pro_rata_basis_value:this.earningsRequestForm.controls.prb.value,
          is_this_component_taxable_value:this.earningsRequestForm.controls.taxableComponenet.value,
          consider_for_esi_contribution_value:this.earningsRequestForm.controls.esic.value,
          consider_for_epf_contribution_value:this.earningsRequestForm.controls.epf_contribution.value,
          epf_always_value:this.earningsRequestForm.controls.epf_option_contribution.value=='always'?1:0,
          epf_only_when_pf_wage_is_less_than_standard_pf_wage_value:this.earningsRequestForm.controls.epf_option_contribution.value=='always'?0:1,
          show_this_component_in_payslip_value:this.earningsRequestForm.controls.showComponent.value,
          status:'Active'
        }
        console.log(data)
        /**configure component values service call */
        this.PR.configurePayGroupComponent(data).subscribe((result:any)=>{
          if(result.status){
            console.log(this.earndata);
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
                this.router.navigate(["/Payroll/Earnings"],{state:{data:this.senddata}})); 
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position:{top:`70px`},
              disableClose: true,
              data: this.PR9
            });
          }
          else{
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position:{top:`70px`},
              disableClose: true,
              data: this.PR10
            });
    
          }
        })
        }
        /**Edit component values */
        else{
           let data ={
            pigcm_id_value:this.dataofvalues.pigcm_id,
            is_percentage_or_flat_amount_value:this.earningsRequestForm.controls.monthly_salary.value,
            input_value:this.earningsRequestForm.controls.monthly_salary.value==0?this.earningsRequestForm.controls.flat_amount.value:this.earningsRequestForm.controls.percentage.value,
            parent_component_id_value:this.earndata.Earndata.component_name == 'Basic Salary'?"15":this.earningsRequestForm.controls.monthly_salary.value==0?null:"1",
            display_name_value:this.earningsRequestForm.controls.namePaySlip.value,
            is_this_component_a_part_of_employee_salary_structure_value: this.earningsRequestForm.controls.taxableComponenet.value,
            calculate_on_pro_rata_basis_value:this.earningsRequestForm.controls.prb.value,
            is_this_component_taxable_value:this.earningsRequestForm.controls.taxableComponenet.value,
            consider_for_esi_contribution_value:this.earningsRequestForm.controls.esic.value,
            consider_for_epf_contribution_value:this.earningsRequestForm.controls.epf_contribution.value,
            epf_always_value:this.earningsRequestForm.controls.epf_option_contribution.value=='always'?1:0,
            epf_only_when_pf_wage_is_less_than_standard_pf_wage_value:this.earningsRequestForm.controls.epf_option_contribution.value=='always'?0:1,
            show_this_component_in_payslip_value:this.earningsRequestForm.controls.showComponent.value,
            status:'Active'
           }
           /**edit component values service call */
           this.PR.editPayGroupComponent(data).subscribe((result:any)=>{
             if(result.status){
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
              this.router.navigate(["/Payroll/Earnings",{state:{data:this.earndata.Earndata}}])); 
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position:{top:`70px`},
              disableClose: true,
              data: this.PR4
            });
                
             }
             else{
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position:{top:`70px`},
              disableClose: true,
              data: this.PR5
            });
       
             }
           })
        }

      }
      else{
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: 'Please enter a valid value that satisfies the condition given in the information pane.'
        });

      }
      
    }
   
   
   
  }
  /**getMessages for success , failure */
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
          if (e.code == "PR4") {
            this.PR4 = e.message
          } else if (e.code == "PR4") {
            this.PR5 =e.message
          }
          else if (e.code == "PR9") {
            this.PR9 =e.message
          }
          else if (e.code == "PR10") {
            this.PR10 =e.message
          }
          else if (e.code == "PR1") {
            this.PR1 =e.message
          }
        })

      }

    })
  }
  Back(){
  
    this.router.navigate(['/Payroll/Earnings'],{state:{data:this.earndata}});

  }
  otherAllowance(data:any){
    this.PR.otherAllowancePopup(data).subscribe((result:any)=>{
      console.log("result:",result)
      if(result.status&&result.data.length>0){
        if(result.data[0].popup==1){
           this.popupflag=true;
        }
        else{
          this.popupflag=false;
        }
      }
    })
  }

  getComponentConfiguredValuesForPayGroup(pgmid:any,flat:any){
    let data={
      pgmid:pgmid,
      flat:flat
    }
    this.PR.getComponentConfiguredValuesForPayGroup(data).subscribe((result:any)=>{
     console.log(result);
     if(result.status){
      this.validationMessage = result.data[0].message;
      this.validationvalue = result.data[0].final_value;

     }
      
    })

  }
  alphabetKeyPress(event: any,) {
    const pattern = /[a-zA-Z ]/;
      let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  
  _keyPress(event: any) {
    const pattern = /[0-9.]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
        event.preventDefault();

    }
  }
}
