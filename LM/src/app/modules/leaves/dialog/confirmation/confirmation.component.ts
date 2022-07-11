import {Component, Inject, OnInit} from '@angular/core';
import {ReusableDialogComponent} from "../../../../pages/reusable-dialog/reusable-dialog.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ReusableDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public message: string) { }

  ngOnInit(): void {
  }

}
