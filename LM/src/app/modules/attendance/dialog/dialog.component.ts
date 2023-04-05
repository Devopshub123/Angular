import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators,ValidatorFn,ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminService } from 'src/app/modules/admin/admin.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
    public form:FormGroup;
  messagesDataList:any;
  ATT1:any;

  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private Admin:AdminService) {
      this.form = this.formBuilder.group({
        'reason':['',[Validators.required,this.noWhitespaceValidator()]], });
    }
rejectreason='';
  ngOnInit(): void {
    this.getMessagesList();

    // this.requestform = this.formBuilder.group(
    //   {
    //     reason: ['',[Validators.required]],
    //   });
  }
  // get f(): { [key: string]: AbstractControl } {
  //   return this.form.controls;
  // }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onOkClick(){
    console.log("this.form.valid",this.form.valid)
    if(this.form.valid){
      if(this.data.name == "Reject"){
        this.form.get('reason')!.setValidators([Validators.required]);
        this.form.get('reason')!.updateValueAndValidity();
        this.rejectreason=this.form.controls.reason.value;
        if(this.form.valid && this.form.value){
          this.dialogRef.close(this.form.value);
        }

    }
    else{
    this.form.get('reason')?.clearValidators();
    this.form.get('reason')!.updateValueAndValidity();

    this.dialogRef.close(this.form.value);
   }
    }
    
  }


  getMessagesList() {
    let data =
      {
        "code": null,
        "pagenumber":1,
        "pagesize":100
      }
    this.Admin.getMessagesListApi(data).subscribe((res:any)=>{
      if(res.status) {
        this.messagesDataList = res.data;
        this.messagesDataList.forEach((e: any) => {
          if (e.code == "ATT1") {
            this.ATT1 = e.message
          }
        })
      }
      else {
        this.messagesDataList = [];
      }

    })
  }

  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const isWhitespace = (control.value || '').trim().length === 0;
      return isWhitespace ? { whitespace: true } : null;
    };
  }
}
