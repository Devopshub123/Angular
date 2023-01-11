import { Component,Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialogue',
  templateUrl: './confirmation-dialogue.component.html',
  styleUrls: ['./confirmation-dialogue.component.scss']
})
export class ConfirmationDialogueComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmationDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
    // onNoClick(): void {
    //   this.dialogRef.close();
    // }
    Onyes(): void {
        this.dialogRef.close(true);
      }
    Onno(): void {
      this.dialogRef.close(false);
    }  
  ngOnInit(): void {
  }

}
