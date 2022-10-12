import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmsMessagemasterComponent } from './ems-messagemaster.component';

describe('EmsMessagemasterComponent', () => {
  let component: EmsMessagemasterComponent;
  let fixture: ComponentFixture<EmsMessagemasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmsMessagemasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmsMessagemasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
