import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
  planners!: Array<any>;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  projectForm: any;
  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private commonService: CommonService,
    public dialogRef: MatDialogRef<any>
  ) {}

  get controls() {
    return this.projectForm.controls;
  }
  ngOnInit(): void {
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
  }
  onSubmit() {
    if (this.projectForm.invalid) {
      return;
    }
    console.log('Project data==========>', this.projectForm.getRawValue());
    let { planners, ...projectDetails } = this.projectForm.getRawValue();
    planners = [planners];
    this.projectService.create({ ...projectDetails, planners });
  }

  projectListners() {
    this.projectService
      .createdlistner()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data) => {
        console.log('Project socket data========>', data);
        if (data.succes) {
          this.commonService.openSnackBar(data.message);
          this.dialogRef.close();
        } else if (data.error) {
          this.commonService.openErrorSnackBar(data.message);
        }
      });
  }
  getPlannerName(id: number) {
    if (id) {
      const planner = this.planners.find((ele) => ele.id === id);
      return planner.name;
    }
    return '';
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
