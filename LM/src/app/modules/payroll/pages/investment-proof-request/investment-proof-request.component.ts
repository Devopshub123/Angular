import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-investment-proof-request',
  templateUrl: './investment-proof-request.component.html',
  styleUrls: ['./investment-proof-request.component.scss']
})
export class InvestmentProofRequestComponent implements OnInit {

  constructor(private location:Location) { }
  userData: any;
  ngOnInit(): void {
    this.userData = this.location.getState();
    console.log("userData",this.userData);
  }

}
