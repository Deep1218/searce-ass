import { Routes } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';

export const routes: Routes = [
  {
    path: '',
    component: ProjectsComponent,
  },
  {
    path: 'sidebar',
    component: SidebarComponent,
  },
];
