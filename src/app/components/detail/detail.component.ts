import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../config';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  product: any = {
    qrCodeImage: 'qrcode.png', 
    sku: '9P7K7LA',
    additionalImages: [
      'audis2.jpg',
      'audis3.jpg',
      'audis4.jpg',
    ],
    originalPrice: 9678,
    discountedPrice: 8299,
    discount: 0.14,
    stock: 1,
  };

  stars = [1, 2, 3, 4, 5];
  private apiUrl = `${environment.apiUrl}products/by-name/`;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const productName = params.get('name');
      if (productName) {
        this.loadProduct(productName);
      }
    });
  }

  loadProduct(name: string) {
    this.http.get<any>(`${this.apiUrl}${name}`).subscribe({
      next: (data) => {
        this.product = {
          ...this.product,
          name: data.name,
          description: data.description,
          image_url: data.image_url,
          price: data.price,
          stock: data.stock,
          combinedNameDescription: `${data.name} - ${data.description}`
        };
      },
      error: (err) => {
        console.error('Error al cargar producto:', err);
      }
    });
  }

  addToCart() {
    alert('Producto agregado al carrito');
  }
}
