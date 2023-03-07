import { Component, OnInit,ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
export interface ProductAdminInvoiceHistoryElement {
  subscriptionid:string;
  companyname: string;
  startdate: string;  
  lastdate:string;
  status:string;
  amount:string;
  users:string;
  modules:string;

}
const ELEMENT_DATA: ProductAdminInvoiceHistoryElement[] = [
  {subscriptionid:'SBT100',companyname: 'Sreeb',users:'100',modules:'All', startdate: '12-02-2022',lastdate:'12-02-2023',status:'Active',amount:"454"},
  {subscriptionid:'SAN100',companyname: 'Sanela',users:'100',modules:'All',  startdate: '12-02-2022',lastdate:'12-02-2023',status:'Active',amount:"454"},
  {subscriptionid:'DVT100',companyname: 'Devworks',users:'100',modules:'All',  startdate: '12-02-2022',lastdate:'12-02-2023',status:'Active',amount:"454"},
  {subscriptionid:'WP100',companyname: 'Wipro',users:'100',modules:'All',  startdate: '12-02-2022',lastdate:'12-02-2023',status:'Active',amount:"454"},
  {subscriptionid:'TCS100',companyname: 'TCS',users:'100',modules:'All',  startdate: '12-02-2022',lastdate:'12-02-2023',status:'Active',amount:"454"}
];

@Component({
  selector: 'app-product-admin-clients',
  templateUrl: './product-admin-clients.component.html',
  styleUrls: ['./product-admin-clients.component.scss']
})
export class ProductAdminClientsComponent implements OnInit {
  displayedColumns: string[] = ['sno','subscriptionid', 'companyname','users','modules','startdate','lastdate','cost','status'];
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
