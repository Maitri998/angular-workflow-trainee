import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class LoginComponent {

  //reactive form for inserting username and password
  loginForm: FormGroup;
  errorMsg: string = '';

  constructor(
    private fb: FormBuilder, 
    private auth: AuthService, //this will handle the login validation
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: [''],
      password: ['']
    });
  }

  onLogin() {
    const { username, password } = this.loginForm.value;
    const role = this.auth.login(username, password);

    if (role)
       {
         this.navigateToRoleRoute(role);
       }
     else
       {
         this.errorMsg = 'Invalid credentials';
       }
  }

  private navigateToRoleRoute(role: string) {
    if (role === 'Admin') {
      this.router.navigate(['/workflows/admin']);
    }

    if (role === 'Employee') {
      this.router.navigate(['/workflows/employee']);
    }

    if (role === 'Manager') {
      this.router.navigate(['/workflows/manager']);
    }
  }
}