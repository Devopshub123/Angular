import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignChecklistComponent } from './assign-checklist.component';

describe('AssignChecklistComponent', () => {
  let component: AssignChecklistComponent;
  let fixture: ComponentFixture<AssignChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignChecklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
