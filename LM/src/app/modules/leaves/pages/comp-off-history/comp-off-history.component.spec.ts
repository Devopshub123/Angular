import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompOffHistoryComponent } from './comp-off-history.component';

describe('CompOffHistoryComponent', () => {
  let component: CompOffHistoryComponent;
  let fixture: ComponentFixture<CompOffHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompOffHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompOffHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
