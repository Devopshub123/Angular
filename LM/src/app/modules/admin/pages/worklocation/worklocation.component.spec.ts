import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorklocationComponent } from './worklocation.component';

describe('WorklocationComponent', () => {
  let component: WorklocationComponent;
  let fixture: ComponentFixture<WorklocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorklocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorklocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
