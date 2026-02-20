import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Workflow } from '../models/workflow.model';

@Injectable({ providedIn: 'root' })
export class WorkflowService {
  private http = inject(HttpClient);
  private readonly STORAGE_KEY = 'workflows';
  private readonly url = 'assets/workflows.json';

  private readonly _workflows$ = new BehaviorSubject<Workflow[]>([]);
  workflows$ = this._workflows$.asObservable();

  private initialized = false;

  /**
   * Initialize workflow service and load from storage or API
   */
  init(): void {
    if (this.initialized) return;
    this.initialized = true;

    const fromStorage = localStorage.getItem(this.STORAGE_KEY);
    if (fromStorage) {
      this._workflows$.next(JSON.parse(fromStorage));
      return;
    }

    this.http.get<Workflow[]>(this.url).subscribe({
      next: (list) => {
        this._workflows$.next(list);
        this.persist();
      },
      error: (err) => {
        console.error('Failed to load assets/workflows.json', err);
        this._workflows$.next([]); // fail-safe
      }
    });
  }

  /**
   * Get workflow by ID
   */
  getById(id: number): Workflow | undefined {
    return this._workflows$.value.find(w => w.id === id);
  }

  /**
   * Add new workflow (Admin/Employee creation)
   * @param draft Workflow data to create
   * @param createdBy User role or name who created it
   */
  add(draft: { 
    title: string; 
    status: Workflow['status']; 
    description?: string;
    assignedTo?: string;
  }, createdBy: string): Workflow {
    const newItem: Workflow = {
      id: this.nextId(),
      title: draft.title,
      status: draft.status,
      description: draft.description ?? '',
      createdAt: new Date().toISOString(),
      createdBy,
      assignedTo: draft.assignedTo
    };
    this._workflows$.next([newItem, ...this._workflows$.value]);
    this.persist();
    return newItem;
  }

  /**
   * Update workflow
   */
  update(updated: Workflow): void {
    const next = this._workflows$.value.map(w => w.id === updated.id ? { ...updated } : w);
    this._workflows$.next(next);
    this.persist();
  }

  /**
   * Send workflow from employee to manager (change status to inprogress)
   */
  sendToManager(workflowId: number, managerName: string): boolean {
    const workflow = this.getById(workflowId);
    if (!workflow || workflow.status !== 'pending') {
      console.warn('Workflow must be in pending status to send to manager');
      return false;
    }

    this.update({
      ...workflow,
      status: 'inprogress',
      assignedTo: managerName
    });
    return true;
  }

  /**
   * Approve workflow (Manager action)
   */
  approveWorkflow(workflowId: number): boolean {
    const workflow = this.getById(workflowId);
    if (!workflow || workflow.status !== 'inprogress') {
      console.warn('Workflow must be in inprogress status to approve');
      return false;
    }

    this.update({
      ...workflow,
      status: 'approved'
    });
    return true;
  }

  /**
   * Reject workflow (Manager action)
   */
  rejectWorkflow(workflowId: number): boolean {
    const workflow = this.getById(workflowId);
    if (!workflow || workflow.status !== 'inprogress') {
      console.warn('Workflow must be in inprogress status to reject');
      return false;
    }

    this.update({
      ...workflow,
      status: 'rejected'
    });
    return true;
  }

  /**
   * Get workflows sorted for manager view
   * Order: inprogress, rejected, approved
   */
  getManagerViewWorkflows(): Observable<Workflow[]> {
    return this.workflows$.pipe(
      map(workflows => {
        const order = { 'inprogress': 0, 'rejected': 1, 'approved': 2, 'pending': 999 } as const;
        return [...workflows].sort((a, b) => {
          const orderA = order[a.status] ?? 999;
          const orderB = order[b.status] ?? 999;
          return orderA - orderB;
        });
      })
    );
  }
  getEmployeeWorkflows(employeeName: string): Observable<Workflow[]> {
    return this.workflows$.pipe(
      map(workflows => 
        workflows.filter(w => w.assignedTo === employeeName || w.createdBy === employeeName)
      )
    );
  }
  private persist(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._workflows$.value));
  }
  private nextId(): number {
    const ids = this._workflows$.value.map(w => w.id);
    return ids.length ? Math.max(...ids) + 1 : 1;
  }
}