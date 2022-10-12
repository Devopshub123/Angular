import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetsRoutingModule } from './assets-routing.module';
import { AssetCategoryComponent } from './pages/asset-category/asset-category.component';
import { VendorDetailsComponent } from './pages/vendor-details/vendor-details.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material/material.module';
import { VendorContactsComponent } from './pages/vendor-contacts/vendor-contacts.component';
import { AssetTypeComponent } from './pages/asset-type/asset-type.component';
import { EmpTicketRaiseComponent } from './pages/emp-ticket-raise/emp-ticket-raise.component';
import { ApproveAssetComponent } from './pages/approve-asset/approve-asset.component';
import { AssignAssetsComponent } from './pages/assign-assets/assign-assets.component';
import { RequestAssetBehalfComponent } from './pages/request-asset-behalf/request-asset-behalf.component';
import { AssetListComponent } from './pages/asset-list/asset-list.component';
import { CabinMasterComponent } from './pages/cabin-master/cabin-master.component';
import { CabinAllocationComponent } from './pages/cabin-allocation/cabin-allocation.component';
import { RequestCabinBehalfComponent } from './pages/request-cabin-behalf/request-cabin-behalf.component';
import { LocationsComponent } from './pages/locations/locations.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { ReorderingAssetComponent } from './pages/reordering-asset/reordering-asset.component';
import { ApproveCabinComponent } from './pages/approve-cabin/approve-cabin.component';
import { EmpMyAssetsComponent } from './pages/emp-my-assets/emp-my-assets.component';
import { EmpRequestAssetComponent } from './pages/emp-request-asset/emp-request-asset.component';
import { ApproveAssetLevel2Component } from './pages/approve-asset-level2/approve-asset-level2.component';
import { ApproveAssetDialogComponent } from './pages/approve-asset-dialog/approve-asset-dialog.component';
import { ApproveAssetChangeRequestLevel1Component } from './pages/approve-asset-change-request-level1/approve-asset-change-request-level1.component';
import { ApproveAssetChangeRequestLevel2Component } from './pages/approve-asset-change-request-level2/approve-asset-change-request-level2.component';
import { ApproveCabinDialogComponent } from './pages/approve-cabin-dialog/approve-cabin-dialog.component';
import { AssetAdminDashboardComponent } from './pages/asset-admin-dashboard/asset-admin-dashboard.component';
import { AllAssetsReportComponent } from './reports/all-assets-report/all-assets-report.component';

@NgModule({
  declarations: [
    AssetCategoryComponent,
    VendorDetailsComponent,
    VendorContactsComponent,
    AssetTypeComponent,
    EmpTicketRaiseComponent,
    ApproveAssetComponent,
    AssignAssetsComponent,
    RequestAssetBehalfComponent,
    AssetListComponent,
    CabinMasterComponent,
    CabinAllocationComponent,
    RequestCabinBehalfComponent,
    LocationsComponent,
    NotificationsComponent,
    ReorderingAssetComponent,
    ApproveCabinComponent,
    EmpMyAssetsComponent,
    EmpRequestAssetComponent,
    ApproveAssetLevel2Component,
    ApproveAssetDialogComponent,
    ApproveAssetChangeRequestLevel1Component,
    ApproveAssetChangeRequestLevel2Component,
    ApproveCabinDialogComponent,
    AssetAdminDashboardComponent,
    AllAssetsReportComponent,
   ],
  imports: [
    CommonModule,
    AssetsRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
  ]
})
export class AssetsModule { }
