import { Component, Inject, ViewChild, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { jsPDF } from "jspdf";
import { AdminService } from '../../../admin.service';
@Component({
  selector: 'app-product-invoice-data',
  templateUrl: './product-invoice-data.component.html',
  styleUrls: ['./product-invoice-data.component.scss']
})
export class ProductInvoiceDataComponent implements OnInit {

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
    productinvoicedata:any;
    constructor(public dialogRef: MatDialogRef<ProductInvoiceDataComponent>,private adminService: AdminService,
      @Inject(MAT_DIALOG_DATA) public data: any) {
      this.paymentId = data.payment_reference_number;
      this.productinvoicedata = data;
      // this.invoicedata = data;

    }
    @ViewChild('invoice') invoice: any;
    invoiceData: any;
    ngOnInit(): void {


          this.invoiceDate = this.productinvoicedata.payment_date;
          this.cname = this.productinvoicedata.company_name;
          this.dueDate = this.productinvoicedata.valid_to;
          this.address1 = this.productinvoicedata.company_address;
          // this.address2 = this.invoiceData.company_address2;
          this.invoiceNum = this.productinvoicedata.payment_reference_number;
          // this.location = this.invoiceData.location;
          // this.state = this.invoiceData.state;
          // this.country = this.invoiceData.country;
          // this.pincode = this.invoiceData.pincode;
          this.dataSource[0] = this.productinvoicedata;




    }


    print() {
      const DATA = this.invoice.nativeElement;
      const doc: jsPDF = new jsPDF('p', 'pt',  'a4');
      // const doc: jsPDF = new jsPDF('l', 'mm',  [Number(window.innerWidth), Number(window.innerHeight)]);
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
