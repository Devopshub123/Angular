import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit,ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table'
import { Router } from '@angular/router';
import { PayrollService } from '../../payroll.service';
import { MatDialog } from '@angular/material/dialog'; 
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { Investments } from '../../models/investments';
import { InvestmentRejectComponent } from '../investment-reject/investment-reject.component';
@Component({
  selector: 'app-investment-proof',
  templateUrl: './investment-proof.component.html',
  styleUrls: ['./investment-proof.component.scss'],
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
export class InvestmentProofComponent implements OnInit {
  expandedElement:any;
  hide:boolean=false;
  empname:any;
  empid:any;
  empcode:any;
  constructor(private router:Router,private PR:PayrollService,public dialog: MatDialog,) { }
  displayedColumns: string[] = ['Employee_ID', 'Employee_Name','Action'];
  dataSource: MatTableDataSource<any>=<any>[];
  userSession: any;
  displayedColumns1 = ['sno','particulars','mlimit','percentage','declareamount','samount','receiptnumber','attachments','approveamount','action'];
  datasource:any;
  datas: any;
  InvestmentDetails:any;
  array: any=[];
  damountarray:any=[];
  isShowTaxRegion:any = 'tax-region';
  isRadioNewTaxRegime:boolean = false;
  isRadioOldTaxRegime:boolean = false;
  taxRegimeFormData:any;
  columnNames: any;
  lastColumnName: any;
  allButLastColumnNames: any;
  rowSpans: any;
  decamount:any=[];
  subamount:any=[];
  recnumber:any=[];
  aattachment:any=[];
  sampleSAAmount:any=[];
  sampleRN:any = [];
  sampleAttachment:any=[];
  sampleApprovedAmount:any=[];
  sampleFlags:any=[];
  sampleStatus:any=[];
  sampleStatusReason:any=[];
  disabiltyarry:any=[];
  filename: any;
  file: any;
  fileURL: any;
  expFromDate: any;
  expToDate: any;
  maxDate = new Date();
  minetodate: any;
  editDockinfo: any;
  isedit: boolean = false;
  editFileName: any;
  documentTypeList: any;
  isFile: boolean = true;
  formData: any;
  arr:any=[];
  titleName:any;
  reason:any;
  rejectdata:any;
  messagesList:any=[];
  PR11:any;
  PR12:any;
  PR34:any;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  
  ngOnInit(): void {
    this.getMessagesList();
    this.getEmployeesListForInvestmentsApproval();
    this.formData = new FormData();
    this.InvestmentDetails=new Investments();
  }
  onRequestClick(element:any){  
    this.router.navigate(["/Payroll/InvestmentRequest"],{state: {userData:element}}); 
  }
  applyFilter(event: Event) {
   const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  
  }
  /**Investments applied employees list */
  getEmployeesListForInvestmentsApproval(){
    this.PR.getEmployeesListForInvestmentsApproval().subscribe((result:any)=>{
      if(result.status){
        this.dataSource = new MatTableDataSource(result.data[0]);
      }
    })

  }
   /**index tracking */
   trackByFn(index: any, item: any) {
    return index;
 }
 back(){
  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    this.router.navigate(["/Payroll/InvestmentProof"])); 

 }
  /**Get Applied Investments functionality */
  getinvestments(data:any){
    this.hide=true;
    this.empid=data.empid;
    this.empcode=data.empcode;
    this.empname=data.empname;
    this.PR.getEmployeeInvestments(this.empid).subscribe((result:any)=>{
      if(result.status){
        let data= JSON.parse(result.data[0][0].json_data);
        for(let i=0;i<data.length;i++){
          let arr=[]
          if(data[i].status!=null){
            this.arr.push(data[i])  
          }
        }
        this.datasource= this.arr;
        for(var i=0;i<this.datasource.length;i++){         
          if(this.datasource[i].action_date ==null){}
          else{
            this.datasource[i].key = i+1;
            this.sampleSAAmount[i] = [];
            this.sampleRN[i] = [];
            this.sampleAttachment[i] = [];
            this.sampleApprovedAmount[i] = []
            var s_amount:any=[];
            var r_number:any=[];
            var s_att:any=[];
            var a_amount:any=[];
            var flags:any=[];
            var status:any=[];
            var statusreason:any=[];
            this.damountarray.push(this.datasource[i].declared_amount);
            this.disabiltyarry.push(this.datasource[i].disability_percentage)
            for(let m=0;m<this.datasource[i].submitted_amount.length;m++){
              s_amount.push(this.datasource[i].submitted_amount[m].submitted_amount);
              r_number.push(this.datasource[i].receipt_number[m].receipt_number);
              s_att.push(this.datasource[i].investment_file[m].investment_file);
              a_amount.push(this.datasource[i].approved_amount[m].approved_amount==null?this.datasource[i].submitted_amount[m].submitted_amount:this.datasource[i].approved_amount[m].approved_amount);
              flags.push(this.datasource[i].approved_amount[m].approved_amount==null?true:false);
              status.push(this.datasource[i].status[m].status);
              statusreason.push(this.datasource[i].status_reason[m].status_reason);
              this.sampleSAAmount[i]=s_amount;
              this.sampleRN[i]=r_number;
              this.sampleAttachment[i]=s_att;
              this.sampleApprovedAmount[i]=a_amount;
              this.sampleFlags[i]=flags;
              this.sampleStatus[i]=status;
              this.sampleStatusReason[i] = statusreason;

            }
          }
        }
        this.InvestmentDetails.submittedamount = this.sampleSAAmount;
        this.InvestmentDetails.receiptnumner =this.sampleRN;
        this.InvestmentDetails.approveamount=this.sampleApprovedAmount;
        this.InvestmentDetails.attachments= this.sampleAttachment;
        this.InvestmentDetails.percentage = this.disabiltyarry;
        this.InvestmentDetails.damount=this.damountarray;
        this.sampleStatus[i]=status;
        this.sampleStatusReason[i] = statusreason;
      }
    })
  }
  /**Approve Investments Functionality */
  approveInvestments(item:any,i:any){

    let data = {
      iid:item.investment_id[i].investment_id,
      empid:this.empid,
      investmentid:Number(item.id),
      declaredamount:item.declared_amount,
      submittedamount:item.submitted_amount[i].submitted_amount,
      verifiedamount:Number(this.InvestmentDetails.approveamount[item.key-1][i]),
      receiptnumber:item.receipt_number[i].receipt_number,
      disabilitypercentage:item.disability_percentage,
      statusvalue:9,
      statusreason:null,
      actionby:this.empid
    }

    if(Number(item.submitted_amount[i].submitted_amount) >= Number(this.InvestmentDetails.approveamount[item.key-1][i])){
      this.PR.setEmployeeInvestments(data).subscribe((result:any)=>{
      if(result.status){
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate(["/Payroll/InvestmentProof"])); 
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: this.PR12
        });
      }
      else{
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: this.PR11
        });
      }

      })

    }
    else{
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position:{top:`70px`},
        disableClose: true,
        data: this.PR34
      });

    }
  }
  /**Reject Investments Functionality */
  rejectInvestments(item:any,i:any){

    this.rejectdata={
      iid:item.investment_id[i].investment_id,
      empid:this.empid,
      investmentid:Number(item.id),
      declaredamount:item.declared_amount,
      submittedamount:item.submitted_amount[i].submitted_amount,
      verifiedamount:null,
      receiptnumber:item.receipt_number[i].receipt_number,
      disabilitypercentage:item.disability_percentage,
      statusvalue:10,
      statusreason:null,
      actionby:this.empid

    }

    this.titleName="Reject"
      this.openDialog(this.rejectdata);
  } 

 /**Reject Reson added pop up screen */ 
 openDialog(leave:any): void {
  const dialogRef = this.dialog.open(InvestmentRejectComponent, {
    position:{top:`70px`},
    data: {name: this.titleName, reason: this.reason}
  });
  dialogRef.afterClosed().subscribe(result => { 
    if(result!=undefined ){
      if(result !==true){
        this.rejectdata.statusreason = result.reason;
        this.PR.setEmployeeInvestments(this.rejectdata).subscribe((result:any)=>{
          if(result.status){
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/Payroll/InvestmentProof"])); 
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position:{top:`70px`},
              disableClose: true,
              data: 'Investments rejectd'
            });
          }
          else{
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position:{top:`70px`},
              disableClose: true,
              data: 'Unable to reject Investments'
            });
          }
    
          })

      }
    }
  });
 }   
