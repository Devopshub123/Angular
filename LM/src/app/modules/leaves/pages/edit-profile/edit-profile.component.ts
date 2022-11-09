import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LeavesService } from '../../leaves.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ReusableDialogComponent } from '../../../../pages/reusable-dialog/reusable-dialog.component';
import { ConfirmationComponent } from '../../dialog/confirmation/confirmation.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { MainComponent } from '../../../../pages/main/main.component';
import { multiplyDuration } from '@fullcalendar/angular';
import { ThirdPartyDraggable } from '@fullcalendar/interaction';
import { CompanySettingService } from '../../../../services/companysetting.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {
  editForm: any = FormGroup;
  file: any;
  profileId: any = null;
  profileInfo: any = null;
  imageurls: any = null;
  base64String: any;
  name: any;
  imagePath: any;
  formData: FormData = new FormData();
  isFileImage: boolean = false;
  message: any = [];
  progressInfos: any = [];
  selectedFiles: any;
  previews: any = [];
  CountryDetails: any = [];
  stateDetails: any = [];
  cityDetails: any = [];
  employeedata: any = [];
  isRemoveImage: boolean = true;
  LM117: any = '';
  LM118: any = '';
  LM119: any = '';
  LM138: any = '';
  LM54: any = '';

  LM2: any = '';
  LM1: any = '';
  companyDBName: any = environment.dbName;
  // displayedColumns: string[] = ['firstname','lastName','email','contact','address','countryId','stateId','cityId','zipCode'];
  constructor(
    private router: Router,
    private LM: LeavesService,
    private LMS: CompanySettingService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private MainComponent: MainComponent
  ) {
    this.spinner.hide();
    this.getErrorMessages('LM117');
    this.getErrorMessages('LM118');
    this.getErrorMessages('LM119');
    this.getErrorMessages('LM3');
    this.getErrorMessages('LM1');
    this.getErrorMessages('LM138');
    this.getErrorMessages('LM54');
  }
  userSession: any;
  activeModule: any;
  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    //this.activeModule = JSON.parse(sessionStorage.getItem('activeModule') || '');
    this.editForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      middlename: [''],
      email: [
        '',
        [
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      contact: ['', Validators.required],
      address: ['', Validators.required],
      countryId: ['', Validators.required],
      stateId: ['', Validators.required],
      cityId: ['', Validators.required],
      zipCode: ['', Validators.required],
    });

    this.getUploadImage();
    this.getCountry();

    // this.editForm = this.formBuilder.group(
    //   {
    //     firstName: [{ value:this.employeedata.firstname , disabled: true }],
    //     lastName: [{ value: this.employeedata.lastname , disabled: true }],
    //     email: [{ value:this.employeedata.personalemail} ],
    //     contact: [{ value:this.employeedata.contact}],
    //     address: [{ value:this.employeedata.address}],
    //     countryId: [{ value:this.employeedata.country}],
    //     stateId: [{ value:this.employeedata.state}],
    //     cityId: [{ value:this.employeedata.city}],
    //     zipCode: [{ value:this.employeedata.zipCode}],
    //   });

    this.getEmployeeInformation();

    /**get state details for residance address */
    this.editForm
      .get('countryId')
      ?.valueChanges.subscribe((selectedValue: any) => {
        this.stateDetails = [];
        this.LM.getStates(selectedValue).subscribe((result) => {
          if (result && result.status) {
            this.stateDetails = result.data;
            if (this.employeedata != null) {
              this.editForm.controls.stateId.setValue(this.employeedata.state);
            }
          }
        });
      });
    /**get city details for residance address */
    this.editForm
      .get('stateId')
      ?.valueChanges.subscribe((selectedValue: any) => {
        this.cityDetails = [];
        this.LM.getCities(selectedValue).subscribe((result) => {
          if (result && result.status) {
            this.cityDetails = result.data;
            this.editForm.controls.cityId.setValue('');
            if (
              this.employeedata.state === this.editForm.controls.stateId.value
            ) {
              this.editForm.controls.cityId.setValue(this.employeedata.city);
            }
          }
        });
      });
  }
  editProfile() {
    if (this.editForm.valid) {
      var obj = {
        id: this.userSession.id,
        firstName: this.editForm.controls.firstName.value,
        middlename: this.editForm.controls.middlename.value,
        lastName: this.editForm.controls.lastName.value,
        email: this.editForm.controls.email.value,
        contact: this.editForm.controls.contact.value,
        address: this.editForm.controls.address.value,
        countryId: this.editForm.controls.countryId.value,
        stateId: this.editForm.controls.stateId.value,
        cityId: this.editForm.controls.cityId.value,
        zipCode: this.editForm.controls.zipCode.value,
      };
      this.spinner.show();
      this.LM.SetEditProfile(obj).subscribe((res: any) => {
        if (res && res.status) {
          if (!this.file) {
            this.spinner.hide();
            this.MainComponent.ngOnInit();
            this.dialog.open(ConfirmationComponent, {
              position: { top: `70px` },
              disableClose: true,
              data: {
                Message: this.LM118,
                url: '/LeaveManagement/EditProfile',
              },
            });
          } else {
            this.LM.getFilepathsMaster(2).subscribe((result) => {
              if (result && result.status) {
                let obj = {
                  id: this.profileId ? this.profileId : null,
                  employeeId: this.userSession.id,
                  filecategory: 'PROFILE',
                  moduleId: 1,
                  documentnumber: '',
                  fileName: this.file.name,
                  modulecode: result.data[0].module_code,
                  requestId: null,
                  status: 'Submitted',
                };
                this.LM.setFilesMaster(obj).subscribe((data) => {
                  if (data && data.status) {
                    let info = JSON.stringify(data.data[0]);
                    this.LM.setProfileImage(this.formData, info).subscribe(
                      (data) => {
                        this.spinner.hide();
                        if (data && data.status) {
                          if (this.profileId) {
                            this.LMS.removeImage(this.profileInfo).subscribe(
                              (data) => {}
                            );
                          }
                          this.MainComponent.ngOnInit();
                          this.dialog.open(ConfirmationComponent, {
                            position: { top: `70px` },
                            disableClose: true,
                            data: {
                              Message: this.LM118,
                              url: '/LeaveManagement/EditProfile',
                            },
                          });
                        } else {
                          this.dialog.open(ConfirmationComponent, {
                            position: { top: `70px` },
                            disableClose: true,
                            data: {
                              Message: this.LM138,
                              url: '/LeaveManagement/EditProfile',
                            },
                          });
                        }
                        this.file = null;
                        this.fileImageToggler();
                        this.getUploadImage();
                        this.isRemoveImage = true;
                        this.formData.delete('file');
                      }
                    );
                  } else {
                    this.spinner.hide();
                    this.LM.deleteFilesMaster(result.data[0].id).subscribe(
                      (data) => {}
                    );
                    this.getUploadImage();
                    this.dialog.open(ConfirmationComponent, {
                      position: { top: `70px` },
                      disableClose: true,
                      data: {
                        Message: this.LM138,
                        url: '/LeaveManagement/EditProfile',
                      },
                    });
                  }
                });
              } else {
                this.getUploadImage();
                this.spinner.hide();
                this.dialog.open(ConfirmationComponent, {
                  position: { top: `70px` },
                  disableClose: true,
                  data: {
                    Message: this.LM138,
                    url: '/LeaveManagement/EditProfile',
                  },
                });
              }
            });
          }
        } else {
          this.getUploadImage();
          this.spinner.hide();
          this.dialog.open(ConfirmationComponent, {
            // width: '500px', height: '250px',
            position: { top: `70px` },
            disableClose: true,
            data: { Message: this.LM119, url: '/LeaveManagement/EditProfile' },
          });
        }
      });
    }
  }
  getCountry() {
    let obj = {
      tableName: 'countrymaster',
      status: null,
      pageNumber: 1,
      pageSize: 10,
      databaseName: this.companyDBName,
    };
    this.LM.getMastertable(obj).subscribe((result) => {
      if (result && result.status) {
        this.CountryDetails = result.data;
      }
    });
    // this.LMS.getCountry('countrymaster',null,1,10,this.companyDBName).subscribe((results)=>{
    //   this.CountryDetails=results.data;
    //   this.permanentCountryDetails=results.data;
    //
    // })
  }

  submit() {}










  // removeImage() {
  //   this.isRemoveImage=false;
  //   this.LM.removeProfileImage(this.userSession.id,"google").subscribe((data) => {});
  //   let dialogRef = this.dialog.open(ConfirmationComponent, {width: '500px',height:'250px',
  //     position:{top:`70px`},
  //     disableClose: true,
  //     data: {Message:'Removed profile picture successfully',url: '/LeaveManagement/EditProfile'}
  //   });
  //   this.imageurls =null;
  //   // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
  //   //   this.router.navigate(["/LeaveManagement/EditProfile"]));
  //
  // }
  // cancelImage(){
  //   this.isRemoveImage=true;
  //   // this.getUploadImage();
  //   this.fileImageToggler();
  // }
  onSelectFile(event:any) {
    this.isRemoveImage=false;
    this.imageurls = null;
    this.file = null;
    this.file = event.target.files[0];
    this.fileImageToggler();
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
          this.imageurls = event.target.result;
        };
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  saveImage(flag: boolean) {
    this.formData.append('file', this.file);
    if (this.file) {
      if (this.file.size <= 1024000) {
        this.editProfile();
      } else {
        this.dialog.open(ConfirmationComponent, {
          position: {top: `70px`},
          disableClose: true,
          data: {Message: this.LM117, url: '/LeaveManagement/EditProfile'},
        });
      }
    }else{
        this.editProfile()
    }
  }
  fileImageToggler() {
    this.isFileImage = !this.isFileImage;
  }

  getUploadImage() {
    let info = {
      employeeId: this.userSession.id,
      candidateId: null,
      filecategory: 'PROFILE',
      moduleId: 1,
      requestId: null,
      status: 'Submitted',
    };
    this.LM.getFilesMaster(info).subscribe((result) => {
      if (result && result.status && result.data[0]) {
        this.profileId = result.data[0].id;
        this.profileInfo = JSON.stringify(result.data[0]);
        result.data[0].employeeId = this.userSession.id;
        let info = result.data[0];
        this.LM.getProfileImage(info).subscribe((imageData) => {
          if (imageData.success) {
            let TYPED_ARRAY = new Uint8Array(imageData.image.data);
            const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
              return data + String.fromCharCode(byte);
            }, '');

            let base64String = btoa(STRING_CHAR);
            this.imageurls = 'data:image/png;base64,' + base64String;
          } else {
            this.isRemoveImage = false;
            this.imageurls = null;
          }
        });
      } else {
        this.isRemoveImage = false;
        this.imageurls = null;
      }
    });
  }

  getEmployeeInformation(){
    this.LM.getEmployeeInformation(this.userSession.id).subscribe((result) => {
      if (result && result.status) {
        this.employeedata = JSON.parse(result.data[0].json)[0];
        this.editForm.controls.firstName.setValue(this.employeedata.firstname);
        this.editForm.controls.middlename.setValue(
          this.employeedata.middlename
        );
        this.editForm.controls.lastName.setValue(this.employeedata.lastname);
        this.editForm.controls.email.setValue(this.employeedata.personalemail);
        this.editForm.controls.contact.setValue(
          this.employeedata.contactnumber
        );
        this.editForm.controls.address.setValue(this.employeedata.address);
        this.editForm.controls.countryId.setValue(this.employeedata.country);
        this.editForm.controls.zipCode.setValue(this.employeedata.pincode);
        // this.editForm.controls.stateId.setValue(this.employeedata.state);
        // this.editForm.controls.cityId.setValue(this.employeedata.city);
      }
    });
  }
  cancel() {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/MainDashboard']));
  }

  getErrorMessages(errorCode: any) {
    this.LM.getErrorMessages(errorCode, 1, 1).subscribe((result) => {
      if (result.status && errorCode == 'LM117') {
        this.LM117 = result.data[0].errormessage;
      } else if (result.status && errorCode == 'LM118') {
        this.LM118 = result.data[0].errormessage;
      } else if (result.status && errorCode == 'LM119') {
        this.LM119 = result.data[0].errormessage;
      } else if (result.status && errorCode == 'LM3') {
        this.LM2 = result.data[0].errormessage;
      } else if (result.status && errorCode == 'LM1') {
        this.LM1 = result.data[0].errormessage;
      } else if (result.status && errorCode == 'LM138') {
        this.LM138 = result.data[0].errormessage;
      } else if (result.status && errorCode == 'LM54') {
        this.LM54 = result.data[0].errormessage;
      }
    });
  }
}

