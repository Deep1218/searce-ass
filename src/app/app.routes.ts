import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'projects',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./projects/projects.routes').then((m) => m.routes),
  },
  {
    path: '',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.routes),
  },
];
