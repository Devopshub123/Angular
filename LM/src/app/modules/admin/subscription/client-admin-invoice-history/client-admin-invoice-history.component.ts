import { Component, OnInit,ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InvoiceDataComponent } from '../dialog/invoice-data/invoice-data.component';
import { AdminService } from 'src/app/modules/admin/admin.service';
import { CompanySettingService } from 'src/app/services/companysetting.service';

@Component({
  selector: 'app-client-admin-invoice-history',
  templateUrl: './client-admin-invoice-history.component.html',
  styleUrls: ['./client-admin-invoice-history.component.scss']
})
export class ClientAdminInvoiceHistoryComponent implements OnInit {  
displayedColumns: string[] = ['sno', 'billingdate','invoice','amount','action'];
dataSource : any=[];
@ViewChild(MatPaginator)
paginator!: MatPaginator;
@ViewChild(MatSort)
sort!: MatSort;
pageLoading = true;
  constructor(private dialog: MatDialog,private adminService: AdminService, private companyService: CompanySettingService,) { 
    this.getClientSubscriptionDetails();
  }
 invoiceList:any=[]
  ngOnInit(): void {
   
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
            width: '600px',position:{top:`100px`},
            disableClose: true,
            data:data
                 
          });

}

getClientPaymentDetails(data:any){
  this.adminService.getClientPaymentDetails(data).subscribe((result:any)=>{
    if (result.status && result.data.length > 0) {
      this.invoiceList = result.data;
      this.dataSource = new MatTableDataSource(this.invoiceList);
      this.dataSource.paginator = this.paginator;
      this.pageLoading = false;
    }
  })
}
/**get all subscription details. */
  getClientSubscriptionDetails() {
  this.companyService.getClientSubscriptionDetails().subscribe((data:any)=>{
    if (data.status && data.data.length != 0) {
      this.getClientPaymentDetails(Number(data.data[0].client_id));
      
    }
  })
}
getPageSizes(): number[] {
  var customPageSizeArray = [];
  
  if (this.dataSource.data.length > 5) {
    customPageSizeArray.push(5);
  }
  if (this.dataSource.data.length > 10) {
    customPageSizeArray.push(10);
  }
  if (this.dataSource.data.length > 20) {
    customPageSizeArray.push(20);
   
  }
  customPageSizeArray.push(this.dataSource.data.length);
  return customPageSizeArray;
}
}
