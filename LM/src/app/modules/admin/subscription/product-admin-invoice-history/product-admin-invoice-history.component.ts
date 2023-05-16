import { Component, OnInit, ViewChild  } from '@angular/core';
import { FormGroup,FormControl,Validators, FormBuilder, AbstractControl, FormArray, ValidatorFn, ValidationErrors} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {AdminService} from'../../../admin/admin.service';
import { environment } from 'src/environments/environment';
import { ProductInvoiceDataComponent } from '../dialog/product-invoice-data/product-invoice-data.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-product-admin-invoice-history',
  templateUrl: './product-admin-invoice-history.component.html',
  styleUrls: ['./product-admin-invoice-history.component.scss']
})
export class ProductAdminInvoiceHistoryComponent implements OnInit {
  arrayList:any=[];
  inductionForm:any= FormGroup;
  displayedColumns: string[] = ['sno', 'companyname','billingdate','useddate','invoice','amount','action'];
  dataSource: MatTableDataSource<any>=<any>[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  userSession:any;
  arrayValue:any;
  companyDBName:any = environment.dbName;
  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,private dialog: MatDialog) { }
  pageLoading = true;
  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') ?? '');
    this.getSprypleClients();
    this.inductionForm=this.formBuilder.group(
      {
        pid:[''],
        programType: [""],
        status:['']

      });
  }

  getSprypleClients(){
    this.adminService.getPayments().subscribe((result:any)=> {
      if(result.status&&result.data.length>0){
        this.arrayList = result.data
        console.log("this.arrayList",this.arrayList)
        this.dataSource = new MatTableDataSource(this.arrayList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageLoading = false;
      }
    })
  }
  view(data:any){
    data.productadmin = true;
    let dialogRef = this.dialog.open(ProductInvoiceDataComponent, {
      width: '600px',position:{top:`70px`},
      disableClose: true,
      data:data
    });
  
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


}