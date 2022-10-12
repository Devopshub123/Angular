import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrOffboardingChecklistoverviewComponent } from './hr-offboarding-checklistoverview.component';

describe('HrOffboardingChecklistoverviewComponent', () => {
  let component: HrOffboardingChecklistoverviewComponent;
  let fixture: ComponentFixture<HrOffboardingChecklistoverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HrOffboardingChecklistoverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HrOffboardingChecklistoverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
