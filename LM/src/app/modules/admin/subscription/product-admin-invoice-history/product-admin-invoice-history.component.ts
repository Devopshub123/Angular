import { Component, OnInit,ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
export interface ProductAdminInvoiceHistoryElement {
  companyname: string;
  billingdate: string;  
  useddate:string;
  invoice:string;
  amount:string

}
const ELEMENT_DATA: ProductAdminInvoiceHistoryElement[] = [
  {companyname: 'Sreeb', billingdate: '12-02-2022',useddate:'12-02-2023',invoice:'Ab123',amount:"454"},
  {companyname: 'Sanela', billingdate: '12-02-2022',useddate:'12-02-2023',invoice:'Ab123',amount:"454"},
  {companyname: 'Devworks', billingdate: '12-02-2022',useddate:'12-02-2023',invoice:'Ab123',amount:"454"},
  {companyname: 'Wipro', billingdate: '12-02-2022',useddate:'12-02-2023',invoice:'Ab123',amount:"454"},
  {companyname: 'TCS', billingdate: '12-02-2022',useddate:'12-02-2023',invoice:'Ab123',amount:"454"}
];

@Component({
  selector: 'app-product-admin-invoice-history',
  templateUrl: './product-admin-invoice-history.component.html',
  styleUrls: ['./product-admin-invoice-history.component.scss']
})
export class ProductAdminInvoiceHistoryComponent implements OnInit {
  displayedColumns: string[] = ['sno', 'companyname','billingdate','useddate','invoice','amount','status','action'];
  dataSource : any=ELEMENT_DATA;
  // dataSource: MatTableDataSource<UserData>=<any>[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor() { }

  ngOnInit(): void {
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
}

}
