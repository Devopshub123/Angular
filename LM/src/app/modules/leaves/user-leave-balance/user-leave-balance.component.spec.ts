import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLeaveBalanceComponent } from './user-leave-balance.component';

describe('UserLeaveBalanceComponent', () => {
  let component: UserLeaveBalanceComponent;
  let fixture: ComponentFixture<UserLeaveBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserLeaveBalanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLeaveBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
