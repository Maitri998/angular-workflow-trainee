import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { Workflow } from '../../core/models/workflow.model';
import { WorkflowService } from '../../core/services/workflow.service';
import { AuthService, User } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private workflowService = inject(WorkflowService);
  private auth = inject(AuthService);
  private router = inject(Router);

  // Unsubscribe subject
  private destroy$ = new Subject<void>();

  user$: Observable<User | null> = this.auth.user$;
  
  /**
   * Manager gets sorted workflows (inprogress, rejected, approved)
   * Others get normal workflow list
   */
  workflows$: Observable<Workflow[]> = this.user$.pipe(
    switchMap(user => {
      if (user?.role === 'manager') {
        return this.workflowService.getManagerViewWorkflows();
      }
      return this.workflowService.workflows$;
    })
  );

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    status: ['pending', Validators.required],
    description: ['']
  });

  editingId: number | null = null;

  // Role-based observables
  canCreateWorkflow$ = this.user$.pipe(
    map(u => !!u && (u.role === 'employee' || u.role === 'admin')),
    takeUntil(this.destroy$)
  );
  
  isEmployee$ = this.user$.pipe(
    map(u => u?.role === 'employee'),
    takeUntil(this.destroy$)
  );
  
  isManager$ = this.user$.pipe(
    map(u => u?.role === 'manager'),
    takeUntil(this.destroy$)
  );
  
  isAdmin$ = this.user$.pipe(
    map(u => u?.role === 'admin'),
    takeUntil(this.destroy$)
  );

  ngOnInit(): void {
    this.workflowService.init();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }

  
  submit(user: User | null) {
    if (!user || this.form.invalid) return;
    const v = this.form.getRawValue();

    if (this.editingId == null) {
      // CREATE new workflow
      if (user.role === 'employee') {
        this.workflowService.add(
          {
            title: v.title!,
            status: 'pending',
            description: v.description ?? ''
          },
          user.name
        );
      } else if (user.role === 'admin') {
        this.workflowService.add(
          {
            title: v.title!,
            status: v.status as Workflow['status'],
            description: v.description ?? '',
            assignedTo: v.title! // Can be customized to assign to specific employee
          },
          user.name
        );
      }
    } else {
      // EDIT existing workflow
      const existing = this.workflowService.getById(this.editingId);
      if (!existing) return;

      if (user.role === 'employee') {
        // Employee can only edit title and description
        this.workflowService.update({
          ...existing,
          title: v.title!,
          description: v.description ?? ''
        });
      } else if (user.role === 'admin') {
        // Admin can edit all fields
        this.workflowService.update({
          ...existing,
          title: v.title!,
          status: v.status as Workflow['status'],
          description: v.description ?? ''
        });
      }
    }

    this.resetForm();
  }

  //Employee sends workflow to manager
  sendToManager(w: Workflow, user: User | null): void {
    if (!user || user.role !== 'employee') return;
    if (w.status !== 'pending') {
      console.warn('Only pending workflows can be sent to manager');
      return;
    }
    this.workflowService.sendToManager(w.id, 'Manager'); // Could be dynamic
  }

  
    //Manager approves workflow
   
  approveWorkflow(w: Workflow, user: User | null): void {
    if (!user || user.role !== 'manager') return;
    if (w.status !== 'inprogress') {
      console.warn('Only inprogress workflows can be approved');
      return;
    }
    this.workflowService.approveWorkflow(w.id);
  }

  //Manager rejects workflow
  
  rejectWorkflow(w: Workflow, user: User | null): void {
    if (!user || user.role !== 'manager') return;
    if (w.status !== 'inprogress') {
      console.warn('Only inprogress workflows can be rejected');
      return;
    }
    this.workflowService.rejectWorkflow(w.id);
  }

 
  onRowDblClick(user: User | null, w: Workflow): void {
    if (!user) return;
    if (user.role === 'manager') return; // Manager cannot edit

    this.editingId = w.id;
    this.form.reset({
      title: w.title,
      status: w.status,
      description: w.description ?? ''
    });
  }

  onSelectWorkflow(id: number): void {
    console.log('Selected workflow ID:', id);
  }

  trackById(_: number, item: Workflow): number {
    return item.id;
  }

  cancelEdit(): void {
    this.resetForm();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  private resetForm(): void {
    this.editingId = null;
    this.form.reset({ title: '', status: 'pending', description: '' });
  }
}