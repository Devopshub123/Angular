import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalTaxRequestComponent } from './professional-tax-request.component';

describe('ProfessionalTaxRequestComponent', () => {
  let component: ProfessionalTaxRequestComponent;
  let fixture: ComponentFixture<ProfessionalTaxRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfessionalTaxRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessionalTaxRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
