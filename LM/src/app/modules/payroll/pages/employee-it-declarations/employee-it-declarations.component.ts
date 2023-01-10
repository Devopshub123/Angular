import { AnyComponent } from 'preact';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl,Validators, AbstractControl, FormArray } from '@angular/forms';
import { PayrollService } from '../../payroll.service';
import * as FileSaver from 'file-saver';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'; 
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { Investments } from '../../models/investments';
import { typeWithParameters } from '@angular/compiler/src/render3/util';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-employee-it-declarations',
  templateUrl: './employee-it-declarations.component.html',
  styleUrls: ['./employee-it-declarations.component.scss']
})

export class EmployeeItDeclarationsComponent implements OnInit {
  itDeclarationRequestForm!: FormGroup;
  itDeclarationOTForm!: FormGroup;
  itDeclarationForm!:FormGroup;
  userSession: any;
  displayedColumns = ['sno','particulars','mlimit','percentage','declareamount','samount','receiptnumber','attachments','approveamount','action'];
  datasource:any;
  datas: any;
  InvestmentDetails:any;
  array: any=[];
  damountarray:any=[];
  disabiltyarry:any=[];
  disableflag:any;
  investmentid:any;
  receiptnumber:any;
  messagesList:any=[];
  statusdata:any;
  PR13:any;
  PR14:any;
  PR15:any;
  PR16:any;
  PR17:any;
  PR18:any;
  PR19:any;
  PR20:any;
  PR21:any;
  PR22:any;
  PR29:any;
  private files: Array<any> = [];
  constructor(private formBuilder: FormBuilder,private PR:PayrollService,private dialog: MatDialog,private router: Router) {
    this.userSession = JSON.parse(sessionStorage.getItem('user') || '');
    this.getEmployeeInvestments();
    this.formData = new FormData();
    this.disableFormData = new FormData();

    this.InvestmentDetails=new Investments();
  }
  isShowTaxRegion:any = 'tax-region';
  isRadioNewTaxRegime:boolean = false;
  isRadioOldTaxRegime:boolean = false;
  taxRegimeFormData:any;
  columnNames: any;
  lastColumnName: any;
  allButLastColumnNames: any;
  rowSpans: any;
  decamount:any=[];
  subamount:any=[];
  recnumber:any=[];
  aattachment:any=[];
  sampleSAAmount:any=[];
  sampleRN:any = [];
  sampleAttachment:any=[];
  sampleApprovedAmount:any=[];
  sampleflags:any=[];
  sampleStatus:any=[];
  sampleStatusReason:any=[];
  filename: any;
  file: any;
  disablefile:any;
  disablefilename:any
  fileURL: any;
  expFromDate: any;
  expToDate: any;
  maxDate = new Date();
  minetodate: any;
  editDockinfo: any;
  isedit: boolean = false;
  editFileName: any;
  documentTypeList: any;
  isFile: boolean = true;
  formData: any;
  disableFormData:any;
  modulecode:any;
  dataidofupdate:any;
  
