import { Component, OnInit } from '@angular/core';
import { ProjectCardComponent } from '../../layout/project-card/project-card.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { AddComponent } from '../add/add.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../project.service';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listing',
  standalone: true,
  imports: [
    CommonModule,
    ProjectCardComponent,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
  ],
  templateUrl: './listing.component.html',
  styleUrl: './listing.component.scss',
})
export class ListingComponent implements OnInit {
  projects: any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.projects = this.projectService.getAllProjects$();
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddComponent, {
      width: '600px',
      data: { edit: false },
    });
  }

  onClickProject(project: any) {
    this.projectService.selectedProject = project;
    this.router.navigate(['./planning', `${project.id}`], {
      relativeTo: this.activeRoute,
    });
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
