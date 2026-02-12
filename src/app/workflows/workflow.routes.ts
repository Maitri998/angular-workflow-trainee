import { Routes } from "@angular/router";
import { WorkflowList } from "./workflow-list/workflow-list";
import { WorkflowDetail } from "./workflow-detail/workflow-detail";
import { workflowResolver } from "./workflow.resolver";

export const workflowRoutes: Routes = [
    {
        path: '',
        component: WorkflowList
    },
    {
        path: ':id',
        component: WorkflowDetail,
        resolve: {  
            workflow: workflowResolver
        }
    }
];
