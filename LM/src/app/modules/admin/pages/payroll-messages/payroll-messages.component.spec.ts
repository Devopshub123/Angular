import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollMessagesComponent } from './payroll-messages.component';

describe('PayrollMessagesComponent', () => {
  let component: PayrollMessagesComponent;
  let fixture: ComponentFixture<PayrollMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayrollMessagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayrollMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
