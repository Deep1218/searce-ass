import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
})
export class ProjectCardComponent {
  project = {
    title: 'Title',
    subtitle: 'Subtitle',
    budget: '1.5 CR',
    positions: 66,
    coPlanners: 'Yeah Mehta',
  };
  colSpan = 'col-md-3';
}
