import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpValidationPopUpComponent } from './emp-validation-pop-up.component';

describe('EmpValidationPopUpComponent', () => {
  let component: EmpValidationPopUpComponent;
  let fixture: ComponentFixture<EmpValidationPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpValidationPopUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpValidationPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
