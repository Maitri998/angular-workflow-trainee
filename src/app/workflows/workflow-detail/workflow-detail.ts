import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Workflow } from '../workflow.model';
import { WorkflowService } from '../workflow.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-workflow-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './workflow-detail.html',
  styleUrl: './workflow-detail.css'
})
export class WorkflowDetail implements OnInit {

  // Current workflow details from route param
  workflow?: Workflow;
  managerComment: string = '';
  currentRole: string | null = null;

//DI used here
  private route = inject(ActivatedRoute);
  private workflowService = inject(WorkflowService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.currentRole = this.authService.getRole();

    //Extracting workflow ID from route params
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;

    if (!id) {
      console.error('Invalid workflow ID');
      return;
    }

    this.workflowService.getWorkflowById(id).subscribe(workflow => {
      if (!workflow) {
        console.error('Workflow not found');
        return;
      }

      this.workflow = workflow;
      this.managerComment = workflow.managerComments || '';
    });
  }

  requestApproval() {
  if (this.workflow) {

  this.workflowService.requestApproval(this.workflow.id);
  }
}

  approve() {
  if (!this.workflow) return;

  this.workflowService.updateWorkflowStatus(
    this.workflow.id,
    'APPROVED',
    this.managerComment //manager's comment is a must
  );
}

reject() {
  if (!this.workflow) return;

  this.workflowService.updateWorkflowStatus(
    this.workflow.id,
    'REJECTED',
    this.managerComment  //manager's comment is a must
  );
}


getStatusClass(status: string): string {  //did here the CSS class mapping
  switch (status) {
    case 'NEW':
      return 'status-new';
    case 'REQUESTED':
      return 'status-requested';
    case 'APPROVED':
      return 'status-approved';
    case 'REJECTED':
      return 'status-rejected';
    default:
      return '';
  }
}

}
