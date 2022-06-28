import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyinformationComponent } from './companyinformation.component';

describe('CompanyinformationComponent', () => {
  let component: CompanyinformationComponent;
  let fixture: ComponentFixture<CompanyinformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyinformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyinformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
