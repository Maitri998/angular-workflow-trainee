import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, delay } from "rxjs";
import { Workflow } from "./workflow.model";

@Injectable({
    providedIn: "root" 
})

export class WorkflowService {
    constructor(private http: HttpClient) {}

getWorkflows(): Observable<Workflow[]> {
        return this.http
        .get<Workflow[]>('assets/workflows.json')
        .pipe( delay(1300));
    }
}


