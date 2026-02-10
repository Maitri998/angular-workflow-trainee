import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Workflow } from '../workflow.model';


@Component({
  selector: 'app-workflow-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workflow-list.html',
  styleUrl: './workflow-list.css',

  // Using OnPush change detection strategy for better
  //  performance so that Angular skips checking a component
  //  and its children unless specific conditions are met.// 
  changeDetection: ChangeDetectionStrategy.OnPush

})

export class WorkflowList {
  @Input() workflows: Workflow[] = []; // Input property to receive the list of workflows from the parent component//
  @Output() workflowSelected = new EventEmitter<number>(); // Output event emitter to notify the parent component when a workflow is selected//
onWorkflowClick(workflowId: number): void {
  this.workflowSelected.emit(workflowId); // Emit the selected workflow ID to the parent component//
}
trackByWorkflowId(index: number, workflow: Workflow): number {
  return workflow.id; // TrackBy function to optimize rendering by tracking workflows by their unique ID//
}

}
