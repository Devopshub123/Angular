import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LMSAccessGuard } from 'src/app/LMS-access.guard';
import { MainComponent } from 'src/app/pages/main/main.component';
import { ApproveAssetChangeRequestLevel1Component } from './pages/approve-asset-change-request-level1/approve-asset-change-request-level1.component';
import { ApproveAssetChangeRequestLevel2Component } from './pages/approve-asset-change-request-level2/approve-asset-change-request-level2.component';
import { ApproveAssetLevel2Component } from './pages/approve-asset-level2/approve-asset-level2.component';
import { ApproveAssetComponent } from './pages/approve-asset/approve-asset.component';
import { ApproveCabinComponent } from './pages/approve-cabin/approve-cabin.component';
import { AssetAdminDashboardComponent } from './pages/asset-admin-dashboard/asset-admin-dashboard.component';
import { AssetCategoryComponent } from './pages/asset-category/asset-category.component';
import { AssetListComponent } from './pages/asset-list/asset-list.component';
import { AssetTypeComponent } from './pages/asset-type/asset-type.component';
import { AssignAssetsComponent } from './pages/assign-assets/assign-assets.component';
import { CabinAllocationComponent } from './pages/cabin-allocation/cabin-allocation.component';
import { CabinMasterComponent } from './pages/cabin-master/cabin-master.component';
import { EmpMyAssetsComponent } from './pages/emp-my-assets/emp-my-assets.component';
import { EmpRequestAssetComponent } from './pages/emp-request-asset/emp-request-asset.component';
import { EmpTicketRaiseComponent } from './pages/emp-ticket-raise/emp-ticket-raise.component';
import { LocationsComponent } from './pages/locations/locations.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { ReorderingAssetComponent } from './pages/reordering-asset/reordering-asset.component';
import { RequestAssetBehalfComponent } from './pages/request-asset-behalf/request-asset-behalf.component';
import { RequestCabinBehalfComponent } from './pages/request-cabin-behalf/request-cabin-behalf.component';
import { VendorContactsComponent } from './pages/vendor-contacts/vendor-contacts.component';
import { VendorDetailsComponent } from './pages/vendor-details/vendor-details.component';
import { AllAssetsReportComponent } from './reports/all-assets-report/all-assets-report.component';

const routes: Routes = [
  {
    path: '', component: MainComponent,
    children: [
      { path: 'AssetCategory', component: AssetCategoryComponent, canActivate: [LMSAccessGuard] },
      { path: 'VendorDetails', component: VendorDetailsComponent, canActivate: [LMSAccessGuard] },
      { path: 'ApproveAsset', component: ApproveAssetComponent, canActivate: [LMSAccessGuard] },
      { path: 'AssetType', component: AssetTypeComponent, canActivate: [LMSAccessGuard] },
      { path: 'AssignAsset', component: AssignAssetsComponent, canActivate: [LMSAccessGuard] },
      { path: 'RaiseTicket', component: EmpTicketRaiseComponent, canActivate: [LMSAccessGuard] },
      { path: 'VendorContact', component: VendorContactsComponent, canActivate: [LMSAccessGuard] },
      { path: 'RequestAssetBehalf', component: RequestAssetBehalfComponent, canActivate: [LMSAccessGuard] },
      { path: 'AssetList', component: AssetListComponent, canActivate: [LMSAccessGuard] },
      { path: 'NewCabin', component: CabinMasterComponent, canActivate: [LMSAccessGuard] },
      { path: 'CabinAllocation', component: CabinAllocationComponent, canActivate: [LMSAccessGuard] },
      { path: 'RequestCabinBehalf', component: RequestCabinBehalfComponent, canActivate: [LMSAccessGuard] },
      { path: 'Locations', component: LocationsComponent, canActivate: [LMSAccessGuard] },
      { path: 'Notifications', component: NotificationsComponent, canActivate: [LMSAccessGuard] },
      { path: 'ReorderAsset', component: ReorderingAssetComponent, canActivate: [LMSAccessGuard] },
      { path: 'ApproveCabin', component: ApproveCabinComponent, canActivate: [LMSAccessGuard] },
      { path: 'MyAssets', component: EmpMyAssetsComponent, canActivate: [LMSAccessGuard] },
      { path: 'RequestAsset', component: EmpRequestAssetComponent, canActivate: [LMSAccessGuard] },
      { path: 'Level2Approve', component: ApproveAssetLevel2Component, canActivate: [LMSAccessGuard] },
      { path: 'ApproveAssetChangeRequestL1', component: ApproveAssetChangeRequestLevel1Component, canActivate: [LMSAccessGuard] },
      { path: 'ApproveAssetChangeRequestL2', component: ApproveAssetChangeRequestLevel2Component, canActivate: [LMSAccessGuard] },
      { path: 'AdminDashboard', component: AssetAdminDashboardComponent, canActivate: [LMSAccessGuard] },
      { path: 'AdminDashboard', component: AssetAdminDashboardComponent, canActivate: [LMSAccessGuard] },
    ]
  },
  {path:'Reports',component:MainComponent,children:[
    { path: 'AllAssets', component: AllAssetsReportComponent, canActivate: [LMSAccessGuard] },
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetsRoutingModule { }
