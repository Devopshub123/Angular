import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpPayrollReportComponent } from './emp-payroll-report.component';

describe('EmpPayrollReportComponent', () => {
  let component: EmpPayrollReportComponent;
  let fixture: ComponentFixture<EmpPayrollReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpPayrollReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpPayrollReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
