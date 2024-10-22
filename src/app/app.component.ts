import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser'; 
import { environment } from './config';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, HeaderComponent, CommonModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'PciTecno';
  private apiUrl = `${environment.apiUrl}company-profile`;
  isMenuOpen = false;
  socialMediaLinks: any = {};
  logoUrl: string | null = null; 
  constructor(private titleService: Title, private http: HttpClient) {}

  ngOnInit() {
    this.loadCompanyProfile();
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  isDarkMode = false;

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }
  loadCompanyProfile() {
    this.http.get(`${this.apiUrl}`).subscribe((profile: any) => {
      if (profile && profile.pageTitle) {
        this.titleService.setTitle(profile.pageTitle);
      } else {
        this.titleService.setTitle('PCI Tecnología');
      }
      if (profile && profile.socialMedia) {
        this.socialMediaLinks = profile.socialMedia;
      }
      if (profile && profile.logo) {
        this.logoUrl = profile.logo; 
      }
    }, (error) => {
      console.error('Error al cargar el perfil de la empresa', error);
      this.titleService.setTitle('PCI Tecnología'); 
    });
  }
}
