import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { finalize, take } from 'rxjs/operators';

import { Workflow } from '../../core/models/workflow.model';
import { WorkflowService } from '../../core/services/workflow.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private fb = inject(FormBuilder);
  private workflowService = inject(WorkflowService);

  workflows$: Observable<Workflow[]> = this.workflowService.workflows$;

  
  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    status: ['Pending', Validators.required],
    description: ['']
  });

  
  editingId: number | null = null;
  rowLoadingId: number | null = null;   
  saving = false;                       

  constructor() {
   
    this.workflowService.init();
  }

 
  submit(): void {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    this.saving = true;

    if (this.editingId == null) {
     
      const draft = {
        title: v.title!,
        status: v.status as Workflow['status'],
        description: v.description ?? ''
      };
      this.workflowService.add$(draft).pipe(
        take(1),
        finalize(() => (this.saving = false))
      ).subscribe(() => this.resetForm());

    } else {
      
      const existing = this.workflowService.getById(this.editingId);
      if (!existing) { this.saving = false; return; }

      const updated: Workflow = {
        ...existing,
        title: v.title!,
        status: v.status as Workflow['status'],
        description: v.description ?? ''
      };

      this.workflowService.update$(updated).pipe(
        take(1),
        finalize(() => (this.saving = false))
      ).subscribe(() => this.resetForm());
    }
  }

  onRowDblClick(w: Workflow): void {
    this.rowLoadingId = w.id;

    setTimeout(() => {
      this.editingId = w.id;
      this.form.reset({
        title: w.title,
        status: w.status,
        description: w.description ?? ''
      });
      this.rowLoadingId = null;
    }, 400);
  }

  onSelectWorkflow(id: number): void {
    console.log('Selected workflow ID:', id);
  }

  cancelEdit(): void {
    this.resetForm();
  }

  trackById(_: number, item: Workflow) { return item.id; }

  private resetForm() {
    this.editingId = null;
    this.form.reset({ title: '', status: 'Pending', description: '' });
  }
}