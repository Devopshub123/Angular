import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeMonthlyDetailReportComponent } from './employe-monthly-detail-report.component';

describe('EmployeMonthlyDetailReportComponent', () => {
  let component: EmployeMonthlyDetailReportComponent;
  let fixture: ComponentFixture<EmployeMonthlyDetailReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeMonthlyDetailReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeMonthlyDetailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
