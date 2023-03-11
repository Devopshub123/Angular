import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { PayrollService } from '../../payroll.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'; 
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
@Component({
  selector: 'app-esi',
  templateUrl: './esi.component.html',
  styleUrls: ['./esi.component.scss']
})

export class EsiComponent implements OnInit {
  PR1:any;
  PR37:any
  PR38:any;
  PR39:any;
  messagesDataList:any=[];
  isedit:boolean=false;
  enable:boolean=true;
  constructor(private router: Router,private formBuilder: FormBuilder,private dialog: MatDialog,private PR:PayrollService) { }
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
    this.getCompanyEsiValues();
    this.getEsiEmployerContribution();
    this.getMessagesList();
    // Validators.pattern("^(\d{2})[-–\s]?(\d{2})[-–\s]?(\d{1,6})[-–\s]?(\d{3})[-–\s]?(\d{4})$")
    this.esiRequestForm = this.formBuilder.group(
      {
        esiNumber: ["",[Validators.required,Validators.pattern("^(\d{2})[-–\s]?(\d{2})[-–\s]?(\d{6})[-–\s]?(\d{3})[-–\s]?(\d{4})$")]],
        deductionCycle: ["Monthly",[Validators.required,]],
        employeeContribution:[""],
        employersContribution:[""],
        employerCTCContribution:[''],
        includectc:[""],
        effective_date:[""]
      });
      const regex = new RegExp(/^(\d{2})[-–\s]?(\d{2})[-–\s]?(\d{6})[-–\s]?(\d{3})[-–\s]?(\d{4})$/);
      // Validators.pattern("^(\d{2})[--\s]?(\d{2})[--\s]?(\d{6})[--\s]?(\d{3})[--\s]?(\d{4})$")
      this.companyEsiRequestForm = this.formBuilder.group(
        {
          esiNumber: ["",[Validators.required, Validators.pattern(regex)]],
          state:[""],
          statesdata:[""]
        });
  }
  cancel() { 
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(["/Payroll/ESI"]));
  }
  clear(){
    this.companyEsiRequestForm.controls.esiNumber.setValue('');
    this.companyEsiRequestForm.controls.state.setValue('');
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
editdata(){
  this.enable = false;
}
  /**setEsiForState */
  setEsiForState(){
    if(this.companyEsiRequestForm.valid){
      let data ={
        esi_number:this.companyEsiRequestForm.controls.esiNumber.value,
        state_id:this.companyEsiRequestForm.controls.state.value
      }
      this.PR.setEsiForState(data).subscribe((result:any)=>{
        if(result.status){
          this.router.navigateByUrl('/', { skipLocationChange: true })
          .then(() => this.router.navigate(["/Payroll/ESI"]));
         
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: this.PR37
          }); 
        }
        else{
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: this.PR38
          });
        }
        
      });

    }
   

  }
  /**setCompanyEsiValues */
  setCompanyEsiValues(){
    console.log(this.esiRequestForm.controls.includectc.value)
    let data ={
      include_employer_contribution_in_ctc:this.esiRequestForm.controls.includectc.value?1:0
    }
    console.log("setCompanyEsiValues",data)
    this.PR.setCompanyEsiValues(data).subscribe((result:any)=>{
      console.log(result)
      if(result.status){
    
         
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: this.PR37
        });
        this.router.navigate(["/Payroll/ESI"]); 
      }
      else{
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: this.PR38
        });

      }
      
    });

  }
  /**getCompanyEsiValues */
  getCompanyEsiValues(){
    this.dataSource=[]
    this.PR.getCompanyEsiValues().subscribe((result:any)=>{
      if(result.status && result.data.length>0){
        this.dataSource = result.data[0]
      }
    })

  }
  getEsiEmployerContribution(){
    this.PR.getEsiEmployerContribution().subscribe((result:any)=>{
      if(result.status && result.data.length>0){
        this.esiRequestForm.controls.includectc.setValue(result.data[0][0].esi_employer_contribution==0?false:true)
      }
    })

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
        this.messagesDataList = res.data;
        this.messagesDataList.forEach((e: any) => {
          if (e.code == "PR1") {
            this.PR1 = e.message
          } else if (e.code == "PR37") {
            this.PR37 =e.message
          }
          else if (e.code == "PR38") {
            this.PR38 =e.message
          }
          else if (e.code == "PR39") {
            this.PR39 =e.message
          }
        })

      }

    })
  }
  edit(data:any){
    console.log(data)
    this.isedit=true
    this.companyEsiRequestForm.controls.esiNumber.setValue(data.value),
    this.companyEsiRequestForm.controls.state.setValue(data.state_id),
    this.companyEsiRequestForm.controls.statesdata.setValue(data.state)
  }

}
