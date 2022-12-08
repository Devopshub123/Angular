import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeptResignationPendingchecklistComponent } from './dept-resignation-pendingchecklist.component';

describe('DeptResignationPendingchecklistComponent', () => {
  let component: DeptResignationPendingchecklistComponent;
  let fixture: ComponentFixture<DeptResignationPendingchecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeptResignationPendingchecklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeptResignationPendingchecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
