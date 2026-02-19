import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowService } from '../workflow.service';
import { Workflow, WorkflowStatus } from '../workflow.model';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './employee.html',
  styleUrl: './employee.css'
})

export class EmployeeComponent implements OnInit {

  private workflowService = inject(WorkflowService); //Used DI here of the workflow service

  workflows$!: Observable<Workflow[]>;

  selectedFilter: WorkflowStatus | 'ALL' = 'ALL'; //filter is set to default as 'ALL'

  ngOnInit(): void {
    this.loadWorkflows();
  }

  loadWorkflows(): void {
    this.workflows$ =
      this.selectedFilter === 'ALL'
        ? this.workflowService.getWorkflows()
        : this.workflowService.getWorkflowsByStatus(this.selectedFilter);
  }

  onFilterChange(): void {
    this.loadWorkflows();
  }

  requestApproval(id: number): void {
    this.workflowService.requestApproval(id);
  }
}
