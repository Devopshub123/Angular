import { Component, OnInit,ViewChild } from '@angular/core';
import { FormGroup,FormControl,Validators, FormBuilder, AbstractControl} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PopupComponent,PopupConfig } from '../../../../pages/popup/popup.component';
import { MatDialog } from '@angular/material/dialog'; 
import { OnlyNumberDirective } from 'src/app/custom-directive/only-number.directive';
import { LoginService } from 'src/app/services/login.service';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { MatSelect } from '@angular/material/select';
@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.scss']
})
export class HolidaysComponent implements OnInit {
  HolidaysForm:any= FormGroup;
  selectedBranch:any=[];

  constructor(private formBuilder: FormBuilder,private router: Router,private LM:CompanySettingService,private dialog: MatDialog) { }
  
  selectAll(select: MatSelect, values:any, array:any) {
    select.value = values;
    array = values;
    // console.log(this.selectedYears); // selectedYears is still undefined
  }

  deselectAll(select: MatSelect) {
    this.selectedBranch = [];
    select.value = [];
  }
  equals(objOne:any, objTwo:any) {
    if (typeof objOne !== 'undefined' && typeof objTwo !== 'undefined') {
      // return objOne.id === objTwo.id;
    }
  }
  ngOnInit(): void {
    this.HolidaysForm=this.formBuilder.group(
      {
      holiday: ["",],        
      date: ["",],
      branch: ["",],
      
      
    });
  }

}
