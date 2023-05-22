import { Component,ViewChild, OnInit,ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { jsPDF } from "jspdf";
import {DatePipe,Location} from "@angular/common";
import { PayrollService } from '../../payroll.service';
import { ToWords } from 'to-words';
import { CompanyInformationService } from 'src/app/services/company-information.service';
import { environment } from 'src/environments/environment';
import { MainService } from 'src/app/services/main.service';
import { CompanySettingService } from 'src/app/services/companysetting.service';
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
  usersession:any;
  companyDBName: any = environment.dbName;
  companyName: any;
  companyinfo: any;
  companylocation:any;
  constructor(private router: Router,private location:Location,private PR:PayrollService,private LM:CompanyInformationService,private mainService:MainService,private companyService:CompanySettingService) {
    this.payslipdata = this.location.getState();
    this.usersession = JSON.parse(sessionStorage.getItem('user') || '');
    if(!this.payslipdata.userData){
      this.router.navigate(["Payroll/PaySlips"]);
    }
    else {
      this.getEmployeePayslipDetails(this.payslipdata.userData);
    }
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
      this.getWorkLocation()

  }
  Back(){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/Payroll/PaySlips"]));
  }
  getWorkLocation() {
    this.companyService
      .getactiveWorkLocation({ id: null, companyName: this.companyDBName })
      .subscribe((result) => {

        for(let i=0;i<result.data.length;i++){
          if(this.usersession.worklocation == result.data[i].city){
            if(result.data[i].location !=''||result.data[i].location !=null){
              this.companylocation = result.data[i].location +"-"+result.data[i].cityname

            }else{
              this.companylocation= result.data[i].cityname 
            }
             

          }
        }
      });
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
          this.getLogo();

        }
      }
    })
  }
  Download(){
    const DATA = this.payslip.nativeElement;
    const doc: jsPDF = new jsPDF('l', 'mm', [Number(window.innerWidth)-400, window.innerHeight+400]);
    // const doc: jsPDF = new jsPDF('l', 'mm', [297, 210]);
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

  // getUploadImage(): void
  // {
  //   this.LM.getUploadImage(1,"Apple").subscribe((imageData:any) => {

  //     if(imageData.success){
  //       let TYPED_ARRAY = new Uint8Array(imageData.image.data);
  //       const STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
  //         return data + String.fromCharCode(byte);
  //       }, '');

  //       let base64String= btoa(STRING_CHAR)
  //       this.pic='data:image/png;base64,'+base64String;

  //     }else{
  //       this.pic="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAACXBIWXMAAC4jAAAuIwF4pT92AAAF3WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMS0xMC0yM1QxNTo1NzowNyswNTozMCIgeG1wOk1vZGlmeURhdGU9IjIwMjEtMTAtMjNUMTY6MDM6MzcrMDU6MzAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjEtMTAtMjNUMTY6MDM6MzcrMDU6MzAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6YzVkODNlNWQtODc1Yi1lOTRm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";
  //     }
  //   })
  // }

  getLogo()
  {
    let info ={
      employeeId: 0,
      candidateId: null,
      filecategory: 'LOGO',
      moduleId: 2,
      requestId: null,
      status: 'Submitted',
    };
    this.mainService.getFilesMaster(info).subscribe((result:any) => {
      if(result && result.status &&  result.data[0]){
       result.data[0].employeeId=0;
       let info = result.data[0]
       this.mainService.getProfileImage(result.data[0]).subscribe((imageData) => {
        if(imageData.success){
          let TYPED_ARRAY = new Uint8Array(imageData.image.data);
          const STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
            return data + String.fromCharCode(byte);
          }, '');

          let base64String= btoa(STRING_CHAR)
          this.pic='data:image/png;base64,'+base64String;


        }
      else{
        // this.isRemoveImage=false;
        this.pic ="data:image/png;base64,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";

      }
    })
  }else{
    // this.isRemoveImage=false;
    this.pic ="data:image/png;base64,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";

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
