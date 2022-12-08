import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InductionConductedByMasterComponent } from './induction-conducted-by-master.component';

describe('InductionConductedByMasterComponent', () => {
  let component: InductionConductedByMasterComponent;
  let fixture: ComponentFixture<InductionConductedByMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InductionConductedByMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InductionConductedByMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
