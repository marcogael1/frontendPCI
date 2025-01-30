import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../config';
import { CommonModule } from '@angular/common';

interface Category {
  id: number;
  name: string;
  description: string;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports:[CommonModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  private categoriesApiUrl = `${environment.apiUrl}categories`;  

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
      }
    });
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesApiUrl);
  }

  navigateToCategory(categoryName: string) {
    this.router.navigate(['/category', categoryName]);
  }
}
