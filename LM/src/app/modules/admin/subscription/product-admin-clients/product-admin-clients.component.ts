import { Component, OnInit,ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdminService } from 'src/app/modules/admin/admin.service';

@Component({
  selector: 'app-product-admin-clients',
  templateUrl: './product-admin-clients.component.html',
  styleUrls: ['./product-admin-clients.component.scss']
})
export class ProductAdminClientsComponent implements OnInit {
  displayedColumns: string[] = ['sno','subscriptionid', 'companyname','users','modules','startdate','lastdate','cost','status'];
  dataSource: any=[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  pageLoading = true;

  constructor(private adminService: AdminService,) { }

  ngOnInit(): void {
    this.getSprypleClients();
  }
  applyFilter(event: Event) {
    console.log("jhdfsj")
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();


    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
}
getSprypleClients(){
  this.adminService.getAllSprypleClients().subscribe((result:any)=>{
    if(result.status&&result.data.length>0){
      this.dataSource = result.data;
      this.pageLoading = false;
    }
   
  })
}
getPageSizes(): number[] {
  var customPageSizeArray = [];
  
  if (this.dataSource.length > 5) {
    customPageSizeArray.push(5);
  }
  if (this.dataSource.length > 10) {
    customPageSizeArray.push(10);
  }
  if (this.dataSource.length > 20) {
    customPageSizeArray.push(20);
   
  }
  customPageSizeArray.push(this.dataSource.length);
  return customPageSizeArray;
}
}
