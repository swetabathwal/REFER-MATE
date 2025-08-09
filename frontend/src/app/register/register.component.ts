import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  loginForm: FormGroup;
  showLoginForm: boolean = false; // Ensure this is false by default

  constructor(private readonly fb: FormBuilder, private http: HttpClient, private router: Router, private readonly activatedparam: ActivatedRoute) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.activatedparam.queryParams.subscribe(params => {
      const type = params['type'];
      if (type === 'logIn') {
        this.showLoginForm = true; // Show login form if 'type' is 'login'
      }
    })
  }

  get passwordsMatch(): boolean {
    return this.registerForm.get('password')?.value === this.registerForm.get('repeatPassword')?.value;
  }

  get canSubmit(): boolean {
    return this.registerForm.valid && this.passwordsMatch;
  }

  onSubmit() {
    if (this.canSubmit) {
      const { repeatPassword, ...formValue } = this.registerForm.value;
      this.http.post('/api/auth/register', formValue).subscribe(
        (response) => {
          console.log('User registered successfully', response);
          // this.showLoginForm = true; // Show login form after registration
          this.router.navigate(['/profile']); // Navigate to profile after successful registration
        },
        (error) => {
          console.error('Error during registration', error);
        }
      );
    }
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.http.post('/api/auth/login', this.loginForm.value).subscribe(
        (response:any) => {
          console.log('Login successful', response);
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          this.router.navigate(['/profile']); // Navigate to profile after successful login
        },
        (error) => {
          console.error('Login error', error);
        }
      );
    }
  }

  switchToLogin() {
    this.showLoginForm = true;
  }

  switchToRegister() {
    this.showLoginForm = false;
  }
}
