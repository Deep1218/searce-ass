import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { ProjectService } from '../project.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonService } from '../../shared/common.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
@Component({
  selector: 'app-add',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIcon,
    MatSelectModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
})
export class AddComponent implements OnInit, OnDestroy {
  projectId!: string;
  planners!: Array<any>;
  formattedBudget!: string;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  projectForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<AddComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {}

  get controls() {
    return this.projectForm.controls;
  }
  ngOnInit(): void {
    this.projectId = this.projectService.projectId ?? null;

    this.projectService
      .getPlanners()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res) => {
        this.planners = res.data;
      });

    this.projectListners();
    this.initForm();
  }

  initForm() {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      planners: ['', [Validators.required]],
    });
    if (this.projectId && this.dialogData.edit) {
      this.controls['name'].disable();
      this.controls['description'].disable();
      this.controls['planners'].disable();
      this.projectForm.addControl(
        'totalBudget',
        this.fb.control('0', Validators.required)
      );
      this.setupForm();
    }
  }

  setupForm() {
    this.projectService
      .getProject()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((res: any) => {
        console.log('Data==============>', res.data);

        this.projectForm.patchValue({
          name: res.data.name,
          description: res.data.description,
          planners: res.data.planners[0].planner_user_id,
          totalBudget: res.data.totalBudget,
        });
        this.formattedBudget = this.addCommas(res.data.totalBudget);
      });
  }

  onSubmit() {
    if (this.projectForm.invalid) {
      return;
    }
    let { planners, ...projectDetails } = this.projectForm.getRawValue();
    planners = [planners];
    if (this.projectId && this.dialogData.edit) {
      this.projectService.update({
        id: this.projectId,
        totalBudget: projectDetails.totalBudget,
      });
    } else {
      this.projectService.create({ ...projectDetails, planners });
    }
  }

  projectListners() {
    this.projectService
      .createdlistner()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        if (data.success) {
          this.commonService.openSnackBar(data.message);
          this.dialogRef.close();
        } else if (data.error) {
          this.commonService.openErrorSnackBar(data.message);
        }
      });
    this.projectService
      .updateListner()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        if (data.success) {
          this.commonService.openSnackBar(data.message);
          this.dialogRef.close();
        } else if (data.error) {
          this.commonService.openErrorSnackBar(data.message);
        }
      });
  }
  getPlannerName(id: number) {
    if (id) {
      console.log('Planners=========>', this.planners, id);

      const planner = this.planners.find((ele) => ele.id === id);
      return planner.name;
    }
    return '';
  }
  formatBudget(): void {
    let input = this.controls['totalBudget'].value;
    const numericValue = input.replace(/\D/g, '');

    this.formattedBudget = this.addCommas(numericValue);
    this.projectForm.controls['totalBudget'].setValue(numericValue);
  }
  addCommas(value: string): string {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
