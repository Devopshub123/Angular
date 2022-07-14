import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeavesListComponent } from './employee-leaves-list.component';

describe('EmployeeLeavesListComponent', () => {
  let component: EmployeeLeavesListComponent;
  let fixture: ComponentFixture<EmployeeLeavesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeLeavesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeLeavesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
