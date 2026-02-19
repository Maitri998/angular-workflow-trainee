import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Component} from '@angular/core';
import {ReactiveFormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { WorkflowService } from '../workflow.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-workflow-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './workflow-form.html',
  styleUrl: './workflow-form.css'
})

export class WorkflowForm {
//using reactive form group for workflow creation
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private workflowService: WorkflowService,
    private auth: AuthService,
    private router: Router
  )
   {
     this.form = this.fb.group({
      title: ['', Validators.required] //title here is mandatory
    });
  }

  onSubmit() {

  if (this.form.invalid) {
    return;
  }

  //value(i.e. title)  extracted here and the service called
  this.workflowService.addWorkflow(
    this.form.value.title
  );

  this.router.navigate(['/workflows/admin']);
}

}
