import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../config';
import { CommonModule } from '@angular/common';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
@Component({
  selector: 'app-passwordRequest',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './passwordRequest.component.html',
  styleUrls: ['./passwordRequest.component.css']
})
export class PasswordRequestComponent{
  requestForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.requestForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  requestPasswordReset() {
    const passwordUrl = `${environment.apiUrl}auth/request-reset-password`;

    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      Toastify({
        text: 'Por favor, ingresa un correo válido.',
        duration: 3000,
        close: true,
        gravity: 'top',
        position: 'right',
        backgroundColor: '#FFA500',
      }).showToast();
      return;
    }

    const email = this.requestForm.value.email;
    this.http.post(passwordUrl, { email }).subscribe({
      next: () => {
        Toastify({
          text: 'Se ha enviado el enlace de restablecimiento. Revisa tu correo.',
          duration: 3000,
          close: true,
          gravity: 'top',
          position: 'right',
          backgroundColor: '#4CAF50',
        }).showToast();
      },
      error: (err) => {
        Toastify({
          text: `Error al enviar el enlace: ${err.error.message || 'Error desconocido'}`,
          duration: 3000,
          close: true,
          gravity: 'top',
          position: 'right',
          backgroundColor: '#FF0000',
        }).showToast();
      },
    });
  }

}
