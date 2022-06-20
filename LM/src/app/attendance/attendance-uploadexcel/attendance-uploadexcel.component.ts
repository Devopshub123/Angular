import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import * as XLSX from 'xlsx';
import { AttendanceService } from '../attendance.service';
type AOA = any[][];

@Component({
  selector: 'app-attendance-uploadexcel',
  templateUrl: './attendance-uploadexcel.component.html',
  styleUrls: ['./attendance-uploadexcel.component.scss']
})
export class AttendanceUploadexcelComponent implements OnInit {
  data: AOA = [[], []];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName: string = 'SheetJS.xlsx';
  @ViewChild('inputFile') inputFile!: ElementRef;
  convertedJson!:string;
  constructor(private attendanceService:AttendanceService,public dialog: MatDialog) { }

  ngOnInit(): void {
  }
  onChange(event:any){
      console.log(event.target.files);
      const selectedFile=event.target.files[0];
      const fileReader= new FileReader();
      fileReader.readAsBinaryString(selectedFile);
      fileReader.onload=(event:any)=>{
         //   console.log(event);
      let binaryData= event.target.result;
      let workbook= XLSX.read(binaryData,{type:"binary",cellText:false,cellDates:true});

      /* grab first sheet */
      const wsname: string = workbook.SheetNames[0];
      const ws: XLSX.WorkSheet = workbook.Sheets[wsname];

      /* save data */
      this.data = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 ,raw:false,dateNF:'yyyy-mm-dd hh:mm:ss'}));
      let data=XLSX.utils.sheet_to_json(ws,{ raw:false,dateNF:'yyyy-mm-dd hh:mm:ss'});
      this.convertedJson=JSON.stringify(data,undefined,4);
      console.log(this.convertedJson);
     
      // workbook.SheetNames.forEach(sheet=>{

      //   console.log(this.convertedJson);
      // })


      }
  }
  SaveUploadedData(){
    console.log("gg",this.convertedJson)
    this.attendanceService.excelDataForAttendance(JSON.parse(this.convertedJson)).subscribe(
     (res) => {
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
        disableClose:true,
        data: "Uploaded successfully"
     });

     }, 
     error =>{
       error.error.text
     })
  
  }
  
  removeData() {
    this.inputFile.nativeElement.value = '';
    this.data=[[], []];
    this.convertedJson = '';
  }
}
