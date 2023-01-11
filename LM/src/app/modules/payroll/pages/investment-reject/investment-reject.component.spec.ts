import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentRejectComponent } from './investment-reject.component';

describe('InvestmentRejectComponent', () => {
  let component: InvestmentRejectComponent;
  let fixture: ComponentFixture<InvestmentRejectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestmentRejectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentRejectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
