import { Component } from '@angular/core';
import { HeaderComponent } from '../layout/header/header.component';
import { SidebarComponent } from '../layout/sidebar/sidebar.component';
import { ProjectCardComponent } from '../layout/project-card/project-card.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AddComponent } from './add/add.component';
import { MatFormFieldModule } from '@angular/material/form-field';

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
    MatFormFieldModule,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  constructor(private dialog: MatDialog) {}
  openDialog() {
    const dialogRef = this.dialog.open(AddComponent, {
      width: '600px',
    });
    dialogRef.afterClosed().subscribe((data) => console.log('Dialog closed'));
  }
}
