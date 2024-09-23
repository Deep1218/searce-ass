import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BudgetCardComponent } from '../../layout/budget-card/budget-card.component';
import { ProjectService } from '../project.service';
import { debounce, debounceTime, Subject, takeUntil } from 'rxjs';
import { CommonService } from '../../shared/common.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddPositionComponent } from './add-position/add-position.component';
import { CurrencyToShortcodePipe } from '../../shared/pipes/currency-to-shortcode.pipe';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-planning-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    BudgetCardComponent,
    MatSnackBarModule,
    MatDialogModule,
    CurrencyToShortcodePipe,
  ],
  templateUrl: './planning-details.component.html',
  styleUrl: './planning-details.component.scss',
})
export class PlanningDetailsComponent implements OnInit {
  displayedColumns: string[] = [
    'designation',
    'department',
    'budget',
    'location',
    'lastUpdated',
    'delete',
  ];
  dataSource!: MatTableDataSource<any>;

  projectId!: string;
  positions: any[] = [];
  totalItems = this.positions.length;
  searchForm!: FormGroup;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private projectService: ProjectService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  get controls() {
    return this.searchForm.controls;
  }
  ngOnInit() {
    this.route.params
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((params: any) => {
        this.projectService.projectId = params.id;
      });
    this.positionListners();
    this.initForm();
    this.controls['text'].valueChanges
      .pipe(takeUntil(this._unsubscribeAll))
      .pipe(debounceTime(1000))
      .subscribe((value) => {
        this.getPositions(value, this.controls['filter'].value);
      });
    this.getPositions();
  }
  initForm() {
    this.searchForm = this.fb.group({
      text: [''],
      filter: ['designation', [Validators.required]],
    });
  }
  getPositions(searchText = '', searchFilter = '') {
    this.projectService
      .getPositions(searchText, searchFilter)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (res: any) => {
          console.log('Res data========>', res);
          this.positions = res.data;
          this.dataSource = new MatTableDataSource(this.positions);
        },
        (err) => {
          this.commonService.openErrorSnackBar(err.error.message);
        }
      );
  }

  deleteRow(element: any): void {
    // TODO delete position api
    this.dataSource.data = this.dataSource.data.filter(
      (item) => item !== element
    );
  }
  openDialog() {
    const dialogRef = this.dialog.open(AddPositionComponent, {
      width: '600px',
      data: { projectId: this.projectId },
    });
  }
  positionListners() {
    this.projectService
      .createPositionListner()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (res) => {
          if (res.success) {
            this.positions.push(res.data);
            this.dataSource = new MatTableDataSource(this.positions);
            this.dialog.closeAll();
            this.commonService.openSnackBar(res.message);
          } else if (res.error) {
            this.commonService.openErrorSnackBar(res.message);
          }
        },
        (err) => {
          this.commonService.openErrorSnackBar(
            'Something went wrong! Please try again later'
          );
        }
      );
  }
  searchPosition() {
    if (this.controls['text'].value) {
      this.getPositions(
        this.controls['text'].value,
        this.controls['filter'].value
      );
    }
  }
}
