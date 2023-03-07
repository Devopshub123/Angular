import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAdminSubscriptionComponent } from './client-admin-subscription.component';

describe('ClientAdminSubscriptionComponent', () => {
  let component: ClientAdminSubscriptionComponent;
  let fixture: ComponentFixture<ClientAdminSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientAdminSubscriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAdminSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
