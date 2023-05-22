import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsiReportsComponent } from './esi-reports.component';

describe('EsiReportsComponent', () => {
  let component: EsiReportsComponent;
  let fixture: ComponentFixture<EsiReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsiReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EsiReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
