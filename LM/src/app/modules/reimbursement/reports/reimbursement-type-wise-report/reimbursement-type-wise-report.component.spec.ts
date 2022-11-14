import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursementTypeWiseReportComponent } from './reimbursement-type-wise-report.component';

describe('ReimbursementTypeWiseReportComponent', () => {
  let component: ReimbursementTypeWiseReportComponent;
  let fixture: ComponentFixture<ReimbursementTypeWiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReimbursementTypeWiseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReimbursementTypeWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
