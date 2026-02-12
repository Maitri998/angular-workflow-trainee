import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Workflow } from '../workflow.model';

@Component({
  selector: 'app-workflow-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './workflow-detail.html',
  styleUrl: './workflow-detail.css'
})
export class WorkflowDetail {
private route = inject(ActivatedRoute);
workflow: Workflow | undefined;

constructor() {

  this.workflow = this.route.snapshot.data['workflow'];
}
}
