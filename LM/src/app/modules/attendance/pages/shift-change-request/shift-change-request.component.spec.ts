import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftChangeRequestComponent } from './shift-change-request.component';

describe('ShiftChangeRequestComponent', () => {
  let component: ShiftChangeRequestComponent;
  let fixture: ComponentFixture<ShiftChangeRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftChangeRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftChangeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
