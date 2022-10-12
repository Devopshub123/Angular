import { Component, OnInit, ViewChild  } from '@angular/core';
import { FormGroup,FormControl,Validators, FormBuilder, AbstractControl, FormArray} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AngularEditorConfig } from '@kolkov/angular-editor';
export interface PeriodicElement {
  id: number;
  programtype: string; 
  department: string;
  conductby:string;
  date:string;
  time:string;

}
export interface PeriodicElement2 {
  id: number;
  name: string; 
  department: string;
  checklist:string;
  status:string;

}
const Sample_Data: PeriodicElement[] = [
  {id: 1, programtype: 'Sreeb Tech', department:'Published',conductby:'Rakesh',date:'22/08/2022',time:'12.00'},
  {id: 2, programtype: 'Sanela',  department:'Save as draft',conductby:'Rakesh',date:'22/08/2022',time:'12.00'},
  {id: 3, programtype: 'Sriram Hardwaress', department:'Save as draft',conductby:'Rakesh',date:'22/08/2022',time:'12.00'},
  {id: 4, programtype: 'ABC Tech', department:'Save as draft',conductby:'Rakesh',date:'22/08/2022',time:'12.00'},
 
];
const Sample_Data2: PeriodicElement2[] = [
  {id: 1, name: 'Sreeb Tech', department:'Published',checklist:'Rakesh',status:'Active'},
  {id: 2, name: 'Sanela',  department:'Save as draft',checklist:'Rakesh',status:'Active'},
  {id: 3, name: 'Sriram Hardwaress', department:'Save as draft',checklist:'Rakesh',status:'Active'},
  {id: 4, name: 'ABC Tech', department:'Save as draft',checklist:'Rakesh',status:'Active'},
 
];

@Component({
  selector: 'app-induction-program',
  templateUrl: './induction-program.component.html',
  styleUrls: ['./induction-program.component.scss']
})
export class InductionProgramComponent implements OnInit {
  displayedColumns: string[] = ['sno','programtype','department','conductby','date','time'];
  displayedColumns2: string[] = ['sno','name','department','checklist','status'];
  dataSource = new MatTableDataSource<PeriodicElement>(Sample_Data);
  dataSource2 = new MatTableDataSource<PeriodicElement2>(Sample_Data2);
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor() { }

  ngOnInit(): void {
  }

}
