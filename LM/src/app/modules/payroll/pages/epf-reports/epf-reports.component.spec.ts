import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpfReportsComponent } from './epf-reports.component';

describe('EpfReportsComponent', () => {
  let component: EpfReportsComponent;
  let fixture: ComponentFixture<EpfReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EpfReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EpfReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
