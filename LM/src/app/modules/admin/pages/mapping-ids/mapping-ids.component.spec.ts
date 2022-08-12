import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingIdsComponent } from './mapping-ids.component';

describe('MappingIdsComponent', () => {
  let component: MappingIdsComponent;
  let fixture: ComponentFixture<MappingIdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MappingIdsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MappingIdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
