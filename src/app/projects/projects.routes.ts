import { Routes } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { ListingComponent } from './listing/listing.component';
import { PlanningDetailsComponent } from './planning-details/planning-details.component';
import { inject } from '@angular/core';
import { ProjectService } from './project.service';

export const routes: Routes = [
  {
    path: '',
    component: ProjectsComponent,
    children: [
      {
        path: '',
        component: ListingComponent,
        resolve: {
          projects: () => inject(ProjectService).getProjects(),
        },
      },
      { path: 'planning/:id', component: PlanningDetailsComponent },
    ],
  },
];
