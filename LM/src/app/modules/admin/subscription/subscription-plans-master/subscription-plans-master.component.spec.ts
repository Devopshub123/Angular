import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionPlansMasterComponent } from './subscription-plans-master.component';

describe('SubscriptionPlansMasterComponent', () => {
  let component: SubscriptionPlansMasterComponent;
  let fixture: ComponentFixture<SubscriptionPlansMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionPlansMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionPlansMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
