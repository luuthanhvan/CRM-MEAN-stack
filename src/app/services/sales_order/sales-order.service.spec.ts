import { TestBed } from '@angular/core/testing';

import { SalesOrderService } from './sales-order.service';

describe('SalesOrderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SalesOrderService = TestBed.get(SalesOrderService);
    expect(service).toBeTruthy();
  });
});
