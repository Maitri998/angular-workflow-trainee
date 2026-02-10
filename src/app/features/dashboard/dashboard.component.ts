import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
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
    title: ['', Validators.required],
    status: ['Pending' as Workflow['status'], Validators.required],
    description: ['']
  });

  // When null → create mode. When number → edit mode for that id
  editingId: number | null = null;

  constructor() {
    // Load initial data (JSON → local storage OR from local storage)
    this.workflowService.init();
  }

  /** Called when clicking Save (create or update) */
  submit() {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();

    if (this.editingId == null) {
      // CREATE
      this.workflowService.add({
        title: value.title!,
        status: value.status!,
        description: value.description ?? ''
      });
    } else {
      // UPDATE
      const existing = this.workflowService.getById(this.editingId);
      if (!existing) return;
      this.workflowService.update({
        ...existing,
        title: value.title!,
        status: value.status!,
        description: value.description ?? ''
      });
    }

    this.resetForm();
  }


  onRowDblClick(w: Workflow) {
    this.editingId = w.id;
    this.form.reset({
      title: w.title,
      status: w.status,
      description: w.description ?? ''
    });
   
  }

 
  onSelectWorkflow(id: number) {
    console.log('Selected workflow ID:', id);
  }

 
  cancelEdit() {
    this.resetForm();
  }


  trackById(_: number, item: Workflow) {
    return item.id;
  }

  private resetForm() {
    this.editingId = null;
    this.form.reset({
      title: '',
      status: 'Pending',
      description: ''
    });
  }
}