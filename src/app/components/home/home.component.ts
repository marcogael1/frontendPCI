import { Component , CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';
import { CarouselModule, CarouselComponent, CarouselControlComponent, CarouselIndicatorsComponent, CarouselInnerComponent, CarouselItemComponent } from '@coreui/angular';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent {
  ngOnInit() {
    register();  
  }
  breakpoints = {
    640: { slidesPerView: 1 },
    1024: { slidesPerView: 3 }
  };
  breakpoints2 = {
    640: { slidesPerView: 1 },
    1024: { slidesPerView: 4 }
  };
  categories = [
    { name: 'Computadoras' },
    { name: 'Celulares y Telefonía' },
    { name: 'Cómputo (Hardware)' },
    { name: 'Apple' },
    { name: 'Seguridad y Vigilancia' },
    { name: 'Hogar' },
    { name: 'Home Office' },
    { name: 'Software y Servicios' }
  ];

  slides = [
    { imageUrl: 'PCI2.jpg' },
    { imageUrl: 'PCI1.png' },
    { imageUrl: 'PCI3.jpg' }
  ];

  products = [
    {
      id: 1,
      name: 'Laptop DELL Inspiron',
      description: 'Laptop DELL Inspiron | 15.6" | Intel Core i3 | 4GB RAM | 1TB Unidad Óptica No Incluida | Windows 10 Home | Reacondicionado Grado B',
      price: 7999.00,
      imageUrl: 'https://samaraonline.com.mx/web/image/product.product/485/image_1024/%5BKWNWX-GRB-RFB%5D%20Laptop%20DELL%20Inspiron%20%7C%2015.6%22%20%7C%20%20Intel%20Core%20i3%20%7C%204GB%20RAM%20%7C%201TB%20Unidad%20%C3%93ptica%20No%20Incluida%20%7C%20Windows%2010%20Home%20%7C%20Reacondicionado%20Grado%20B?unique=e3e0eb0'
    },
    {
      id: 2,
      name: 'HUAWEI MateBook 14 2021',
      description: 'Cuenta con una pantalla de 14” 2K (2160x1440), procesadores Intel Core i5/i7 de 11ª generación, hasta 16 GB de RAM, 512 GB SSD.',
      price: 14999.99,
      imageUrl: 'https://consumer.huawei.com/content/dam/huawei-cbg-site/latam/latin/mkt/plp/laptops/kv/matebook-14-2021-kv.jpg'
    },
    {
      id: 3,
      name: 'Laptop Hp',
      description: 'La laptop HP es una solución tanto para trabajar y estudiar como para entretenerte. Al ser portátil, el escritorio dejará de ser tu unico.',
      price: 12499.99,
      imageUrl: 'https://http2.mlstatic.com/D_NQ_NP_762357-MLM70716689726_072023-O.webp'
    },
    {
      id: 4,
      name: 'Laptop Gamer Y520-15IKBN',
      description: 'Laptop gamer con pantalla de 15.6" Full HD, tarjeta gráfica NVIDIA GeForce GTX 1050/1060, 16GB de memoria RAM y 1TB de almacenamiento.',
      price: 15299.00,
      imageUrl: 'https://resources.sanborns.com.mx/imagenes-sanborns-ii/1200/191200938092.jpg?scale=700&qlty=80'
    },
    {
      id: 5,
      name: 'Laptop MSI Gamer Thin GF63',
      description: 'Cuenta con una pantalla de 15.6" Full HD, procesador Intel Core i5/i7 de 9ª/10ª generación, tarjeta gráfica NVIDIA GeForce GTX 1650/1650 Ti.',
      price: 39.99,
      imageUrl: 'https://m.media-amazon.com/images/I/51HkrsR0r+L._AC_SX522_.jpg'
    },
  ];
  featuredCategories = [
    {
      name: 'Tarjetas de Video',
      imageUrl: 'https://hiraoka.com.pe/media/mageplaza/blog/post/t/a/tarjeta-grafica-que-es-para-que-sirve-como-funciona.jpg'
    },
    {
      name: 'Laptops',
      imageUrl: 'https://media.gq.com.mx/photos/61e70ca25def32c5619cef06/16:9/w_1920,c_limit/Lenovo%20Yoga%20Slim%207%20Pro.jpg'
    },
    {
      name: 'Monitores',
      imageUrl: 'https://img.global.news.samsung.com/latin/wp-content/uploads/2018/10/monitor1_1.png'
    },
    {
      name: 'Tóner',
      imageUrl: 'https://http2.mlstatic.com/D_NQ_NP_2X_814283-MLU69671544485_052023-F.webp'
    }
  ];

  featuredProducts = [
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
}
