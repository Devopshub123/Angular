import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSuperAdminDashboardComponent } from './client-super-admin-dashboard.component';

describe('ClientSuperAdminDashboardComponent', () => {
  let component: ClientSuperAdminDashboardComponent;
  let fixture: ComponentFixture<ClientSuperAdminDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientSuperAdminDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientSuperAdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
