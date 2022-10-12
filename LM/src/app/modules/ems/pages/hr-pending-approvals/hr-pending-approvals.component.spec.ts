import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrPendingApprovalsComponent } from './hr-pending-approvals.component';

describe('HrPendingApprovalsComponent', () => {
  let component: HrPendingApprovalsComponent;
  let fixture: ComponentFixture<HrPendingApprovalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HrPendingApprovalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HrPendingApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
