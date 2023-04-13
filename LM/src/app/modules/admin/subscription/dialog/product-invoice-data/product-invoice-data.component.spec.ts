import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductInvoiceDataComponent } from './product-invoice-data.component';

describe('ProductInvoiceDataComponent', () => {
  let component: ProductInvoiceDataComponent;
  let fixture: ComponentFixture<ProductInvoiceDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductInvoiceDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductInvoiceDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
