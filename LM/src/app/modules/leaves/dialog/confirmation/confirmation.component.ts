import {Component, Inject, OnInit} from '@angular/core';
import {ReusableDialogComponent} from "../../../../pages/reusable-dialog/reusable-dialog.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ReusableDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,private router: Router) {
    dialogRef.disableClose = true;

  }

  ngOnInit(): void {
  }
  close(){
    this.router.navigate([this.data.url])
  }

}
