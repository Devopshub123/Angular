import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalTaxMainComponent } from './professional-tax-main.component';

describe('ProfessionalTaxMainComponent', () => {
  let component: ProfessionalTaxMainComponent;
  let fixture: ComponentFixture<ProfessionalTaxMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfessionalTaxMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessionalTaxMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
