import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalAttendanceComponent } from './approval-attendance.component';

describe('ApprovalAttendanceComponent', () => {
  let component: ApprovalAttendanceComponent;
  let fixture: ComponentFixture<ApprovalAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalAttendanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
