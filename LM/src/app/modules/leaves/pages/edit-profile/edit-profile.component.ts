import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Router} from "@angular/router";
import {LeavesService} from "../../leaves.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {ReusableDialogComponent} from "../../../../pages/reusable-dialog/reusable-dialog.component";
import {ConfirmationComponent} from "../../dialog/confirmation/confirmation.component";


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  editForm:any= FormGroup;
  file:any;
  imageurls =[{
    base64String: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAACXBIWXMAAC4jAAAuIwF4pT92AAAF3WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMS0xMC0yM1QxNTo1NzowNyswNTozMCIgeG1wOk1vZGlmeURhdGU9IjIwMjEtMTAtMjNUMTY6MDM6MzcrMDU6MzAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjEtMTAtMjNUMTY6MDM6MzcrMDU6MzAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6YzVkODNlNWQtODc1Yi1lOTRm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"
  }];
  base64String: any;
  name: any;
  imagePath: any;
  formData: FormData = new FormData();
  isFileImage:boolean=false;
  message:any=[]
  progressInfos:any=[];
  selectedFiles:any;
  previews:any=[];
  CountryDetails:any=[];
  stateDetails:any=[];
  cityDetails:any=[];
  employeedata:any=[];
  isRemoveImage:boolean=true;
  LM117:any='';
  LM118:any='';
  LM119:any='';
  LM2:any = '';
  LM1:any=''
  // displayedColumns: string[] = ['firstname','lastName','email','contact','address','countryId','stateId','cityId','zipCode'];
  constructor(private router: Router,private LM:LeavesService,private formBuilder: FormBuilder,private dialog: MatDialog) {

    this.getErrorMessages('LM117');
    this.getErrorMessages('LM118');
    this.getErrorMessages('LM119');
    this.getErrorMessages('LM2');


  }
  userSession:any;
  ngOnInit(): void {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.editForm = this.formBuilder.group(
      {
        firstName: [{ value:'' , disabled: true }],
        lastName: [{ value:'' , disabled: true }],
        email: ['',[Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        contact: ['',Validators.required],
        address: ['',Validators.required],
        countryId: ['',Validators.required],
        stateId: ['',Validators.required],
        cityId: ['',Validators.required],
        zipCode: ['',Validators.required],
      });

    this.getUploadImage();
    this.getEmployeeInformation();
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




    /**get state details for residance address */
    this.editForm.get('countryId')?.valueChanges.subscribe((selectedValue:any)=> {
      this.stateDetails= [];
      this.LM.getStates(selectedValue).subscribe((result)=>{
        if(result && result.status){
          this.stateDetails=result.data;
        }
        if(this.employeedata != null)
        {
          this.editForm.controls.stateId.setValue(this.employeedata.state);
        }
      })
    })
    /**get city details for residance address */
    this.editForm.get('stateId')?.valueChanges.subscribe((selectedValue:any) => {
      this.cityDetails=[];
      this.LM.getCities(selectedValue).subscribe((result)=>{
        if(result && result.status){
          console.log("bksbjbs",result)
          this.cityDetails=result.data;
        }
        if(this.employeedata != null)
        {
          this.editForm.controls.cityId.setValue(this.employeedata.city);
        }
      })
    })

  }

  editProfile(){
    var obj = {
      'id':this.userSession.id,
      'firstName': this.editForm.controls.firstName.value,
      'lastName':this.editForm.controls.lastName.value,
      'email':this.editForm.controls.email.value,
      'address':this.editForm.controls.address.value,
      'countryId':this.editForm.controls.countryId.value,
      'stateId':this.editForm.controls.stateId.value,
      'cityId':this.editForm.controls.cityId.value,
      'zipCode':this.editForm.controls.zipCode.value

    }
    this.LM.SetEditProfile(obj).subscribe((res: any) => {
      if(res && res.status){
        this.dialog.open(ConfirmationComponent, {width: '500px',height:'250px',
          position:{top:`70px`},
          disableClose: true,
          data:{Message:this.LM118,url: '/LeaveManagement/ManagerDashboard'}
        });

      }else {
        this.dialog.open(ConfirmationComponent, {width: '500px',height:'250px',
          position:{top:`70px`},
          disableClose: true,
          data:{Message:this.LM119,url: '/LeaveManagement/ManagerDashboard'}
        });
      }


    })

  }
  getCountry(){
    let obj={
      tableName:'countrymaster',
      status:null,
      pageNumber:1,
      pageSize:10,
      databaseName:'boon_client'
    }
    this.LM.getMastertable(obj).subscribe(result=>{
      if(result && result.status){
          this.CountryDetails=result.data;
        console.log("hvdsjhjh",result)
      }
    })
    // this.LMS.getCountry('countrymaster',null,1,10,'boon_client').subscribe((results)=>{
    //   this.CountryDetails=results.data;
    //   this.permanentCountryDetails=results.data;
    //
    // })
  }

  submit(){

  }
//   activeColor: string = 'green';
//   baseColor: string = '#ccc';
//   overlayColor: string = 'rgba(255,255,255,0.5)';
//
//   dragging: boolean = false;
//   loaded: boolean = false;
//   imageLoaded: boolean = false;
//   imageSrc: string = '';
//
//   handleDragEnter() {
//     this.dragging = true;
//   }
//
//   handleDragLeave() {
//     this.dragging = false;
//   }
//
//   handleDrop(e:any) {
//     e.preventDefault();
//     this.dragging = false;
//     this.handleInputChange(e);
//   }
//
//   handleImageLoad() {
//     console.log("dfjjknjbdkj")
//     this.imageLoaded = true;
//   }
//
//   handleInputChange(e:any) {
//     var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
// console.log("file",file)
//     var pattern = /image-*/;
//     var reader = new FileReader();
//
//     if (!file.type.match(pattern)) {
//       alert('invalid format');
//       return;
//     }
//
//     this.loaded = false;
//
//     reader.onload = this._handleReaderLoaded.bind(this);
//     reader.readAsDataURL(file);
//   }
//
//   _handleReaderLoaded(e:any) {
//     var reader = e.target;
//     this.imageSrc = reader.result;
//     console.log("filethis.imageSrc",this.imageSrc)
//     this.loaded = true;
//   }
//
//   selectFiles(event: any): void {
//     this.message = [];
//     this.progressInfos = [];
//     this.selectedFiles = event.target.files;
//     this.previews = [];
//     if (this.selectedFiles && this.selectedFiles[0]) {
//       const numberOfFiles = this.selectedFiles.length;
//       for (let i = 0; i < numberOfFiles; i++) {
//         const reader = new FileReader();
//
//         reader.onload = (e: any) => {
//           this.previews.push(e.target.result);
//         };
//
//         reader.readAsDataURL(this.selectedFiles[i]);
//       }
//     }
//   }
//   uploadFiles(): void {}









  removeImage() {
    this.isRemoveImage=false;
    this.LM.removeProfileImage(this.userSession.id,"google").subscribe((data) => {});
    let dialogRef = this.dialog.open(ConfirmationComponent, {width: '500px',height:'250px',
      position:{top:`70px`},
      disableClose: true,
      data: {Message:'Removed profile picture successfully',url: '/LeaveManagement/EditProfile'}
    });
    this.imageurls =[{
      base64String: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAACXBIWXMAAC4jAAAuIwF4pT92AAAF3WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMS0xMC0yM1QxNTo1NzowNyswNTozMCIgeG1wOk1vZGlmeURhdGU9IjIwMjEtMTAtMjNUMTY6MDM6MzcrMDU6MzAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjEtMTAtMjNUMTY6MDM6MzcrMDU6MzAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6YzVkODNlNWQtODc1Yi1lOTRm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"
    }];
    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    //   this.router.navigate(["/LeaveManagement/EditProfile"]));

  }
  cancelImage(){
    this.isRemoveImage=true;
    // this.getUploadImage();
    this.fileImageToggler();
  }
  onSelectFile(event:any) {
    this.isRemoveImage=false;
    this.imageurls = [];
    this.file=null;
    this.file = event.target.files[0];
    this.fileImageToggler();
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
  }

  saveImage(flag:boolean)
  {
    this.formData.append('file', this.file);
    if(this.file){
      if(this.file.size<=1024000){
        this.file=null;
        this.LM.setProfileImage(this.formData,this.userSession.id,"google").subscribe((data) => {
          this.file=null;
          this.fileImageToggler();
          this.getUploadImage();
          this.isRemoveImage=true;
          this.formData.delete('file');
          if(flag){
            this.editProfile()

          }else {
            this.dialog.open(ConfirmationComponent, {width: '500px',height:'250px',
              position:{top:`70px`},
              disableClose: true,
              data:{Message:this.LM118,url: '/LeaveManagement/EditProfile'}
            });
          }

        });
      }
      else{
       this.dialog.open(ConfirmationComponent, {width: '500px',height:'250px',
          position:{top:`70px`},
          disableClose: true,
          data:{Message:this.LM117,url: '/LeaveManagement/EditProfile'}
        });


      }
    }else{
     this.dialog.open(ConfirmationComponent, {width: '500px',height:'250px',
        position:{top:`70px`},
        disableClose: true,
        data:{Message:this.LM119,url: '/LeaveManagement/EditProfile'}
      });
      // this.toastr.error("Please select image")
    }
  }
  fileImageToggler()
  {
    this.isFileImage = !this.isFileImage;
  }

  getUploadImage(){

    this.LM.getProfileImage(this.userSession.id,'google').subscribe((imageData) => {
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
          base64String: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAACXBIWXMAAC4jAAAuIwF4pT92AAAF3WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMS0xMC0yM1QxNTo1NzowNyswNTozMCIgeG1wOk1vZGlmeURhdGU9IjIwMjEtMTAtMjNUMTY6MDM6MzcrMDU6MzAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjEtMTAtMjNUMTY6MDM6MzcrMDU6MzAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6YzVkODNlNWQtODc1Yi1lOTRm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"
        }];

      }
    })
  }

  getEmployeeInformation(){


      this.LM.getEmployeeInformation(this.userSession.id).subscribe((result) => {
        if(result && result.status) {
          this.employeedata = JSON.parse(result.data[0].json)[0];
          console.log("fdkkjdf111", this.employeedata )
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



          this.editForm.controls.firstName.setValue(this.employeedata.firstname);
          this.editForm.controls.lastName.setValue(this.employeedata.lastname);
          this.editForm.controls.email.setValue(this.employeedata.personalemail);
          this.editForm.controls.contact.setValue(this.employeedata.contactnumber);
          this.editForm.controls.address.setValue(this.employeedata.address);
          this.editForm.controls.countryId.setValue(this.employeedata.country);
          this.editForm.controls.zipCode.setValue(this.employeedata.pincode);
          // this.editForm.controls.stateId.setValue(this.employeedata.state);


        }
      });

  }


  getErrorMessages(errorCode:any) {
    this.LM.getErrorMessages(errorCode,1,1).subscribe((result)=>{
      console.log("resultresult",result)
      if(result.status && errorCode == 'LM117')
      {
        this.LM117 = result.data[0].errormessage
        // console.log("this.msgLM34",this.LM34)
      }
      else if(result.status && errorCode == 'LM118')
      {
        this.LM118 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM119')
      {
        this.LM119 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM2')
      {
        this.LM2 = result.data[0].errormessage
      }
      else if(result.status && errorCode == 'LM1')
      {
        this.LM1 = result.data[0].errormessage
      }

    })
  }

}
