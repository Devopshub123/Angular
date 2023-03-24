import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRenewalUesrsComponent } from './add-renewal-uesrs.component';

describe('AddRenewalUesrsComponent', () => {
  let component: AddRenewalUesrsComponent;
  let fixture: ComponentFixture<AddRenewalUesrsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRenewalUesrsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRenewalUesrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
