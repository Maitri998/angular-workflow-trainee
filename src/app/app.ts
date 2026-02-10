import { Component} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { WorkflowList } from './workflows/workflow-list/workflow-list';
import { Workflow } from './workflows/workflow.model';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WorkflowList, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  workflows: Workflow[] = []; //here it starts empty, filled after HTTP call completes//
  
  constructor(private http: HttpClient) {
    this.loadWorkflows();
  } //the constructor runs when the component is created, and it calls loadWorkflows to fetch the data from the JSON file.//
  
  loadWorkflows(): void {
    this.http.get<Workflow[]> ('assets/workflows.json') //HTTP GET request is called here to fetch workflows.json
    .subscribe(data => { //subscribe runs when the HTTP request completes, and it receives the data from the JSON file.//
      this.workflows = data;
    });
  }
 onWorkflowSelected(id: number): void { //This method is called when a workflow is selected in the WorkflowList component. It receives the ID of the selected workflow as a parameter and logs it to the console.//
    console.log('Selected Workflow ID:', id);
 }
}
