import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../config';
import { RouterModule, } from '@angular/router';
import { Router } from '@angular/router';
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  reviews: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
}


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeNoSessionComponent implements OnInit {
  categories: Category[] = [];
  
  private categoriesApiUrl = `${environment.apiUrl}categories`;  // URL para obtener categorías desde el backend

  slides = [
    { image_url: 'PCI2.jpg' },
    { image_url: 'PCI1.png' },
    { image_url: 'PCI3.jpg' }
  ];

  featuredCategories = [
    {
      name: 'Tarjetas de Video',
      image_url: 'https://hiraoka.com.pe/media/mageplaza/blog/post/t/a/tarjeta-grafica-que-es-para-que-sirve-como-funciona.jpg',
      reviews: 10
    },
    {
      name: 'Laptops',
      image_url: 'https://media.gq.com.mx/photos/61e70ca25def32c5619cef06/16:9/w_1920,c_limit/Lenovo%20Yoga%20Slim%207%20Pro.jpg',
      reviews: 10
    },
    {
      name: 'Monitores',
      image_url: 'https://img.global.news.samsung.com/latin/wp-content/uploads/2018/10/monitor1_1.png',
      reviews: 10
    },
    {
      name: 'Tóner',
      image_url: 'https://http2.mlstatic.com/D_NQ_NP_2X_814283-MLU69671544485_052023-F.webp',
      reviews: 10
    }
  ];
  Products = [
    {
      name: 'Disco Duro Interno Seagate Barracuda 3.5"',
      imageUrl: 'https://http2.mlstatic.com/D_NQ_NP_2X_869449-MLU74996449781_032024-F.webp',
      reviews: 1575
    },
    {
      name: 'Gabinete Balam Rush THINOS con Ventana',
      imageUrl: 'https://i5.walmartimages.com.mx/mg/gm/3pp/asr/58fb2a0a-2bf9-4e57-b720-e06c86da0cdc.4d7c837f57202a29ff3ef3b5d82a58e8.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF',
      reviews: 44
    },
    {
      name: 'Fuente de Poder XPG CORE REACTOR 80 PLUS Gold',
      imageUrl: 'https://m.media-amazon.com/images/I/91tzDiqwkRL.__AC_SX300_SY300_QL70_ML2_.jpg',
      reviews: 261
    },
    {
      name: 'Procesadores Intel Core i3-12100',
      imageUrl: 'https://m.media-amazon.com/images/I/51Xik7NRvJL._AC_SL1500_.jpg',
      reviews: 11
    }
  ];
  featuredProducts: Product[] = [];

  breakpoints = {
    320: { slidesPerView: 1 },  
    640: { slidesPerView: 2 },  
    1024: { slidesPerView: 3 }, 
    1280: { slidesPerView: 3 }  
  };

  breakpoints2 = {
    320: { slidesPerView: 1 },  
    640: { slidesPerView: 2 },  
    1024: { slidesPerView: 3 }, 
    1280: { slidesPerView: 4 }  
  };
  

  private apiUrl = `${environment.apiUrl}products`;  // URL para productos destacados del día

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    register();
    this.loadFeaturedProducts();
    this.loadCategories();
  }

  loadFeaturedProducts() {
    this.getFeaturedProducts().subscribe({
      next: (data) => {
        this.featuredProducts = data;
      },
      error: (err) => {
        console.error('Error al cargar productos destacados:', err);
      }
    });
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

  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }
  navigateToCategory(categoryName: string) {
    this.router.navigate(['/category', categoryName]);
  }
}
