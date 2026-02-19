import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowService } from '../workflow.service';
import { Workflow } from '../workflow.model';
import { Observable } from 'rxjs';
import { RouterModule, Router } from '@angular/router';
import { WorkflowList } from '../workflow-list/workflow-list';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, WorkflowList],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})

export class AdminComponent implements OnInit {

  private workflowService = inject(WorkflowService);
  private router = inject(Router);

  workflows$!: Observable<Workflow[]>;

  ngOnInit()
   {
    this.workflows$ = this.workflowService.getWorkflows(); //this will fetch all workflows when component initializes
  }

  createWorkflow()
   {
    this.router.navigate(['/workflows/admin/new']); // this will navigate to workflow creation page
  }

  delete(id: number) 
  {
      this.workflowService.deleteWorkflow(id); //only the admin has the authority to delete the workflows
    
  }
}
