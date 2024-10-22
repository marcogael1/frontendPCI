import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { environment } from '../../../config';
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
  isModalOpen = false;
  isEditing = false;
  isViewing = false;
  documentForm: FormGroup;
  currentDocument: any = null;
  private apiUrl = `${environment.apiUrl}admin/information`;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.documentForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
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
      }
    );
  }

  filterDocuments() {
    if (this.selectedFilter === 'all') {
      this.filteredDocuments = this.companyDocuments.filter(doc => !doc.isDeleted);
    } else if (this.selectedFilter === 'vigente') {
      this.filteredDocuments = this.companyDocuments.filter(doc => !doc.isDeleted && doc.isCurrentVersion);
    } else if (this.selectedFilter === 'no-vigente') {
      this.filteredDocuments = this.companyDocuments.filter(doc => !doc.isDeleted && !doc.isCurrentVersion);
    } else if (this.selectedFilter === 'eliminado') {
      this.filteredDocuments = this.companyDocuments.filter(doc => doc.isDeleted);
    }
  }

  addNewDocument() {
    this.isEditing = false;
    this.documentForm.reset();
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
    const formData = this.documentForm.value;

    this.http.post(`${this.apiUrl}`, formData).subscribe(
      (response) => {
        console.log('Documento procesado con éxito');
        this.closeModal();
        this.loadCompanyDocuments();
      },
      (error) => {
        console.error('Error al procesar el documento:', error);
      }
    );
  }

  deleteDocument(document: any) {
    if (confirm(`¿Estás seguro de que deseas eliminar el documento: ${document.title}?`)) {
      this.http.delete(`${this.apiUrl}/${document._id}`).subscribe(
        (response) => {
          console.log('Documento eliminado con éxito');
          this.loadCompanyDocuments();
        },
        (error) => {
          console.error('Error al eliminar el documento:', error);
        }
      );
    }
  }

  formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  // Función para establecer un documento como "Vigente"
  setAsCurrentVersion(document: any) {
    if (confirm(`¿Estás seguro de que deseas establecer este documento como la versión vigente?`)) {
      this.http.put(`${this.apiUrl}/set-current/${document._id}`, {}).subscribe(
        (response) => {
          console.log('Documento establecido como vigente');
          this.loadCompanyDocuments(); // Volver a cargar los documentos
        },
        (error) => {
          console.error('Error al establecer el documento como vigente:', error);
        }
      );
    }
  }
}
