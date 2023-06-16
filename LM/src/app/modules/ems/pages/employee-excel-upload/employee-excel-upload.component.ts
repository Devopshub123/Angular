import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from 'src/app/modules/admin/admin.service';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import * as XLSX from 'xlsx';
import { Router, RouterModule } from '@angular/router';
import { EmsService } from '../../ems.service';
type AOA = any[][];
@Component({
  selector: 'app-employee-excel-upload',
  templateUrl: './employee-excel-upload.component.html',
  styleUrls: ['./employee-excel-upload.component.scss']
})
export class EmployeeExcelUploadComponent implements OnInit {
  data: AOA = [[], []];
  viewdata:AOA =[[],[]];
  isview:boolean=false;
  isadd:boolean=true;
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';
  @ViewChild('inputFile') inputFile!: ElementRef;
  convertedJson!: string;
  viewconvertedJson!: string;
  messagesDataList: any = [];
  reqField: any;
  reqOption: any;
  reqSave: any;
  reqNotSave: any;
  isLoading = false;
  companyName: any;
  userSession: any;
  constructor(private emsService: EmsService, public dialog: MatDialog,private router: Router,) {
    this.companyName = sessionStorage.getItem("companyName")?sessionStorage.getItem("companyName"):null;
    this.userSession = JSON.parse(sessionStorage.getItem('user') ?? '');
  }

  ngOnInit(): void {
  }
  onChange(event:any){
    const selectedFile=event.target.files[0];
    const fileReader= new FileReader();
    fileReader.readAsBinaryString(selectedFile);
    fileReader.onload=(event:any)=>{
    let binaryData= event.target.result;
    let workbook= XLSX.read(binaryData,{type:"binary",cellText:false,cellDates:true});

    /* grab first sheet */
    const wsname: string = workbook.SheetNames[0];
    const ws: XLSX.WorkSheet = workbook.Sheets[wsname];

    /* save data */
    this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 ,raw:false,dateNF:'yyyy-mm-dd'}));
    let data=XLSX.utils.sheet_to_json(ws,{ raw:false,dateNF:'yyyy-mm-dd'});
    this.viewdata = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 ,raw:false,dateNF:'d-m-yy'}));
    let viewdata=XLSX.utils.sheet_to_json(ws,{ raw:false,dateNF:'d-m-yy'});
    // this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 ,raw:false}));
    // let data=XLSX.utils.sheet_to_json(ws,{ raw:true});
    this.convertedJson=JSON.stringify(data,undefined,4);
    this.isview = true;
    this.isadd = false;
    
    }
}

  SaveUploadedData(){
    this.isLoading = true;
    let data = {
      'emplist': JSON.parse(this.convertedJson),
      'createdby':this.userSession.id
    }
    this.emsService.setEmployeeExcelData(data,this.companyName).subscribe(
     (res:any) => {
      this.isLoading=false;
        if (res.status) {
          let resMessage: any;
          if (res.message=="excelUploadSave") {
            resMessage = this.reqSave
          } else if(res.message=="unableToUpload"){
            resMessage = this.reqNotSave
          } else {
            resMessage=this.reqNotSave
          }
       this.removeData();
       this.isview=false;
       this.isadd = true;
       this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
       this.router.navigate(["/ems/employee-excel-upload "]));
       let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position:{top:`70px`},
          disableClose:true,
          data: 'Data saved successfully.'//resMessage
       });
      }else{
        
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose:true,
          data: 'Unable to save data.'//this.reqNotSave
       });
      }
     }, 
     error =>{
       error.error.text
     })
  }
  removeData(){
    this.isview = false;
    this.isadd = true ;
  //  this.inputFile.nativeElement.value = '';
    this.data=[[], []];
    this.convertedJson = '';
  }
}
