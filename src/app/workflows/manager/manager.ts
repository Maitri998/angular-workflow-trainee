import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowService } from '../workflow.service';
import { Workflow, WorkflowStatus } from '../workflow.model';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './manager.html',
  styleUrl: './manager.css'
})

export class ManagerComponent implements OnInit {

  private workflowService = inject(WorkflowService); //Injected the service for workflow operations

  workflows$!: Observable<Workflow[]>; //used the observable for async workflow list

  selectedFilter: WorkflowStatus | 'ALL' = 'REQUESTED';

  ngOnInit(): void {
    this.loadWorkflows();
  }

  loadWorkflows(): void {

    this.workflows$ =
      this.selectedFilter === 'ALL'
        ? this.workflowService.getWorkflows()
        : this.workflowService.getWorkflowsByStatus(this.selectedFilter);
  }

  approve(id: number): void {
    const comment = prompt('Enter approval comments:') || '';
    this.workflowService.updateWorkflowStatus(id, 'APPROVED', comment); //approve workflow
  }

  reject(id: number): void {
    const comment = prompt('Enter rejection comments:') || '';
    this.workflowService.updateWorkflowStatus(id, 'REJECTED', comment); //reject workflow
  }

  onFilterChange(): void {
    this.loadWorkflows(); //reloading the workflows
  }
}
