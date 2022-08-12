import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftConfigureComponent } from './shift-configure.component';

describe('ShiftConfigureComponent', () => {
  let component: ShiftConfigureComponent;
  let fixture: ComponentFixture<ShiftConfigureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftConfigureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftConfigureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
