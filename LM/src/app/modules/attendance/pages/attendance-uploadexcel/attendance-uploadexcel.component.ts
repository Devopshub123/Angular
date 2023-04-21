import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from 'src/app/modules/admin/admin.service';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import * as XLSX from 'xlsx';
import { AttendanceService } from '../../attendance.service';
type AOA = any[][];

@Component({
  selector: 'app-attendance-uploadexcel',
  templateUrl: './attendance-uploadexcel.component.html',
  styleUrls: ['./attendance-uploadexcel.component.scss']
})
export class AttendanceUploadexcelComponent implements OnInit {
  data: AOA = [[], []];
  isview:boolean=false;
  isadd:boolean=true;
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';
  @ViewChild('inputFile') inputFile!: ElementRef;
  convertedJson!: string;
messagesDataList: any = [];
reqField: any;
reqOption: any;
reqSave: any;
reqNotSave: any;
isLoading = false;
  constructor(private attendanceService:AttendanceService,public dialog: MatDialog,private adminService: AdminService) { }

  ngOnInit(): void {
    this.getMessagesList();
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
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 ,raw:false,dateNF:'yyyy-mm-dd hh:mm:ss'}));
      let data=XLSX.utils.sheet_to_json(ws,{ raw:false,dateNF:'yyyy-mm-dd hh:mm:ss'});
      this.convertedJson=JSON.stringify(data,undefined,4);
      console.log(" this.convertedJson", this.convertedJson)
      this.isview = true;
      this.isadd = false;
      }
  }
  
  SaveUploadedData(){
    this.isLoading=true;
    this.attendanceService.excelDataForAttendance(JSON.parse(this.convertedJson)).subscribe(
     (res) => {
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

       let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position:{top:`70px`},
          disableClose:true,
          data: resMessage
       });
      }else{
        
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose:true,
          data:this.reqNotSave
       });
      }
     }, 
     error =>{
       error.error.text
     })
  
  }
  
  removeData() {
    this.isview = false;
    this.isadd = true ;
  //  this.inputFile.nativeElement.value = '';
    this.data=[[], []];
    this.convertedJson = '';
    
  }
  getMessagesList() {
    let data = 
     {
       "code": null,
       "pagenumber":1,
       "pagesize":100
   }
   this.adminService.getMessagesListApi(data).subscribe((res:any)=>{
    if(res.status) {
      this.messagesDataList = res.data;
      this.messagesDataList.forEach((e: any) => {
       if (e.code == "ATT20") {
        this.reqSave = e.message
       }else if (e.code == "ATT21") {
         this.reqNotSave =e.message
       }
     })
    }
    else {
      this.messagesDataList = [];
    }

  })
 }
}
