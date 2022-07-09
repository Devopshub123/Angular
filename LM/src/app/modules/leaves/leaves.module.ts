import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeavesRoutingModule } from './leaves-routing.module';
import {PendingApprovalsComponent} from "../leaves/pages/pending-approvals/pending-approvals.component";
import {MaterialModule} from "../../material/material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FlexLayoutModule} from "@angular/flex-layout";
import { ManagerReviewAndApprovalsComponent } from '../leaves/pages/manager-review-and-approvals/manager-review-and-approvals.component';
import { ReviewAndApprovalsComponent } from './dialog/review-and-approvals/review-and-approvals.component';


@NgModule({
  declarations: [
    PendingApprovalsComponent,
    ManagerReviewAndApprovalsComponent,
    ReviewAndApprovalsComponent,
  ],
  imports: [
    CommonModule,
    LeavesRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
  ]
})
export class LeavesModule { }
