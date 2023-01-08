import { animate, state, style, transition, trigger } from '@angular/animations';
import { FormGroup, FormBuilder,FormArray, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import { MatDialog } from '@angular/material/dialog';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { EmsService } from '../../ems.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
export interface UserData {
  deptname: string;
  status: string;
  depthead: string;
  headcount: number;
  id: number;
  total: number;
}

@Component({
  selector: 'app-settings-add-checklist',
  templateUrl: './settings-add-checklist.component.html',
  styleUrls: ['./settings-add-checklist.component.scss'],

})
export class SettingsAddChecklistComponent implements OnInit {
  checklistForm:any = FormGroup;
  payGroupRequestForm!: FormGroup;
  isEarnings:boolean = true;
  isDeductions:boolean = true;
  expandedElement:any;
  Educations:any;
  companyDBName:any = environment.dbName;
  constructor(private router: Router, private formBuilder: FormBuilder,private dialog: MatDialog,private emsService: EmsService,
    private companyServices: CompanySettingService) {
    // this.addtext();
   }
   @ViewChild(MatPaginator)
   paginator!: MatPaginator;
   @ViewChild(MatSort)
   sort!: MatSort;
  categoryValue: any = [{ id: '1', name: 'Onboarding ' }, { id: '2', name: 'Offboarding' }];
  selectedCategory: any;
  displayedColumns2: string[] = ['sno','department','checklistname','status','action'];
  dataSource : MatTableDataSource<UserData> = <any>[];
  departmentList: any = [];
  addChecklistData: any = [];
  checklistData: any = [];
  userSession: any;
  statusValues: any;
  pageLoading = true;
  isAdd: boolean = false;
  isdata: boolean = true;
  isEdit: boolean = true;
  isSave: boolean = false;
  enable: any = null;
  messagesDataList: any = [];
  EM1: any;
  EM2: any;
  EM7: any;
  EM8: any;
  EM41: any;
  EM42: any;
  EM43: any;

  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.checklistForm = this.formBuilder.group(
      {
        onboardCategory: [""],
        department: [""],
        checklistId: [""],
        checklistName: [""],
         name:[""],
        description:[null,[Validators.required,this.noWhitespaceValidator()]],
        status:[""],
      });
    this.getMessagesList();
    this.getstatuslist();
    this.getDepartmentsData();
    this.checklistForm.controls.onboardCategory.setValue("Onboarding");
    this.getCheckListData(this.checklistForm.controls.onboardCategory.value);
    this.checklistForm.get('onboardCategory')?.valueChanges.subscribe((selectedValue: any) => {
      this.checklistData = [];
      this.getCheckListData(selectedValue);

    })
  }
  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }
  submit(){
    const invalid = [];
    const controls = this.checklistForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
          invalid.push(name);
      }
    }
    if (this.addChecklistData.length > 0) {
      let data = {
        department: this.checklistForm.controls.department.value,
        category:this.checklistForm.controls.onboardCategory.value,
        actionby: this.userSession.id,
        checklists:this.addChecklistData
      }

      this.emsService.setChecklistsMaster(data).subscribe((res: any) => {
        if (res.status) {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/Admin/settings-checklist"]));
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data:this.EM42
          });

        } else {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
           data:this.EM43
          });
        }
      });
    }
  }
  statusChange(status:any,value:any){
    let data = {
      department: value.department_id,
      category:value.category,
      actionby: this.userSession.id,
      checklists: [
        {
          id:value.id,
          name:null,
          description:value.description,
          status:status,
        }
      ]
    }

          this.emsService.setChecklistsMaster(data).subscribe((res: any) => {
            if (res.status) {
              this.getCheckListData(this.checklistForm.controls.onboardCategory.value);
         let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data:"Checklist status updated successfully"
          });

        } else {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
           data:this.EM8
          });
        }
      });
  }

  updateData( name: any,value:any) {
    let data = {
      department: value.department_id,
      category:value.category,
      actionby: this.userSession.id,
      checklists: [
        {
          id:value.id,
          name:null,
          description:name,
          status:value.status,
        }
      ]
    }

   this.emsService.setChecklistsMaster(data).subscribe((res: any) => {
        if (res.status) {
         this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/Admin/settings-checklist"]));
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data:this.EM7
          });

        } else {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
           data: this.EM8
          });
        }
      });
  }

  getstatuslist(){
    this.companyServices.getstatuslists().subscribe((result:any) => {
      console.log(result)
      if(result.status){
        this.statusValues = result.data;
      }

    })
  }
  onChangeRadio() {
    this.addChecklistData = [];
    this.clearFields();
    this.checklistForm.controls.department.setValue();
    this.checklistForm.controls.department.clearValidators();
    this.checklistForm.controls.department.updateValueAndValidity();

  }
  departmentChange() {
    this.addChecklistData = [];

  }
  cancel(){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    this.router.navigate(["/Admin/settings-checklist"]));
  }

  add() {
    if(this.addChecklistData !=undefined){
      const toSelect = this.addChecklistData.find((name:any) => name.description.trim().toLowerCase() == this.checklistForm.controls.description.value.trim().toLowerCase());
      if(toSelect!=undefined){
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          disableClose:true,
          data: this.EM41
       });
       this.clearFields();
      }
      else{
    this.addChecklist();
      }
      }
      else{
        this.addChecklist();
      }
  }

  addChecklist() {
    if (this.checklistForm.valid) {
      this.addChecklistData.push({
        //id: this.checklistForm.controls.checklistId.value,
        name:null,
        description: this.checklistForm.controls.description.value,
        status: "Active",
      });
      this.clearFields();
    }

  }
  clearFields() {
    this.checklistForm.controls.description.setValue();
    this.checklistForm.controls.description.clearValidators();
    this.checklistForm.controls.description.updateValueAndValidity();
}
  removeText(index:number) {
    this.addChecklistData.splice(index, 1);
  }
  getDepartmentsData() {
    this.companyServices.getMastertable('departmentsmaster', 1, 1, 1000, this.companyDBName).subscribe(data => {
      if(data.status){
        this.departmentList = data.data;
      }
    })
  }
  getCheckListData(data:any) {
    this.emsService.getChecklistsMaster(null,this.checklistForm.controls.onboardCategory.value).subscribe((res: any) => {
      if (res.status && res.data.length != 0) {
        this.checklistData = res.data;
        this.dataSource = new MatTableDataSource(this.checklistData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageLoading = false;
      }
    })
  }
  edit(w: any, i: any) {
    this.checklistForm.controls.description.setValue(i.description);
    this.enable = i.id;
    this.isEdit = false;
    this.isSave = true;
  }
  canceledit(event: any, id: any) {
    this.enable = null;
    this.isEdit = true;
    this.isSave = false;
    this.ngOnInit();

  }

  getPageSizes(): number[] {
    if (this.dataSource.data.length > 20) {
      return [5, 10, 20, this.dataSource.data.length];
    }
    else {

     return [5, 10, 20];
    }
  }

  AddData() {
    this.isAdd = true;
    this.isdata = false;
  }

  getMessagesList() {
    let data =
    {
      "code": null,
      "pagenumber": 1,
      "pagesize": 100
    }
    this.emsService.getMessagesListApi(data).subscribe((res: any) => {
      if (res.status) {
        this.messagesDataList = res.data;
        this.messagesDataList.forEach((e: any) => {
          if (e.code == "EM1") {
            this.EM1 =e.message
          } else if (e.code == "EM2") {
            this.EM2 =e.message
          }else if (e.code == "EM7") {
            this.EM7 =e.message
          }else if (e.code == "EM8") {
            this.EM8 =e.message
          } else if (e.code == "EM41") {
            this.EM41 =e.message
          }else if (e.code == "EM42") {
            this.EM42 =e.message
          }else if (e.code == "EM43") {
            this.EM43 =e.message
          }
        })
      } else {
        this.messagesDataList = [];
      }

    })
  }
}
