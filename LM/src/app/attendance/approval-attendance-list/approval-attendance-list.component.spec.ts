import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalAttendanceListComponent } from './approval-attendance-list.component';

describe('ApprovalAttendanceListComponent', () => {
  let component: ApprovalAttendanceListComponent;
  let fixture: ComponentFixture<ApprovalAttendanceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalAttendanceListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalAttendanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
