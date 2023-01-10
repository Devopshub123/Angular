import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsiComponent } from './esi.component';

describe('EsiComponent', () => {
  let component: EsiComponent;
  let fixture: ComponentFixture<EsiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EsiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
