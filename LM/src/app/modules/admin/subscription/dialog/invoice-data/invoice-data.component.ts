import { Component,Inject,ViewChild, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { jsPDF } from "jspdf";
export interface ProductAdminInvoiceHistoryElement {
  plan: string;
  date: string;  
  qty:string;
  costperuser:string;
  subtotal:string

}
const ELEMENT_DATA: ProductAdminInvoiceHistoryElement[] = [
  {plan: 'Basic', date: '12-02-2022',qty:'100',costperuser:'150',subtotal:"1500"}

];

@Component({
  selector: 'app-invoice-data',
  templateUrl: './invoice-data.component.html',
  styleUrls: ['./invoice-data.component.scss']
})
export class InvoiceDataComponent implements OnInit {
  displayedColumns: string[] = ['date','plan','qty','costperuser','subtotal'];
  dataSource : any=[];

  constructor(public dialogRef: MatDialogRef<InvoiceDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
        this.dataSource = data;
        console.log(this.dataSource)
      }
    @ViewChild('invoice') invoice: any;
  ngOnInit(): void {
  }
  print(){
    const DATA = this.invoice.nativeElement;
    const doc: jsPDF = new jsPDF('l', 'mm', 'a1');
    doc.html(DATA, {
      callback: (doc) => {
        doc.setFont('fa-solid-900', 'normal');
        doc.save("invoice.pdf");
      }
    });

  }

}
