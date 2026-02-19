import { Routes } from '@angular/router';

export const routes: Routes = [

      {
         path: '',
        redirectTo: 'login',
        pathMatch: 'full' //ensures exact match of empty path
     },

  {

    //Login Route (Lazy Loaded Component)
    path: 'login',
    loadComponent: () =>
   import('./workflows/login/login').then(m => m.LoginComponent)
  },

    {

     // Workflows Feature Routes (Lazy Loaded)
        path: 'workflows',
        loadChildren: () =>
        import('./workflows/workflow.routes').then(m => m.workflowRoutes)
    },

];
