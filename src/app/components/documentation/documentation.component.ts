import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../config';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-documentation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.css']
})
export class DocumentationComponent implements OnInit {
  documentTitle: string | null = null;
  documentContent: any = null;

  private apiUrl = `${environment.apiUrl}admin/information`;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.documentTitle = params.get('title');
      if (this.documentTitle) {
        this.loadDocument();
      }
    });
  }

  loadDocument(): void {
    this.http.get<any[]>(`${this.apiUrl}`).subscribe(
      (documents) => {
        const document = documents.find(doc => 
          doc.title === this.documentTitle && doc.isCurrentVersion && !doc.isDeleted
        );
        if (document) {
          this.documentContent = document.content;
        } else {
          this.documentContent = 'Documento no encontrado o no vigente.';
        }
      },
      (error) => {
        console.error('Error al cargar el documento:', error);
        this.documentContent = 'Error al cargar el documento.';
      }
    );
  }
}
