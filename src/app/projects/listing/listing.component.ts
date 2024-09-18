import { Component } from '@angular/core';
import { ProjectCardComponent } from '../../layout/project-card/project-card.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { AddComponent } from '../add/add.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-listing',
  standalone: true,
  imports: [
    ProjectCardComponent,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
  ],
  templateUrl: './listing.component.html',
  styleUrl: './listing.component.scss',
})
export class ListingComponent {
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {}

  openDialog() {
    const dialogRef = this.dialog.open(AddComponent, {
      width: '600px',
    });
    dialogRef.afterClosed().subscribe((data) => console.log('Dialog closed'));
  }

  onClickProject(id: string) {
    this.router.navigate(['./planning', `${id}`], {
      relativeTo: this.activeRoute,
    });
  }
}
