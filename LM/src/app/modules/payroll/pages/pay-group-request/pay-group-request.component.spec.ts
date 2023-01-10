import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayGroupRequestComponent } from './pay-group-request.component';

describe('PayGroupRequestComponent', () => {
  let component: PayGroupRequestComponent;
  let fixture: ComponentFixture<PayGroupRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayGroupRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayGroupRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
