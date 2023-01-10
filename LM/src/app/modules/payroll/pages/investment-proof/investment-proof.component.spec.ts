import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentProofComponent } from './investment-proof.component';

describe('InvestmentProofComponent', () => {
  let component: InvestmentProofComponent;
  let fixture: ComponentFixture<InvestmentProofComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvestmentProofComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestmentProofComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
