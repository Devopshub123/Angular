import { EmsService } from './../../ems.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup,FormControl,Validators, FormBuilder, AbstractControl, FormArray} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { MainService } from 'src/app/services/main.service';
import {NgxSpinnerService} from "ngx-spinner";
import { ComfirmationDialogComponent } from 'src/app/pages/comfirmation-dialog/comfirmation-dialog.component';

@Component({
  selector: 'app-hr-document-approval',
  templateUrl: './hr-document-approval.component.html',
  styleUrls: ['./hr-document-approval.component.scss']
})
export class HrDocumentApprovalComponent implements OnInit {
  approvalForm:any= FormGroup;
  ishide:boolean=true;
  isview:boolean=false;
  emplist:any=[];
  fileslist:any=[];
  fileURL:any;
  displayedColumns: string[] = ['sno','empid','name','Action'];
  displayedColumns2: string[] = ['sno','document','documentnumber','file','Action'];

  dataSource: MatTableDataSource<any>=<any>[];
  datadocumentsSource: MatTableDataSource<any>=<any>[];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatPaginator)
  paginator2!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  employeeEmailData: any = []
  employeeId: any;
  constructor(private formBuilder: FormBuilder, private router: Router,
    private spinner: NgxSpinnerService, private ES: EmsService,
    public dialog: MatDialog, private mainService: MainService,
  ) { this.formData = new FormData();}
  pageLoading = true;
  pageLoading2 = true;
  formData: any;
  ngOnInit(): void {
    this.getFilesForApproval();
    this.approvalForm = this.formBuilder.group(
      {
        empname: [""],
        empid:[""],
      });
  }
  preview(event:any,data:any){
    let datas=[]
    datas.push(data)
    this.ishide=false;
    this.isview = true;
    this.employeeId = data.empid;
    this.approvalForm.controls.empid.setValue(data.empcode)
    this.approvalForm.controls.empname.setValue(data.empname)
    for(let i=0;i<this.emplist.length;i++){
      if(this.emplist[i].empid == data.empid){
        this.fileslist.push(this.emplist[i])
      }
    }
    this.datadocumentsSource = new MatTableDataSource(datas)
     this.datadocumentsSource.sort = this.sort;
    this.pageLoading2 = false;
    this.getEmployeeEmailData();
  }
  getFilesForApproval(){
    this.ES.getFilesForApproval().subscribe((res:any)=>{
      if(res.status && res.data){
        this.emplist=(res.data)
        this.dataSource = new MatTableDataSource(res.data)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageLoading = false;

      }
    })

  }
  fileView(data: any) {

    let info = data
    this.spinner.show()
    this.mainService.getDocumentOrImagesForEMS(info).subscribe((imageData) => {

      if (imageData.success) {


        this.spinner.hide();

        let TYPED_ARRAY = new Uint8Array(imageData.image.data);
        const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
          return data + String.fromCharCode(byte);
        }, '');
        let base64String = btoa(STRING_CHAR)
        var documentName = data.fname.split('.')

        if (documentName[documentName.length - 1] == 'pdf') {
          const file = new Blob([TYPED_ARRAY], { type: "application/pdf" });
          this.fileURL = URL.createObjectURL(file);
          window.open(this.fileURL);

        } else {
          this.fileURL = new Blob([TYPED_ARRAY], { type: "image/png" })
          let url = URL.createObjectURL(this.fileURL)
          window.open(url, '_blank');

        }

      }
    })

  }

  approve(event: any, data: any) {
    let email = JSON.stringify(this.employeeEmailData)
  let updatedata=
  {
    id:data.fileid,
    status: 'Approved',
    email:email
   }
  this.ES.documentApproval(updatedata).subscribe((res:any)=>{
    if(res.status){
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/ems/hr-document-approval"]));
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position:{top:`70px`},
        disableClose: true,
        data: 'Document Approved successfully'
      });
    }
    else{
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position:{top:`70px`},
        disableClose: true,
        data: 'Unable to approve document'
      });
    }

  })
  }
  reject(event: any, data: any) {
    let dialogRef = this.dialog.open(ComfirmationDialogComponent, {
      position: { top: `10%` },
      disableClose: true,
      data: { message: "Are you sure you want to reject document ? ", YES: 'YES', NO: 'NO' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'YES') {

  let email = JSON.stringify(this.employeeEmailData);
  let updatedata=
  {
    id:data.fileid,
    status: 'Rejected',
    email:email
  }
  this.ES.documentApproval(updatedata).subscribe((res:any)=>{
    if(res.status){
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/ems/hr-document-approval"]));
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position:{top:`70px`},
        disableClose: true,
        data: 'Document Rejected successfully'
      });
    }
    else{
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position:{top:`70px`},
        disableClose: true,
        data: 'Unable to reject document'
      });
    }

   })
    }
  });
  }

  // reject(event: any, data: any) {
  // let email = JSON.stringify(this.employeeEmailData);
  // let updatedata=
  // {
  //   id:data.fileid,
  //   status: 'Rejected',
  //   email:email
  // }
  // this.ES.documentApproval(updatedata).subscribe((res:any)=>{
  //   if(res.status){
  //     this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
  //         this.router.navigate(["/ems/hr-document-approval"]));
  //     let dialogRef = this.dialog.open(ReusableDialogComponent, {
  //       position:{top:`70px`},
  //       disableClose: true,
  //       data: 'Document Rejected successfully'
  //     });
  //   }
  //   else{
  //     let dialogRef = this.dialog.open(ReusableDialogComponent, {
  //       position:{top:`70px`},
  //       disableClose: true,
  //       data: 'Unable to reject document'
  //     });
  //   }

  // })
  // }
  
  cancel() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    this.router.navigate(["/ems/hr-document-approval"]));
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
  
  getEmployeeEmailData() {
    this.employeeEmailData = [];
    this.ES.getEmployeeEmailDataByEmpid(this.employeeId)
      .subscribe((res: any) => {
        this.employeeEmailData = JSON.parse(res.data[0].jsonvalu)[0];
      })
}
}
