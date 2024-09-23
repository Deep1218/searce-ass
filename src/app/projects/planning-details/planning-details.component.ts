import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
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
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
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
  dialogRef: any;
  selectedPosition: any;
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
          this.positions = res.data;
          this.dataSource = new MatTableDataSource(this.positions);
        },
        (err) => {
          this.commonService.openErrorSnackBar(err.error.message);
        }
      );
  }
  deleteConfirm(template: any, position: any) {
    this.selectedPosition = position;
    this.dialogRef = this.dialog.open(template, {
      width: '300px',
      data: position,
    });
    this.dialogRef
      .afterClosed()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((confirm: boolean) => {
        if (confirm) {
          this.deleteRow();
        } else {
          this.selectedPosition = null;
        }
      });
  }

  deleteRow(): void {
    this.projectService
      .deletePosition(this.selectedPosition.id)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (res: any) => {
          this.dataSource.data = this.dataSource.data.filter(
            (item) => item !== this.selectedPosition
          );
          const idx = this.positions.findIndex(
            (ele) => ele.id === this.selectedPosition.id
          );
          if (idx > -1) {
            this.positions.splice(idx, 1);
          }
          this.selectedPosition = null;
          this.commonService.openSnackBar(res.message);
        },
        (err) => {
          this.selectedPosition = null;
          this.commonService.openErrorSnackBar(err.error.message);
        }
      );
  }
  openDialog() {
    const dialogRef = this.dialog.open(AddPositionComponent, {
      width: '600px',
      data: { projectId: this.projectId },
    });
  }
  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close();
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
