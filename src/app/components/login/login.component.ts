import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../config';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { Auth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service'; 
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FontAwesomeModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  isGoogleLogin = false;
  showPassword = false;
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private auth: Auth,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  onSubmit() {
    const { email, password } = this.loginForm.value;
    const loginUrl = `${environment.apiUrl}auth/login`;

    this.isGoogleLogin = false;
    this.http.post<any>(loginUrl, { email, password }, { withCredentials: true })
      .subscribe({
        next: (response) => {
          if (response.mfaRequired) {
            this.router.navigate(['/mfa'], { queryParams: { email, token: response.mfaToken } });
            Toastify({
              text: 'Código de autenticación enviado. Verifica tu correo.',
              duration: 3000,
              backgroundColor: '#4CAF50',
            }).showToast();
          } else {
            this.authService.setUserType(response.userType);
            this.redirectToHome();
          }
        },
        error: (err) => {
          Toastify({
            text: err.error.message || 'Error en el inicio de sesión.',
            duration: 3000,
            backgroundColor: '#FF0000',
          }).showToast();
        },
      });
  }

  private redirectToHome() {
    const userType = this.authService.getUserType();
    console.log(userType)
    if (userType === 'admin') {
      this.router.navigate(['/admin-dashboard']);
    } else {
      this.router.navigate(['/home']);
    }
  }

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    this.isGoogleLogin = true;

    signInWithPopup(this.auth, provider)
      .then(() => {
        Toastify({
          text: 'Inicio de sesión con Google exitoso.',
          duration: 3000,
          backgroundColor: '#4CAF50',
        }).showToast();
        this.redirectToHome();
      })
      .catch(() => {
        this.isGoogleLogin = false;
        Toastify({
          text: 'Error en el inicio de sesión con Google.',
          duration: 3000,
          backgroundColor: '#FF0000',
        }).showToast();
      });
  }
}
