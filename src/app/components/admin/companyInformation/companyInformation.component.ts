import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { environment } from '../../../config';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

function noCodeValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const forbidden = /[<>\/{}()=;]|<script|<\/script>/i.test(control.value);
    return forbidden ? { 'noCode': { value: control.value } } : null;
  };
}

@Component({
  selector: 'app-companyInformation',
  templateUrl: './companyInformation.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  styleUrls: ['./companyInformation.component.css']
})
export class CompanyInformationComponent implements OnInit {
  companyDocuments: any[] = [];
  filteredDocuments: any[] = [];
  selectedFilter: string = 'all'; 
  selectedDocumentType: string = 'all'; 
  isModalOpen = false;
  isEditing = false;
  isViewing = false;
  documentForm: FormGroup;
  currentDocument: any = null;
  private apiUrl = `${environment.apiUrl}admin/information`;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.documentForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', [Validators.required, noCodeValidator()]],
    });
  }

  ngOnInit(): void {
    this.loadCompanyDocuments();
  }

  
  loadCompanyDocuments() {
    this.http.get<any[]>(`${this.apiUrl}`).subscribe(
      (data) => {
        this.companyDocuments = data;
        this.filterDocuments();
      },
      (error) => {
        console.error('Error al cargar los documentos:', error);
        Toastify({
          text: 'Error al cargar los documentos',
          duration: 3000,
          backgroundColor: '#FF0000',
        }).showToast();
      }
    );
  }

  filterDocuments() {
    let filteredByType = this.companyDocuments;
    if (this.selectedDocumentType !== 'all') {
      filteredByType = filteredByType.filter(doc => doc.title === this.selectedDocumentType);
    }

    if (this.selectedFilter === 'all') {
      this.filteredDocuments = filteredByType.filter(doc => !doc.isDeleted);
    } else if (this.selectedFilter === 'vigente') {
      this.filteredDocuments = filteredByType.filter(doc => !doc.isDeleted && doc.isCurrentVersion);
    } else if (this.selectedFilter === 'no-vigente') {
      this.filteredDocuments = filteredByType.filter(doc => !doc.isDeleted && !doc.isCurrentVersion);
    } else if (this.selectedFilter === 'eliminado') {
      this.filteredDocuments = filteredByType.filter(doc => doc.isDeleted);
    }
  }

  addNewDocument() {
    this.isEditing = false;
    this.documentForm.reset();
    this.documentForm.get('title')?.enable();
    this.isModalOpen = true;
  }

  editDocument(document: any) {
    this.isEditing = true;
    this.currentDocument = document;
    this.documentForm.patchValue({
      title: document.title,
      content: document.content,
      effectiveDate: document.effectiveDate.split('T')[0],
    });
    this.documentForm.get('title')?.disable();
    this.isModalOpen = true;
  }

  viewDocumentDetails(document: any) {
    this.isViewing = true;
    this.currentDocument = document;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.isViewing = false;
    this.isEditing = false;
  }

  onSubmit() {
    const formData = this.documentForm.getRawValue(); 
    this.http.post(`${this.apiUrl}`, formData).subscribe(
      (response) => {
        Toastify({
          text: 'Documento procesado con éxito',
          duration: 3000,
          backgroundColor: '#4CAF50',
        }).showToast();
        this.closeModal();
        this.loadCompanyDocuments();
      },
      (error) => {
        console.error('Error al procesar el documento:', error);
        Toastify({
          text: 'Error al procesar el documento',
          duration: 3000,
          backgroundColor: '#FF0000',
        }).showToast();
      }
    );
  }
  
  

  deleteDocument(document: any) {
    if (confirm(`¿Estás seguro de que deseas eliminar el documento: ${document.title}?`)) {
      this.http.delete(`${this.apiUrl}/${document._id}`).subscribe(
        (response) => {
          Toastify({
            text: 'Documento eliminado con éxito',
            duration: 3000,
            backgroundColor: '#4CAF50',
          }).showToast();
          this.loadCompanyDocuments();
        },
        (error) => {
          console.error('Error al eliminar el documento:', error);
          Toastify({
            text: 'Error al eliminar el documento',
            duration: 3000,
            backgroundColor: '#FF0000',
          }).showToast();
        }
      );
    }
  }

  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  setAsCurrentVersion(document: any) {
    if (confirm(`¿Estás seguro de que deseas establecer este documento como la versión vigente?`)) {
      this.http.put(`${this.apiUrl}/set-current/${document._id}`, {}).subscribe(
        (response) => {
          Toastify({
            text: 'Documento establecido como vigente',
            duration: 3000,
            backgroundColor: '#4CAF50',
          }).showToast();
          this.loadCompanyDocuments(); 
        },
        (error) => {
          console.error('Error al establecer el documento como vigente:', error);
          Toastify({
            text: 'Error al establecer el documento como vigente',
            duration: 3000,
            backgroundColor: '#FF0000',
          }).showToast();
        }
      );
    }
  }
}
