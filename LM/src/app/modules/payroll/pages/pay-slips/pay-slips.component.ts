import { Component,ViewChild, OnInit,ElementRef  } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { PayrollService } from '../../payroll.service';
import { jsPDF } from "jspdf";
import { ToWords } from 'to-words';
export interface PaySlipsElement {
  Date: string;  
  salary_month: string;
  salary:string; 
  Active:string; 
}
const ELEMENT_DATA: PaySlipsElement[] = [
  {Date: '01-01-2022', salary_month: 'January',salary:'2,50,000',Active:"View"},
  {Date: '01-01-2021', salary_month: 'January',salary:'2,00,000',Active:"View"},
  {Date: '01-01-2020', salary_month: 'January',salary:'1,50,000',Active:"View"}
];
@Component({
  selector: 'app-pay-slips',
  templateUrl: './pay-slips.component.html',
  styleUrls: ['./pay-slips.component.scss']
})
export class PaySlipsComponent implements OnInit {
  payslipsForm!: FormGroup;
  financeyears:any=[];
  userSession:any;
  payslipdata:any=[];
  getpayslipdata:any=[];
  alldata:any=[];
  earningsdata:any=[];
  deductiondata:any=[];
  empname:any;
  designation:any;
  dateofjoin:any;
  payperiod:any;
  paydate:any;
  uanumber:any;
  esi:any;
  netamount:any;
  words:any;
  payslip: any = `<div id="payslip" #payslip >
      <script src="https://code.jquery.com/jquery-2.2.4.min.js"></script> <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.js"></script> <script src="jspdf/jspdf.js"></script>
    <div fxLayout="row" fxLayout.xs="column" fxLayoutGap="10px" class="custom-card">      
      <div fxLayout="column" fxFlex="5">
      </div>       
      <div fxLayout="column" fxFlex="90" class="custom-payroll-div">
          <div fxLayout="row" fxLayout.xs="column" fxLayoutAlign.xs="center center">   
           <div fxFlex.xs="100" fxFlex="50" class="mx-2 my-2">
           </div>     
           <div fxFlex.xs="100" fxFlex="50" class="mx-2 my-2">
              <button type="button" class="btn btn-primary" style="float: right;" >Download</button>
           </div>        
          </div>
          <div fxLayout="row" fxLayout.xs="column" fxLayoutAlign.xs="center center">   
              <div fxFlex.xs="100" fxFlex="100" class="mx-2 my-2" style="border-bottom: 1px solid #a0a0a0;">
                   <h3 style="margin: 20px 0 0px;font-size: 17px;font-weight: 500;">SBT</h3>   
                   <p>Hyderabad, Telangana, India</p>
              </div>                         
          </div>
          <div fxLayout="row" fxLayout.xs="column" fxLayoutAlign.xs="center center" style="border-bottom: 1px solid #a0a0a0;">                       
              <div fxFlex.xs="100" fxFlex="50" class="mx-2 my-2" >
                  <h3 style="margin: 20px 0 0px;font-size: 17px;font-weight: 500;">Payslip for the month of January 2018</h3>   
                  <h3 style="margin: 20px 0 10px;font-weight: 500;">Employee Pay Summary</h3>   
                  <div class="form-row">
                  <div class="form-group col-md-12" style="padding-bottom: 0px !important;padding-top: 0px !important;display: flex;">
                      <label style="color:#a0a0a0;width:200px;">Employee Name</label>
                      <p>{{empname}}</p>
                  </div>
                  <div class="form-group col-md-12" style="padding-bottom: 0px !important;padding-top: 0px !important;display: flex;">
                      <label style="color:#a0a0a0;width:200px;">Designation</label>
                      <p>{{designation}}</p>
                  </div>
                  <div class="form-group col-md-12" style="padding-bottom: 0px !important;padding-top: 0px !important;display: flex;">
                      <label style="color:#a0a0a0;width:200px;">Date of Joining</label>
                      <p>{{dateofjoin}}</p>
                  </div>
                  <div class="form-group col-md-12" style="padding-bottom: 0px !important;padding-top: 0px !important;display: flex;">
                      <label style="color:#a0a0a0;width:200px;">Pay Period</label>
                      <p>{{payperiod}}</p>
                  </div>
                  <div class="form-group col-md-12" style="padding-bottom: 0px !important;padding-top: 0px !important;display: flex;">
                      <label style="color:#a0a0a0;width:200px;">Pay Date</label>
                      <p>{{paydate}}</p>
                  </div>
                  
                  <div class="form-group col-md-12" style="padding-bottom: 0px !important;padding-top: 0px !important;display: flex;">
                      <label style="color:#a0a0a0;width:200px;">UAN Number</label>
                      <p>{{uanumber}}</p>
                  </div>
                  <div class="form-group col-md-12" style="padding-bottom: 0px !important;padding-top: 0px !important;display: flex;">
                      <label style="color:#a0a0a0;width:200px;">ESI Number</label>
                      <p>{{esi}}</p>
                  </div>
    
              </div>
              </div>
             <div fxFlex.xs="100" fxFlex="50" class="mx-2 my-2">
              <div class="card card-stats card-warning cmn-leave" style="margin-top: 29%;">
                  <div class="card-body ">
                      <div class="row">
                          <div class="col-12">
                              <div class="numbers text-center">
                                  <p style="color:#a0a0a0;">Employee Net Pay</p>
                                  <p class="card-category" style="color: #65986f;font-size: 30px;">₹ {{netamount}}</p>
                                  <p style="color:#a0a0a0;">Paid Days: 28 | LOP Days: 3</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
             </div>       
          </div>
          <div fxLayout="row" fxLayout.xs="column" fxLayoutAlign.xs="center center">                       
              <div fxFlex.xs="100" fxFlex="50" class="mx-2 my-2" >
                  <table class="table-responsive">
                      <thead>
                        <tr class="dashboard-1 custom-investment-header">
                          <th scope="col" class="custom-investment-th" style="width:50%;">Earnings</th>
                          <th scope="col" class="custom-investment-th" style="width:33%;">Amount ₹</th>

                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let item of earningsdata;let i = index">
                          <th scope="row" class="custom-investment-td">{{item.component_name}}</th>
                         
                                <td class="custom-investment-td">{{item.data_value}}</td>
           
                        </tr>
                       
                      </tbody> 
                  </table>
              
              </div>
             <div fxFlex.xs="100" fxFlex="50" class="mx-2 my-2">
              <table class="table-responsive">
                  <thead>
                    <tr class="dashboard-1 custom-investment-header">
                      <th scope="col" class="custom-investment-th" style="width:48%;">Deductions</th>
                      <th scope="col" class="custom-investment-th" style="width:35%;">Amount ₹</th>
                    </tr>
                    
                  </thead>
                  <tbody>
                    <tr *ngFor="let item of deductiondata;let i = index">
                      <th scope="row" class="custom-investment-td">{{item.component_name}}</th>
     
                            <td class="custom-investment-td">{{item.data_value}}</td>
                    </tr>
                     
                
                  </tbody> 
              </table>
     
             </div>       
          </div>
          <div fxLayout="row" fxLayout.xs="column" fxLayoutAlign.xs="center center" style="background: rgb(233 247 230); padding: 10px 10px 0px 10px;margin-bottom: 1rem;">     
              <p style="text-align: center;margin-right: 5px !important;font-size: 16px;">Total Net Payable</p><p style="font-size: 16px;"> ₹{{netamount}}&nbsp;</p><p style="font-size: 13px;margin-top: 3px !important;"> Indian Rupee {{words}}</p>
          </div> 
          <div fxLayout="row" fxLayout.xs="column" fxLayoutAlign.xs="center center" style="text-align: center;margin:auto;;">     
              <p  style="text-align: center;">** Total Net Payable * Gross Earnings - Total Deductions</p>
          </div> 
          <div fxLayout="row" fxLayout.xs="column" fxLayoutAlign.xs="center center" style="text-align: center;margin:auto;">     
              <p style="text-align: center;">-- This is a system generated payslip, hence signature is not required --</p>
          </div>    
      </div>
       <div fxLayout="column" fxFlex="5">
      </div>
    
    </div>
    </div> ` 
  // @ViewChild('payslip') payslip: any;
  
