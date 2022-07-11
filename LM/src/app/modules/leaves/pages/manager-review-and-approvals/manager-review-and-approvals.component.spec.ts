import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerReviewAndApprovalsComponent } from './manager-review-and-approvals.component';

describe('ManagerReviewAndApprovalsComponent', () => {
  let component: ManagerReviewAndApprovalsComponent;
  let fixture: ComponentFixture<ManagerReviewAndApprovalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagerReviewAndApprovalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerReviewAndApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
