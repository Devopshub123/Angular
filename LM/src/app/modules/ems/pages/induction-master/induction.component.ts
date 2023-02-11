import { Component, OnInit, ViewChild  } from '@angular/core';
import { FormGroup,FormControl,Validators, FormBuilder, AbstractControl, FormArray, ValidatorFn, ValidationErrors} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import {EmsService} from '../../ems.service'
import {UserData} from "../../../attendance/models/EmployeeData";
import {AdminService} from'../../../admin/admin.service';
import {ReusableDialogComponent} from '../../../../pages/reusable-dialog/reusable-dialog.component'
import {ConfirmationComponent} from "../../../leaves/dialog/confirmation/confirmation.component";
import { CompanySettingService } from 'src/app/services/companysetting.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-induction',
  templateUrl: './induction.component.html',
  styleUrls: ['./induction.component.scss']
})
export class InductionComponent implements OnInit {
  arrayList:any=[];
  enable: any = null;
  isdata: boolean = true;
  isEdit: boolean = true;
  isSave: boolean = false;
  inductionForm:any= FormGroup;
  designations:any=[];
  min:any=new Date();
  max:any=new Date();
  isview:boolean=true;
  ishide:boolean=false;
  displayedColumns: string[] = ['sno','programtype','status','action'];
  dataSource: MatTableDataSource<any>=<any>[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  userSession:any;
  arrayValue:any;
  EM4:any;
  EM5:any;
  EM6:any;
  EM7:any;
  EM8:any;
  EM1:any;
  EM9:any;
  EM10:any;
  companyDBName:any = environment.dbName;
  EM65: any;
  valid:boolean=false;

  constructor(private dialog:MatDialog,private formBuilder: FormBuilder,private companyServices: CompanySettingService,private router: Router,private EMS:EmsService,private EM:AdminService) { }
  pageLoading = true;
  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') ?? '');
    this.getProgramsMaster(null);
    this.getAllStatus()
    this.inductionForm=this.formBuilder.group(
      {
        pid:[''],
        programType: ["",[Validators.required,this.noWhitespaceValidator()]],
        status:['']

      });
    this.getMessageList()
  }

  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }
  Add(){
    this.ishide = true;
    this.isview = false;
  }
  close(){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(["/Admin/induction"]));
    // this.ishide = false;
    // this.isview = true;
  }
  edit(event:any,data:any){
    // this.designationForm.controls.designation.setValue(i.designation)
    this.enable = data.id;
    this.isEdit = false;
    this.isSave = true;
    this.inductionForm.controls.programType.setValue(data.description);


  }
  save(event:any,info:any){
    if(this.inductionForm.valid) {
      this.enable = null;
      this.isEdit = true;
      this.isSave = false;
      this.inductionForm.controls.pid.value = info.id;
      this.setProgramsMaster();
    }else {
      this.dialog.open(ReusableDialogComponent, {
        position: {top: `70px`},
        disableClose: true,
        data: this.EM9
      });
    }

  }
  canceledit(event: any, id: any) {
    this.enable = null;
    this.isEdit = true;
    this.isSave = false;
    this.ngOnInit();
  }
  delete(){}

  // getProgramsMaster(pId:any){
  //   this.EMS.getProgramsMaster(pId).subscribe((result: any) => {
  //     if(result && result.status){
  //       this.arrayList=result.data
  //       this.dataSource = new MatTableDataSource(this.arrayList);
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;
  //       // this.arrayList=[]
  //     }else {
  //       this.arrayList=[];
  //       this.dataSource = new MatTableDataSource(this.arrayList);
  //       this.dataSource.paginator = this.paginator;
  //       this.dataSource.sort = this.sort;

  //     }

  //   });

  // }

  // validateData(obj:any){
  //   if(this.arrayList.length ==0) {
  //     for (let i = 0; i < this.arrayList.length; i++) {
  //       if (obj.pid == null && obj.programType == this.arrayList[i].description) {
  //         return false;
  //       }
  //     }
  //   }
  //   return true
  // }


  setProgramsMaster(){
    this.validatedesignation(this.inductionForm.controls.programType.value)
    let obj={
      'pid':this.inductionForm.controls.pid.value?this.inductionForm.controls.pid.value:null,
      'programType':null,
      'pDescription':this.inductionForm.controls.programType.value,
      'pStatus':this.inductionForm.controls.status.value?this.inductionForm.controls.status.value:1,
      'actionby':this.userSession.id,
    }
    if(this.inductionForm.valid) {
      if (this.valid) {
        this.EMS.setProgramsMaster(obj).subscribe((result: any) => {
          this.getProgramsMaster(null);
          if (result.data[0].successstate == 0 && !result.data[0].pid) {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/Admin/induction"]));
            this.dialog.open(ReusableDialogComponent, {
              position: {top: `70px`},
              disableClose: true, /**Inserted succesfully **/
              data: this.EM4
            });

          } else if (result.data[0].successstate == 0 && result.data[0].pid) {
            this.getProgramsMaster(null);
            this.dialog.open(ReusableDialogComponent, {
              position: {top: `70px`}, /**updated succesfully **/
              disableClose: true,
              data: this.EM7
            });

          } else if (result.data[0].successstate == 1) {
            this.dialog.open(ReusableDialogComponent, {
              position: {top: `70px`}, /**duplecated record **/
              disableClose: true,
              data: this.EM5
            });

          } else if (result.data[0].successstate == -1 && !result.data[0].pid) {
            this.dialog.open(ReusableDialogComponent, {
              position: {top: `70px`},
              disableClose: true, /**unable to insert  **/
              data: this.EM6
            });

          } else if (result.data[0].successstate == -1 && result.data[0].pid) {
            this.dialog.open(ReusableDialogComponent, {
              position: {top: `70px`},
              disableClose: true, /**unable to update  **/
              data: this.EM8
            });

          }

        });
      } else {
        this.dialog.open(ReusableDialogComponent, {
          position: {top: `70px`},
          disableClose: true, /**duplecated record **/
          data: this.EM5
        });

      }
     }//else {

    //   this.dialog.open(ReusableDialogComponent, {
    //     position: {top: `70px`},
    //     disableClose: true,
    //     data: this.EM9
    //   });

    // }

  }

  getAllStatus() {
    this.EMS.getAllStatus().subscribe((result: any) => {
      if(result.status){
        this.arrayValue = result.data;
      }

    });
  }

  status(status: any, info:any) {
      let obj = {
        'pid': info.id,
        'pStatus': status,
        'actionby': this.userSession.id,
      }
      this.EMS.setProgramsMasterStatus(obj).subscribe((result: any) => {
        if(result.status){
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["Admin/induction"]));
          this.dialog.open(ReusableDialogComponent, {
            position: {top: `70px`},
            disableClose: true,
            data: this.EM65
          });

        }else{
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["Admin/induction"]));
          this.dialog.open(ReusableDialogComponent, {
            position: {top: `70px`},
            disableClose: true,
            data: this.EM10
          });

        }
      })


  }
  getProgramsMaster(pId:any){
    this.companyServices.getMastertable('ems_programs_master', null, 1, 1000, this.companyDBName).subscribe(data => {
      if(data.status){
        this.arrayList=data.data
        this.dataSource = new MatTableDataSource(this.arrayList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pageLoading = false;
      }
    })
  }


  getMessageList(){
    let info={
      "code": null,
      "pagenumber":1,
      "pagesize":1000
    }
    this.EM.getEMSMessagesList(info).subscribe((result: any) => {
      if(result && result.status){
        for(let i=0;i<result.data.length;i++){
          if(result.data[i].code =='EM4'){
            this.EM4=result.data[i].message;

          }else if(result.data[i].code =='EM5'){
            this.EM5=result.data[i].message;

          }else if(result.data[i].code =='EM6'){
            this.EM6=result.data[i].message;


          }else if(result.data[i].code =='EM7'){
            this.EM7=result.data[i].message;


          }else if(result.data[i].code =='EM8'){
            this.EM8=result.data[i].message;


          }
          else if(result.data[i].code =='EM1'){
            this.EM1=result.data[i].message;


          }
          else if(result.data[i].code =='EM9'){
            this.EM9=result.data[i].message;


          }else if(result.data[i].code =='EM10'){
            this.EM10=result.data[i].message;
          }
          else if(result.data[i].code =='EM65'){
            this.EM65=result.data[i].message;
          }
        }

      }

    })

  }
  getPageSizes(): number[] {
     
  var customPageSizeArray = [];
  if (this.dataSource.data.length > 5) {
    customPageSizeArray.push(5);
  }
  if (this.dataSource.data.length > 10) {
    customPageSizeArray.push(10);
  }
  if (this.dataSource.data.length > 20) {
    customPageSizeArray.push(20);
  }
  customPageSizeArray.push(this.dataSource.data.length);
  return customPageSizeArray;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  validatedesignation(data: any) {
    if (this.arrayList.length == 0) {
      this.valid = true;

    }

    else {
      if (this.arrayList.length > 0) {
        for (let i = 0; i < this.arrayList.length; i++) {
          if (data.trim().toLowerCase() === this.arrayList[i].description.toLowerCase()) {
            this.valid = false;
            break;
          }
          else {
            this.valid = true;
          }
        }
      }
    }
  }
}
