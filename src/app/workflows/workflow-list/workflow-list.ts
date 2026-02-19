import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Workflow } from '../workflow.model';
import { WorkflowService } from '../workflow.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-workflow-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './workflow-list.html',
  styleUrl: './workflow-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkflowList {

  workflows$!: Observable<Workflow[]>;

  constructor(
    private workflowService: WorkflowService,
    public auth: AuthService // public because template uses it
  )
   {
    const role = this.auth.getRole() as 'Employee' | 'Manager' | 'Admin';

    this.workflows$ = this.workflowService.getWorkflowsByRole(role);
  }

  trackByWorkflowId(index: number, workflow: Workflow): number
   {
    return workflow.id;
  }
 //Manager scope of work-

  approve(id: number): void
   {
    this.workflowService.updateWorkflowStatus(
      id,
      'APPROVED',
      'Approved by manager'
    );
  }

  reject(id: number): void {
    this.workflowService.updateWorkflowStatus(
      id,
      'REJECTED',
      'Rejected by manager'
    );
  }
       //admin scope of work-
  
  delete(id: number): void {
    this.workflowService.deleteWorkflow(id);
  }
}
