import { Component, OnInit, ViewChild  } from '@angular/core';
import { FormGroup,FormControl,Validators, FormBuilder, AbstractControl, FormArray, ValidatorFn, ValidationErrors} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { EmsService } from '../../ems.service';
import { DatePipe } from '@angular/common';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { AdminService } from 'src/app/modules/admin/admin.service';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import * as _moment from 'moment';
// import {default as _rollupMoment} from 'moment';
const moment =  _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};


@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class AnnouncementsComponent implements OnInit {
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: "15rem",
    minHeight: "5rem",
    placeholder: "Enter text ",
    translate: "no",
    defaultParagraphSeparator: "p",
    defaultFontName: "Arial",
    toolbarHiddenButtons: [["bold"]],
    customClasses: [
      {
        name: "quote",
        class: "quote"
      },
      {
        name: "redText",
        class: "redText"
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1"
      }
    ]
  };
  pipe = new DatePipe('en-US');
  announcementForm:any= FormGroup;
  designations:any=[];
  min:any=new Date();
  max:any=new Date();
  issubmit:boolean =false;
  isview:boolean=true;
  ishide:boolean=false;
  isedit:boolean=false;
  ispublish:boolean=true;
  isrepublish:boolean=false;
  isviewdata:boolean=false;
  iseditingdata:boolean=false;
  announcementlist:any=[];
  pageLoading = true;
  mindate: any;
  minAnounceDate:any=new Date();

  issavedraft:boolean=true;
  displayedColumns: string[] = ['sno','topic','title','publishedon','publishedTo','status','action'];
  dataSource: MatTableDataSource<any>=<any>[];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  userSession: any;
  EM1:any;
  EM2:any;
  EM3:any;
  EM24:any;
  EM25:any;
  EM30:any;
  EM31:any;
  EM32:any;
  EM33:any;
  EM44: any;
  EM45: any;


  constructor(private formBuilder: FormBuilder,private router: Router,private ES:EmsService,public dialog: MatDialog,private EM:AdminService) { }

  ngOnInit(): void {
    this.getAnnouncements();
    this.getActiveAnnouncementsTopics();
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.getMessageList();
    this.announcementForm=this.formBuilder.group(
      {
      topic: ["",Validators.required],
      title: ["",[Validators.required,this.noWhitespaceValidator()]],
      description:["",Validators.required],
      fromdate:["",Validators.required],
      todate:["",Validators.required],
      id:[null,],
    });

    this.announcementForm.get('fromdate')?.valueChanges.subscribe((selectedValue:any) => {

      this.minAnounceDate = selectedValue._d==undefined?this.minAnounceDate:selectedValue._d;
    })
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
    this.ishide = false;
    this.isview = true;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/Admin/announcement"]));
  }
  edit(event: any, data: any) {
    console.log(this.minAnounceDate)
    this.minAnounceDate = new Date(data.fromdate)
    this.iseditingdata=true;
    if(data.status == 'Published'){
      this.issavedraft =false;
      this.ispublish=true;
    }
    else{
      this.issavedraft =true;
      this.ispublish=true;

    }
    this.ishide = true;
    this.isview = false;
    this.isedit = false;
    this.isviewdata = false;

    // this.announcementForm.controls.topic.setvalue(data.topicid)
    this.announcementForm.controls.topic.setValue(data.topicid);
    this.announcementForm.controls.title.setValue(data.title);
    this.announcementForm.controls.fromdate.setValue(new Date(data.fromdate));
    this.announcementForm.controls.todate.setValue(new Date(data.todate));
    this.announcementForm.controls.description.setValue(data.description);
    this.announcementForm.controls.id.setValue(data.id)
  }
  delete(event:any,data:any){

    let deletedata ={
      id:data.id,
      topicid:data.topicid,
      title:data.title,
      fromdate: this.pipe.transform(data.fromdate,'yyyy-MM-dd'),
      todate:this.pipe.transform(data.todate,'yyyy-MM-dd'),
      description:data.description,
      status:'Deleted',
      actionby:this.userSession.id

     }
     this.ES.setAnnouncements(deletedata).subscribe((res:any)=>{

        if(res.status ){
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/Admin/announcement"]));
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: 'Announcement deleted successfully'
          });

        }
        else{
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: 'Unable to delete announcement.'
          });

       }


     })

  }
  getActiveAnnouncementsTopics(){
    this.ES.getActiveAnnouncementsTopics().subscribe((res:any)=>{
      if(res.status ){
        this.announcementlist = res.data;
      }
    })

  }
  getAnnouncements(){
    this.ES.getAnnouncements(null).subscribe((res:any)=>{
      if(res.status ){
        this.dataSource = new MatTableDataSource(res.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })

  }
  submit(){
    this.issubmit = true;
    if(this.announcementForm.valid){
      let data ={
        id:this.announcementForm.controls.id.value,
        topicid:this.announcementForm.controls.topic.value,
        title:this.announcementForm.controls.title.value,
        fromdate:this.pipe.transform(this.announcementForm.controls.fromdate.value,'yyyy-MM-dd'),
        todate:this.pipe.transform(this.announcementForm.controls.todate.value,'yyyy-MM-dd'),
        // description:"hi",
        description:this.announcementForm.controls.description.value,
        status:'Published',
        actionby:this.userSession.id

       }
       this.ES.setAnnouncements(data).subscribe((res:any)=>{
        if(this.isedit){
          if(res.status ){
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
              this.router.navigate(["/Admin/announcement"]));
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position:{top:`70px`},
              disableClose: true,
              data: 'Announcemenyt Updated successfully'
            });

          }
          else{
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position:{top:`70px`},
              disableClose: true,
              data: 'Unable to update announcement.'
            });

         }

        }
        else{
          if(res.status ){
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
              this.router.navigate(["/Admin/announcement"]));
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position:{top:`70px`},
              disableClose: true,
              data: this.EM24
            });

          }
          else{
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position:{top:`70px`},
              disableClose: true,
              data: this.EM25
            });

         }
        }

       })

    }


  }
  draft(){
    this.issubmit=true;
    if(this.announcementForm.valid){
      let data ={
        id:this.announcementForm.controls.id.value,
        topicid:this.announcementForm.controls.topic.value,
        title:this.announcementForm.controls.title.value,
        fromdate:this.pipe.transform(this.announcementForm.controls.fromdate.value,'yyyy-MM-dd'),
        todate:this.pipe.transform(this.announcementForm.controls.todate.value,'yyyy-MM-dd'),
        // description:"hi",
        description:this.announcementForm.controls.description.value,
        status:'Saved as draft',
        actionby:this.userSession.id

       }
       this.ES.setAnnouncements(data).subscribe((res:any)=>{
        if(this.isedit){
          if(res.status ){
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
              this.router.navigate(["/Admin/announcement"]));
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position:{top:`70px`},
              disableClose: true,
              data:  this.EM30
            });

          }
          else{
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position:{top:`70px`},
              disableClose: true,
              data:  this.EM31
            });

         }

        }
        else{
          if(res.status ){
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
              this.router.navigate(["/Admin/announcement"]));
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position:{top:`70px`},
              disableClose: true,
              data: this.EM32
            });

          }
          else{
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position:{top:`70px`},
              disableClose: true,
              data: this.EM33
            });

         }
        }

       })

    }


  }
  stop(event:any,data:any){

    let deletedata ={
      id:data.id,
      topicid:data.topicid,
      title:data.title,
      fromdate: this.pipe.transform(data.fromdate,'yyyy-MM-dd'),
      todate:this.pipe.transform(data.todate,'yyyy-MM-dd'),
      description:data.description,
      status:'Cancelled',
      actionby:this.userSession.id

     }
     this.ES.setAnnouncements(deletedata).subscribe((res:any)=>{

        if(res.status ){
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/Admin/announcement"]));
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data:  this.EM44
          });

        }
        else{
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data:  this.EM45
          });

       }

      })

  }
  republish(event:any,data:any){
    if(data.status == 'Publish'){
      this.issavedraft =false;
      this.ispublish=false;
      this.isrepublish = true;
    }
    else{
      this.issavedraft =false;
      this.ispublish=true;
      this.isrepublish = false;

    }

    this.ishide = true;
    this.isview = false;
    this.isedit = false;
    this.isviewdata=false;
    this.iseditingdata=true

    // this.announcementForm.controls.topic.setvalue(data.topicid)
    this.announcementForm.controls.topic.setValue(data.topicid);
    this.announcementForm.controls.title.setValue(data.title);
    this.announcementForm.controls.fromdate.setValue('');
    this.announcementForm.controls.todate.setValue('');
    this.announcementForm.controls.description.setValue(data.description);
    this.announcementForm.controls.id.setValue(data.id)
  }
  view(event:any,data:any){
    this.ishide = true;
    this.isview = false;
    this.isedit = false;
    this.isviewdata=true;
    this.ispublish=false;
    this.isrepublish=false;
    this.issavedraft=false;
    this.iseditingdata=true

    // this.announcementForm.controls.topic.setvalue(data.topicid)
    this.announcementForm.controls.topic.setValue(data.topicid);
    this.announcementForm.controls.title.setValue(data.title);
    this.announcementForm.controls.fromdate.setValue(new Date(data.fromdate));
    this.announcementForm.controls.todate.setValue(new Date(data.todate));
    this.announcementForm.controls.description.setValue(data.description);
    this.announcementForm.controls.id.setValue(data.id)
  }
  getPageSizes(): number[] {
    if (this.dataSource.data.length > 20) {
      return [5, 10, 20, this.dataSource.data.length];
    }
    else {
      return [5, 10, 20];
    }
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
          if(result.data[i].code =='EM1'){
            this.EM1=result.data[i].message;

          }else if(result.data[i].code =='EM2'){
            this.EM2=result.data[i].message;

          }else if(result.data[i].code =='EM3'){
            this.EM3=result.data[i].message;


          }

          else if(result.data[i].code =='EM24'){
            this.EM24=result.data[i].message;


          }
          else if(result.data[i].code =='EM25'){
            this.EM25=result.data[i].message;

          }
          else if(result.data[i].code =='EM30'){
            this.EM30=result.data[i].message;


          }else if(result.data[i].code =='EM31'){
            this.EM31=result.data[i].message;


          }
          else if(result.data[i].code =='EM32'){
            this.EM32=result.data[i].message;


          }else if(result.data[i].code =='EM33'){
            this.EM33=result.data[i].message;


          }
          else if(result.data[i].code =='EM44'){
            this.EM44=result.data[i].message;


          }else if(result.data[i].code =='EM45'){
            this.EM45=result.data[i].message;


          }
        }

      }

    })

  }

}
