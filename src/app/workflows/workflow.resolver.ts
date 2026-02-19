import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { Workflow } from "./workflow.model";
import { WorkflowService } from "./workflow.service";
import { map, tap, first } from "rxjs";


export const workflowResolver: ResolveFn<Workflow | undefined> //this will ensure that the component receives resolved data instead of fetching manually
 = (route) => {
    const service = inject(WorkflowService);
    const id = Number(route.paramMap.get('id')); // this will extract workflow ID from route parameter and convert to number

    console.log('Resolver searching for ID:', id);

    return service.getWorkflows().pipe(

        first(), //this will take the first value from the observable and automatically stop listening

        map(workflows => workflows.find(w => w.id === id)),
        tap(result => {
            if (!result) 
                {
                console.error('Resolver did not find workflow with ID:', id);
                } 
            else
                 {
                console.log('Resolver found workflow:', result);
                 }
        })
    );
}


