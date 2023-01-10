import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceForm16Component } from './finance-form16.component';

describe('FinanceForm16Component', () => {
  let component: FinanceForm16Component;
  let fixture: ComponentFixture<FinanceForm16Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinanceForm16Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceForm16Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
