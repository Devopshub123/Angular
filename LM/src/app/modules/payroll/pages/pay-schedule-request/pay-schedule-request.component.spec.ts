import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayScheduleRequestComponent } from './pay-schedule-request.component';

describe('PayScheduleRequestComponent', () => {
  let component: PayScheduleRequestComponent;
  let fixture: ComponentFixture<PayScheduleRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayScheduleRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayScheduleRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
