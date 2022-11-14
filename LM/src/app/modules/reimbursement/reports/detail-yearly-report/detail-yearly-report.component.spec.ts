import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailYearlyReportComponent } from './detail-yearly-report.component';

describe('DetailYearlyReportComponent', () => {
  let component: DetailYearlyReportComponent;
  let fixture: ComponentFixture<DetailYearlyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailYearlyReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailYearlyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
