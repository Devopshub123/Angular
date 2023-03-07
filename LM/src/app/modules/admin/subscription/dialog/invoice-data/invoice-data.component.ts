import { Component,Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-invoice-data',
  templateUrl: './invoice-data.component.html',
  styleUrls: ['./invoice-data.component.scss']
})
export class InvoiceDataComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<InvoiceDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

}
