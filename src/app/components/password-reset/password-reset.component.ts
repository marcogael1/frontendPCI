import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { environment } from '../../config';
@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, RouterModule],
  templateUrl: './password-reset.component.html',
})
export class PasswordResetComponent implements OnInit {
  resetForm: FormGroup;
  token: string | null = null;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  passwordStrengthPercentage: number = 0;
  passwordStrengthClass: string = 'bg-red-500';
  passwordStrengthText: string = 'Débil';
  passwordStrengthClassText: string = 'text-red-500';
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    this.resetForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern('^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};\'":,.<>/?|]*$'),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.checkPasswords }
    );
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      Toastify({
        text: 'Token no válido o faltante.',
        backgroundColor: '#FF0000',
      }).showToast();
      this.router.navigate(['/']);
    }
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  checkPasswords(group: FormGroup): { notSame: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notSame: true };
  }

  onPasswordInput(): void {
    const password = this.resetForm.get('password')?.value || '';
    this.evaluatePasswordStrength(password);
  }

  evaluatePasswordStrength(password: string): void {
    const length = password.length >= 8;
    const uppercase = /[A-Z]/.test(password);
    const lowercase = /[a-z]/.test(password);
    const number = /[0-9]/.test(password);
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const fulfilledRequirements = [length, uppercase, lowercase, number, specialChar].filter(Boolean).length;
    this.passwordStrengthPercentage = (fulfilledRequirements / 5) * 100;

    if (this.passwordStrengthPercentage < 40) {
      this.passwordStrengthClass = 'bg-red-500';
      this.passwordStrengthText = 'Débil';
      this.passwordStrengthClassText = 'text-red-500';
    } else if (this.passwordStrengthPercentage < 80) {
      this.passwordStrengthClass = 'bg-yellow-500';
      this.passwordStrengthText = 'Media';
      this.passwordStrengthClassText = 'text-yellow-500';
    } else {
      this.passwordStrengthClass = 'bg-green-500';
      this.passwordStrengthText = 'Fuerte';
      this.passwordStrengthClassText = 'text-green-500';
    }
  }

  resetPassword(): void {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    const { currentPassword, password } = this.resetForm.value;
    const url = `${environment.apiUrl}auth/reset-password`;

    this.http.patch(url, { token: this.token, currentPassword, newPassword: password }).subscribe({
      next: () => {
        Toastify({
          text: 'Contraseña cambiada con éxito.',
          backgroundColor: '#4CAF50',
        }).showToast();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        Toastify({
          text: `${err.error.message}`,
          backgroundColor: '#FF0000',
        }).showToast();
      },
    });
  }
}
