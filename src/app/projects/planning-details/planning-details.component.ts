import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BudgetCardComponent } from '../../layout/budget-card/budget-card.component';

const ELEMENT_DATA = [
  {
    designation: 'HR',
    department: 'Others',
    budget: '₹8L',
    location: 'Ahmedabad',
    lastUpdated: { user: 'Ankush Mehta', date: '2022-09-06T19:05:00' },
  },
  {
    designation: 'UI Designer',
    department: 'Product',
    budget: '₹10L',
    location: 'Ahmedabad',
    lastUpdated: { user: 'Ankush Mehta', date: '2022-09-06T19:05:00' },
  },
  {
    designation: 'Architect',
    department: 'Engineering',
    budget: '₹8L',
    location: 'Ahmedabad',
    lastUpdated: { user: 'Ankush Mehta', date: '2022-09-06T19:05:00' },
  },
];

@Component({
  selector: 'app-planning-details',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    BudgetCardComponent,
  ],
  templateUrl: './planning-details.component.html',
  styleUrl: './planning-details.component.scss',
})
export class PlanningDetailsComponent {
  displayedColumns: string[] = [
    'designation',
    'department',
    'budget',
    'location',
    'lastUpdated',
    'delete',
  ];
  dataSource = new MatTableDataSource(ELEMENT_DATA); // Sample data

  totalItems = ELEMENT_DATA.length;

  deleteRow(element: any): void {
    this.dataSource.data = this.dataSource.data.filter(
      (item) => item !== element
    );
  }
}
