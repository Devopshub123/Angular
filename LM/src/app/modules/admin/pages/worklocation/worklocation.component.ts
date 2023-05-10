import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  AbstractControl,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  PopupComponent,
  PopupConfig,
} from '../../../../pages/popup/popup.component';
import { MatDialog } from '@angular/material/dialog';
import { OnlyNumberDirective } from 'src/app/custom-directive/only-number.directive';
import { LoginService } from 'src/app/services/login.service';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import { EmsService } from 'src/app/modules/ems/ems.service';

export interface UserData {
  total: number;
  address1: string;
  address2: string;
  branchcode: string;
  city: string;
  cityname: string;
  country: string;
  currentvalue: number;
  id: number;
  location: string;
  pincode: number;
  prefix: string;
  seed: number;
  state: string;
  status: string;
}
@Component({
  selector: 'app-worklocation',
  templateUrl: './worklocation.component.html',
  styleUrls: ['./worklocation.component.scss'],
})
export class WorklocationComponent implements OnInit {
  worklocationForm: any = FormGroup;
  CountryDetails: any = [];
  workLocationDetails: any = [];
  stateDetails: any = [];
  CityDetails: any = [];
  worklocationdata: any = [];
  ischeckprefix: boolean = false;
  isViewSeed: boolean = false;
  isnote: boolean = false;
  isdata: boolean = true;
  isadd: boolean = false;
  isview: boolean = false;
  ishide: boolean = true;
  editworklocation: boolean = false;
  userSession: any;
  msgEM1: any;
  msgEM3: any;
  msgEM2: any;
  msgEM77: any;
  msgEM31: any;
  msgEM76: any;
  msgEM80: any;
  msgEM81: any;
  msgEM82: any;
  msgEM83: any;
  pageLoading = true;

