import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLeaveHistoryComponent } from './user-leave-history.component';

describe('UserLeaveHistoryComponent', () => {
  let component: UserLeaveHistoryComponent;
  let fixture: ComponentFixture<UserLeaveHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserLeaveHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLeaveHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
