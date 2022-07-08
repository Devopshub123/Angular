import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LeavePoliciesService } from 'src/app/services/leave-policies.service'; 

@Component({
  selector: 'app-addleavepopup',
  templateUrl: './addleavepopup.component.html',
  styleUrls: ['./addleavepopup.component.scss']
})
export class AddleavepopupComponent implements OnInit {
  leaveTypeForm:any = FormGroup;
  isCustomLeaveSubmitted:boolean=false;
  existingLeaveTypes:any=[]
  existingColors:any=[]
  existingDisplayNames:any=[]

  constructor(private LM:LeavePoliciesService,private formBuilder: FormBuilder,) { }

  ngOnInit(): void {
  }
  // addNewCustomLeaveType() {
  //   // this.isCustomLeaveSubmitted = true;
  //   if(leaveTypeForm.valid && this.isValidLeaveName && this.isValidDisplayname && this.isValidColor) {

  //     this.lmsData.displayName=this.lmsData.leaveTypeName;
  //     this.LM.setNewLeaveType(this.lmsData).subscribe((data) => {
  //       // this.lmsData=new lmsModalPopup();
  //       if (data.status) {
  //         // this.lmsData=new lmsModalPopup();
      
  //         this.isCustomLeaveSubmitted=false;
  //       }
  //       else {
  //         // this.toastr.error(this.msgLM42)
  //       }
  //     });
  //   }
  // }
  /**get all leavetype details */
  getLeavesDetails() {
    this.LM.getLeaveDetails('lm_leavesmaster',null,1,100).subscribe((result) =>{
      for(let i=0; i<result.data.length;i++) {
        this.existingLeaveTypes.push(result.data[i].leavename);
        this.existingColors.push(result.data[i].leavecolor);
        this.existingDisplayNames.push(result.data[i].display_name);
      }

    });
  }

}
