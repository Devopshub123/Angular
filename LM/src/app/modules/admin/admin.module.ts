import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { DesignationsComponent } from './pages/designations/designations.component';
import { DeparmentComponent } from './pages/deparment/deparment.component';
import { CompanyinformationComponent } from './pages/companyinformation/companyinformation.component';


@NgModule({
  declarations: [
    
    DesignationsComponent,
    DeparmentComponent,
    CompanyinformationComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
  ]
})
export class AdminModule { }
