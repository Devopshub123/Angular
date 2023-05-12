import { Component, OnInit,ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InvoiceDataComponent } from '../dialog/invoice-data/invoice-data.component';
import { ProductInvoiceDataComponent } from '../dialog/product-invoice-data/product-invoice-data.component';
import { AdminService } from 'src/app/modules/admin/admin.service';


@Component({
  selector: 'app-product-admin-invoice-history',
  templateUrl: './product-admin-invoice-history.component.html',
  styleUrls: ['./product-admin-invoice-history.component.scss']
})
export class ProductAdminInvoiceHistoryComponent implements OnInit {
  displayedColumns: string[] = ['sno', 'companyname','billingdate','useddate','invoice','amount','action'];
  dataSource : MatTableDataSource<any> = <any>[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private dialog: MatDialog,private adminService: AdminService) { }

  ngOnInit(): void {
    this.getPayments();
  }

view(data:any){
  data.productadmin = true;
  let dialogRef = this.dialog.open(ProductInvoiceDataComponent, {
    width: '600px',position:{top:`70px`},
    disableClose: true,
    data:data
  });

}
getPayments(){
  this.adminService.getPayments().subscribe((result:any)=>{
    if(result.status&&result.data.length>0){
      this.dataSource = result.data;
    }
 })
}
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
     if (this.dataSource.paginator) {
       this.dataSource.paginator.firstPage();
    }
  }
}
