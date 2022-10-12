import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-emp-ticket-raise',
  templateUrl: './emp-ticket-raise.component.html',
  styleUrls: ['./emp-ticket-raise.component.scss']
})
export class EmpTicketRaiseComponent implements OnInit {
  raiseTicketForm!: FormGroup;
   constructor(private formBuilder: FormBuilder,private router:Router) { }

  ngOnInit(): void {
    this.raiseTicketForm = this.formBuilder.group(
      {
        assetCategory: ["", Validators.required],
        assetType:  [""],
        assetName:  [""],
        Issue: [""],
      });
  }
  setPayGroup(){     
    
  }

  cancel(){     
  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
  this.router.navigate(["/Asset/RaiseTicket"]));
  }

}
