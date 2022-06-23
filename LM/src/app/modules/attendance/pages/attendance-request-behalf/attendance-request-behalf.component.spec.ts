import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceRequestBehalfComponent } from './attendance-request-behalf.component';

describe('AttendanceRequestBehalfComponent', () => {
  let component: AttendanceRequestBehalfComponent;
  let fixture: ComponentFixture<AttendanceRequestBehalfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceRequestBehalfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceRequestBehalfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
