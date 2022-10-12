import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrOnboardingChecklistoverviewComponent } from './hr-onboarding-checklistoverview.component';

describe('HrOnboardingChecklistoverviewComponent', () => {
  let component: HrOnboardingChecklistoverviewComponent;
  let fixture: ComponentFixture<HrOnboardingChecklistoverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HrOnboardingChecklistoverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HrOnboardingChecklistoverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