  displayedColumns: string[] = [
    'sno',
    'city-branch',
    'prefix',
    'seed',
    'status',
    'Action',
  ];
  departmentData: any = [];
  arrayValue: any = [
    { Value: 'Active', name: 'Active ' },
    { Value: 'Inactive', name: 'Inactive' },
  ];
  dataSource: MatTableDataSource<UserData> = <any>[];
  companyDBName: any = environment.dbName;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private LM: CompanySettingService,
    private dialog: MatDialog,
    private ts: LoginService,private emsService:EmsService
  ) {
    console.log("consttt")
  }

  ngOnInit(): void {
    console.log("ngoninit")
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.getstatuslist();
    this.getmessages('EM1');
    this.getmessages('EM3');
    this.getmessages('EM2');
    this.getmessages('EM77');
    this.getmessages('EM31');
    this.getmessages('EM76');
    this.getmessages('LM57');
    this.getmessages('EM80');
    this.getmessages('EM81');
    this.getmessages('EM82');
    this.getmessages('EM83')
    this.getWorkLocation();
    this.getCountry();

    this.worklocationForm = this.formBuilder.group({
      address1: [''],
      address2: [''],
      branch: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      pincode: [''],
      prefix: [''],
      seed: ['', Validators.required],
      id: [''],
    });

    this.worklocationForm
      .get('country')
      ?.valueChanges.subscribe((selectedValue: any) => {
        this.stateDetails = [];
        this.LM.getStatesc(selectedValue).subscribe((data) => {
          this.stateDetails = data.data;
          if (this.worklocationdata != null) {
            this.worklocationForm.controls.state.setValue(
              this.worklocationdata.state
            );
          }
        });
      });
    /**get city details for residance address */
    this.worklocationForm
      .get('state')
      ?.valueChanges.subscribe((selectedValue: any) => {
        this.CityDetails = [];
        this.LM.getCities(selectedValue).subscribe((data) => {
          this.CityDetails = data.data;
          if (this.worklocationdata != null) {
            this.worklocationForm.controls.city.setValue(
              this.worklocationdata.city
            );
          }
        });
      });
    this.worklocationForm
      .get('prefix')
      ?.valueChanges.subscribe((selectedValue: any) => {
        this.isViewSeed = false;
        this.isnote = false;
        selectedValue.trim();
        if (selectedValue != '') {
          for (var i = 0; i < this.workLocationDetails.length; i++) {
            if (
              this.workLocationDetails[i].prefix == selectedValue.toUpperCase()
            ) {
              this.worklocationForm.controls.seed.setValue(
                this.workLocationDetails[i].seed
              );
              this.ischeckprefix = true;
              this.isViewSeed = true;
              this.worklocationForm.controls.seed.disable();
              this.isnote = true;
              break;
            } else {
              this.worklocationForm.controls.seed.setValue('');
              // this.isViewSeed=false;
              this.worklocationForm.controls.seed.enable();
              this.isnote = false;
              this.ischeckprefix = true;
              // valid = true;
            }
          }
        } else {
          for (let i = 0; i < this.workLocationDetails.length; i++) {
            if (this.workLocationDetails[i].prefix == selectedValue) {
              this.worklocationForm.controls.seed.setValue(
                this.workLocationDetails[i].seed
              );
              this.ischeckprefix = true;
              this.worklocationForm.controls.seed.disable();
              this.isnote = true;
              break;
            }
          }
        }
        // return this.isViewSeed;
        // return this.ischeckprefix;
      });
  }
  emptyprefix() {
    if (this.worklocationForm.controls.prefix.value == '') {
      for (var i = 0; i < this.workLocationDetails.length; i++) {
        if (this.workLocationDetails[i].prefix == '') {
          this.worklocationForm.controls.seed.setValue(
            this.workLocationDetails[i].seed
          );
          this.ischeckprefix = true;
          this.isViewSeed = true;
          this.worklocationForm.controls.seed.disable();
          this.isnote = true;
          break;
        }
      }

      // this.worklocationForm.controls.seed.disable();
      // return this.ischeckprefix;
    }
    return this.isViewSeed;
  }
  getstatuslist(){
    this.LM.getstatuslists().subscribe((result:any) => {
      if(result.status){
        this.arrayValue = result.data;
      }
    });
  }
  getWorkLocation() {
    // this.spinner.show();
    this.workLocationDetails =[]
    this.LM.getWorkLocation({
      id: null,
      companyName: this.companyDBName,
    }).subscribe((result:any) => {
      
      this.workLocationDetails = result.data==null?[]:result.data;
      this.emptyprefix();
      this.dataSource = new MatTableDataSource(this.workLocationDetails);
      this.dataSource.paginator = this.paginator;
      this.pageLoading = false;
    });
  }
  edit(data: any) {
    this.editworklocation = true;
    this.worklocationdata = data;
    this.isadd = true;
    this.isdata = false;
    this.isview = false;
    this.worklocationForm.controls.id.setValue(data.id);
    this.worklocationForm.controls.address1.setValue(data.address1);
    this.worklocationForm.controls.address2.setValue(data.address2);
    this.worklocationForm.controls.branch.setValue(data.location);
    this.worklocationForm.controls.country.setValue(data.country);
    this.worklocationForm.controls.state.setValue(data.state);
    this.worklocationForm.controls.city.setValue(data.city);
    this.worklocationForm.controls.pincode.setValue(data.pincode);
    this.worklocationForm.controls.prefix.setValue(data.prefix);
    this.worklocationForm.controls.seed.setValue(data.seed);
  }
  view(data: any) {
    this.worklocationdata = data;
    this.isadd = true;
    this.isdata = false;
    this.isview = true;
    this.ishide = false;
    this.worklocationForm.controls.country.setValue(data.country);
    this.worklocationForm.controls.address1.setValue(data.address1);
    this.worklocationForm.controls.address2.setValue(data.address2);
    this.worklocationForm.controls.branch.setValue(data.location);

    this.worklocationForm.controls.state.setValue(data.state);
    this.worklocationForm.controls.city.setValue(data.city);
    this.worklocationForm.controls.pincode.setValue(data.pincode);
    this.worklocationForm.controls.prefix.setValue(data.prefix);
    this.worklocationForm.controls.seed.setValue(data.seed);

    this.worklocationForm.controls.address1.disable();
    this.worklocationForm.controls.address2.disable();
    this.worklocationForm.controls.branch.disable();
    //  this.worklocationForm.controls.country.disable();
    //  this.worklocationForm.controls. state.disable();
    //  this.worklocationForm.controls.city.disable();
    this.worklocationForm.controls.pincode.disable();
    this.worklocationForm.controls.prefix.disable();
    this.worklocationForm.controls.seed.disable();
    this.isnote = false;
  }
  Add() {
    this.isadd = true;
    this.isdata = false;
    this.isview = false;
    this.ishide = true;
  }
  getCountry() {
    this.LM.getCountry(
      'countrymaster',
      null,
      1,
      10,
      this.companyDBName
    ).subscribe((data) => {
      this.CountryDetails = data.data;
    });
  }
  status(status: any, id: any) {
    let data = {
      checktable: 'companyworklocationsmaster',
      tableName: 'employee_worklocations',
      columnName: 'locationid',
      id: id,
      status: status,
    };
    this.LM.updateStatusall(data).subscribe((result) => {
      if (result.status) {
        this.ngOnInit();
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
          data: this.msgEM82,
        });
      } else {
        this.ngOnInit();
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
          data: this.msgEM81,
        });
      }
    });
  }
  submit() {
    console.log("this.worklocationForm.valid",this.worklocationForm.valid)
    if (this.worklocationForm.valid) {
      if (
        this.worklocationForm.controls.id.value == '' ||
        this.worklocationForm.controls.id.value == null
      ) {
        let isvalid = true;
        if (this.workLocationDetails.length > 0) {
          for (let i = 0; i < this.workLocationDetails.length; i++) {
            if (
              this.worklocationForm.controls.branch.value
                .trim()
                .toLowerCase() ===
                this.workLocationDetails[i].location.trim().toLowerCase() &&
              this.worklocationForm.controls.city.value ===
                this.workLocationDetails[i].city
            ) {
              isvalid = false;
              break;
            } else {
              isvalid = true;
            }
          }
        }
        if (isvalid == true) {
          let data = {
            id: this.worklocationForm.controls.id.value,
            address1: this.worklocationForm.controls.address1.value,
            branchCode: '',
            address2: this.worklocationForm.controls.address2.value,
            location: this.worklocationForm.controls.branch.value,
            pincode: this.worklocationForm.controls.pincode.value,
            city: this.worklocationForm.controls.city.value,
            state: this.worklocationForm.controls.state.value,
            country: this.worklocationForm.controls.country.value,
            prefix: this.worklocationForm.controls.prefix.value.toUpperCase(),
            seed: this.worklocationForm.controls.seed.value,
            status: 1,
            created_by: this.userSession.id,
          };
          this.LM.setWorkLocation(data).subscribe((data) => {
            /**For edit worklocation */
            if (this.editworklocation) {
              if (data.status) {
                this.router
                  .navigateByUrl('/', { skipLocationChange: true })
                  .then(() => this.router.navigate(['/Admin/Worklocation']));

                this.ngOnInit();
                let dialogRef = this.dialog.open(ReusableDialogComponent, {
                  position: { top: `70px` },
                  disableClose: true,
                  data: 'Work Location Updated Successfully',
                });
              } else {
                let dialogRef = this.dialog.open(ReusableDialogComponent, {
                  position: { top: `70px` },
                  disableClose: true,
                  data: this.msgEM77,
                });
              }
            } else {
              /**For add worklocation */
              if (data.status) {
                this.router
                  .navigateByUrl('/', { skipLocationChange: true })
                  .then(() => this.router.navigate(['/Admin/Worklocation']));

                this.ngOnInit();
                let dialogRef = this.dialog.open(ReusableDialogComponent, {
                  position: { top: `70px` },
                  disableClose: true,
                  data: this.msgEM80,
                });
              } else {
                let dialogRef = this.dialog.open(ReusableDialogComponent, {
                  position: { top: `70px` },
                  disableClose: true,
                  data: this.msgEM76,
                });
              }
            }
          });
        } else {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: this.msgEM83,
          });
        }
      } else {
        let isvalid = true;
        if (this.workLocationDetails.length > 0) {
          for (let i = 0; i < this.workLocationDetails.length; i++) {
            if (this.worklocationForm.controls.id.value !=this.workLocationDetails[i].id &&
              this.worklocationForm.controls.branch.value
                .trim()
                .toLowerCase() ===
                this.workLocationDetails[i].location.trim().toLowerCase() &&
              this.worklocationForm.controls.city.value ===
                this.workLocationDetails[i].city
            ) {
              isvalid = false;
              break;
            } else {
              isvalid = true;
            }
          }
        }
        if (isvalid == true) {
          let data = {
            id: this.worklocationForm.controls.id.value,
            address1: this.worklocationForm.controls.address1.value,
            branchCode: '',
            address2: this.worklocationForm.controls.address2.value,
            location: this.worklocationForm.controls.branch.value,
            pincode: this.worklocationForm.controls.pincode.value,
            city: this.worklocationForm.controls.city.value,
            state: this.worklocationForm.controls.state.value,
            country: this.worklocationForm.controls.country.value,
            prefix: this.worklocationForm.controls.prefix.value.toUpperCase(),
            seed: this.worklocationForm.controls.seed.value,
            status: 1,
            updated_by: this.userSession.id,
          };
          this.LM.setWorkLocation(data).subscribe((data) => {
            /**For edit worklocation */
            if (this.editworklocation) {
              if (data.status) {
                this.router
                  .navigateByUrl('/', { skipLocationChange: true })
                  .then(() => this.router.navigate(['/Admin/Worklocation']));

                this.ngOnInit();
                let dialogRef = this.dialog.open(ReusableDialogComponent, {
                  position: { top: `70px` },
                  disableClose: true,
                  data: 'Work Location Updated Successfully',
                });
              } else {
                let dialogRef = this.dialog.open(ReusableDialogComponent, {
                  position: { top: `70px` },
                  disableClose: true,
                  data: this.msgEM77,
                });
              }
            } else {
              /**For add worklocation */
              if (data.status) {
                this.router
                  .navigateByUrl('/', { skipLocationChange: true })
                  .then(() => this.router.navigate(['/Admin/Worklocation']));

                this.ngOnInit();
                let dialogRef = this.dialog.open(ReusableDialogComponent, {
                  position: { top: `70px` },
                  disableClose: true,
                  data: this.msgEM80,
                });
              } else {
                let dialogRef = this.dialog.open(ReusableDialogComponent, {
                  position: { top: `70px` },
                  disableClose: true,
                  data: this.msgEM76,
                });
              }
            }
          });
        } else {
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: { top: `70px` },
            disableClose: true,
            data: this.msgEM83,
          });
        }
      }
    }
  }
  cancel() {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/Admin/Worklocation']));
  }
  close() {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/Admin/Worklocation']));
  }
  getmessages(messageCode:any) {
    let data = {
      code: messageCode,
      pagenumber: 1,
      pagesize: 1,
    };
    this.emsService.getMessagesListApi(data).subscribe((result: any) => {

      if (result.status && messageCode == 'EM1') {
        this.msgEM1 = result.data[0].message;
      } else if (result.status && messageCode == 'EM3') {
        this.msgEM3 = result.data[0].message;
      } else if (result.status && messageCode == 'EM2') {
        this.msgEM2 = result.data[0].message;
      } else if (result.status && messageCode == 'EM77') {
        this.msgEM77 = result.data[0].message;
      } else if (result.status && messageCode == 'EM76') {
        this.msgEM76 = result.data[0].message;
      } else if (result.status && messageCode == 'EM80') {
        this.msgEM80 = result.data[0].message;
      } else if (result.status && messageCode == 'EM81') {
        this.msgEM81 = result.data[0].message;
      } else if (result.status && messageCode == 'EM82') {
        this.msgEM82 = result.data[0].message;
      } else if (result.status && messageCode == 'EM83') {
        this.msgEM83 = result.data[0].message;
      }
    });
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
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  
  }
}
