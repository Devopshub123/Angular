import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayGroupComponent } from './pay-group.component';

describe('PayGroupComponent', () => {
  let component: PayGroupComponent;
  let fixture: ComponentFixture<PayGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
