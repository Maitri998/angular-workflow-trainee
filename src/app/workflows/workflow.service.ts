import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";
import { Workflow, WorkflowStatus } from "./workflow.model";

@Injectable({
  providedIn: "root"
})

export class WorkflowService {

  //Key is used here to store workflows in browser localStorage
  private readonly STORAGE_KEY = 'workflows';

  private workflowsSubject: BehaviorSubject<Workflow[]>; //BehaviorSubject allows to  always receive the latest value immediately
  workflows$: Observable<Workflow[]>;

  private idCounter = 1; //incremental ID generator

  constructor() {

    //this will load the saved workflows from localStorage
    const saved = localStorage.getItem(this.STORAGE_KEY);

    if (saved) {
      const parsed: Workflow[] = JSON.parse(saved);
      this.workflowsSubject = new BehaviorSubject<Workflow[]>(parsed);

      this.idCounter =
        parsed.length > 0
          ? Math.max(...parsed.map(w => w.id)) + 1
          : 1;

    } else {

      const defaultData: Workflow[] = [
        {
          id: 1,
          title: 'Excel sheet issue Workflow',
          status: 'NEW',
          createdBy: 'Admin',
          date: new Date().toISOString()
        },
        {
          id: 2,
          title: 'Microsoft form fillup Workflow',
          status: 'NEW',
          createdBy: 'Admin',
          date: new Date().toISOString()
        }
      ];

      this.workflowsSubject = new BehaviorSubject<Workflow[]>(defaultData);
      this.saveWorkflows(defaultData);
      this.idCounter = 3;
    }

    this.workflows$ = this.workflowsSubject.asObservable();
  }

  getWorkflows(): Observable<Workflow[]> {
    return this.workflows$;
  }

//returns a single workflow by ID
  getWorkflowById(id: number): Observable<Workflow | undefined>
   {
     return this.workflows$.pipe
     (
        map(workflows => workflows.find(w => w.id === id))
    );
  }

getWorkflowsByRole
(
  role: 'Admin' | 'Manager' | 'Employee'
)
: Observable<Workflow[]> {

  return this.workflows$.pipe(
    map(workflows => {

      if (role === 'Admin') {
        return workflows; // Admin sees all
      }

      if (role === 'Manager') {
        return workflows.filter(w => w.status === 'REQUESTED');
      }

      if (role === 'Employee') {
        return workflows.filter(w => w.status === 'NEW');
      }

      return [];
    })
  );
}



  getWorkflowsByStatus(
    status: WorkflowStatus | 'ALL'   //if status is 'ALL' it will return entire list
  ): Observable<Workflow[]> {

    return this.workflows$.pipe(
      map(workflows =>
        status === 'ALL'
          ? workflows
          : workflows.filter(w => w.status === status)
      )
    );
  }

  getRequestedWorkflows(): Observable<Workflow[]> {
    return this.getWorkflowsByStatus('REQUESTED');
  }

//this will create a new workflow
  addWorkflow(title: string): void {

    const newWorkflow: Workflow = {
      id: this.idCounter++,
      title,
      status: 'NEW',
      createdBy: 'Admin',
      date: new Date().toISOString()
    };

    const updated: Workflow[] = [
      ...this.workflowsSubject.value,
      newWorkflow
    ];

    this.saveWorkflows(updated);
  }

  //this will delete a workflow by ID
  deleteWorkflow(id: number): void {

    const updated: Workflow[] =
      this.workflowsSubject.value.filter(w => w.id !== id);

    this.saveWorkflows(updated);
  }

 
  requestApproval(id: number): void {

    const updated: Workflow[] =
      this.workflowsSubject.value.map(w =>
        w.id === id
          ? {
              ...w,
              status: 'REQUESTED' as WorkflowStatus
            }
          : w
      );

    this.saveWorkflows(updated);
  }


  updateWorkflowStatus(
    id: number,
    status: Extract<WorkflowStatus, 'APPROVED' | 'REJECTED'>,
    comment: string
  ): void 
  {
      const updated: Workflow[] =
      this.workflowsSubject.value.map(w =>
        w.id === id
          ? {
              ...w,
              status,
              managerComments: comment
            }
          : w
      );

    this.saveWorkflows(updated);
  }

  
  private saveWorkflows(workflows: Workflow[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(workflows));
    this.workflowsSubject.next(workflows);
  }
}
