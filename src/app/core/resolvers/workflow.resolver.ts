import { Injectable, inject } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Workflow } from '../models/workflow.model';
import { WorkflowService } from '../services/workflow.service';


 //Resolver use karege sara data load hoga phele se hi(route ke activate hone se phele) jab component aayega
 
@Injectable({ providedIn: 'root' })
export class WorkflowResolver implements Resolve<Workflow[]> {
  private workflowService = inject(WorkflowService);

  resolve(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): Observable<Workflow[]> {
    this.workflowService.init();
    return this.workflowService.workflows$;
  }
}
