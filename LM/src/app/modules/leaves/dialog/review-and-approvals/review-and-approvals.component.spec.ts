import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewAndApprovalsComponent } from './review-and-approvals.component';

describe('ReviewAndApprovalsComponent', () => {
  let component: ReviewAndApprovalsComponent;
  let fixture: ComponentFixture<ReviewAndApprovalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewAndApprovalsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewAndApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
