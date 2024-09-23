import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { noAuthGuard } from '../shared/guards/no-auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: 'login' },
];
