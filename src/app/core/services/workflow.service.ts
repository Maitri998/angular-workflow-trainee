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
        this._workflows$.next([]); 
      }
    });
  }

  getById(id: number): Workflow | undefined {
    return this._workflows$.value.find(w => w.id === id);
  }

  add(draft: { title: string; status: Workflow['status']; description?: string }): Workflow {
    const newItem: Workflow = {
      id: this.nextId(),
      title: draft.title,
      status: draft.status,
      description: draft.description ?? '',
      createdAt: new Date().toISOString()
    };
    this._workflows$.next([newItem, ...this._workflows$.value]);
    this.persist();
    return newItem;
  }

  update(updated: Workflow): void {
    const next = this._workflows$.value.map(w => w.id === updated.id ? { ...updated } : w);
    this._workflows$.next(next);
    this.persist();
  }


  private persist(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._workflows$.value));
  }

  private nextId(): number {
    const ids = this._workflows$.value.map(w => w.id);
    return ids.length ? Math.max(...ids) + 1 : 1;
  }
}