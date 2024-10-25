import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from './config';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './services/auth.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, HeaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'PciTecno';
  isLogged = false;
  private apiUrl = `${environment.apiUrl}company-profile`;
  isMenuOpen = false;
  isDarkMode = false; 
  socialMediaLinks: any = {};
  logoUrl: string | null = null;
  constructor(private titleService: Title, private http: HttpClient, private router: Router, public authService: AuthService) { }

  ngOnInit() {
    this.checkSession();
    this.loadCompanyProfile();
    this.checkDarkMode();
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  checkDarkMode() {
    const darkModeSetting = localStorage.getItem('darkMode');
    if (darkModeSetting === 'true') {
      this.isDarkMode = true;
      document.body.classList.add('dark-mode');
    } else {
      this.isDarkMode = false;
      document.body.classList.remove('dark-mode');
    }
  }
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'true'); 
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'false'); 
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

  logout() {
    this.http.post(`${environment.apiUrl}auth/logout`, {}, { withCredentials: true })
      .subscribe(
        () => {
          window.location.reload(); 
        },
        (error) => {
          console.error('Error al cerrar sesión:', error);
        }
      );
  }
  
  checkSession() {
    this.http.get(`${environment.apiUrl}auth/validate-session`, { withCredentials: true })
      .subscribe({
        next: (response: any) => {
          this.isLogged = true;
        },
        error: (err) => {
          this.isLogged = false;
        }
      });
  }
}
