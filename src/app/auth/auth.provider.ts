import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ENVIRONMENT_INITIALIZER,
  EnvironmentProviders,
  inject,
  Provider,
} from '@angular/core';
import { ApiInterceptor } from '../shared/api.interceptor';
import { AuthService } from './auth.service';

export const provideAuth = (): Array<Provider | EnvironmentProviders> => {
  return [
    provideHttpClient(withInterceptors([ApiInterceptor])),
    {
      provide: ENVIRONMENT_INITIALIZER,
      useValue: () => inject(AuthService),
      multi: true,
    },
  ];
};
