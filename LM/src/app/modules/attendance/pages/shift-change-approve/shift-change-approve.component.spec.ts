import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftChangeApproveComponent } from './shift-change-approve.component';

describe('ShiftChangeApproveComponent', () => {
  let component: ShiftChangeApproveComponent;
  let fixture: ComponentFixture<ShiftChangeApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftChangeApproveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftChangeApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
