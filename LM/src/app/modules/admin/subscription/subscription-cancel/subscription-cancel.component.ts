import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-subscription-cancel',
  templateUrl: './subscription-cancel.component.html',
  styleUrls: ['./subscription-cancel.component.scss']
})
export class SubscriptionCancelComponent implements OnInit {
  signUpForm: any = FormGroup;

  constructor(private formBuilder: FormBuilder,) { }
  favoriteSeason: any;
  seasons: string[] = ['I’m restricted by feature usage limits',
    'It’s too expensive',
    'I left or changed positions in my business',
    'My business requires that I use a different tool',
    'It’s missing functionality or functionality is too basic',
    'The price I was paying changed',
    'I didn’t receive enough support or training',
    'I never got started or set up correctly',
    'It’s missing an integration or integration is too basic',
    'I want to use an all-in-one tool for my business',
    'My business closed',
    'It’s not customizable enough',
    'My business is downsizing or reducing its budget',
    'I couldn’t get others to use it',
    'It’s too complicated to use',
    'Performance is poor or features don’t work properly',
    'I’m not leaving. I’m using another account or made a new one',
    'The project I was working on ended',
  ];
  ngOnInit(): void {
    this.signUpForm=this.formBuilder.group(
      {
      remarks: [""],
      });
  }
  radioChange(event:any) {
    
  }

  submit() {
    
  }
  cancel() {
    
  }
//  let dialogRef = this.dialog.open(ComfirmationDialogComponent, {
//   position: { top: `70px` },
//   disableClose: true,
//   data: { message: "Are you sure you want to delete ?", YES: 'YES', NO: 'NO' }
// });
}
