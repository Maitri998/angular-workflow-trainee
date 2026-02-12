import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { Workflow } from "./workflow.model";
import { WorkflowService } from "./workflow.service";
import { map } from "rxjs";



export const workflowResolver: ResolveFn<Workflow>
 = (route) => {
    const service = inject(WorkflowService);
    const id = Number(route.paramMap.get('id'));

    return service.getWorkflows().pipe(

        map(workflows => workflows.find(w => w.id === id)!)
    );
}


