import { TestBed } from '@angular/core/testing';

import { ReferMateService } from './refer-mate.service';

describe('ReferMateService', () => {
  let service: ReferMateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReferMateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
