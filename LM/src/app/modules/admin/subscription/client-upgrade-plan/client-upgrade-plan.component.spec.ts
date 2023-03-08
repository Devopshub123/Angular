import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientUpgradePlanComponent } from './client-upgrade-plan.component';

describe('ClientUpgradePlanComponent', () => {
  let component: ClientUpgradePlanComponent;
  let fixture: ComponentFixture<ClientUpgradePlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientUpgradePlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientUpgradePlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
