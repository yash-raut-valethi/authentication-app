import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  inject
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterOutlet
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);

  private readonly API_URL = 'http://localhost:8080/auth';

  isRegisterMode = false;
  isLoading = false;

  errorMessage = '';
  successMessage = '';

  loginForm: FormGroup = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    password: [
      '',
      [
        Validators.required
      ]
    ]
  });

  registerForm: FormGroup = this.fb.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(2)
      ]
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    password: [
      '',
      [
        Validators.required
      ]
    ]
  });

  get loginEmail() {
    return this.loginForm.get('email');
  }

  get loginPassword() {
    return this.loginForm.get('password');
  }

  get registerName() {
    return this.registerForm.get('name');
  }

  get registerEmail() {
    return this.registerForm.get('email');
  }

  get registerPassword() {
    return this.registerForm.get('password');
  }

  get isHomePage(): boolean {
    return this.router.url === '/home';
  }

  showRegister(): void {
    this.isRegisterMode = true;
    this.clearMessages();
    this.registerForm.reset();
    this.cdr.detectChanges();
  }

  showLogin(): void {
    this.isRegisterMode = false;
    this.clearMessages();
    this.loginForm.reset();
    this.cdr.detectChanges();
  }

  login(): void {

    this.clearMessages();

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.cdr.detectChanges();
      return;
    }

    const loginData = this.loginForm.getRawValue();

    console.log(
      'Sending login request:',
      {
        email: loginData.email
      }
    );

    this.isLoading = true;

    this.cdr.detectChanges();

    this.http
      .post(
        `${this.API_URL}/login`,
        loginData,
        {
          responseType: 'text'
        }
      )
      .subscribe({

        next: (response: string) => {

          console.log(
            'Login successful:',
            response
          );

          this.isLoading = false;

          this.errorMessage = '';

          this.successMessage =
            response || 'Login Successful';

          localStorage.setItem(
            'isLoggedIn',
            'true'
          );

          localStorage.setItem(
            'user',
            JSON.stringify({
              email: loginData.email
            })
          );

          this.cdr.detectChanges();

          console.log(
            'Navigating to /home...'
          );

          this.router.navigateByUrl('/home')
            .then((success) => {

              console.log(
                'Navigation result:',
                success
              );

              if (!success) {
                console.error(
                  'Angular could not navigate to /home.'
                );
              }

            })
            .catch((error) => {

              console.error(
                'Navigation error:',
                error
              );

            });

        },

        error: (error) => {

          console.error(
            'Login error:',
            error
          );

          let message = '';

          if (
            typeof error?.error === 'string'
          ) {

            message = error.error;

          } else if (
            error?.error?.message
          ) {

            message = error.error.message;

          } else {

            message =
              'Login failed. Please check your email and password.';

          }

          message =
            message.replace(
              /^Error:\s*/i,
              ''
            );

          this.isLoading = false;

          this.successMessage = '';

          this.errorMessage = message;

          this.cdr.detectChanges();

        }

      });
  }

  register(): void {

    this.clearMessages();

    if (this.registerForm.invalid) {

      this.registerForm.markAllAsTouched();

      this.cdr.detectChanges();

      return;
    }

    const registerData =
      this.registerForm.getRawValue();

    console.log(
      'Sending registration request:',
      {
        name: registerData.name,
        email: registerData.email
      }
    );

    this.isLoading = true;

    this.cdr.detectChanges();

    this.http
      .post(
        `${this.API_URL}/register`,
        registerData,
        {
          responseType: 'text'
        }
      )
      .subscribe({

        next: (response: string) => {

          console.log(
            'Registration successful:',
            response
          );

          this.isLoading = false;

          this.errorMessage = '';

          this.successMessage =
            response ||
            'Registration successful.';

          this.registerForm.reset();

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Registration error:',
            error
          );

          let message = '';

          if (
            typeof error?.error === 'string'
          ) {

            message = error.error;

          } else if (
            error?.error?.message
          ) {

            message = error.error.message;

          } else {

            message =
              'Registration failed. Please try again.';

          }

          message =
            message.replace(
              /^Error:\s*/i,
              ''
            );

          this.isLoading = false;

          this.successMessage = '';

          this.errorMessage = message;

          this.cdr.detectChanges();

        }

      });
  }

  logout(): void {

    localStorage.removeItem(
      'isLoggedIn'
    );

    localStorage.removeItem(
      'user'
    );

    this.router.navigateByUrl('/');

  }

  private clearMessages(): void {

    this.errorMessage = '';
    this.successMessage = '';

  }
}