  ngOnInit(): void {
    this.getMessagesList();
    this.itDeclarationForm= this.formBuilder.group(
      {
        percentage:[""],
        damount:[],
        samount:[""],
        rrnumber:["",],
        attach:[""],
        aaamount:[""],
      });

    this.itDeclarationRequestForm = this.formBuilder.group(
      {
        newTaxRegime:  [""]
      });
    this.itDeclarationOTForm = this.formBuilder.group(
      {
        oldTaxRegime:  [""]
      });
  }
  onClickNext(){
    this.isShowTaxRegion = 'it-declaration';
  }
  onClickTaxRegime(element:any){
    if(element == "newTaxRegime")
    {
      this.isRadioNewTaxRegime = !this.isRadioNewTaxRegime;
      this.itDeclarationOTForm.reset();
    }
    else  if(element == "oldTaxRegime")
    {
      this.isRadioOldTaxRegime = !this.isRadioOldTaxRegime;
      this.itDeclarationRequestForm.reset();
    }
    this.taxRegimeFormData = this.itDeclarationRequestForm.value;
    console.log("NT",this.taxRegimeFormData);
    console.log("OT",this.itDeclarationOTForm.value);

  }
  /**index tracking */
  trackByFn(index: any, item: any) {
    return index;
 }
  /**get employee investment details */
  getEmployeeInvestments(){
    this.PR.getEmployeeInvestments(this.userSession.id).subscribe((result:any)=>{
      if(result.status){
        this.datasource = JSON.parse(result.data[0][0].json_data);
        console.log(this.datasource)
        /*this.datasource = [JSON.parse(result.data[0][0].json_data)[0]];*/
        for(var i=0;i<this.datasource.length;i++){          
          if(this.datasource[i].action_date ==null){
            this.sampleSAAmount[i] = [''];
            this.sampleRN[i] = [''];
            this.sampleAttachment[i] = [''];
            this.sampleApprovedAmount[i] = [''];
            this.InvestmentDetails.damount=[''];
            this.sampleflags[i]=[false];
            this.sampleStatus[i]=[''];
            this.sampleStatusReason[i]=[''];
            this.damountarray.push('');
            this.disabiltyarry.push('');
          }
          else{
            this.sampleSAAmount[i] = [];
            this.sampleRN[i] = [];
            this.sampleAttachment[i] = [];
            this.sampleApprovedAmount[i] = [];
            this.sampleStatus[i]=[];
            this.sampleStatusReason[i]=[];
            var s_amount:any=[];
            var r_number:any=[];
            var s_att:any=[];
            var a_amount:any=[];
            var flags:any=[];
            var status:any=[];
            var statusreason:any=[];
            this.damountarray.push(this.datasource[i].declared_amount)
            this.disabiltyarry.push(this.datasource[i].disability_percentage)
            for(let m=0;m<this.datasource[i].submitted_amount.length;m++){
              s_amount.push(this.datasource[i].submitted_amount[m].submitted_amount);
              r_number.push(this.datasource[i].receipt_number[m].receipt_number);
              s_att.push(this.datasource[i].investment_file[m].investment_file==null?'':this.datasource[i].investment_file[m].investment_file);
              flags.push(true)
              a_amount.push(this.datasource[i].approved_amount[m].approved_amount==null?'':this.datasource[i].approved_amount[m].approved_amount);
              status.push(this.datasource[i].status[m].status);
              statusreason.push(this.datasource[i].status_reason[m].status_reason);
              this.sampleSAAmount[i]=s_amount;
              this.sampleRN[i]=r_number;
              this.sampleAttachment[i]=s_att;
              this.sampleApprovedAmount[i]=a_amount;
              this.sampleflags[i] = flags;
              this.sampleStatus[i]=status;
              this.sampleStatusReason[i] = statusreason;

            }
          }
        }
        this.InvestmentDetails.submittedamount = this.sampleSAAmount;
        this.InvestmentDetails.receiptnumner =this.sampleRN;
        this.InvestmentDetails.approveamount=this.sampleApprovedAmount;
        this.InvestmentDetails.attachments= this.sampleAttachment;
        this.InvestmentDetails.damount=this.damountarray;
        this.InvestmentDetails.percentage = this.disabiltyarry;
        this.InvestmentDetails.flags = this.sampleflags;
        this.InvestmentDetails.status = this.sampleStatus;
        this.InvestmentDetails.statusreason = this.sampleStatusReason;
      }
    })
  }
  set(data:any){}
  Onchange(event:any,index:any){}
  setdata(item:any,i:any){
    console.log("item",item)
    console.log("index",i)
    console.log(this.InvestmentDetails.damount)
    this.disableflag=item.disability_flag;
    this.investmentid=item.id;
    this.array = [Number(this.InvestmentDetails.submittedamount[item.id-1][i])]
    this.receiptnumber=this.InvestmentDetails.receiptnumner[item.id-1][i]
    let sum = this.array.reduce((sum:any, p:any) => sum + p);

    /**Here check  Uploaded filedata */
    if(item.disability_flag){ 
      if(Number(this.InvestmentDetails.percentage[item.id-1])>= item.disability_min_percentage && Number(this.InvestmentDetails.percentage[item.id-1]) <= item.disability_max_percentage){
        if( this.file != undefined){
          if(item.investment_maxvalue>=(item.declared_amount==null?Number(this.InvestmentDetails.damount[item.id-1]):item.declared_amount)){
            if((item.declared_amount==null?Number(this.InvestmentDetails.damount[item.id-1]):item.declared_amount)>=sum){
              let data = {
                iid:null,
                empid:this.userSession.id,
                investmentid:Number(item.id),
                declaredamount:item.declared_amount==null?Number(this.InvestmentDetails.damount[item.id-1]):item.declared_amount,
                submittedamount:Number(this.InvestmentDetails.submittedamount[item.id-1][i]),
                verifiedamount:null,
                receiptnumber:this.InvestmentDetails.receiptnumner[item.id-1][i],
                disabilitypercentage:item.disability_flag?(item.disability_percentage==null?Number(this.InvestmentDetails.percentage[item.id-1]):item.disability_percentage):null,
                statusvalue:7,
                statusreason:null,
                actionby:this.userSession.id
              }
              this.PR.setEmployeeInvestments(data).subscribe((result:any)=>{
                if(result.status){
                this.saveDocument(result.data[0]);
                }
                else{
                  let dialogRef = this.dialog.open(ReusableDialogComponent, {
                    position:{top:`70px`},
                    disableClose: true,
                    data: this.PR19 ()
                  });
                }
          
              })
            }
            else{
              let dialogRef = this.dialog.open(ReusableDialogComponent, {
                position:{top:`70px`},
                disableClose: true,
                data: this.PR14
                });
      
            }
          }
          else{
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position:{top:`70px`},
              disableClose: true,
              data: this.PR15
              });
          }
    
        }
        else{
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: this.PR16
            });
        
        }
      }
      else{
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: this.PR29 +'('+item.disability_min_percentage+ '-' +item.disability_max_percentage+')'
        });

      }

    }else{
      if( this.file != undefined && this.array !='' && this.receiptnumber!=''){
        if(item.investment_maxvalue>=(item.declared_amount==null?Number(this.InvestmentDetails.damount[item.id-1]):item.declared_amount)){
          if((item.declared_amount==null?Number(this.InvestmentDetails.damount[item.id-1]):item.declared_amount)>=sum){
            let data = {
              iid:null,
              empid:this.userSession.id,
              investmentid:Number(item.id),
              declaredamount:item.declared_amount==null?Number(this.InvestmentDetails.damount[item.id-1]):item.declared_amount,
              submittedamount:Number(this.InvestmentDetails.submittedamount[item.id-1][i]),
              verifiedamount:null,
              receiptnumber:this.InvestmentDetails.receiptnumner[item.id-1][i],
              disabilitypercentage:item.disability_flag?(item.disability_percentage==null?Number(this.InvestmentDetails.percentage[item.id-1]):item.disability_percentage):null,
              statusvalue:7,
              statusreason:null,
              actionby:this.userSession.id
            }
            this.PR.setEmployeeInvestments(data).subscribe((result:any)=>{
              if(result.status){
              this.saveDocument(result.data[0]);
              }
              else{
                let dialogRef = this.dialog.open(ReusableDialogComponent, {
                  position:{top:`70px`},
                  disableClose: true,
                  data: this.PR19
                });
              }
        
            })
          }
          else{
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position:{top:`70px`},
              disableClose: true,
              data: this.PR14
              });
    
          }
        }
        else{
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: this.PR15
            });
        }
  
      }
      else{
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data: this.PR16
          });
      
      }

    }
    
  }
  
  /**adding new declaration details */
  addSubItdeclaration(index:any) {
   this.sampleSAAmount[index].push('');
   this.sampleRN[index].push('');
   this.sampleAttachment[index].push('');
   this.sampleApprovedAmount[index].push('');
   this.sampleStatus[index].push('');
  }
  /**Delete Employee Investments */
  deleteInvestments(index:any,i:any,id:any){
    /** */
    if(index.approved_amount.length > i){
      let data ={
        id:index.investment_id[i].investment_id
      }
      let filedata={
        id:index.investment_fileid[i].investment_fileid,
        filepath:index.filepath,
        filename:index.investment_filename[i].investment_filename
  
      }
      this.PR.deleteEmployeeInvestments(data).subscribe((result:any)=>{
        if(result.status){
          if(index.investment_fileid[i].investment_fileid != null){
            this.PR.deleteFilesMaster(index.investment_fileid[i].investment_fileid).subscribe((res: any) => {
              if (res && res.status) {
                var info = JSON.stringify(filedata)
                this.PR.removeDocumentOrImagesForEMS(info).subscribe((result: any) => { 
                  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
                  this.router.navigate(["/Payroll/EmployeeITDeclaration"])); 
                  let dialogRef = this.dialog.open(ReusableDialogComponent, {
                  position:{top:`70px`},
                  disableClose: true,
                  data: this.PR17
            });
                })
              } else {
                let dialogRef = this.dialog.open(ReusableDialogComponent, {
                  position:{top:`70px`},
                  disableClose: true,
                  data: this.PR18
                });
        
              }
            });
          }
          else{
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/Payroll/EmployeeITDeclaration"])); 
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data: this.PR17
          });
          }
        }
      })

    }
    /** */
    else{
      this.sampleSAAmount[id].splice(i, 1);
      this.sampleRN[id].splice(i, 1);
      this.sampleAttachment[id].splice(i, 1);
      this.sampleApprovedAmount[id].splice(i,1);
    }
   
  }
  /**Save Uploaded attchment Document */
  saveDocument(data:any) {
    this.PR.getFilepathsMasterForEMS(5).subscribe((resultData:any) => {
      if (resultData && resultData.status) {
        this.modulecode = resultData.data[0].module_code;
        this.dataidofupdate = data.idofupdate==undefined?data:data.idofupdate;
        this.statusdata = data.idofupdate;
        let obj = {
          'id': null,
          'employeeId': this.userSession.id,
          'candidateId': 0,
          'filecategory': 'INVESTMENTS',
          'moduleId': 5,
          'documentnumber': this.receiptnumber,
          'fileName': this.file.name,
          'modulecode': resultData.data[0].module_code,
          'requestId':data.idofupdate==undefined?data:data.idofupdate,
          'status': 'Submitted'
        }
        console.log(obj)
        this.PR.setFilesMasterForEMS(obj).subscribe((data) => {
          if (data && data.status) {
              let info = JSON.stringify(data.data[0])
              console.log(info);
              console.log(this.formData);
              this.PR.setDocumentOrImageForEMS(this.formData, info).subscribe((data:any) => {
                // this.spinner.hide()
                if (data && data.status) {
                  if(this.disableflag){
                    console.log(this.dataidofupdate)
                    this.saveDisableDocument(this.dataidofupdate);
                  }else{
                    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
                    this.router.navigate(["/Payroll/EmployeeITDeclaration"])); 
                    /**For only Document upload */
                    if(this.statusdata==undefined){
                      let dialogRef = this.dialog.open(ReusableDialogComponent, {
                        position:{top:`70px`},
                        disableClose: true,
                        data: 'Document uploaded successfully.'
                      });

                    }
                    /**For Document upload and submit */
                    else{
                      let dialogRef = this.dialog.open(ReusableDialogComponent, {
                        position:{top:`70px`},
                        disableClose: true,
                        data: this.PR13
                      });

                    }
                   

                  }
                  
                  
                } else {
                  // let dialogRef = this.dialog.open(ReusableDialogComponent, {
                  //   position: { top: `70px` },
                  //   disableClose: true,
                  //   data: this.EM12
                  // });
                  // this.open(result.isLeaveUpdated ? this.msgLM76 : this.msgLM79,'8%','500px','250px',false,"/LeaveManagement/UserDashboard")

                }
                this.file = null;
                this.formData.delete('file');
                this.editDockinfo = null;
                this.editFileName = null;

              });
            
          }
        });
      }
    });
  }
  /**Save Uploaded attchment Document */
  saveDisableDocument(data:any) {
        let obj = {
          'id': null,
          'employeeId': this.userSession.id,
          'candidateId': 0,
          'filecategory': 'DISABILITIES',
          'moduleId': 5,
          'documentnumber': '',
          'fileName': this.disablefile.name,
          'modulecode': this.modulecode,
          'requestId':data,
          'status': 'Submitted'
        }
        console.log("hi")
        this.PR.setFilesMasterForEMS(obj).subscribe((data) => {
          if (data && data.status) {
              let info = JSON.stringify(data.data[0])
              this.PR.setDocumentOrImageForEMS(this.disableFormData, info).subscribe((data:any) => {
                if (data && data.status) {
                  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
                  this.router.navigate(["/Payroll/EmployeeITDeclaration"])); 
                  let dialogRef = this.dialog.open(ReusableDialogComponent, {
                    position:{top:`70px`},
                    disableClose: true,
                    data: this.PR13
                  });
                } else {}
                this.file = null;
                this.formData.delete('file');
                this.editDockinfo = null;
                this.editFileName = null;

              });
            
          }
        });
      
  
  }
