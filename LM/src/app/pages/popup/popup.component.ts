// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-popup',
//   templateUrl: './popup.component.html',
//   styleUrls: ['./popup.component.scss']
// })
// export class PopupComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }
import { Component, Inject } from '@angular/core';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';


export interface PopupConfig {
    title?: string,
    content?: string,
    ok?: string,
    close: string
}

@Component({
  template: `
  <h4 mat-dialog-title>
    {{ dialog.title }}
  </h4>
  <mat-dialog-content>
    {{ dialog.content }}
  </mat-dialog-content>
  <mat-dialog-actions>
    <button
        mat-button
        (click)="dialogRef.close(false)"
        color="primary">
        {{ dialog.close }}
    </button>
    <button
        *ngIf="dialog.ok"
        mat-button
        color="primary"
        (click)="dialogRef.close(true)">
        {{ dialog.ok }}
    </button>
  </mat-dialog-actions>
  `
})
export class PopupComponent {

  get dialog(): PopupConfig {
      return this.data;
  }

  constructor(
      @Inject(MAT_DIALOG_DATA) public data: PopupConfig,
      public dialogRef: MatDialogRef<PopupComponent>
  ) {}

}
