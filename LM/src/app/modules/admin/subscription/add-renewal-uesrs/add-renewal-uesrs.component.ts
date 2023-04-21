import { Component, OnInit,HostListener } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AdminService } from 'src/app/modules/admin/admin.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ReusableDialogComponent } from 'src/app/pages/reusable-dialog/reusable-dialog.component';
import { Router, RouterModule } from '@angular/router';
import { CompanySettingService } from 'src/app/services/companysetting.service';
declare var Razorpay: any;
@Component({
  selector: 'app-add-renewal-uesrs',
  templateUrl: './add-renewal-uesrs.component.html',
  styleUrls: ['./add-renewal-uesrs.component.scss']
})
export class AddRenewalUesrsComponent implements OnInit {
  message:any = "Not yet stared";
  paymentId = "";
  error = "";
  title = 'angular-razorpay-intergration';
  options = {
    "key": "rzp_test_AAxMUhOM5m2fuV",
    "amount": "200",
    "name": "SPRYPLE",
    "description": "Web Development",
    "image": "assets/images/FavIcon.png",
    "order_id": "",
    "handler": function (response: any) {
      var event = new CustomEvent("payment.success",
        {
          detail: response,
          bubbles: true,
          cancelable: true
        }
      );
      window.dispatchEvent(event);
    },
    "prefill": {
      "name": "",
      "email": "",
      "contact": ""
    },
    "notes": {
      "address": ""
    },
    "theme": {
      "color": "#28acaf"
    }
  };
  addausersForm: any = FormGroup;
  renewalausersForm: any = FormGroup;
  addvalue = 0;
  renewalvalue = 0;
  disable:boolean=true;
  disablerenew:boolean=true;
  renewalhide:boolean=false;
  addusersamount:boolean=false;
  renewalusersamount:boolean=false;
  addUsersDisplayInfohide:boolean=false;
  adddisplayrenewalhide:boolean=false;
  addUsersDisplayInfoamount:any;
  addUsersDisplayInfoUserCount:any;
  renewalDisplayInfoamount:any;
  renewaldate:any;
  validto:any;
  clientplandetailid:any;
  addUsersDisplayInfovaliddate:any
  monthlycost:any;
  clientname:any
      email:any
      contactnumber:any
  array:any;
  

  constructor(public datePipe: DatePipe,private router: Router,public dialog: MatDialog,private adminService: AdminService,private formBuilder: FormBuilder, private companyService: CompanySettingService,) { 
   this.getClientSubscriptionDetails()
    
  
  }

  ngOnInit(): void {
    // this.getUsers();
    this.addausersForm = this.formBuilder.group({
      addexistingusers:[""],
      addusers:[""]
    })
    this.renewalausersForm = this.formBuilder.group({
      renewalexistingusers:[""],
      addrenewalusers:[""],
      renewtype:[""]

    })

  }
 
 
  handleMinus() { 
    this.addUsersDisplayInfohide =false;
    this.addvalue--;  
    if(this.addvalue<1){
      this.disable=true;
    }else{
      this.disable=false;
    }
  }
  handlePlus() {
    this.addvalue++;
    this.disable=false; 
    this.addUsersDisplayInfohide =false;   
  }

