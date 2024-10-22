import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../config';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormModule } from '@coreui/angular';

@Component({
  selector: 'app-incidents',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormModule, FormsModule],
  templateUrl: './incidents.component.html',
  styleUrls: ['./incidents.component.css']
})
export class IncidentsComponent implements OnInit {
  logs: string[] = []; // Arreglo para almacenar todos los logs
  filteredLogs: string[] = []; // Arreglo para almacenar los logs filtrados
  selectedPeriod: string = 'day'; // Periodo seleccionado por defecto
  maxLoginAttempts: number = 5; // Valor por defecto del número máximo de intentos

  private apiUrl = `${environment.apiUrl}admin/incidents/logs`;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchLogs(); // Cargar los logs al iniciar el componente
    this.fetchMaxLoginAttempts(); // Cargar el valor de intentos de inicio de sesión
  }

  // Función para cargar los logs desde el backend
  fetchLogs() {
    this.http.get<string[]>(this.apiUrl).subscribe(
      (data) => {
        this.logs = data;
        this.filterLogs(); // Filtrar los logs después de cargarlos
      },
      (error) => {
        console.error('Error al cargar los logs:', error);
      }
    );
  }

  // Función para filtrar los logs según el periodo seleccionado
  filterLogs() {
    const now = new Date(); // Fecha actual
    const oneDayInMillis = 24 * 60 * 60 * 1000; // Milisegundos en un día

    // Filtramos los logs para encontrar solo aquellos que contienen 'Cuenta bloqueada'
    this.filteredLogs = this.logs.filter((log) => {
      if (!log.includes('Cuenta bloqueada')) return false; // Solo tomar los logs que mencionan 'Cuenta bloqueada'

      // Extraer la fecha del log (formato "22/10/2024, 00:14:24")
      const logDateStr = log.split(' - ')[0]; // Obtener la parte de la fecha del log
      const logDateParts = logDateStr.split(', ')[0].split('/'); // Dividir día, mes y año

      const logDate = new Date(
        parseInt(logDateParts[2], 10), // Año
        parseInt(logDateParts[1], 10) - 1, // Mes (0 indexado)
        parseInt(logDateParts[0], 10) // Día
      );

      const timeDiff = now.getTime() - logDate.getTime();

      if (this.selectedPeriod === 'day') {
        return timeDiff <= oneDayInMillis; 
      } else if (this.selectedPeriod === 'week') {
        return timeDiff <= 7 * oneDayInMillis; // Última semana
      } else if (this.selectedPeriod === 'month') {
        return timeDiff <= 30 * oneDayInMillis; // Último mes
      }

      return false;
    });
  }
  fetchMaxLoginAttempts() {
    this.http.get<{ maxAttempts: number }>(`${environment.apiUrl}auth/max-login-attempts`).subscribe(
      (response) => {
        this.maxLoginAttempts = response.maxAttempts;
      },
      (error) => {
        console.error('Error al obtener el valor de intentos de inicio de sesión:', error);
      }
    );
  }

  updateMaxLoginAttempts() {
    this.http.patch(`${environment.apiUrl}auth/max-login-attempts`, { maxAttempts: this.maxLoginAttempts }).subscribe(
      (response: any) => {
        alert(response.message);
      },
      (error) => {
        console.error('Error al actualizar el valor de intentos de inicio de sesión:', error);
      }
    );
  }
}
