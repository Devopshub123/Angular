import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerDashboardCalenderComponent } from './manager-dashboard-calender.component';

describe('ManagerDashboardCalenderComponent', () => {
  let component: ManagerDashboardCalenderComponent;
  let fixture: ComponentFixture<ManagerDashboardCalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagerDashboardCalenderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerDashboardCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
