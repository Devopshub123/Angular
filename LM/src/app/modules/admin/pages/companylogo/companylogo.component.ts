import { Component, OnInit } from '@angular/core';
import { CompanySettingService } from 'src/app/services/companysetting.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { LeavesService } from '../../../leaves/leaves.service'
import { MainComponent } from '../../../../pages/main/main.component'
import { EmsService } from 'src/app/modules/ems/ems.service';
// src\app\modules\leaves\leaves.service.ts

@Component({
  selector: 'app-companylogo',
  templateUrl: './companylogo.component.html',
  styleUrls: ['./companylogo.component.scss']
})
export class CompanylogoComponent implements OnInit {
  // file !:File=null;
  file:any;
  imageurls =[{
    base64String: "data:image/png;base64,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"
  }];
  base64String: any;
  name: any;
  imagePath: any;
  formData: FormData = new FormData();
  userSession:any;
  isFileImage:boolean=false;
  msgEM124:any;
  msgEM71:any;
  msgEM72:any;
  msgEM73:any;
  msgEM74:any;
  msgEM75:any;
  activeModule:any;
  logoId:any=null;
  imageInfo:any=null;
  constructor(private MainComponent:MainComponent,private LMS:LeavesService,
    private LM:CompanySettingService,private dialog: MatDialog,private router: Router,
    private spinner:NgxSpinnerService,private  emsService:EmsService) { }

  ngOnInit() {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.activeModule = JSON.parse(sessionStorage.getItem('activeModule') || '');
    this.getUploadImage();
    this.getMessages('EM73');
    this.getMessages('EM124');
    this.getMessages('EM71');
    this.getMessages('EM72');
    this.getMessages('EM74');
    this.getMessages('EM75');

  }

