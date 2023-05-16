import { Component, OnInit, ViewChild  } from '@angular/core';
import { FormGroup,FormControl,Validators, FormBuilder, AbstractControl, FormArray, ValidatorFn, ValidationErrors} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {AdminService} from'../../../admin/admin.service';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import { environment } from 'src/environments/environment';
import { EmsService } from 'src/app/modules/ems/ems.service';

@Component({
  selector: 'app-product-admin-clients',
  templateUrl: './product-admin-clients.component.html',
  styleUrls: ['./product-admin-clients.component.scss']
})
export class ProductAdminClientsComponent implements OnInit {
  arrayList:any=[];
  inductionForm:any= FormGroup;
  displayedColumns: string[] = ['sno','sid','cname','users','modules','startdate','lastpaid','amount','status'];
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
    private adminService: AdminService,) { }
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
    this.adminService.getAllSprypleClients().subscribe((result:any)=> {
      if(result.status&&result.data.length>0){
        this.arrayList = result.data
        this.dataSource = new MatTableDataSource(this.arrayList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageLoading = false;
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


}