import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LateAttendanceReportComponent } from './late-attendance-report.component';

describe('LateAttendanceReportComponent', () => {
  let component: LateAttendanceReportComponent;
  let fixture: ComponentFixture<LateAttendanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LateAttendanceReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LateAttendanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
