import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { CommonModule } from '@angular/common';
import { environment } from '../../config';

@Component({
  selector: 'app-mfa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './authenticator.component.html',
  styleUrls: ['./authenticator.component.css'],
})
export class MfaComponent {
  mfaForm: FormGroup;
  email!: string;
  mfaToken!: string;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.mfaForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
    this.mfaToken = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.email || !this.mfaToken) {
      Toastify({
        text: 'Datos de autenticación faltantes.',
        duration: 3000,
        backgroundColor: '#FF0000',
      }).showToast();
      this.router.navigate(['/auth/login']);
    }
  }

  verifyMfa() {
    const { code } = this.mfaForm.value;
    const verifyUrl = `${environment.apiUrl}auth/verify-mfa`;

    this.http.post<any>(verifyUrl, { email: this.email, code, token: this.mfaToken }, { withCredentials: true })
      .subscribe({
        next: (response) => {
          const userType = response.userType;

          Toastify({
            text: 'Inicio de sesión exitoso.',
            duration: 3000,
            backgroundColor: '#4CAF50',
          }).showToast();

          this.redirectToViewBasedOnRole(userType); 
        },
        error: (err) => {
          Toastify({
            text: err.error.message || 'Código de autenticación incorrecto o expirado.',
            duration: 3000,
            backgroundColor: '#FF0000',
          }).showToast();
        },
      });
  }
  private redirectToViewBasedOnRole(userType: string) {
    if (userType === 'admin') {
      this.router.navigate(['/admin/documents']).then(() => {
        window.location.reload(); // Recarga la página
      });
    } else if (userType === 'cliente') {
      this.router.navigate(['/home']).then(() => {
        window.location.reload(); // Recarga la página
      });
    } else {
      this.router.navigate(['/auth/login']).then(() => {
        window.location.reload(); // Recarga la página en caso de error o login fallido
      });
    }
  }
}