  constructor(private router:Router,private PR:PayrollService,private formBuilder: FormBuilder) {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
   }
  displayedColumns: string[] = ['Month','Amount','Active'];
  // dataSource =ELEMENT_DATA;
  dataSource :any;
  ngOnInit(): void {
    this.getFinancialYears();
    this.payslipsForm = this.formBuilder.group(
      {
        financial_year:  ["2022-2023"],
      });
      this.getEmployeePayslips("2022-2023");
      this.payslipsForm.get('financial_year')?.valueChanges.subscribe((selectedValue:any) => {
        this.getEmployeePayslips(selectedValue);
      })
  
  }
    /** getFinancialYears Data*/
    getFinancialYears(){
      this.PR.getFinancialYears().subscribe((result:any)=>{
        if(result.status && result.data.length>0){
          this.financeyears = result.data;
        }
        else{
          this.financeyears=[]
        }
      })
    }
    /**getEmployeePayslips */
    getEmployeePayslips(fyear:any){
      let data={
        fyear:fyear,
        id:this.userSession.id
      }
      this.dataSource=[]
      this.PR.getEmployeePaySlips(data).subscribe((result:any)=>{

        if(result.status&&result.data.length>0){
          this.dataSource =result.data;
        }
      })
    }
    getEmployeePayslipDetails(userdata:any){
      let data ={
        id:userdata.id,
        empid:userdata.empid
      }

      this.PR.getEmployeePayslipDetails(data).subscribe((result:any)=>{

        if(result.status&&result.data.length>0){
          
          const toWords:any = new ToWords();
          this.getpayslipdata = result.data;
          for(let i=0;i<this.getpayslipdata.length;i++){
            if(this.getpayslipdata[i].component_name == "Employee Name"){
              this.empname = this.getpayslipdata[i].data_value;
  
            }
            else if(this.getpayslipdata[i].component_name == "Designation"){
              this.designation = this.getpayslipdata[i].data_value;
  
            }
            else if(this.getpayslipdata[i].component_name == "Date of Joining"){
              this.dateofjoin = this.getpayslipdata[i].data_value;
  
            }
            else if(this.getpayslipdata[i].component_name == "Pay Period"){
              this.payperiod = this.getpayslipdata[i].data_value;
  
            }
            else if(this.getpayslipdata[i].component_name == "Pay Date"){
              this.paydate = this.getpayslipdata[i].data_value;
  
            }
            else if(this.getpayslipdata[i].component_name == "UA Number"){
              this.uanumber = this.getpayslipdata[i].data_value;
  
            }
            else if(this.getpayslipdata[i].component_name == "ESI"){
              this.esi = this.getpayslipdata[i].data_value;
            }
            else if(this.getpayslipdata[i].component_name == "Total Net Payable"){
              this.netamount = this.getpayslipdata[i].data_value;
              this.words = toWords.convert(this.netamount, { currency: true });
            }
            else{
               this.alldata.push(this.getpayslipdata[i])
            }
          }

          for(let i=0;i<this.alldata.length;i++){
            if(this.alldata[i].type_value== "Earnings"  || this.alldata[i].component_name== "Gross Earnings"){
              this.earningsdata.push(this.alldata[i])
              
            }
            else if(this.alldata[i].type_value== "Deductions" || this.alldata[i].component_name== "Total Deductions"){
              
              this.deductiondata.push(this.alldata[i])
            }
            
          }
          this.Downloaddata();
        }
      })
    }
    Downloaddata(){
      
      
      const DATA = this.payslip.nativeElement;
      const doc: jsPDF = new jsPDF('l', 'mm', [1000, 1010]);
      doc.html(DATA, {
        callback: (doc) => {
          doc.setFont('fa-solid-900', 'normal');
          doc.save("dataurlnewwindow.pdf");
        }
      });
    }
    download(element:any){
      this.getEmployeePayslipDetails(element);
    }



    // downloads(element:any){
    //   this.router.navigate(["/Payroll/PaySlipsView"],{state: {userData:element}}); 
    // }
  setPayGroup(){     
    
  }
  cancel(){     
    
  }
  onViewClick(element:any){
  this.router.navigate(["/Payroll/PaySlipsView"],{state: {userData:element}}); 
  }
}
