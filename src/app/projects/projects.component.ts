import { Component } from '@angular/core';
import { HeaderComponent } from '../layout/header/header.component';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';
import { ProjectCardComponent } from '../layout/project-card/project-card.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarComponent,
    ProjectCardComponent,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {}
