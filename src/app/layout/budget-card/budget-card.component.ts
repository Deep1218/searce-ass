import { Component, OnInit } from '@angular/core';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ChartConfiguration, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { AddComponent } from '../../projects/add/add.component';
import { ProjectService } from '../../projects/project.service';
import { Subject, takeUntil } from 'rxjs';
import { CurrencyToShortcodePipe } from '../../shared/pipes/currency-to-shortcode.pipe';

@Component({
  selector: 'app-budget-card',
  standalone: true,
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    NgChartsModule,
    MatDialogModule,
    CurrencyToShortcodePipe,
  ],
  templateUrl: './budget-card.component.html',
  styleUrl: './budget-card.component.scss',
})
export class BudgetCardComponent implements OnInit {
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
  public doughnutChartData!: ChartConfiguration['data'];
  public doughnutChartType: ChartType = 'doughnut';
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  calculationData: any = {
    total: {},
    engineering: {},
    product: {},
    sales: {},
    others: {},
  };
  constructor(
    private dialog: MatDialog,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    this.calculationListiner();
  }

  openDialog() {
    this.dialog.open(AddComponent, {
      width: '600px',
      data: { edit: true },
    });
  }
  setGraphData() {
    this.doughnutChartData = {
      labels: this.doughnutChartLabels,
      datasets: [
        {
          data: [
            this.calculationData.engineering?.percent_used || 0,
            this.calculationData.product?.percent_used || 0,
            this.calculationData.sales?.percent_used || 0,
            this.calculationData.others?.percent_used || 0,
          ],
          backgroundColor: ['#489E9F', '#81CB85', '#FFC74F', '#70b0b1'],
          borderWidth: 0,
        },
      ],
    };
  }
  calculationListiner() {
    this.projectService
      .getGraphDataListner()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        this.calculationData.total = data.data
          .filter((ele: any) => !!ele.total_used)
          .pop();
        this.calculationData.engineering = data.data
          .filter((ele: any) => {
            if (ele?.percent_used) {
              ele.percent_used = parseFloat(ele.percent_used).toFixed(2);
            }
            return ele?.department === 'engineering';
          })
          .pop();
        this.calculationData.product = data.data
          .filter((ele: any) => ele?.department === 'product')
          .pop();
        this.calculationData.sales = data.data
          .filter((ele: any) => ele?.department === 'sales')
          .pop();
        this.calculationData.others = data.data
          .filter((ele: any) => ele?.department === 'others')
          .pop();
        this.setGraphData();
      });
  }
}
