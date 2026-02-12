import { Routes } from '@angular/router';
import { workflowResolver } from './workflows/workflow.resolver';

export const routes: Routes = [
{
        path: '',
        redirectTo: 'workflows',
        pathMatch: 'full'
    },

    {
        path: 'workflows',
        loadComponent: () => import('./workflows/workflow-list/workflow-list').then(m => m.WorkflowList)
    },
    {
        path: 'workflows/:id',

         loadComponent: () => import('./workflows/workflow-detail/workflow-detail')
         .then(m => m.WorkflowDetail),
         resolve: {
            workflow : workflowResolver
    }
}

    
];
