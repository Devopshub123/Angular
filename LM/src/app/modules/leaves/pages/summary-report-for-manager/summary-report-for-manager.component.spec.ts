import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryReportForManagerComponent } from './summary-report-for-manager.component';

describe('SummaryReportForManagerComponent', () => {
  let component: SummaryReportForManagerComponent;
  let fixture: ComponentFixture<SummaryReportForManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummaryReportForManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryReportForManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
