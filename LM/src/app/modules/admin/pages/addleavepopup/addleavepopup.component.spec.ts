import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddleavepopupComponent } from './addleavepopup.component';

describe('AddleavepopupComponent', () => {
  let component: AddleavepopupComponent;
  let fixture: ComponentFixture<AddleavepopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddleavepopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddleavepopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
