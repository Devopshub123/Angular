import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detailed-report-for-manager',
  templateUrl: './detailed-report-for-manager.component.html',
  styleUrls: ['./detailed-report-for-manager.component.scss']
})
export class DetailedReportForManagerComponent implements OnInit {

  constructor() { }
  userSession:any;
  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');

  }

}
