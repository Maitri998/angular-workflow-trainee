import { Component} from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowList } from './workflows/workflow-list/workflow-list';
import { WorkflowService } from './workflows/workflow.service';
import { Workflow } from './workflows/workflow.model';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WorkflowList, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})


export class App {
  workflows$!: Observable<Workflow[]>; //This property is an Observable that will hold an array of Workflow objects. The $ suffix is a common convention to indicate that this property is an Observable.//
  
  constructor(private workflowService: WorkflowService) {
    this.workflows$ = this.workflowService.getWorkflows();
     //In the constructor, the WorkflowService is injected, and the getWorkflows() method is called to assign the Observable of workflows to the workflows$ property.//
  }

 onWorkflowSelected(id: number): void { //This method is called when a workflow is selected in the WorkflowList component. It receives the ID of the selected workflow as a parameter and logs it to the console.//
    console.log('Selected Workflow ID:', id);
 }
}