  handleMinusrenew() { 
    this.renewalvalue--;  
    this.renewUsersDisplayInformation();
    if(this.renewalvalue<41){
      this.disablerenew=true;
    }else{
      this.disablerenew=false;
    }
  }
  handlePlusrenew() {
    this.renewalvalue++;  
    this.renewUsersDisplayInformation();
 
    this.disablerenew=false; 
  }
  getClientPlanDetails(id:any){
    let data ={
      client_id_value:id
    }
    console.log("jhjkhsdfj",data)
    this.adminService.getClientPlanDetails(data).subscribe((result:any)=>{
      console.log("clientplandetailid",result)
       if(result.status){
        // this.enableRenewButton(result.data[0].valid_to);
        // this.validto = result.data[0].valid_to;
        // this.clientplandetailid = result.data[0].client_plan_detail_id;

      }
    })
  }
  /**get All users count details */
  getUsers(id:any){
    this.adminService.getUsers(id).subscribe((result:any)=>{
      if(result.status&&result.data.length>0){
        this.renewalvalue = result.data[0].user_count;
        this.addausersForm.controls.addexistingusers.setValue(result.data[0].user_count);
        this.renewalausersForm.controls.renewalexistingusers.setValue(result.data[0].user_count);
      }
    })

  }
  /**renwal screen enable last date */
  enableRenewButton(date:any){
    let data ={
      // date:this.datePipe.transform(new Date(), "y-MM-dd")
      date:date
    }
    
    this.adminService.enableRenewButton(data).subscribe((result:any)=>{
      if(result.status&&result.data[0].validity==1){
        this.renewalhide = false;
      }
      else if(result.status&&result.data[0].validity==0){
        this.renewalhide = true;
        this.renewaldate = result.data[0].valid_to;
      }
    })

  }
  /**addUsersDisplayInfo for display information purpose. */
  addUsersDisplayInfo(){
    this.addusersamount=true;
    this.renewalusersamount=false;
    this.addUsersDisplayInfoUserCount=''
    this.addUsersDisplayInfoamount = '';
    this.addUsersDisplayInfovaliddate = ''
    if(this.addvalue>0){
      let data = {
        client_renewal_detail_id_value:this.clientplandetailid,
        valid_to_value:this.validto,
        user_count_value:this.addvalue
      }
      console.log("ghygyg",data)
      this.adminService.addUsersDisplayInfo(data).subscribe((result:any)=>{
        console.log("data",data)
        if(result.status){
         this.addUsersDisplayInfohide =true;
         this.addUsersDisplayInfoUserCount = result.data[0].user_count
         let date1:any =new Date( );
         let date2:any = new Date('2023-04-30')
         console.log("date1",date1);
         console.log("date2",date2);
         console.log("result.data[0].user_count",result.data[0].user_count);
         let dayscount = Math.floor((date2 - date1) / (1000 * 60 * 60 * 24));
         this.addUsersDisplayInfoamount = Math.floor((this.addvalue*Number( this.monthlycost)*dayscount)/30);
         this.addUsersDisplayInfovaliddate = result.data[0].validity
        }
  
      })

    }
  }
  /**renewUsersDisplayInformation for display information purpose. */
  renewUsersDisplayInformation(){
    this.addusersamount=false;
    this.renewalusersamount=true;

      let data = {
        client_renewal_detail_id_value:this.clientplandetailid,
        valid_to_value:this.validto,
        user_count_value:this.renewalvalue
      }
      this.adminService.renewUsersDisplayInformation(data).subscribe((result:any)=>{
        console.log("result",result);
        // Math.floor((this.renewalvalue*100*30)/30);
        this.renewalDisplayInfoamount  = Math.floor((this.renewalvalue*Number(this.monthlycost)*30)/30);
        if(result .status){
          this.adddisplayrenewalhide = true;
          let month = "For a month validity will extended to"+ result.data[0].valid_to_month +" and cost "+Math.floor((this.renewalvalue*this.monthlycost*30)/30)
          let year = "For a month validity will extended to"+ result.data[0].valid_to_year +" and cost "+result.data[0].cost_for_year
          // this.array=[{id:"M",value:month},{id:"Y",value:year}]
          this.array=[{id:"M",value:month}]
        }
  
      })

    
   

  }
  adduserspay(){
    if(this.addvalue>0){
      let data = {
        client_renewal_detail_id_value:this.clientplandetailid,
        valid_to_value:this.validto,
        user_count_value:this.addvalue,
        created_by_value:1,
        payment_reference_number_value:"Shhhf3425",
        payment_date_value:this.datePipe.transform(new Date(), "y-MM-dd"),
        payment_status_value:"Paid"
      }
      this.adminService.addUsers(data).subscribe((result:any)=>{
        if(result.status){
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            this.router.navigate(["/Admin/add-renewal-users"]));
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data:'Payment success for add users'
          });

        }
        else{
          let dialogRef = this.dialog.open(ReusableDialogComponent, {
            position:{top:`70px`},
            disableClose: true,
            data:'unable to success payment for addUsers.'
          });

        }
  
      })

    }
    else{
      let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position:{top:`70px`},
        disableClose: true,
        data:'Please Add users'
      });

    }
   
    
  }
  renewalpay(){
    let data={
      client_plan_detail_id_value:this.clientplandetailid,
      user_count_value:this.renewalvalue,
      valid_to_value:this.validto,
      renew_type:this.renewalausersForm.controls.renewtype.value,
      created_by_value:1,
      payment_reference_number_value:"Shhhf3425",
      payment_date_value:this.datePipe.transform(new Date(), "y-MM-dd"),
      payment_status_value:"Paid"
    }
    this.adminService.renewUsers(data).subscribe((result:any)=>{
      if(result.status){
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data:'Payment susuccess for add renewal.'
        });

      }
      else{
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data:'unable to success payment for renewal.'
        });

      }
      
    })
  }
  cancel(){}

  paynow() {
    this.paymentId = '';
    this.error = '';
       this.options.prefill.name = 'Rakesh'//this.clientname;
    this.options.prefill.email = 'rthallapely@sreebtech.com'//this.email;
    this.options.prefill.contact ='9704546030'//this.contactnumber;
    if(this.addvalue>0 &&this.addusersamount){
    let dataamount:any = Math.floor(this.addUsersDisplayInfoamount*100);
    this.options.amount = dataamount; //paise
    var rzp1 = new Razorpay(this.options);
     rzp1.open();
     rzp1.on('payment.failed',  (response: any) => {
      //this.message = "Payment Failed";
      // Todo - store this information in the server
       rzp1.close();
       let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position:{top:`70px`},
        disableClose: true,
        data:'Your Payment failed.Please try again.'
    
      });
      
      console.log(response.error.code);
      console.log(response.error.description);
      console.log(response.error.source);
      console.log(response.error.step);
      console.log(response.error.reason);
      console.log(response.error.metadata.order_id);
      console.log(response.error.metadata.payment_id);
      //this.error = response.error.reason;
    }
    );
  }
  else if( this.renewalusersamount){
    let dataamount:any = Math.floor(this.renewalDisplayInfoamount*100);
    this.options.amount = dataamount; //paise
    var rzp1 = new Razorpay(this.options);
    rzp1.open();
    rzp1.on('payment.failed',  (response: any) => {
       rzp1.close();
       let dialogRef = this.dialog.open(ReusableDialogComponent, {
        position:{top:`70px`},
        disableClose: true,
        data:'Your Payment failed.Please try again.'
    
      });
      
      console.log(response.error.code);
      console.log(response.error.description);
      console.log(response.error.source);
      console.log(response.error.step);
      console.log(response.error.reason);
      console.log(response.error.metadata.order_id);
      console.log(response.error.metadata.payment_id);
      //this.error = response.error.reason;
    }
    );
  
    

  }
  
  
  else{
    let dialogRef = this.dialog.open(ReusableDialogComponent, {
      position:{top:`70px`},
      disableClose: true,
      data:'Please Add users'
    });

  }
  }
  @HostListener('window:payment.success', ['$event'])
  onPaymentSuccess(event: any): void {
    this.message = "Success Payment";
    console.log("data",event)
    console.log("data",event.detail)
    // this.addusersamount=false;
    // this.renewalusersamount=true;
if(this.addusersamount){
    let data = {
      client_renewal_detail_id_value:this.clientplandetailid,
      valid_to_value:this.validto,
      user_count_value:this.addvalue,
      created_by_value:1,
      payment_reference_number_value:event.detail.razorpay_payment_id,
      payment_date_value:this.datePipe.transform(new Date(), "y-MM-dd"),
      payment_status_value:"Paid"
    }
    console.log("Success Payment data for add users",data);
    this.adminService.addUsers(data).subscribe((result:any)=>{
      if(result.status){
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/Admin/add-renewal-users"]));
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data:'Payment success for add users'
        });

      }
      else{
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data:'unable to success payment for addUsers.'
        });

      }

    })
  }
  else if(this.renewalusersamount){
    let data={
      client_plan_detail_id_value:this.clientplandetailid,
      user_count_value:this.renewalvalue,
      valid_to_value:this.validto,
      renew_type:this.renewalausersForm.controls.renewtype.value,
      created_by_value:1,
      payment_reference_number_value:event.detail.razorpay_payment_id,
      payment_date_value:this.datePipe.transform(new Date(), "y-MM-dd"),
      payment_status_value:"Paid"
    }
    console.log("Success Payment data for renewal users",data);
    this.adminService.renewUsers(data).subscribe((result:any)=>{
      if(result.status){
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate(["/Admin/add-renewal-users"]));
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data:'Payment susuccess for add renewal.'
        });

      }
      else{
        let dialogRef = this.dialog.open(ReusableDialogComponent, {
          position:{top:`70px`},
          disableClose: true,
          data:'unable to success payment for renewal.'
        });

      }
      
    })

  }



  }
  /**get all subscription details. */
getClientSubscriptionDetails(){
  this.companyService.getClientSubscriptionDetails().subscribe((data:any)=>{
    if (data.status && data.data.length != 0) {
      // this.getClientPaymentDetails(Number(data.data[0].client_id));
      console.log("getClientPlanDetails",data)
      this.getClientPlanDetails(Number(data.data[0].client_id));
      // this.getUsers(Number(data.data[0].client_id));
      this.renewalvalue = data.data[0].user_count;
      this.addausersForm.controls.addexistingusers.setValue(data.data[0].user_count);
      this.renewalausersForm.controls.renewalexistingusers.setValue(data.data[0].user_count);
       this.validto = data.data[0].valid_to;
      this.clientplandetailid = data.data[0].client_id;
      this.monthlycost=data.data[0].cost_per_user_monthly_bill;
      this.clientname=data.data[0].contact_name;
      this.email=data.data[0].company_email;
      this.contactnumber=data.data[0].mobile_number;
    }
  })
}
}
