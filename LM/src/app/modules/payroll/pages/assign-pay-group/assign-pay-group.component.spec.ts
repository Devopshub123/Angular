import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignPayGroupComponent } from './assign-pay-group.component';

describe('AssignPayGroupComponent', () => {
  let component: AssignPayGroupComponent;
  let fixture: ComponentFixture<AssignPayGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignPayGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignPayGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
