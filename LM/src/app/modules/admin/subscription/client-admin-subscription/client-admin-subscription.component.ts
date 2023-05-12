import { Component, OnInit, ViewChild  } from '@angular/core';
import { FormGroup,FormControl,Validators, FormBuilder} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from 'src/app/modules/admin/admin.service';
import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { environment } from 'src/environments/environment';
import * as _moment from 'moment';
import { ManageUsersComponent } from '../dialog/manage-users/manage-users.component';
import { InvoiceDataComponent } from '../dialog/invoice-data/invoice-data.component';
import { CompanySettingService } from 'src/app/services/companysetting.service';
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
  selector: 'app-client-admin-subscription',
  templateUrl: './client-admin-subscription.component.html',
  styleUrls: ['./client-admin-subscription.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class ClientAdminSubscriptionComponent implements OnInit {

  subscriptionForm:any= FormGroup;
  companyDBName: any = environment.dbName;
  clientid:any;
  /** */
  isOther: boolean = false;
  constructor(private formBuilder: FormBuilder, private router: Router, public dialog: MatDialog,
    private adminService: AdminService, private companyService: CompanySettingService,) {
    this.getActiveEmployeesCount();
      this.getClientSubscriptionDetailswithshortcode();

   }
  activeemployeecount: any;
  ngOnInit(): void {

    this.subscriptionForm=this.formBuilder.group(
      {
        companyCode:[""],
        subscriptionId:[""],
        plan:[""],
        takenUsers:[""],
        monthlyCost:[""],
        yearlyCost:[""],
        totalPaidAmt:[""],
        nextRenewal:[""],
        lastRenewal: [""],
        contactPerson:[""],
        companyName:[""],
        mobile:[""],
        industryType:[""],
        industryTypeOther:[""],
        email: [""],
       address1:[""],
        address2:[""],
        country:[""],
        state:[""],
        city:[""],
        pincode:[""],
        gstNumber:[""],
      });

  }
  getClientSubscriptionDetails(data:any){
    this.adminService.getClientSubscriptionDetails(Number(data)).subscribe((res:any)=>{
      if (res.status && res.data.length != 0) {
        let value = res.data;
        this.subscriptionForm.controls.companyCode.setValue(value[0].company_code);
        this.subscriptionForm.controls.subscriptionId.setValue(value[0].subscription_id);
        this.subscriptionForm.controls.plan.setValue(value[0].plan_name);
        this.subscriptionForm.controls.takenUsers.setValue(value[0].user_count +" ( "+ this.activeemployeecount+" in use)");
        this.subscriptionForm.controls.monthlyCost.setValue(value[0].cost_per_user_monthly_bill);
        //this.subscriptionForm.controls.yearlyCost.setValue(value[0].company_code);
        this.subscriptionForm.controls.totalPaidAmt.setValue(value[0].amount_paid);
        this.subscriptionForm.controls.nextRenewal.setValue(value[0].valid_to);
        this.subscriptionForm.controls.lastRenewal.setValue(value[0].payment_date);
        this.subscriptionForm.controls.contactPerson.setValue(value[0].contact_name);
        this.subscriptionForm.controls.companyName.setValue(value[0].company_name);
        this.subscriptionForm.controls.mobile.setValue(value[0].mobile_number);
        this.subscriptionForm.controls.industryType.setValue(value[0].industry_type_name);
        if (value[0].industry_type_name == "others") {
          this.isOther = true;
          this.subscriptionForm.controls.industryTypeOther.setValue(value[0].industry_type_value);
        }

        this.subscriptionForm.controls.email.setValue(value[0].company_email);
        this.subscriptionForm.controls.address1.setValue(value[0].company_address);
        this.subscriptionForm.controls.address2.setValue(value[0].company_address2);
        this.subscriptionForm.controls.country.setValue(value[0].country);
        this.subscriptionForm.controls.state.setValue(value[0].state);
        this.subscriptionForm.controls.city.setValue(value[0].location);
        this.subscriptionForm.controls.pincode.setValue(value[0].pincode);
       this.subscriptionForm.controls.gstNumber.setValue(value[0].gst_number);
      }else {
        }
    })
  }


  invoice(){
     this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/Admin/InvoiceHistory"]));
  }
  manageusers() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/Admin/add-renewal-users"]));
  }
  pay() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    this.router.navigate(["/Admin/upgrade-plan"]));
  }
  cancelSubscription(){}
  getClientSubscriptionDetailswithshortcode(){
    this.companyService.getClientSubscriptionDetails().subscribe((data:any)=>{
      if (data.status && data.data.length != 0) {
        this.clientid =data.data[0].client_id;
        this.getClientSubscriptionDetails(this.clientid);

      }
    })
  }
  getActiveEmployeesCount(){
    this.companyService.getActiveEmployeesCount().subscribe((data: any) => {
      if (data.status && data.data.length != 0) {
        this.activeemployeecount = data.data[0].active_employees_count;
      }
    });
  }
}
