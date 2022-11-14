import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursementApproveComponent } from './reimbursement-approve.component';

describe('ReimbursementApproveComponent', () => {
  let component: ReimbursementApproveComponent;
  let fixture: ComponentFixture<ReimbursementApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReimbursementApproveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReimbursementApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
