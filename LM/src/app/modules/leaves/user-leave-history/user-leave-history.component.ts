import { DialogComponent } from 'src/app/modules/attendance/dialog/dialog.component';
import { Component, OnInit,ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { LeavesService } from '../leaves.service';
import {Router} from "@angular/router";
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
@Component({
  selector: 'app-user-leave-history',
  templateUrl: './user-leave-history.component.html',
  styleUrls: ['./user-leave-history.component.scss']
})
export class UserLeaveHistoryComponent implements OnInit {
  usersession:any;
  leavedata:any;
  displayedColumns: string[] = ['appliedon','leavetype','fromdate','todate','days','status','approver','action'];
  dataSource: MatTableDataSource<any>=<any>[];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private router: Router,private LM:LeavesService) { }

  ngOnInit(): void {
    this.usersession = JSON.parse(sessionStorage.getItem('user') || '');
    this.getleavehistory(null,null);
  }
  getleavehistory(page:any,size:any){
    this.LM.getleavehistory(this.usersession.id,1,100).subscribe((result:any)=>{
      this.leavedata=result.data
      this.dataSource = new MatTableDataSource(this.leavedata);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log('gggggggg', result)
      // this.count = result.data[0].total;

    })

  }
view(data:any){
  console.log(data)
}
}
