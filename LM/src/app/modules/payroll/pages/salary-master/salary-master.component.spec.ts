import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryMasterComponent } from './salary-master.component';

describe('SalaryMasterComponent', () => {
  let component: SalaryMasterComponent;
  let fixture: ComponentFixture<SalaryMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
