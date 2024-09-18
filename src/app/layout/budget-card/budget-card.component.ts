import { Component } from '@angular/core';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-budget-card',
  standalone: true,
  imports: [MatCard, MatCardTitle, MatCardContent, NgChartsModule],
  templateUrl: './budget-card.component.html',
  styleUrl: './budget-card.component.scss',
})
export class BudgetCardComponent {
  // Doughnut chart config
  public doughnutChartOptions: any = {
    responsive: true,
    cutout: '80%',
    plugins: {
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
    labels: ['Engineering', 'Product', 'Sales', 'Others'],
    datasets: [
      {
        data: [30, 20, 30, 10],
        backgroundColor: ['#4db6ac', '#aed581', '#ffb74d', '#80deea'],
        borderWidth: 0,
      },
    ],
  };

  public doughnutChartType: ChartType = 'doughnut';
}
