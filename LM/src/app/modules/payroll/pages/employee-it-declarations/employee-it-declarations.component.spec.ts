import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeItDeclarationsComponent } from './employee-it-declarations.component';

describe('EmployeeItDeclarationsComponent', () => {
  let component: EmployeeItDeclarationsComponent;
  let fixture: ComponentFixture<EmployeeItDeclarationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeItDeclarationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeItDeclarationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
