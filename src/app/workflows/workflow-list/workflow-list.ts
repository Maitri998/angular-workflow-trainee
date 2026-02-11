import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Workflow } from '../workflow.model';
import { RouterModule } from '@angular/router';
import { WorkflowService } from '../workflow.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-workflow-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './workflow-list.html',
  styleUrl: './workflow-list.css',

  // Using OnPush change detection strategy for better
  //  performance so that Angular skips checking a component
  //  and its children unless specific conditions are met.// 
  changeDetection: ChangeDetectionStrategy.OnPush

})

export class WorkflowList {
  workflows$!: Observable<Workflow[]>; // Observable to hold the list of workflows

  constructor(private workflowService: WorkflowService)
   {
    this.workflows$ = this.workflowService.getWorkflows(); // Fetch workflows from the service
   }

trackByWorkflowId(index: number, workflow: Workflow): number {
  return workflow.id; // TrackBy function to optimize rendering by tracking workflows by their unique ID//
}

}
