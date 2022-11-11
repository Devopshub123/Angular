import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeWiseReportComponent } from './employee-wise-report.component';

describe('EmployeeWiseReportComponent', () => {
  let component: EmployeeWiseReportComponent;
  let fixture: ComponentFixture<EmployeeWiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeWiseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