  // removeImage(i) {
  //   this.imageurls.splice(i, 1);
  //   this.fileImageToggler();
  // }
  isRemoveImage:boolean=true;
  // msgEM124:any='';
  // msgEM71:any='';
  // msgEM72:any='';
  // msgEM73:any='';
  removeImage() {

    // let info = {
    //   'employeeId':0,
    //   'filecategory': 'LOGO',
    //   'moduleId':2,
    //   'requestId':null,
    // }
    // this.LMS.getFilesMaster(info).subscribe((result) => {
      this.LMS.deleteFilesMaster(this.logoId).subscribe(data=>{
        if(data && data.status){
          // let info =JSON.stringify(result.data[0])
          this.LM.removeImage(this.imageInfo).subscribe((data) => {})
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: {top: `70px`},
            disableClose: true,
            data: this.msgEM75
          });
          this.getUploadImage()
          this.MainComponent.ngOnInit()
        }else{
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position: {top: `70px`},
            disableClose: true,
            data: this.msgEM73
          });
        }
      })
  }
  cancelImage(){
    this.isRemoveImage=true;
    this.getUploadImage();
    this.fileImageToggler();
  }
  onSelectFile(event:any) {
    this.isRemoveImage=false;
    this.imageurls = [];
    this.file=null;
    this.file = event.target.files[0];
    this.fileImageToggler();
    let uploadeddata = this.file.type.split('/')
    if (this.file && uploadeddata[0] == "image") {
      if (this.file.size <= 1024000) {
        if (event.target.files && event.target.files[0]) {
          var filesAmount = event.target.files.length;
          for (let i = 0; i < filesAmount; i++) {
            var reader = new FileReader();
            reader.onload = (event: any) => {
              this.imageurls.push({ base64String: event.target.result, });
            }
            reader.readAsDataURL(event.target.files[i]);
          }
        }
      }else {
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data:this.msgEM124
        });
        this.isFileImage = false;
        this.getUploadImage();
      }
    }else {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/Admin/CompanyLogo"]));
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position:{top:`70px`},
        disableClose: true,
        data:"Please select valid image"
      });
    }
  }

  saveImage()
  {
    let uploadeddata =this.file.type.split('/')
    if(this.file && uploadeddata[0] == "image"){
      this.spinner.show();
        this.LMS.getFilepathsMaster(2).subscribe((result) => {
          if(result && result.status){
            let obj = {
              'id':this.logoId?this.logoId:null,
              'employeeId':0,
              'filecategory': 'LOGO',
              'moduleId':2,
              'documentnumber':'',
              'fileName':this.file.name,
              'modulecode':result.data[0].module_code,
              'requestId':null,
              'status':'Submitted'
            }
            this.LMS.setFilesMaster(obj).subscribe((data) => {
              if(data && data.status) {
                this.LM.removeImage(this.imageInfo).subscribe((data) => {})
                    let info =JSON.stringify(data.data[0])
                this.formData.append("info",info)
                this.formData.append('file', this.file);
                this.LMS.setProfileImage(this.formData).subscribe((result) => {
                  this.formData.delete('file');
                        this.formData.delete('info');
                        this.spinner.hide();
                        if(data && data.status){
                          if(this.logoId){
                            // this.LM.removeImage(this.imageInfo).subscribe((data) => {})
                          }
                          let dialogRef = this.dialog.open(ReusableDialogComponent, {
                            position:{top:`70px`},
                            disableClose: true,
                            data: this.msgEM74
                          });
                          this.MainComponent.ngOnInit()
                        }else{
                          let dialogRef = this.dialog.open(ReusableDialogComponent, {
                            position:{top:`70px`},
                            disableClose: true,
                            data: this.msgEM71
                          });
                          // this.dialog.open(ConfirmationComponent, {
                          //   position: {top: `70px`},
                          //   disableClose: true,
                          //   data: {Message: this.LM138, url: '/LeaveManagement/EditProfile'}
                          // });
                        }
                  this.file = null;
                 // this.getUploadImage();
                  this.fileImageToggler();
                  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    this.router.navigate(["/Admin/CompanyLogo"]));
                        this.isRemoveImage=true;
                });
              }else{
                this.spinner.hide();
                let dialogRef = this.dialog.open(ReusableDialogComponent, {
                  position:{top:`70px`},
                  disableClose: true,
                  data: this.msgEM71
                });
              }
           })
        }else{
          this.spinner.hide();
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: this.msgEM71
          });

        }})
    } else {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/Admin/CompanyLogo"]));
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position:{top:`70px`},
        disableClose: true,
        data:"Please select valid image"
      });
    }

  }
  fileImageToggler()
  {
    this.isFileImage = !this.isFileImage;
  }
  getUploadImage(){
    let info = {
      'employeeId': 0,
      "candidateId": null,
      "moduleId": 2,
      "filecategory": 'LOGO',
      "requestId": null,
      'status': 'Submitted'


    }
    this.LMS.getFilesMaster(info).subscribe((result) => {
      if(result && result.status && result.data[0]){
        this.logoId=result.data[0].id;
       this.imageInfo =JSON.stringify(result.data[0]);
       result.data[0].employeeId=0;
       let info = result.data[0]
       this.LMS.getProfileImage(info).subscribe((imageData) => {
        if(imageData.success){
          let TYPED_ARRAY = new Uint8Array(imageData.image.data);
          const STRING_CHAR = TYPED_ARRAY.reduce((data, byte)=> {
            return data + String.fromCharCode(byte);
          }, '');

          let base64String= btoa(STRING_CHAR)
          this.imageurls[0].base64String='data:image/png;base64,'+base64String;


        }
      else{
        this.isRemoveImage=false;
        this.imageurls =[{
          base64String: "data:image/png;base64,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"
        }];

      }
    })
  }else{
    this.isRemoveImage=false;
    this.imageurls =[{
      base64String: "data:image/png;base64,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"
    }];

  }

})
  }

  getMessages(messageCode:any) {
    let data =
    {
      "code": messageCode,
      "pagenumber": 1,
      "pagesize": 1
    }
    this.emsService.getMessagesListApi(data).subscribe((result: any) => {

      if(result.status && messageCode == 'EM124')
      {
        this.msgEM124 = result.data[0].message
      }
      else if(result.status && messageCode == 'EM71')
      {
        this.msgEM71 = result.data[0].message
      }
      else if(result.status && messageCode == 'EM72')
      {
        this.msgEM72 = result.data[0].message
      }
      else if(result.status && messageCode == 'EM73')
      {
        this.msgEM73 = result.data[0].message
      }
      else if(result.status && messageCode == 'EM74')
      {
        this.msgEM74 = result.data[0].message
      }
      else if(result.status && messageCode == 'EM75')
      {
        this.msgEM75 = result.data[0].message
      }



    })
  }
}
