// category-products.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../config';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './category-products.component.html',
  styleUrls: ['./category-products.component.css']
})
export class CategoryProductsComponent implements OnInit {
  products: any[] = [];
  categoryName: string | null = null;
  colors: any[] = [];
  brands: any[] = [];
  minPrice: number | null = null;
  maxPrice: number | null = null;
  selectedBrand: number | null = null;
  selectedColor: number | null = null;
  private apiUrl = `${environment.apiUrl}products/by-category/`;

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.categoryName = params.get('name');
      if (this.categoryName) {
        this.loadProducts();
      }
    });
    this.loadBrands();
    this.loadColors();
  }

  loadProducts() {
    console.log('Filtros aplicados:', {
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      selectedBrand: this.selectedBrand,
      selectedColor: this.selectedColor,
    });

    let url = `${this.apiUrl}${this.categoryName}`;
    let params = [];
    if (this.minPrice !== null) params.push(`minPrice=${this.minPrice}`);
    if (this.maxPrice !== null) params.push(`maxPrice=${this.maxPrice}`);
    if (this.selectedBrand !== null) params.push(`brandId=${this.selectedBrand}`);
    if (this.selectedColor !== null) params.push(`colorId=${this.selectedColor}`);

    if (params.length > 0) {
      url += '?' + params.join('&');
    }


    console.log('URL con filtros aplicados:', url);  // Verificar URL

    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
      }
    });
  }


  loadBrands() {
    this.http.get<any[]>(`${environment.apiUrl}products/brands`).subscribe({
      next: (data) => {
        this.brands = data;
      },
      error: (err) => {
        console.error('Error al cargar marcas:', err);
      }
    });
  }

  loadColors() {
    this.http.get<any[]>(`${environment.apiUrl}products/colors`).subscribe({
      next: (data) => {
        this.colors = data;
      },
      error: (err) => {
        console.error('Error al cargar colores:', err);
      }
    });
  }

  // Método para obtener el nombre de la marca seleccionada
  getSelectedBrandName(): string | undefined {
    return this.brands.find(brand => brand.id === this.selectedBrand)?.name;
  }

  // Método para obtener el nombre del color seleccionado
  getSelectedColorName(): string | undefined {
    return this.colors.find(color => color.id === this.selectedColor)?.name;
  }

  clearFilters() {
    console.log('Filtros antes de limpiar:', {
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      selectedBrand: this.selectedBrand,
      selectedColor: this.selectedColor,
    });

    this.minPrice = null;
    this.maxPrice = null;
    this.selectedBrand = null;
    this.selectedColor = null;

    console.log('Filtros después de limpiar:', {
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      selectedBrand: this.selectedBrand,
      selectedColor: this.selectedColor,
    });

    this.loadProducts();  // Recargar productos con filtros vacíos
  }

}
