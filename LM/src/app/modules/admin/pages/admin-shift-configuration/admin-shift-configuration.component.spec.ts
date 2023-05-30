import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminShiftConfigurationComponent } from './admin-shift-configuration.component';

describe('AdminShiftConfigurationComponent', () => {
  let component: AdminShiftConfigurationComponent;
  let fixture: ComponentFixture<AdminShiftConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminShiftConfigurationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminShiftConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
