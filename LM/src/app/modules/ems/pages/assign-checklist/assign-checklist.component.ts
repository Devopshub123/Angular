import { Component, OnInit, ViewChild  } from '@angular/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormGroup,FormControl,Validators, FormBuilder, AbstractControl, FormArray} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
export interface PeriodicElement {
  id: number;
  department: string;
  role: string;
  assignto:string,
}
const Sample_Data: PeriodicElement[] = [
  {id: 1, department: 'Sreeb Tech',  role : 'manager1',assignto:'Published'},
  {id: 2, department: 'Sanela',  role : 'manager1',assignto:'Save as draft'},
  {id: 3, department: 'Sriram Hardwaress', role : 'manager1',assignto:'Save as draft'},
  {id: 4, department: 'ABC Tech', role : 'manager22',assignto:'Save as draft'},
  {id: 5, department: 'Soft Soluntions',   role: 'manager1',assignto:'Save as draft'},
  {id: 6, department: 'Dell ',   role : 'manager1',assignto:'Save as draft'},
  {id: 7, department: 'Tech Mahindra',   role : 'manager5',assignto:'Save as draft'},
  {id: 8, department: 'Wipro',   role : 'manager1',assignto:'Published'},
  {id: 9, department: 'Accenture',  role : 'manager1',assignto:'Save as draft'},
  {id: 10, department: 'TATA ',  role : 'manager1',assignto:'Save as draft'},
  {id: 11, department: 'Cognizent',  role : 'manager1',assignto:'Published'},
]; 

@Component({
  selector: 'app-assign-checklist',
  templateUrl: './assign-checklist.component.html',
  styleUrls: ['./assign-checklist.component.scss']
})
export class AssignChecklistComponent implements OnInit {
  checklistForm:any= FormGroup;
  isview:boolean=true;
  ishide:boolean=false;
  Educations:any=[];
  displayedColumns: string[] = ['sno','department','action'];
  arrayValue:any=[{id:'1',name:'Onboarding '},{id:'2',name:'Offboarding'}];
  dataSource = new MatTableDataSource<PeriodicElement>(Sample_Data);
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  constructor(private formBuilder: FormBuilder,private router: Router,) {
   
   }

  ngOnInit(): void {
    this.checklistForm=this.formBuilder.group(
      {
      department: ["IT"],        
      role: ["",],
      assignto:["",],
      text: this.formBuilder.array([]) ,
      
    });
    // this.addtext();
  }
  Add(){
    this.ishide = true;
    this.isview = false;
  }
  close(){
    this.ishide = false;
    this.isview = true;
  }
  edit(event:any,data:any){}
  text(): FormArray {
    return this.checklistForm.get("text") as FormArray
  }
 
  newText(): FormGroup {
    return this.formBuilder.group({
      textinput:''
      
    })
  }
  addtext() {
    this.text().push(this.newText());

  }
   addtextdetails(){
    for(let i =0;i<this.text().controls.length;i++){
      if(this.text().controls[i].value.textinput != null){
        this.Educations.push({
          textinput:this.text().controls[i].value.textinput,
        });
  

      }
     
    } 
  }
  removetext(empIndex:number) {
    this.text().removeAt(empIndex);
  }

}
