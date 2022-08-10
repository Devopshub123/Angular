import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Router} from "@angular/router";
import {LeavesService} from "../../leaves.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {ReusableDialogComponent} from "../../../../pages/reusable-dialog/reusable-dialog.component";
import {ConfirmationComponent} from "../../dialog/confirmation/confirmation.component";
import { NgxSpinnerService } from 'ngx-spinner';
import {MainComponent} from "../../../../pages/main/main.component";

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
  constructor(private router: Router,private LM:LeavesService,private formBuilder: FormBuilder,private dialog: MatDialog,private spinner:NgxSpinnerService,private MainComponent:MainComponent) {
    this.spinner.hide();
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
        middlename:[{value:'',disabled:true}],
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
          this.cityDetails=result.data;
          this.editForm.controls.cityId.setValue('');
        }
        if(this.employeedata.state === this.editForm.controls.stateId.value)
        {
          this.editForm.controls.cityId.setValue(this.employeedata.city);
        }

      })
    })


  }

  editProfile(){

    if(this.editForm.valid) {
      var obj = {
        'id': this.userSession.id,
        'firstName': this.editForm.controls.firstName.value,
         'middlename':this.editForm.controls.firstName.value,
        'lastName': this.editForm.controls.lastName.value,
        'email': this.editForm.controls.email.value,
        'address': this.editForm.controls.address.value,
        'countryId': this.editForm.controls.countryId.value,
        'stateId': this.editForm.controls.stateId.value,
        'cityId': this.editForm.controls.cityId.value,
        'zipCode': this.editForm.controls.zipCode.value

      }
      this.LM.SetEditProfile(obj).subscribe((res: any) => {
        if (res && res.status) {
          this.MainComponent.ngOnInit()
          this.dialog.open(ConfirmationComponent, {
            width: '500px', height: '250px',
            position: {top: `70px`},
            disableClose: true,
            data: {Message: this.LM118, url: '/LeaveManagement/EditProfile'}
          });

        } else {
          this.dialog.open(ConfirmationComponent, {
            width: '500px', height: '250px',
            position: {top: `70px`},
            disableClose: true,
            data: {Message: this.LM119, url: '/LeaveManagement/EditProfile'}
          });
        }


      })
    }

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
          if(flag ){
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

        // }


      }
    }else{
      if(flag === true){
        this.editProfile()

      }else {
        this.dialog.open(ConfirmationComponent, {
          width: '500px', height: '250px',
          position: {top: `70px`},
          disableClose: true,
          data: {Message: this.LM119, url: '/LeaveManagement/EditProfile'}
        });
      }
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
          base64String:"data:image/jpeg;base64,/9j/4Q2/RXhpZgAATU0AKgAAAAgABwESAAMAAAABAAEAAAEaAAUAAAABAAAAYgEbAAUAAAABAAAAagEoAAMAAAABAAIAAAExAAIAAAAdAAAAcgEyAAIAAAAUAAAAj4dpAAQAAAABAAAApAAAANAACvyAAAAnEAAK/IAAACcQQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKQAyMDIxOjEwOjExIDE5OjU1OjM3AAAAA6ABAAMAAAAB//8AAKACAAQAAAABAAAAgKADAAQAAAABAAAAgAAAAAAAAAAGAQMAAwAAAAEABgAAARoABQAAAAEAAAEeARsABQAAAAEAAAEmASgAAwAAAAEAAgAAAgEABAAAAAEAAAEuAgIABAAAAAEAAAyJAAAAAAAAAEgAAAABAAAASAAAAAH/2P/tAAxBZG9iZV9DTQAC/+4ADkFkb2JlAGSAAAAAAf/bAIQADAgICAkIDAkJDBELCgsRFQ8MDA8VGBMTFRMTGBEMDAwMDAwRDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAENCwsNDg0QDg4QFA4ODhQUDg4ODhQRDAwMDAwREQwMDAwMDBEMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwM/8AAEQgAgACAAwEiAAIRAQMRAf/dAAQACP/EAT8AAAEFAQEBAQEBAAAAAAAAAAMAAQIEBQYHCAkKCwEAAQUBAQEBAQEAAAAAAAAAAQACAwQFBgcICQoLEAABBAEDAgQCBQcGCAUDDDMBAAIRAwQhEjEFQVFhEyJxgTIGFJGhsUIjJBVSwWIzNHKC0UMHJZJT8OHxY3M1FqKygyZEk1RkRcKjdDYX0lXiZfKzhMPTdePzRieUpIW0lcTU5PSltcXV5fVWZnaGlqa2xtbm9jdHV2d3h5ent8fX5/cRAAICAQIEBAMEBQYHBwYFNQEAAhEDITESBEFRYXEiEwUygZEUobFCI8FS0fAzJGLhcoKSQ1MVY3M08SUGFqKygwcmNcLSRJNUoxdkRVU2dGXi8rOEw9N14/NGlKSFtJXE1OT0pbXF1eX1VmZ2hpamtsbW5vYnN0dXZ3eHl6e3x//aAAwDAQACEQMRAD8A9VSSSSUpJQttrprdba4V1sBc97jDQBq5znFcD9Yfr/deXYvRCaqeHZhHvd/4XY/+bZ/wtn6T/q0/HjlM0Pt6LJ5IwFn7Hr+rfWLpHRx+u5AbYdW0M99h/wCtMl39t3sXI9Q/xlZbyW9NxG1M/wBJkHc4/wDWqXNa3/t1641xc57rHuL7HmXvcS5zj+897vc5JW4ctAb+o/g1Z8xM7ekOpk/Wr6yZJJs6hawH82rbUPl6TWv/AOmqFmZm2mbcq95PO615/K9CSUojEbAD6MRlI7kn6pa8zNqM15N7CO7bXj8j1fx/rT9Y8Yj0+oWuA/Nt22j/AMFa53/SWWkkYxO4B+iBKQ2JH1ex6f8A4ys2shvUsRlzP9JjnY7/ALatc5jv+3a113SfrH0frAjCvBtAl1D/AGWj/rT/AKX9dnsXkCQJa5r2ktewyx7SQ4H95j2+5qiny8Jbek+DNDmJjf1B9ySXnn1e+v8AkYpbjdaJvx9A3LAmxn/Htb/PV/8ACM/Tf8avQKbqr6mXUvbZVYA5j2mWkHhzXBVMmOUDR+1tQyRmLH2M0kkkxe//0PVVCyyuqt1trgyusFz3uMANGrnOcVNeffX/AOsJvuPQ8V36Gog5jh+c/wCmzH/qV/zlv/Cez8x6fjxmcqH18lmSYhGz9HM+tX1qu65ccfHJr6XWfYzUG0ji64fuf6Gn/rlnv/m8FJJaEYiIoaANCUjI2d1JJJ2MsssZVU02W2ODK62iXOcfosa1FaslW19pipjrT/wbS/8A6gOXoHQP8X+LSxuR1oDJyDqMUH9Ezyf/AKez/wACXXVU1UsFdLG1sGgawBoH9lqrz5mINRHF49GxDlpEXI8Ph1fEbGvq0uY+r/jGln/VhqS9vsqqtYWWsbYw8tcA4H5OXJdf/wAX+HkMdkdGAxckCfs/+Bf5f8A/+Uz9H/IShzUSakOHx3Cp8tIC4ni8Hz1JSsrtptfTcw1W1OLLK3CHNcOWuUVYa6lufVf60X9CvFVpNnTbD+lq5NZPN9A/8+1f4T/jFhpISiJAg6groyMTY0L7fTdVfUy6l4sqsaHMe0yC06tc0qa87+oP1hOLkjouS79WyHE4jidGWn3Op1/wd/8Ag/8Ah/8Ajl6Is/JjMJUfo38cxONj6v8A/9H0P6xdWb0fpGRnaGxo20NPex/sqH+cdz/5C8fLnvc59ji+x5LnvPLnOO573f1nLsv8ZXUC/LxOmNPsqacizzc7dTV/mtbd/nrjVe5aFQvrLX6NLmJ3OukVJJJKZgUu6/xedCYKj1zIbNlm6vDB/NYPbbcP5VzvY3/g/wDjFwhDnQxujnkNb8XHaF7XhYteFh0Ylf0Mettbfg0bVBzMyIiI/S/JsctC5GR/R/NOkkkqTcUkkkkp4z/GF0JlmOOt47YuohmWAPpVfRba7+Vju/8AAv6i4Fe2ZWPXlY1uNaJrvY6t48nDa5eJljq3Oqd9KtzmGfFpLP8Avqu8tO4mJ/R/Jp8zACQkP0vzUkkkp2uqXAgtJa5pBa4aEEHc1zf5TXL136s9X/bHR6Mx0etBryAO1rPbZ/n/AM63+Q9eRLr/APFv1A1dQyenOPsyGevWD+/XFb4/r1Pb/wBtKHmIcUL6x1Z+XnwzrpLR/9Kt9ask5P1k6hZMhlvpN+FbW1R/ntestFzLDbm5VpMl99rifi95QlpxFRA7AObI3InuSpJJJFalxNv23G3fR9eqfhvYvbF4aS4Dc36TYc34j3NXtXTsyvPwMfNr+hkVtsEdtwnb/ZVXmx8p821yp+YeTYSSSVVtKSSSSUpeL9T2nqmcWfR+03R/nuXsWZlV4eJdl2mK8et1jvg0bl4puc8mx30nkvd8XHe78qtcoPmPkGrzR+Ueakkklaaqlo/VrJOL9Yen3TA9cVuPlaDR/wCjFnKdDizIpeNCy2twPwc1yEhYI7ikxNEHsX//08fLrNWbk1kQWX2tI+D3hCWp9acc431j6hWRAdb6rfha1tv/AFTnLLWnE3EHuAXMkKkR2JUkkkihS7b/ABe9fZXPQ8l22SbMJx7z7rsf/O/S1f8AXFxBIBA7nQDuT5I12Lm4rabrqbcYWndj2ua6skt13VOO129ibkgJx4T1281+OZhLiHTd9sSXD/V//GDWK24vXJa9ujc1olrh/wB2K2e6t/8ALZ+j/qLsMbqGBl1tsxciq5jhILHg/kKoTxygdR9ejehkjMWD9OrYSQMjPwcVhsyciuljRJL3hv5SuQ6//jCqFbsbof6Sx2hzHiGNH/Asf7rX/wBf9F/XShjlM0B9eip5IwGp+nVj/jC6+w1joeM6XuIfmkfmtHvqx/61jvfZ/wAH/wAYuGRasbNzPWupqtyjWd+TY1rrCC7Xfa4S7c9BkSR3GhB0I/rBXscBCPCOm/m0ckzOXEeuy6SSSesUp0NL8ilg1LrGNA+LmtUFo/VzGOV9YOnUxI9dr3Dyqm8/+e0JGgT2CYiyB3L/AP/U1P8AGT0815uJ1Jo9l7Dj2f12brav89jrP+21xy9e+snSB1jo9+EIFxG+hx7Ws99f+d/Nv/kLyEhwJa9pY9pLXNPIcDtcx39VyvcvPihXWOjS5iFTvpJS3fq/9T+o9aDch5+yYB4vcJe//wAL1H8z/hn/APgit/Uv6rM6o/8AaWe3dgUuiqo8XPafc5//AAFTv+3bF6SAAAAIA0ACbmz8J4Y79T2ThwcQ4pbdB3cvpP1a6N0gA4mODcOciz32n/rjvo/9bVvqHT8PqWK/EzahdS/lp5BH0Xsd9Jj2/vtVlJVDKRNkm+7bEQBQArs+c9X/AMXvUsZzrOlvGZRqRU8htzR+7uP6O7/wNc3f0nqOM79Ywb6XHuanf9UxpXtSSnjzUxuBL8GCXLROxMXxSjpXUMl36vg33OHcVPP/AEnNXSdI/wAX3VMpzbOpuGFj6E1tIfc4fu6TVT/4IvR0kpc1M7AR/FUeWiNyZfg1undNwumYrcTBqFVLNYGpJP0n2PPue9377lV6t9W+j9XB+2Y7Tb2vZ7LR/wBdZ7v89aaSgEpA2Cb7s5iCKoV2fLfrD9TeodGa7JpJzMEautaIsrH/AA9bfzP+GrXP86jhe5Lzn67fVVnTnHqvT2bcOx0ZFI4qe4+22v8Adptf9Jn+CsVvDn4jwy36Hu1c2DhHFHbqHlF13+Lfp5t6lk9RcPZi1+iwn/SWQ523+pUz/wAFXIa9gXE6Bo1JJ0a1v9Zeu/Vfo/7H6NRivj13TbkEf6R/uc3/AK1/M/8AW07mJ8MK6y0/is5eHFO+kdX/1fVV579e/qzZXmt6phN/RZtjKskAfzdzy2qvI/4u2f0n/Df8cvQkzmtcNrgCDyDqE/HkMJWPqsyQE40UGDh04OHTh0CKsdja2fBoiT/KcjpJJh1XqSSSSUpJJJJSkkkklKSSSSUpCy8WnMxbcW9u6q9jq3jycNpRUklPnn1J+q9tnUrM7NafQ6dc+qgOH85dW51fq/1KI/7f/wCJXoiYNa0Q0ADwHmnT8mQzlZWY8YhGg//W9VSSSSUpMnSSUsknTJKUkkkkpSSSSSlJJJ0lLJ0kklKSSSSU/wD/2f/tFcZQaG90b3Nob3AgMy4wADhCSU0EJQAAAAAAEAAAAAAAAAAAAAAAAAAAAAA4QklNBDoAAAAAAOUAAAAQAAAAAQAAAAAAC3ByaW50T3V0cHV0AAAABQAAAABQc3RTYm9vbAEAAAAASW50ZWVudW0AAAAASW50ZQAAAABDbHJtAAAAD3ByaW50U2l4dGVlbkJpdGJvb2wAAAAAC3ByaW50ZXJOYW1lVEVYVAAAAAEAAAAAAA9wcmludFByb29mU2V0dXBPYmpjAAAADABQAHIAbwBvAGYAIABTAGUAdAB1AHAAAAAAAApwcm9vZlNldHVwAAAAAQAAAABCbHRuZW51bQAAAAxidWlsdGluUHJvb2YAAAAJcHJvb2ZDTVlLADhCSU0EOwAAAAACLQAAABAAAAABAAAAAAAScHJpbnRPdXRwdXRPcHRpb25zAAAAFwAAAABDcHRuYm9vbAAAAAAAQ2xicmJvb2wAAAAAAFJnc01ib29sAAAAAABDcm5DYm9vbAAAAAAAQ250Q2Jvb2wAAAAAAExibHNib29sAAAAAABOZ3R2Ym9vbAAAAAAARW1sRGJvb2wAAAAAAEludHJib29sAAAAAABCY2tnT2JqYwAAAAEAAAAAAABSR0JDAAAAAwAAAABSZCAgZG91YkBv4AAAAAAAAAAAAEdybiBkb3ViQG/gAAAAAAAAAAAAQmwgIGRvdWJAb+AAAAAAAAAAAABCcmRUVW50RiNSbHQAAAAAAAAAAAAAAABCbGQgVW50RiNSbHQAAAAAAAAAAAAAAABSc2x0VW50RiNQeGxAUgAAAAAAAAAAAAp2ZWN0b3JEYXRhYm9vbAEAAAAAUGdQc2VudW0AAAAAUGdQcwAAAABQZ1BDAAAAAExlZnRVbnRGI1JsdAAAAAAAAAAAAAAAAFRvcCBVbnRGI1JsdAAAAAAAAAAAAAAAAFNjbCBVbnRGI1ByY0BZAAAAAAAAAAAAEGNyb3BXaGVuUHJpbnRpbmdib29sAAAAAA5jcm9wUmVjdEJvdHRvbWxvbmcAAAAAAAAADGNyb3BSZWN0TGVmdGxvbmcAAAAAAAAADWNyb3BSZWN0UmlnaHRsb25nAAAAAAAAAAtjcm9wUmVjdFRvcGxvbmcAAAAAADhCSU0D7QAAAAAAEABIAAAAAQABAEgAAAABAAE4QklNBCYAAAAAAA4AAAAAAAAAAAAAP4AAADhCSU0EDQAAAAAABAAAAFo4QklNBBkAAAAAAAQAAAAeOEJJTQPzAAAAAAAJAAAAAAAAAAABADhCSU0nEAAAAAAACgABAAAAAAAAAAE4QklNA/UAAAAAAEgAL2ZmAAEAbGZmAAYAAAAAAAEAL2ZmAAEAoZmaAAYAAAAAAAEAMgAAAAEAWgAAAAYAAAAAAAEANQAAAAEALQAAAAYAAAAAAAE4QklNA/gAAAAAAHAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAOEJJTQQAAAAAAAACAAE4QklNBAIAAAAAAAQAAAAAOEJJTQQwAAAAAAACAQE4QklNBC0AAAAAAAYAAQAAAAI4QklNBAgAAAAAABAAAAABAAACQAAAAkAAAAAAOEJJTQQeAAAAAAAEAAAAADhCSU0EGgAAAAADSQAAAAYAAAAAAAAAAAAAAIAAAACAAAAACgBVAG4AdABpAHQAbABlAGQALQAyAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAACAAAAAgAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAABAAAAABAAAAAAAAbnVsbAAAAAIAAAAGYm91bmRzT2JqYwAAAAEAAAAAAABSY3QxAAAABAAAAABUb3AgbG9uZwAAAAAAAAAATGVmdGxvbmcAAAAAAAAAAEJ0b21sb25nAAAAgAAAAABSZ2h0bG9uZwAAAIAAAAAGc2xpY2VzVmxMcwAAAAFPYmpjAAAAAQAAAAAABXNsaWNlAAAAEgAAAAdzbGljZUlEbG9uZwAAAAAAAAAHZ3JvdXBJRGxvbmcAAAAAAAAABm9yaWdpbmVudW0AAAAMRVNsaWNlT3JpZ2luAAAADWF1dG9HZW5lcmF0ZWQAAAAAVHlwZWVudW0AAAAKRVNsaWNlVHlwZQAAAABJbWcgAAAABmJvdW5kc09iamMAAAABAAAAAAAAUmN0MQAAAAQAAAAAVG9wIGxvbmcAAAAAAAAAAExlZnRsb25nAAAAAAAAAABCdG9tbG9uZwAAAIAAAAAAUmdodGxvbmcAAACAAAAAA3VybFRFWFQAAAABAAAAAAAAbnVsbFRFWFQAAAABAAAAAAAATXNnZVRFWFQAAAABAAAAAAAGYWx0VGFnVEVYVAAAAAEA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AAAADwBBAGQAbwBiAGUAIABQAGgAbwB0AG8AcwBoAG8AcAAAABIAQQBkAG8AYgBlACAAUABoAG8AdABvAHMAaABvAHAAIABDAEMAAAABADhCSU0EBgAAAAAABwAIAQEAAQEA/+ENzGh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMS0xMC0xMVQxOTo1NTozNyswNTozMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMS0xMC0xMVQxOTo1NTozNyswNTozMCIgeG1wOk1vZGlmeURhdGU9IjIwMjEtMTAtMTFUMTk6NTU6MzcrMDU6MzAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjhiZDA5NTMtODA4MC1jNzQzLWJmOWEtMTVlMzEwOGZiOWQ4IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZThiYzY2ODUtMWYxZC1mOTRmLWEyMDQtODhlZTJkNmI2NjRlIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YjdlMTQ0YjUtNDYwOS0xMTRkLThjMTgtYzc3ODBlMGYyYjQxIiBkYzpmb3JtYXQ9ImltYWdlL2pwZWciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmI3ZTE0NGI1LTQ2MDktMTE0ZC04YzE4LWM3NzgwZTBmMmI0MSIgc3RFdnQ6d2hlbj0iMjAyMS0xMC0xMVQxOTo1NTozNyswNTozMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MjhiZDA5NTMtODA4MC1jNzQzLWJmOWEtMTVlMzEwOGZiOWQ4IiBzdEV2dDp3aGVuPSIyMDIxLTEwLTExVDE5OjU1OjM3KzA1OjMwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDwvcmRmOlNlcT4gPC94bXBNTTpIaXN0b3J5PiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg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"

        }];

      }
    })
  }

  getEmployeeInformation(){


      this.LM.getEmployeeInformation(this.userSession.id).subscribe((result) => {
        if(result && result.status) {
          this.employeedata = JSON.parse(result.data[0].json)[0];
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
 cancel(){
  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    this.router.navigate(["/LeaveManagement/UserDashboard"]));
 }

  getErrorMessages(errorCode:any) {
    this.LM.getErrorMessages(errorCode,1,1).subscribe((result)=>{
      if(result.status && errorCode == 'LM117')
      {
        this.LM117 = result.data[0].errormessage
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
