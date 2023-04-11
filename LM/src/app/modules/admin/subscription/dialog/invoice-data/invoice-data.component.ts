import { Component, Inject, ViewChild, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { jsPDF } from "jspdf";
import { AdminService } from '../../../admin.service';
export interface ProductAdminInvoiceHistoryElement {
  plan: string;
  date: string;
  qty: string;
  costperuser: string;
  subtotal: string

}
const ELEMENT_DATA: ProductAdminInvoiceHistoryElement[] = [
  { plan: 'Basic', date: '12-02-2022', qty: '100', costperuser: '150', subtotal: "1500" }

];

@Component({
  selector: 'app-invoice-data',
  templateUrl: './invoice-data.component.html',
  styleUrls: ['./invoice-data.component.scss']
})
export class InvoiceDataComponent implements OnInit {
  displayedColumns: string[] = ['date', 'plan', 'qty', 'costperuser', 'subtotal'];
  dataSource: any = [];
  paymentId: any;
  invoiceDate: any;
  cname: any;
  dueDate: any;
  address1: any;
  address2: any;
  invoiceNum: any;
  location: any;
  city: any;
  state: any;
  country: any;
  pincode: any;
  constructor(public dialogRef: MatDialogRef<InvoiceDataComponent>,private adminService: AdminService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.paymentId = data.payment_id;
    // this.invoicedata = data;
   
  }
  @ViewChild('invoice') invoice: any;
  invoiceData: any;
  ngOnInit(): void {
    this.getInvoiceData();
  }

  getInvoiceData(){
    this.adminService.getInvoiceDataById(this.paymentId).subscribe((result:any)=>{
      if (result.status && result.data.length > 0) {
        this.invoiceData = result.data[0];
        this.invoiceDate = this.invoiceData.payment_date;
        this.cname = this.invoiceData.company_name;
        this.dueDate = this.invoiceData.valid_to;
        this.address1 = this.invoiceData.company_address;
        this.address2 = this.invoiceData.company_address2;
        this.invoiceNum = this.invoiceData.invoiceno;
        this.location = this.invoiceData.location;
        this.state = this.invoiceData.state;
        this.country = this.invoiceData.country;
        this.pincode = this.invoiceData.pincode;
        this.dataSource = result.data;
     }
    })
  }

  print() {
    const DATA = this.invoice.nativeElement;
    const doc: jsPDF = new jsPDF('l', 'mm', 'a1');
    doc.html(DATA, {
      callback: (doc) => {
        doc.setFont('fa-solid-900', 'normal');
        doc.save("invoice.pdf");
      }
    });

  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
