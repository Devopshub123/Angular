import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HrResignationComponent } from './hr-resignation.component';

describe('HrResignationComponent', () => {
  let component: HrResignationComponent;
  let fixture: ComponentFixture<HrResignationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HrResignationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HrResignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
