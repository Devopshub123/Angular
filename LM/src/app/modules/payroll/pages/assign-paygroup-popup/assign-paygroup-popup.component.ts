
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder,FormArray, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { CopyContentService } from '../../copy-content.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Clipboard } from '@angular/cdk/clipboard';
import * as XLSX from 'xlsx';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

@Component({
  selector: 'app-assign-paygroup-popup',
  templateUrl: './assign-paygroup-popup.component.html',
  styleUrls: ['./assign-paygroup-popup.component.scss']
})
export class AssignPaygroupPopupComponent implements OnInit {
  someContentToCopy = "Working!..fg";
  dataSource:any;
  earningDataSource:any=[];
  deductionDataSource:any=[];
  displayedColumns: string[] = ['component','type','amount','annual'];
  constructor(private clipboard: Clipboard,private copier:CopyContentService,public dialogRef: MatDialogRef<AssignPaygroupPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
   
    //   for(let i=0;i<data.length;i++){
    //     if(data[i].component_type == 'Earnings'){
    //       this.earningDataSource.push(data[i]);
    //     }
    //     else{
    //       this.deductionDataSource.push(data[i]);
    //     }

    //   }
      this.dataSource = data;
    }
    copydata(): void {
      // var urlField:any = document.querySelector('table');
      this.dialogRef.close();
        // var urlField:any = document.getElementById('table');
        // console.log(urlField)
        // this.copier.copyText(urlField);

      //   const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet('table');
      //  const wb: XLSX.WorkBook = XLSX.utils.book_new();
      //  XLSX.utils.book_append_sheet(wb, ws, 'Paygroup_Details');
      // //* save to file */
      //  XLSX.writeFile(wb, 'Paygroup_Details.xlsx');

//       var copyBtn:any = document.querySelector('#copy_btn');
// copyBtn.addEventListener('click', function () {
//   let table:any = document.querySelector('#testTable');
//   let button:any = document.querySelector('#button');
//   function selectNode(node:any){
//     let range  =  document.createRange();
//     range.selectNodeContents(node)
//     let select:any =  window.getSelection()
//     select.removeAllRanges()
//     select.addRange(range)
//   }
//   button.addEventListener('click',function(){
//     selectNode(table);
//     document.execCommand('copy')
    
//   })
// });
// var copyBtn:any = document.querySelector('#button');
// copyBtn.addEventListener('click', function () {
//   var urlField:any = document.querySelector('table');
   
// //   // create a Range object
//   var range = document.createRange();  
// //   console.log(range);
// //   // set the Node to select the "range"
//   range.selectNode(urlField);
//   let selection:any = window.getSelection();
// //   // add the Range to the set of window selections
//   selection.addRange(range);
   
// //   // execute 'copy', can't 'cut' in this case
// //   document.execCommand('copy');
// //   console.log(selection)
// //   // navigator.clipboard.writeText('copy')
// // }, false);
// navigator.clipboard.writeText(selection);

      // const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet('table');
      // const wb: XLSX.WorkBook = XLSX.utils.book_new();
      // XLSX.utils.book_append_sheet(wb, ws, 'Paygroup_Details');
      /* save to file */
      // XLSX.writeFile(wb, 'Paygroup_Details.xlsx');
      // this.copier.copyText('table');
      // this.dialogRef.close();
  
    }
    cancel(): void {
      this.dialogRef.close();
    }
  ngOnInit(): void {
  }

}
