import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../config';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormModule } from '@coreui/angular';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

@Component({
  selector: 'app-incidents',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormModule, FormsModule],
  templateUrl: './incidents.component.html',
  styleUrls: ['./incidents.component.css']
})
export class IncidentsComponent implements OnInit {
  logs: string[] = []; 
  filteredLogs: string[] = []; 
  selectedPeriod: string = 'day'; 
  maxLoginAttempts: number = 5; 
  verificationEmailMessage: string = '';
  verificationTokenExpiry: number = 15; 

  private apiUrl = `${environment.apiUrl}admin/incidents/logs`;
  private authApiUrl = `${environment.apiUrl}auth`; 

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchLogs();
    this.fetchMaxLoginAttempts();
    this.fetchVerificationEmailMessage();
    this.fetchTokenExpiry();
  }

  fetchLogs() {
    this.http.get<{ _id: string; dateTime: string; content: string }[]>(this.apiUrl).subscribe(
      (data) => {
        this.logs = data.map(log => `${log.dateTime} - ${log.content}`);
        this.filterLogs(); // Filtra los logs si es necesario
      },
      (error) => {
        console.error('Error al cargar los logs:', error);
        Toastify({
          text: 'Error al cargar los logs',
          duration: 3000,
          backgroundColor: '#FF0000',
        }).showToast();
      }
    );
  }
  

  filterLogs() {
    const now = new Date();
    const oneDayInMillis = 24 * 60 * 60 * 1000; 
    this.filteredLogs = this.logs.filter((log) => {
      if (!log.includes('Cuenta bloqueada')) return false;

      const logDateStr = log.split(' - ')[0]; 
      const logDateParts = logDateStr.split(', ')[0].split('/'); 

      const logDate = new Date(
        parseInt(logDateParts[2], 10), 
        parseInt(logDateParts[1], 10) - 1, 
        parseInt(logDateParts[0], 10) 
      );

      const timeDiff = now.getTime() - logDate.getTime();

      if (this.selectedPeriod === 'day') {
        return timeDiff <= oneDayInMillis; 
      } else if (this.selectedPeriod === 'week') {
        return timeDiff <= 7 * oneDayInMillis; 
      } else if (this.selectedPeriod === 'month') {
        return timeDiff <= 30 * oneDayInMillis; 
      }

      return false;
    });
  }

  fetchMaxLoginAttempts() {
    this.http.get<{ maxAttempts: number }>(`${this.authApiUrl}/max-login-attempts`).subscribe(
      (response) => {
        this.maxLoginAttempts = response.maxAttempts;
      },
      (error) => {
        console.error('Error al obtener el valor de intentos de inicio de sesión:', error);
        Toastify({
          text: 'Error al obtener el valor de intentos de inicio de sesión',
          duration: 3000,
          backgroundColor: '#FF0000',
        }).showToast();
      }
    );
  }

  updateMaxLoginAttempts() {
    this.http.patch(`${this.authApiUrl}/max-login-attempts`, { maxAttempts: this.maxLoginAttempts }).subscribe(
      (response: any) => {
        Toastify({
          text: response.message,
          duration: 3000,
          backgroundColor: '#4CAF50',
        }).showToast();
      },
      (error) => {
        console.error('Error al actualizar el valor de intentos de inicio de sesión:', error);
        Toastify({
          text: 'Error al actualizar el valor de intentos de inicio de sesión',
          duration: 3000,
          backgroundColor: '#FF0000',
        }).showToast();
      }
    );
  }

  // Actualiza el endpoint y la estructura para obtener el mensaje del email
  fetchVerificationEmailMessage() {
    this.http.get<{ message: string }>(`${this.authApiUrl}/verification-email-message`).subscribe(
      (response) => {
        this.verificationEmailMessage = response.message;
      },
      (error) => {
        console.error('Error al cargar el mensaje del correo:', error);
        Toastify({
          text: 'Error al cargar el mensaje del correo',
          duration: 3000,
          backgroundColor: '#FF0000',
        }).showToast();
      }
    );
  }

  updateVerificationEmailMessage() {
    const body = { newMessage: this.verificationEmailMessage };
    this.http.patch(`${this.authApiUrl}/update-verification-email-message`, body).subscribe(
      (response: any) => {
        Toastify({
          text: response.message,
          duration: 3000,
          backgroundColor: '#4CAF50',
        }).showToast();
      },
      (error) => {
        console.error('Error al actualizar el mensaje del correo:', error);
        Toastify({
          text: 'Error al actualizar el mensaje del correo',
          duration: 3000,
          backgroundColor: '#FF0000',
        }).showToast();
      }
    );
  }

  // Cambia el endpoint para obtener el tiempo de expiración del token
  fetchTokenExpiry() {
    this.http.get<{ expiry: number }>(`${this.authApiUrl}/verification-token-expiry`)
      .subscribe(
        (data) => {
          this.verificationTokenExpiry = data.expiry;
        },
        (error) => {
          console.error('Error al cargar el tiempo de expiración del token:', error);
          Toastify({
            text: 'Error al cargar el tiempo de expiración del token',
            duration: 3000,
            backgroundColor: '#FF0000',
          }).showToast();
        }
      );
  }

  updateTokenExpiry() {
    const body = { newExpiry: this.verificationTokenExpiry };
    this.http.patch(`${this.authApiUrl}/update-token-expiry`, body)
      .subscribe(
        (response: any) => {
          Toastify({
            text: response.message,
            duration: 3000,
            backgroundColor: '#4CAF50',
          }).showToast();
        },
        (error) => {
          console.error('Error al actualizar el tiempo de expiración del token:', error);
          Toastify({
            text: 'Error al actualizar el tiempo de expiración del token',
            duration: 3000,
            backgroundColor: '#FF0000',
          }).showToast();
        }
      );
  }
}
