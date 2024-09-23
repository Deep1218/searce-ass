import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { noAuthGuard } from './shared/guards/no-auth.guard';

export const routes: Routes = [
  {
    path: 'projects',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./projects/projects.routes').then((m) => m.routes),
  },
  {
    path: '',
    canActivate: [noAuthGuard],
    loadChildren: () => import('./auth/auth.routes').then((m) => m.routes),
  },
];
