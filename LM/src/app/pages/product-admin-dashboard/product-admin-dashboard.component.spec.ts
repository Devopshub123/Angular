import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAdminDashboardComponent } from './product-admin-dashboard.component';

describe('ProductAdminDashboardComponent', () => {
  let component: ProductAdminDashboardComponent;
  let fixture: ComponentFixture<ProductAdminDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductAdminDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