/**Selected file data added to formdata */
  onSelectFile(event: any,data:any,index:any) {
    console.log("eve-",event)
    console.log("dat-",data)
    console.log("ind-",index)
     this.datas= data;
      /**for only data upload */
      if(data.investment_file!=null && (data.investment_id[index-1].investment_id !=null  )&& data.investment_filename[index-1].investment_filename !='' ){
        if (event.target.files.length != 0) {
          if (event.target.files[0].size <= 2097152) {
            this.file = event.target.files[0];
            // this.sampleAttachment[data][index] =this.file.name;
            var pdf = this.file.name.split('.');
            if (pdf[pdf.length - 1] == 'pdf' || pdf[pdf.length - 1] == 'jpg' || pdf[pdf.length - 1] == 'png') {
              this.isFile = true;
              this.formData.append('file', this.file, this.file.name);
              // this.saveDocument(data.investment_id[index-1].investment_id);
            } else {
              this.isFile = false;
    
            }
          } else {
            this.isFile = false;
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
              data: this.PR20
            });
          }
        } 
       }
       /**For document upload with data */
       else{
        if (event.target.files.length != 0) {
          if (event.target.files[0].size <= 2097152) {
            this.file = event.target.files[0];
            // this.sampleAttachment[data][index] =this.file.name;
            var pdf = this.file.name.split('.');
            if (pdf[pdf.length - 1] == 'pdf' || pdf[pdf.length - 1] == 'jpg' || pdf[pdf.length - 1] == 'png') {
              this.isFile = true;
              this.formData.append('file', this.file, this.file.name);
              
            } else {
              this.isFile = false;
    
            }
          } else {
            this.isFile = false;
            let dialogRef = this.dialog.open(ReusableDialogComponent, {
              position: { top: `70px` },
              disableClose: true,
              data: this.PR20
            });
          }
        } 
  
       }

    // }
     
    
    
  }