/**Document View functionality */
  fileView(data: any,i:any) {
      let info = {
        filename:data.investment_filename[i].investment_filename,
        fname:data.investment_filename[i].investment_filename
      }
      this.PR.getDocumentOrImagesForEMS(info).subscribe((imageData:any) => {
  
        if (imageData.success) {
          let TYPED_ARRAY = new Uint8Array(imageData.image.data);
          const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
            return data + String.fromCharCode(byte);
          }, '');
          let base64String = btoa(STRING_CHAR)
  
          var documentName = info.fname.split('.')
  
          if (documentName[documentName.length - 1] == 'pdf') {
            const file = new Blob([TYPED_ARRAY], { type: "application/pdf" });
            this.fileURL = URL.createObjectURL(file);
            window.open(this.fileURL);
  
          } else {
            this.fileURL = new Blob([TYPED_ARRAY], { type: "image/png" })
            let url = URL.createObjectURL(this.fileURL)
            window.open(url, '_blank');
          }
        }
    })
  }
  /**Uploaded disability percentage file view functionality */
disableFileView(data: any) {
  let info = {
    filename:data.disability_filename[0].disability_filename,
    fname:data.disability_filename[0].disability_filename,
  }

  // this.spinner.show()
  this.PR.getDocumentOrImagesForEMS(info).subscribe((imageData:any) => {
    if (imageData.success) {
      // this.spinner.hide();
      let TYPED_ARRAY = new Uint8Array(imageData.image.data);
      const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
        return data + String.fromCharCode(byte);
      }, '');
      let base64String = btoa(STRING_CHAR)

      var documentName = info.fname.split('.')
      if (documentName[documentName.length - 1] == 'pdf') {
        const file = new Blob([TYPED_ARRAY], { type: "application/pdf" });
        this.fileURL = URL.createObjectURL(file);
        window.open(this.fileURL);

      } else {
        this.fileURL = new Blob([TYPED_ARRAY], { type: "image/png" })
        let url = URL.createObjectURL(this.fileURL)
        window.open(url, '_blank');
      }
    }
  
})
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
          if (e.code == "PR12") {
            this.PR12 = e.message
          } else if (e.code == "PR11") {
            this.PR11 =e.message
          }
          else if (e.code == "PR34") {
            this.PR34 =e.message
          }
          
        })

      }

    })
  } 
}
