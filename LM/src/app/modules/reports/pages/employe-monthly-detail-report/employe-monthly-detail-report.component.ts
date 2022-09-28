import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ReportsService } from '../../reports.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-employe-monthly-detail-report',
  templateUrl: './employe-monthly-detail-report.component.html',
  styleUrls: ['./employe-monthly-detail-report.component.scss']
})
export class EmployeMonthlyDetailReportComponent implements OnInit {

  List: any[] = [
  ];
  minDate = new Date('2020/01/01'); maxDate = new Date();
  userSession: any;
  headersList: any=[];
  monthdata:any;
  year:any;
  months=[{id:0,month:'Jan'},{id:1,month:'Feb'},{id:2,month:'Mar'},{id:3,month:'Apr'},{id:4,month:'May'},{id:5,month:'Jun'},{id:6,month:'Jul'},{id:7,month:'Aug'},{id:8,month:'Sep'},{id:9,month:'Oct'},{id:10,month:'Nov'},{id:11,month:'Dec'}]
  @ViewChild('TABLE') table!: ElementRef;
  constructor(public reportsService: ReportsService, public datePipe: DatePipe, public formBuilder: FormBuilder,) { }
  searchForm = this.formBuilder.group({ fromDate: [new Date()], toDate: [new Date()], Users: ['0'] });

  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') ?? '');
    this.Searchform();

  }
  Searchform() {
    this.List = [];
    let fromDate = this.datePipe.transform(this.searchForm.controls.fromDate.value, "y-MM-dd");
    let data={};

      data= {
        'manager_employee_id': null,
        'employee_id': this.userSession.id,
        'calendar_date': fromDate,

    }

    this.reportsService.getAttendanceMonthlyReport(data).subscribe((res: any) => {
      this.headersList=[];
      this.List=[];
      if (res.status) {
        let i = 0;
        res.data.forEach((e: any) => {
          if (i < 2) {
            let header:any = JSON.parse(e.result);
              this.headersList.push(header);
          } else {
            let header = JSON.parse(e.result);
              this.List.push(header);
          }
          i++;

        });
      }



    }, error => {
      error.error.text
    });
  }
  resetform() {
    this.List = [];
    this.headersList=[];
    this.searchForm.reset();
    this.searchForm.controls.fromDate.setValue(new Date());
       this.Searchform();

  }

  getColor(i: string): String {
    let color = ''
    if (i == "P") {
      return color = 'green'
    } else if (i == "H") {
      return color = '#800000';
    } else if (i == "W") {
      return color = 'blue';
    } else if (i == "L") {
      return color = 'orange';
    }
     else {
      return color = 'red';
    }
  }

  exportAsXLSX() {
    this.year=this.searchForm.controls.fromDate.value.getFullYear();
    for(let i =0;i<this.months.length;i++){
      if((this.searchForm.controls.fromDate.value).getMonth()==this.months[i].id){
       this.monthdata = this.months[i].month;
       break;
      }
    }
    const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Monthly_Detail_Report');
    /* save to file */
    XLSX.writeFile(wb, 'Monthly_Detail_Report_for_employee_'+this.monthdata+'_'+this.year+'.xlsx');

  }
}
