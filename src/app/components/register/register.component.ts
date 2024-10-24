import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { environment } from '../../config';
declare var grecaptcha: any;

export function commonPasswordValidator(): ValidatorFn {
  const commonPatterns = ['12345', 'password', 'qwerty', '11111', 'abc123'];

  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.value;
    if (commonPatterns.some(pattern => password.includes(pattern))) {
      return { commonPassword: true };
    }
    return null;
  };
}
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FontAwesomeModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  recaptchaToken: string | null = null;
  registerForm: FormGroup;
  passwordStrengthPercentage: number = 0;
  passwordStrengthClass: string = 'bg-red-500';
  passwordStrengthText: string = 'Débil';
  passwordStrengthClassText: string = 'text-red-500';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  passwordRequirements = {
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false
  };
  
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.registerForm = this.fb.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern('^[a-zA-Z0-9_]+$'), 
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\,.<>/?|])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\,.<>/?|]{8,}$/),
          commonPasswordValidator(),
        ],
      ],      
      confirmPassword: ['', [Validators.required]],
    }, { validator: this.checkPasswords });
    
  }

  ngOnInit(): void {
    this.loadRecaptcha();
  }

  loadRecaptcha() {
    setTimeout(() => {
      if (typeof grecaptcha !== 'undefined') {
        grecaptcha.render('recaptcha-container', {
          'sitekey': '6LdUFV8qAAAAACkMDvyHFVmW9W5EVjMBov_LGyMQ',
          'callback': (response: string) => this.onCaptchaResolved(response)
        });
      }
    }, 500); 
  }
  

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else if (field === 'confirmPassword') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onCaptchaResolved(token: string) {
    this.recaptchaToken = token; 
  }

  checkPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notSame: true };
  }

  onPasswordInput() {
    const password = this.registerForm.get('password')?.value || '';
    this.evaluatePasswordStrength(password);
  }

  evaluatePasswordStrength(password: string) {
    this.passwordRequirements.length = password.length >= 8;
    this.passwordRequirements.uppercase = /[A-Z]/.test(password);
    this.passwordRequirements.lowercase = /[a-z]/.test(password);
    this.passwordRequirements.number = /[0-9]/.test(password);
    this.passwordRequirements.specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const fulfilledRequirements = Object.values(this.passwordRequirements).filter(value => value).length;

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

  onSubmit() {
    if (this.registerForm.valid && this.recaptchaToken) {  
      const { username, email, password } = this.registerForm.value;
      const registerUrl = `${environment.apiUrl}register/Sign-up`;
  
      this.http.post<any>(registerUrl, { 
        username, 
        email, 
        password, 
        recaptchaToken: this.recaptchaToken 
      }).subscribe({
        next: (response) => {
          if (response.message.includes('expuesta')) {
            Toastify({
              text: response.message,
              duration: 5000,
              close: true,
              gravity: 'top',
              position: 'right',
              backgroundColor: '#FF0000',
            }).showToast();
          } else {
            Toastify({
              text: 'Correo de verificacion enviado.',
              duration: 3000,
              close: true,
              gravity: 'top',
              position: 'right',
              backgroundColor: '#4CAF50',
            }).showToast();
            this.router.navigate(['/auth/login']);
          }
        },
        error: (err) => {
          const errorMessage = err.error.message || 'Error en el registro. Por favor, inténtelo de nuevo.';
          Toastify({
            text: errorMessage,  
            duration: 3000,
            close: true,
            gravity: 'top',
            position: 'right',
            backgroundColor: '#FF0000',
          }).showToast();
        }
      });
    } else {
      Toastify({
        text: "Datos inválidos o reCAPTCHA no completado. Por favor, completa los campos correctamente.",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "#FFA500",
      }).showToast();
    }
  }
  

  get f() {
    return this.registerForm.controls;
  }
}
