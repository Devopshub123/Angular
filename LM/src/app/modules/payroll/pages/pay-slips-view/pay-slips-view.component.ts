import { Component,ViewChild, OnInit,ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { jsPDF } from "jspdf";
import {DatePipe,Location} from "@angular/common";
import { PayrollService } from '../../payroll.service';
import { ToWords } from 'to-words';
import { CompanyInformationService } from 'src/app/services/company-information.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-pay-slips-view',
  templateUrl: './pay-slips-view.component.html',
  styleUrls: ['./pay-slips-view.component.scss']
})
export class PaySlipsViewComponent implements OnInit {
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
  pic:any
  paiddays:any;
  lop: any;
  companyDBName: any = environment.dbName;
  companyName: any;
  companyinfo: any;
  constructor(private router: Router,private location:Location,private PR:PayrollService,private LM:CompanyInformationService) {
    this.payslipdata = this.location.getState();
    this.getEmployeePayslipDetails(this.payslipdata.userData);
    
    // const toWords:any = new ToWords();
    // const toWords = new ToWords({
    //   localeCode: 'en-IN',
    //   converterOptions: {
    //     currency: true,
    //     ignoreDecimal: false,
    //     ignoreZeroCurrency: false,
    //     doNotAddOnly: false,
    //     currencyOptions: { // can be used to override defaults for the selected locale
    //       name: 'Rupee',
    //       plural: 'Rupees',
    //       symbol: '₹',
    //       fractionalUnit: {
    //         name: 'Paisa',
    //         plural: 'Paise',
    //         symbol: '',
    //       },
    //     }
    //   }
    // });
   }
  @ViewChild('payslip') payslip: any;
  ngOnInit(): void {
    this.getCompanyInformation();
  }
  Back(){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/Payroll/PaySlips"])); 
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
          else if(this.getpayslipdata[i].component_name == "Paid Days"){
            this.paiddays = this.getpayslipdata[i].data_value;
          
          }
          else if(this.getpayslipdata[i].component_name == "LoP Days"){
            this.lop = this.getpayslipdata[i].data_value;
           
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
          this.getUploadImage();
        }
      }
    })
  }
  Download(){
    
    const DATA = this.payslip.nativeElement;
    const doc: jsPDF = new jsPDF('l', 'mm', [1000, 1010]);
    doc.html(DATA, {
      callback: (doc) => {
        doc.setFont('fa-solid-900', 'normal');
        doc.save("payslip.pdf");
      }
    });


    // let doc:any = new jsPDF();
    // // const specialElementHandlers:any = {
    // //   '#editor': function (element:any, renderer:any) {
    // //     return true;
    // //   }
    // // };
    // doc.addHTML(this.payslip.nativeElement, function() {
    //    doc.save("Paslip.pdf");
    // });
    // doc.fromHTML(this.payslip.innerHTML, 15, 15, {
    //   width: 190,
    //   'elementHandlers': specialElementHandlers
    // });

    // doc.save('test.pdf');
  //   const doc:any = document.getElementById('payslip'); //The html element to become a pdf
  //   const pdf = new jsPDF('p', 'pt', 'a4');
  //   doc.addHTML(this.payslip.nativeElement, function() {
  //     pdf.save("obrz.pdf");
  //  });
    // pdf.addHTML(elementToPrint, () => {
    // doc.save('web.pdf');
// });
  }

  getUploadImage(): void
  {
    this.LM.getUploadImage(1,"Apple").subscribe((imageData:any) => {

      if(imageData.success){
        let TYPED_ARRAY = new Uint8Array(imageData.image.data);
        const STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
          return data + String.fromCharCode(byte);
        }, '');

        let base64String= btoa(STRING_CHAR)
        this.pic='data:image/png;base64,'+base64String;

      }else{
        this.pic="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAACXBIWXMAAC4jAAAuIwF4pT92AAAF3WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMS0xMC0yM1QxNTo1NzowNyswNTozMCIgeG1wOk1vZGlmeURhdGU9IjIwMjEtMTAtMjNUMTY6MDM6MzcrMDU6MzAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjEtMTAtMjNUMTY6MDM6MzcrMDU6MzAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6YzVkODNlNWQtODc1Yi1lOTRm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";
      }
    })
  }
  getCompanyInformation(){
    this.LM.getCompanyInformation('companyinformation',null,1,10,this.companyDBName).subscribe((data:any)=>{
      if(data.status && data.data.length!=0) {
        this.companyinfo =data.data[0];
        this.companyName=data.data[0].companyname;
      }else {
       }
    })
  }
}
