import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedReportForManagerComponent } from './detailed-report-for-manager.component';

describe('DetailedReportForManagerComponent', () => {
  let component: DetailedReportForManagerComponent;
  let fixture: ComponentFixture<DetailedReportForManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailedReportForManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedReportForManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
