import { Component } from '@angular/core';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { AddComponent } from '../../projects/add/add.component';

@Component({
  selector: 'app-budget-card',
  standalone: true,
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    NgChartsModule,
    MatDialogModule,
  ],
  templateUrl: './budget-card.component.html',
  styleUrl: './budget-card.component.scss',
})
export class BudgetCardComponent {
  // Doughnut chart config
  public doughnutChartOptions: any = {
    responsive: true,
    cutout: '80%',
    plugins: {
      tooltip: {
        enabled: false,
      },
      legend: {
        display: false,
      },
    },
  };
  public doughnutChartLabels: string[] = [
    'Engineering',
    'Product',
    'Sales',
    'Others',
  ];
  public doughnutChartData: ChartConfiguration['data'] = {
    labels: this.doughnutChartLabels,
    datasets: [
      {
        data: [30, 20, 30, 10],
        backgroundColor: ['#489E9F', '#81CB85', '#FFC74F', '#70b0b1'],
        borderWidth: 0,
      },
    ],
  };
  public doughnutChartType: ChartType = 'doughnut';

  constructor(private dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(AddComponent, {
      width: '600px',
    });
  }
}
