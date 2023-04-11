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

  constructor(private adminService: AdminService,) { }

  ngOnInit(): void {
    this.getSprypleClients();
  }
  applyFilter(event: Event) {
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
    }
   
  })
}
}
