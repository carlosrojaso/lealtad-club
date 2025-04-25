import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  get pageSize(): number {
    return environment.config.pageSize;
  }

  get stampsPerCard(): number {
    return environment.config.stampsPerCard;
  }
}