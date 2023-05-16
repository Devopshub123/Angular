import { Component, OnInit, ViewChild ,ElementRef } from '@angular/core';
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
import * as XLSX from "xlsx";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
const htmlToPdfmake = require("html-to-pdfmake");
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
  @ViewChild('table') table!: ElementRef;
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
        console.log("data",this.arrayList)
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
  public exportPDF(): void {
    const pdfTable = this.table.nativeElement;
    var html = htmlToPdfmake(pdfTable.innerHTML);
    pdfMake.createPdf({
      info: {
        title: "clients data",
        author:'Sreeb tech',
        subject:'Theme',
            keywords:'Report'
      },
      footer: function (currentPage, pageCount) {
        return {
          margin: 10,
          columns: [
            {
              fontSize: 9,
              text: [
                {
                  text: 'Page ' + currentPage.toString() + ' of ' + pageCount,
                }
              ],
              alignment: 'center'
            }
          ]
        };
      },
      content: [
        {
          text: "Clients\n\n",
          style: 'header',
          alignment: 'center',
          fontSize: 14
        },
        // {
        //   text:
        //     "Designation :  " + this.designationForPdf +"\n" +
        //     "Employee Name and Id:  " + this.employeeNameForPdf + "\n" +
        //     "Year:  " + this.searchForm.controls.calenderYear.value+ "\n",
        //   fontSize: 10,
        //   margin: [0, 0, 0, 20],
        //   alignment: 'left'
        // },
        html
      ],
      pageOrientation: 'landscape'//'portrait'
    }).download("Clients.pdf");

  }
  exportAsXLSX() {
  
    // var ws:XLSX.WorkSheet=XLSX.utils.table_to_sheet('Payroll_report_for_financeteam_');
    var ws:XLSX.WorkSheet=XLSX.utils.table_to_sheet(document.getElementById('table'));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'clients');

    /* save to file */
    // XLSX.writeFile('Payroll_report_for_financeteam_'+this.monthdata,'Payroll_report_for_financeteam_'+this.monthdata+'_'+this.year+'.xlsx')
    XLSX.writeFile(wb, 'clients_.xlsx');

  }

}