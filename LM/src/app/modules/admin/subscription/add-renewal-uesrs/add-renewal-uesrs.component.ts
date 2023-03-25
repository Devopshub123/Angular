import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AdminService } from 'src/app/modules/admin/admin.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-add-renewal-uesrs',
  templateUrl: './add-renewal-uesrs.component.html',
  styleUrls: ['./add-renewal-uesrs.component.scss']
})
export class AddRenewalUesrsComponent implements OnInit {
  addausersForm: any = FormGroup;
  renewalausersForm: any = FormGroup;
  addvalue = 0;
  renewalvalue = 0;
  disable:boolean=true;
  disablerenew:boolean=true;
  renewalhide:boolean=false;
  addUsersDisplayInfohide:boolean=false;
  addUsersDisplayInfoamount:any;
  addUsersDisplayInfoUserCount:any;
  renewaldate:any;
  validto:any;
  clientplandetailid:any;
  addUsersDisplayInfovaliddate:any
  // getUsersData =20
  array:any=[{id:"M",value:"For a month"},{id:"Y",value:"For a Year"},]

  constructor(public datePipe: DatePipe,private adminService: AdminService,private formBuilder: FormBuilder,) { 
    this.getClientPlanDetails()
  
  }

  ngOnInit(): void {
    this.getUsers();
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
    console.log("minus",this.addvalue)
    if(this.addvalue<1){
      console.log("working")
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
  getClientPlanDetails(){
    // client_id_value
    let data ={
      client_id_value:1
    }
    this.adminService.getClientPlanDetails(data).subscribe((result:any)=>{
      console.log("getClientPlanDetails",result,result.data[0].valid_to);
      if(result.status){
        this.enableRenewButton(result.data[0].valid_to);
        this.validto = result.data[0].valid_to;
        this.clientplandetailid = result.data[0].client_plan_detail_id;

      }
    })
  }
  getUsers(){
  
    this.adminService.getUsers(1).subscribe((result:any)=>{
      if(result.status){
        // console.log("result",result,result.data[0].sum(client_user_count_details.user_count));
        this.renewalvalue = result.data[0].user_count;
        this.addausersForm.controls.addexistingusers.setValue(result.data[0].user_count);
        this.renewalausersForm.controls.renewalexistingusers.setValue(result.data[0].user_count);
      }
    })

  }
  enableRenewButton(date:any){
    let data ={
      // date:this.datePipe.transform(new Date(), "y-MM-dd")
      date:date
    }
    
    this.adminService.enableRenewButton(data).subscribe((result:any)=>{
      console.log("enableRenewButton",result);
      if(result.status&&result.data[0].validity==1){
        this.renewalhide = false;
      }
      else if(result.status&&result.data[0].validity==0){
        this.renewalhide = true;
        this.renewaldate = result.data[0].valid_to;
      }
    })

  }
  addUsersDisplayInfo(){
    this.addUsersDisplayInfoUserCount=''
    this.addUsersDisplayInfoamount = '';
    this.addUsersDisplayInfovaliddate = ''
    if(this.addvalue>0){
      let data = {
        client_renewal_detail_id_value:this.clientplandetailid,
        valid_to_value:this.validto,
        user_count_value:this.addvalue
      }
      console.log("data",data)
      this.adminService.addUsersDisplayInfo(data).subscribe((result:any)=>{
        console.log(result)
        if(result.status&&result.data.length>0){
         this.addUsersDisplayInfohide =true;
         this.addUsersDisplayInfoUserCount = result.data[0].user_count
         this.addUsersDisplayInfoamount = this.addvalue * 100;
        // this.addUsersDisplayInfoamount = result.data[0].amount
         this.addUsersDisplayInfovaliddate = result.data[0].validity
        }
  
      })

    }
   

  }


  renewUsersDisplayInformation(){

      let data = {
        client_renewal_detail_id_value:this.clientplandetailid,
        valid_to_value:this.validto,
        user_count_value:this.renewalvalue
      }
      console.log("data",data)
      this.adminService.renewUsersDisplayInformation(data).subscribe((result:any)=>{
        console.log("renewdata",result)
        // if(result.status&&result.data.length>0){
        //  this.addUsersDisplayInfohide =true;
        //  this.addUsersDisplayInfoUserCount = result.data[0].user_count
        //  this.addUsersDisplayInfoamount = this.addvalue * 100;
        // // this.addUsersDisplayInfoamount = result.data[0].amount
        //  this.addUsersDisplayInfovaliddate = result.data[0].validity
        // }
  
      })

    
   

  }
  adduserspay(){
    let data = {
      client_renewal_detail_id_value:this.clientplandetailid,
      valid_to_value:this.validto,
      user_count_value:this.addvalue,
      created_by_value:1,
      payment_reference_number_value:"Shhhf3425",
      payment_date_value:this.datePipe.transform(new Date(), "y-MM-dd"),
      payment_status_value:"Paid"
    }
    console.log("addusersdata",data);
    // this.adminService.addUsers(data).subscribe((result:any)=>{

    // })
    
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
    console.log("renewdata",data);
    // this.adminService.renewUsers(data).subscribe((result:any)=>{
      
    // })
  }
  cancel(){}
}
