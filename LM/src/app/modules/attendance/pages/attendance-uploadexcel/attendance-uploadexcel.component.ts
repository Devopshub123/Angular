import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
  convertedJson!:string;
  constructor(private attendanceService:AttendanceService,public dialog: MatDialog) { }

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
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 ,raw:false,dateNF:'yyyy-mm-dd hh:mm:ss'}));
      let data=XLSX.utils.sheet_to_json(ws,{ raw:false,dateNF:'yyyy-mm-dd hh:mm:ss'});
      this.convertedJson=JSON.stringify(data,undefined,4);
      this.isview = true;
      this.isadd = false;
      }
  }
  
  SaveUploadedData(){
    this.attendanceService.excelDataForAttendance(JSON.parse(this.convertedJson)).subscribe(
     (res) => {
      if(res.status){
       this.removeData();
       this.isview=false;
       this.isadd = true;
      
       
      }else{
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          disableClose:true,
          data: res.message
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
    this.inputFile.nativeElement.value = '';
    this.data=[[], []];
    this.convertedJson = '';
    
  }
}
