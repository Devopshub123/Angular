import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftsWiseReportComponent } from './shifts-wise-report.component';

describe('ShiftsWiseReportComponent', () => {
  let component: ShiftsWiseReportComponent;
  let fixture: ComponentFixture<ShiftsWiseReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftsWiseReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftsWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
