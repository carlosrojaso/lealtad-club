import { TestBed } from '@angular/core/testing';
import { ConfigService } from './config.service';
import { environment } from '../../environments/environment';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the configured pageSize', () => {
    expect(service.pageSize).toBe(environment.config.pageSize);
  });

  it('should return the configured stampsPerCard', () => {
    expect(service.stampsPerCard).toBe(environment.config.stampsPerCard);
  });
});
