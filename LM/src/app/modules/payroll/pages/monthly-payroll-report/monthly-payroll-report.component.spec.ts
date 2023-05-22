import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyPayrollReportComponent } from './monthly-payroll-report.component';

describe('MonthlyPayrollReportComponent', () => {
  let component: MonthlyPayrollReportComponent;
  let fixture: ComponentFixture<MonthlyPayrollReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlyPayrollReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyPayrollReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
