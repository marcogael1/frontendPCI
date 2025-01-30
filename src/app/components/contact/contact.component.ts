import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
@Component({
  selector: 'app-contact',
  standalone:true,
  imports:[CommonModule, GoogleMapsModule, ReactiveFormsModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent  {
  location1 = { lat: 21.14175524299589, lng: -98.420033540159282 }; // Ubicación 1 (Ejemplo: CDMX)
  location2 = { lat: 40.7128, lng: -74.0060 }; // Ubicación 2 (Ejemplo: Nueva York)
  ngAfterViewInit() {
    // Inicializar Google Maps en Ubicación 1
    new google.maps.Map(document.getElementById('map1') as HTMLElement, {
      center: this.location1,
      zoom: 15
    });

    // Inicializar Google Maps en Ubicación 2
    new google.maps.Map(document.getElementById('map2') as HTMLElement, {
      center: this.location2,
      zoom: 15
    });

    // Inicializar Street View en Ubicación 1
    new google.maps.StreetViewPanorama(document.getElementById('street-view') as HTMLElement, {
      position: this.location1,
      pov: { heading: 165, pitch: 0 },
      zoom: 1
    });
  }
}
