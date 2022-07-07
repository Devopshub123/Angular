import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { LeavePoliciesService } from 'src/app/services/leave-policies.service'; 
@Component({
  selector: 'app-leavepolicies',
  templateUrl: './leavepolicies.component.html',
  styleUrls: ['./leavepolicies.component.scss']
})
export class LeavepoliciesComponent implements OnInit {
  displayedColumns: string[] = ['sno','configurationrules','addditionalinformation'];
  ruleInfo:any=[];
  ruleMaasterData:any=[];
  defaultRuleInfo:any=[];
  dataSource: MatTableDataSource<any>=<any>[];
  constructor(private LM:LeavePoliciesService) { }

  ngOnInit(): void {
    this.getLeaveRules()
  }
  getLeaveRules() {
    this.LM.getLeavePolicies(null,true,1,10).subscribe((result) => {

      this.defaultRuleInfo=JSON.parse(result.data[0].json);
      console.log(this.defaultRuleInfo)
      this.dataSource = new MatTableDataSource(this.defaultRuleInfo);

    })
  

  }

}
