import { Component, OnInit,ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InvoiceDataComponent } from '../dialog/invoice-data/invoice-data.component';
import { AdminService } from 'src/app/modules/admin/admin.service';
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
  selector: 'app-client-admin-invoice-history',
  templateUrl: './client-admin-invoice-history.component.html',
  styleUrls: ['./client-admin-invoice-history.component.scss']
})
export class ClientAdminInvoiceHistoryComponent implements OnInit {  
displayedColumns: string[] = ['sno', 'billingdate','invoice','amount','status','action'];
dataSource : any=[];
// dataSource: MatTableDataSource<UserData>=<any>[];
@ViewChild(MatPaginator)
paginator!: MatPaginator;
@ViewChild(MatSort)
sort!: MatSort;

  constructor(private dialog: MatDialog,private adminService: AdminService) { }

  ngOnInit(): void {
    this.getClientPaymentDetails(1);
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
}
view(data:any){
  let dialogRef = this.dialog.open(InvoiceDataComponent, {
    width: '600px',position:{top:`70px`},
    disableClose: true,
    data:data
         
  });

}
getClientPaymentDetails(data:any){
  this.adminService.getClientPaymentDetails(data).subscribe((result:any)=>{
    if(result.status&&result.data.length>0){
      this.dataSource = result.data;
    }
  })
}

}
