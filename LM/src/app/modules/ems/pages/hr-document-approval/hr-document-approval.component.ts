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

export interface PeriodicElement {
  id: number;
  name: string;
  empid: string;
  
}
export interface PeriodicElement2 {
  id: number;
  document: string;
  documentnumber: string;
  file:string;
  
}
const Sample_Data: PeriodicElement[] = [
  {id: 1, name: 'Sreeb Tech',empid:'SBT001'},
  {id: 2, name: 'Sanela',empid:'SBT002'},
  {id: 3, name: 'Sriram Hardwaress',empid:'SBT003'},
  {id: 4, name: 'ABC Tech',empid:'SBT004'},
  {id: 5, name: 'Soft Soluntions',empid:'SBT005'},
  {id: 6, name: 'Dell ',empid:'SBT006'},
  {id: 7, name: 'Tech Mahindra',empid:'SBT007'},
];
const Sample_Data2:PeriodicElement2[] = [
  {id: 1, document: 'Adhar',documentnumber:'543767676776767',file:'Attachment'},
  {id: 2, document: 'PAN',documentnumber:'SBT002FDFGHGHJ',file:'Attachment'},
  
]

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
  // dataSource = new MatTableDataSource<PeriodicElement>(Sample_Data);
  dataSource: MatTableDataSource<any>=<any>[];
  datadocumentsSource: MatTableDataSource<any>=<any>[];
  // datadocumentsSource = new MatTableDataSource<PeriodicElement2>(Sample_Data2);
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private formBuilder: FormBuilder,private router: Router,private spinner:NgxSpinnerService,private ES:EmsService,public dialog: MatDialog,private mainService:MainService,) { }

  ngOnInit(): void {
    this.getFilesForApproval();
    this.approvalForm = this.formBuilder.group(
      {
        empname: [""],
        empid:[""],
      });
  }
  preview(event:any,data:any){
    this.ishide=false;
    this.isview=true;
    this.approvalForm.controls.empid.setValue(data.empcode)
    this.approvalForm.controls.empname.setValue(data.empname)
    for(let i=0;i<this.emplist.length;i++){
      if(this.emplist[i].empid == data.empid){
        this.fileslist.push(this.emplist[i])
      }
    }
    this.datadocumentsSource = new MatTableDataSource(this.fileslist)
    this.datadocumentsSource.paginator = this.paginator;
    this.datadocumentsSource.sort = this.sort;
  }
  getFilesForApproval(){
    this.ES.getFilesForApproval().subscribe((res:any)=>{
      if(res.status && res.data){
        console.log(res.data)
        this.emplist=(res.data)
        // for(let i=0;i<res.data.length;i++){
        //   if(res.data[i].empid){
        //     this.emplist.push(res.data[i])
        //   }
        // }
        this.dataSource = new MatTableDataSource(res.data)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      }
    })

  }
  fileView(data:any){
    let info = data;
    this.spinner.show()
        this.mainService.getDocumentOrImagesForEMS(info).subscribe((imageData:any) => {
          console.log('sfagf',imageData);
          console.log('sfagfggf',imageData.image.data)
          if(imageData.success){
            this.spinner.hide();
            // let TYPED_ARRAY = new Uint8Array(imageData.image.data);
            // const STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
            //   return data + String.fromCharCode(byte);
            // }, '');
            let TYPED_ARRAY = new Uint8Array(imageData.image.data);
            const STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
              return data + String.fromCharCode(byte);
            }, '');
            const file = new Blob([TYPED_ARRAY], { type: "application/pdf" });
            this.fileURL = URL.createObjectURL(file);
            window.open(this.fileURL);
            // let base64String= btoa(STRING_CHAR)
            //   var documentName= data.pdfName.split('.')
            // if(documentName[documentName.length-1]=='pdf'){
            // const file = new Blob([TYPED_ARRAY], { type: "application/pdf" });
            // window.open(this.fileURL);
            // this.fileURL = URL.createObjectURL(file);
            // }else{
            //   this.fileURL='data:image/png;base64,'+base64String;
            //   window.open(this.fileURL);
            // }
            
          }
        })
  }
 approve(event:any,data:any){
  console.log(data)
  let updatedata=
  {
    id:data.fileid,
    status:'Approved',
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
 reject(event:any,data:any){
  console.log(data)
  let updatedata=
  {
    id:data.fileid,
    status:'Reject',
  }
  console.log(updatedata)
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


}
