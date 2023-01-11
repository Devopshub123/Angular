import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaySlipsViewComponent } from './pay-slips-view.component';

describe('PaySlipsViewComponent', () => {
  let component: PaySlipsViewComponent;
  let fixture: ComponentFixture<PaySlipsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaySlipsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaySlipsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
