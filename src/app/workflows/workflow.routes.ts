import { Routes } from '@angular/router';
import { RoleGuard } from '../role.guard';

export const workflowRoutes: Routes =  [
  {

    //will be only accessible to users with 'Admin' role
    path: 'admin',
    loadComponent: () =>
      import('./admin/admin').then(m => m.AdminComponent),
    canActivate: [RoleGuard],
    data: { roles: ['Admin'] }
  },
  {

//will be only accessible to users with 'employee' role
    path: 'employee',
    loadComponent: () =>
      import('./employee/employee').then(m => m.EmployeeComponent),
    canActivate: [RoleGuard],
    data: { roles: ['Employee'] }
  },
{

  //will be only accessible to users with 'manager' role
    path: 'manager',
    loadComponent: () =>
      import('./manager/manager').then(m => m.ManagerComponent),
    canActivate: [RoleGuard],
    data: { roles: ['Manager'] }
  },
{

  //Admin-only route for creating a new workflow
    path: 'admin/new',
    loadComponent: () =>
      import('./workflow-form/workflow-form').then(m => m.WorkflowForm),
    canActivate: [RoleGuard],
    data: { roles: ['Admin'] }
  },
{

  //Workflow detail route accessible to Admin only
    path: ':id',
    loadComponent: () =>
      import('./workflow-detail/workflow-detail').then(m => m.WorkflowDetail),
    canActivate: [RoleGuard],
    data: { roles: ['Admin'] }
  }

];
