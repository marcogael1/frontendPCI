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
      description: 'Cuenta con una pantalla de 14” 2K (2160x1440), procesadores Intel Core i5/i7 de 11ª generación, hasta 16 GB de RAM, 512 GB SSD, gráficos Intel Iris Xe, batería de 56 Wh, 1.49 kg de peso, puertos USB-C, HDMI, USB-A, y lector de huellas en el botón de encendido.',
      price: 14999.99,
      imageUrl: 'https://consumer.huawei.com/content/dam/huawei-cbg-site/latam/latin/mkt/plp/laptops/kv/matebook-14-2021-kv.jpg'
    },
    {
      id: 3,
      name: 'Laptop Hp',
      description: 'La laptop HP es una solución tanto para trabajar y estudiar como para entretenerte. Al ser portátil, el escritorio dejará de ser tu único espacio de uso para abrirte las puertas a otros ambientes ya sea en tu casa o en la oficina.',
      price: 12499.99,
      imageUrl: 'https://http2.mlstatic.com/D_NQ_NP_762357-MLM70716689726_072023-O.webp'
    },
    {
      id: 4,
      name: 'Laptop Gamer Y520-15IKBN Lenovo',
      description: 'Laptop gamer con pantalla de 15.6" Full HD, procesador Intel Core i5/i7 de 7ª generación, tarjeta gráfica NVIDIA GeForce GTX 1050/1060, hasta 16 GB de RAM, 1 TB HDD o 256 GB SSD, teclado retroiluminado, sistema de audio Dolby, y múltiples puertos incluyendo USB 3.0, HDMI y Ethernet.',
      price: 15299.00,
      imageUrl: 'https://resources.sanborns.com.mx/imagenes-sanborns-ii/1200/191200938092.jpg?scale=700&qlty=80'
    },
    {
      id: 5,
      name: 'Laptop MSI Gamer Thin GF63',
      description: 'Cuenta con una pantalla de 15.6" Full HD, procesador Intel Core i5/i7 de 9ª/10ª generación, tarjeta gráfica NVIDIA GeForce GTX 1650/1650 Ti, hasta 16 GB de RAM, 512 GB SSD, sistema de refrigeración Cooler Boost, teclado retroiluminado en rojo, y puertos USB 3.2, HDMI y Ethernet.',
      price: 39.99,
      imageUrl: 'https://m.media-amazon.com/images/I/51HkrsR0r+L._AC_SX522_.jpg'
    },
    {
      id: 6,
      name: 'Producto 3',
      description: 'Este es el tercer producto.',
      price: 39.99,
      imageUrl: 'assets/product3.jpg'
    }
  ];
}
