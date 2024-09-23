import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ProjectService } from '../../project.service';
import { Subject, takeUntil } from 'rxjs';
import { CommonService } from '../../../shared/common.service';

@Component({
  selector: 'app-add-position',
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
  templateUrl: './add-position.component.html',
  styleUrl: './add-position.component.scss',
})
export class AddPositionComponent implements OnInit {
  positionForm!: FormGroup;
  formattedBudget!: string;
  departments = ['engineering', 'product', 'sales', 'others'];
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private dialogRef: MatDialogRef<AddPositionComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.positionForm = this.fb.group({
      designation: ['', [Validators.required]],
      department: ['', [Validators.required]],
      location: ['', [Validators.required]],
      budget: ['', [Validators.required, Validators.min(0)]],
    });
  }
  formatBudget(event: KeyboardEvent): void {
    let input = (event.target as HTMLInputElement).value;
    const numericValue = input.replace(/\D/g, '');

    this.formattedBudget = this.addCommas(numericValue);
    this.positionForm.controls['budget'].setValue(numericValue);
  }

  addCommas(value: string): string {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  onSubmit() {
    if (this.positionForm.invalid) {
      return;
    }
    this.projectService.createPosition({
      ...this.positionForm.getRawValue(),
      projectId: this.projectService.projectId,
    });
  }
}