/**Uploaded file view functionality */
fileView(data: any,i:any) {
  console.log(data)
   console.log(i)
   console.log(this.userSession.id+'_'+'INVESTMENTS'+'_'+data.investment_id[i].investment_id+'_.test.pdf')
   let info = {
     filename:data.investment_filename[i].investment_filename,
     fname:data.investment_filename[i].investment_filename
   }
   
   // this.spinner.show()
   this.PR.getDocumentOrImagesForEMS(info).subscribe((imageData:any) => {
     if (imageData.success) {
       // this.spinner.hide();
       let TYPED_ARRAY = new Uint8Array(imageData.image.data);
       const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
         return data + String.fromCharCode(byte);
       }, '');
       let base64String = btoa(STRING_CHAR)
       console.log(info.fname)
       var documentName = info.fname.split('.')
       if (documentName[documentName.length - 1] == 'pdf') {
         const file = new Blob([TYPED_ARRAY], { type: "application/pdf" });
         this.fileURL = URL.createObjectURL(file);
         window.open(this.fileURL);

       } else {
         this.fileURL = new Blob([TYPED_ARRAY], { type: "image/png" })
         let url = URL.createObjectURL(this.fileURL)
         window.open(url, '_blank');
       }
     }
   
 })
} 
/**Uploaded disability percentage file view functionality */
disableFileView(data: any) {
   let info = {
     filename:data.disability_filename[0].disability_filename,
     fname:data.disability_filename[0].disability_filename,
   }
   console.log(info)
   // this.spinner.show()
   this.PR.getDocumentOrImagesForEMS(info).subscribe((imageData:any) => {
     if (imageData.success) {
       // this.spinner.hide();
       let TYPED_ARRAY = new Uint8Array(imageData.image.data);
       const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
         return data + String.fromCharCode(byte);
       }, '');
       let base64String = btoa(STRING_CHAR)
       console.log(info.fname)
       var documentName = info.fname.split('.')
       if (documentName[documentName.length - 1] == 'pdf') {
         const file = new Blob([TYPED_ARRAY], { type: "application/pdf" });
         this.fileURL = URL.createObjectURL(file);
         window.open(this.fileURL);

       } else {
         this.fileURL = new Blob([TYPED_ARRAY], { type: "image/png" })
         let url = URL.createObjectURL(this.fileURL)
         window.open(url, '_blank');
       }
     }
   
 })
} 
/**Uploaded document delete functionality */
deletefile(data:any,index:any,i:any){
  let filedata={
    id:data.investment_fileid[index].investment_fileid,
    filepath:data.filepath,
    filename:data.investment_filename[index].investment_filename

  }
  this.PR.deleteFilesMaster(data.investment_fileid[index].investment_fileid).subscribe((res: any) => {
    if (res && res.status) {
      var info = JSON.stringify(filedata)
      this.PR.removeDocumentOrImagesForEMS(info).subscribe((result: any) => { 
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate(["/Payroll/EmployeeITDeclaration"])); 
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position:{top:`70px`},
        disableClose: true,
        data: this.PR21
  });
      })
    } else {
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position:{top:`70px`},
        disableClose: true,
        data: this.PR22
      });

    }
  });
}
/** */
deletedisablefile(data:any){
  console.log(data)
  let filedata={
    id:data.disability_fileid,
    filepath:data.filepath,
    filename:data.disability_filename
  }
  this.PR.deleteFilesMaster(data.disability_fileid).subscribe((res: any) => {
    if (res && res.status) {
      var info = JSON.stringify(filedata)
      this.PR.removeDocumentOrImagesForEMS(info).subscribe((result: any) => { 
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate(["/Payroll/EmployeeITDeclaration"])); 
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position:{top:`70px`},
        disableClose: true,
        data: this.PR21
  });
      })
    } else {
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position:{top:`70px`},
        disableClose: true,
        data: this.PR22
      });

    }
  });

}
 /**getMessages for success , failure */
 getMessagesList() {
  let data =
    {
      "code": null,
      "pagenumber":1,
      "pagesize":1000
    }
  this.PR.getErrorMessages(null,1,1000).subscribe((res:any)=>{
    if(res.status && res.data && res.data.length >0) {
      this.messagesList = res.data;
      this.messagesList.forEach((e: any) => {
        if (e.code == "PR13") {
          this.PR13 = e.message
        }
        else if (e.code == "PR14") {
          this.PR14 =e.message
        }
        else if (e.code == "PR15") {
          this.PR15 =e.message
        }
        else if (e.code == "PR16") {
          this.PR16 =e.message
        }
        else if (e.code == "PR17") {
          this.PR17 =e.message
        }
        else if (e.code == "PR18") {
          this.PR18 =e.message
        }
        else if (e.code == "PR19") {
          this.PR19 =e.message
        }
        else if (e.code == "PR20") {
          this.PR20 =e.message
        }
        else if (e.code == "PR21") {
          this.PR21 =e.message
        }
        else if (e.code == "PR22") {
          this.PR22 =e.message
        }
        else if (e.code == "PR29") {
          this.PR29 =e.message
        }
        
      })

    }

  })
} 
onClick(event: any,data:any){
  console.log(data);
 if(data.investment_fileid == null){
  if (event.target.files.length != 0) {
    if (event.target.files[0].size <= 2097152) {
      this.disablefile = event.target.files[0];
      console.log(this.disablefile)
      var pdf = this.disablefile.name.split('.');
      if (pdf[pdf.length - 1] == 'pdf' || pdf[pdf.length - 1] == 'jpg' || pdf[pdf.length - 1] == 'png') {
        this.isFile = true;
        this.disableFormData.append('file', this.disablefile, this.disablefile.name);
      } else {
        this.isFile = false;

      }
    } else {
      this.isFile = false;
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position: { top: `70px` },
        disableClose: true,
        data: this.PR20
      });
    }
  } 
  else{
    if (event.target.files.length != 0) {
      if (event.target.files[0].size <= 2097152) {
        this.disablefile = event.target.files[0];
        console.log(this.disablefile)
        var pdf = this.disablefile.name.split('.');
        if (pdf[pdf.length - 1] == 'pdf' || pdf[pdf.length - 1] == 'jpg' || pdf[pdf.length - 1] == 'png') {
          this.isFile = true;
          this.disableFormData.append('file', this.disablefile, this.disablefile.name);
          console.log(this.disableFormData);
          this.saveDisableDocument(data.investment_fileid)
        } else {
          this.isFile = false;
  
        }
      } else {
        this.isFile = false;
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position: { top: `70px` },
          disableClose: true,
          data: this.PR20
        });
      }
    }

  }

 }
  
 
}


}
