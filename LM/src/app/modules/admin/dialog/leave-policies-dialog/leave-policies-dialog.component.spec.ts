import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavePoliciesDialogComponent } from './leave-policies-dialog.component';

describe('LeavePoliciesDialogComponent', () => {
  let component: LeavePoliciesDialogComponent;
  let fixture: ComponentFixture<LeavePoliciesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeavePoliciesDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeavePoliciesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
