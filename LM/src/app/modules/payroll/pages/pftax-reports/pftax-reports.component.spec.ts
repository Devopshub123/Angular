import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PftaxReportsComponent } from './pftax-reports.component';

describe('PftaxReportsComponent', () => {
  let component: PftaxReportsComponent;
  let fixture: ComponentFixture<PftaxReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PftaxReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PftaxReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
