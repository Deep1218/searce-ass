import { Routes } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { ListingComponent } from './listing/listing.component';
import { PlanningDetailsComponent } from './planning-details/planning-details.component';

export const routes: Routes = [
  {
    path: '',
    component: ProjectsComponent,
    children: [
      { path: '', component: ListingComponent },
      { path: 'planning/:id', component: PlanningDetailsComponent },
    ],
  },
];
