import { Component, HostListener, ChangeDetectorRef } from '@angular/core';
import { RouterModule, ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { CategoriesComponent } from './categories/categories.component';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { environment } from '../../config';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { of, filter } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, CategoriesComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent {
  title = 'PciTecno';
  isLogged = false;
  isAdmin = false;
  private apiUrl = `${environment.apiUrl}company-profile`;
  isMenuOpen = false;
  isDarkMode = false;
  showScrollTop = false;
  isUserMenuOpen = false; 
  isMouseInside = false; 
  socialMediaLinks: any = {};
  logoUrl: string | null = null;

  breadcrumbs: { label: string, url: string }[] = [];
  constructor(
    private titleService: Title,
    private http: HttpClient,
    private router: Router,
    public authService: AuthService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  searchQuery: string = '';
  suggestedProducts: any[] = [];
  private apiUrlProducts = `${environment.apiUrl}products/search`;
  ngOnInit() {
    this.checkSession();
    this.loadCompanyProfile();
    this.checkDarkMode();
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.router.url === '/homeNoSession') {
        this.breadcrumbs = [{ label: 'Home', url: '/homeNoSession' }];
      } else {
        if (this.breadcrumbs.length === 0) {
          this.breadcrumbs = [{ label: 'Home', url: '/homeNoSession' }];
        }
        this.updateBreadcrumbs(this.activatedRoute.root);
      }
    });
  }

  onSearchInput(): void {
    if (this.searchQuery.length > 2) {
      of(this.searchQuery)
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap(query => this.http.get<any[]>(`${this.apiUrlProducts}?name=${query}`))
        )
        .subscribe(products => {
          this.suggestedProducts = products;
        });
    } else {
      this.suggestedProducts = [];
    }
  }

  selectProduct(product: any): void {
    this.searchQuery = product.name;
    this.suggestedProducts = [];
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

  getHomeRoute(): string {
    return this.isLogged ? '/home' : '/';
  }

  openUserMenu(): void {
    this.isUserMenuOpen = true;
  }
  keepUserMenuOpen(): void {
    this.isUserMenuOpen = true;
  }
  closeUserMenu(): void {
    this.isUserMenuOpen = false;
  }

  onMouseEnter(): void {
    this.isMouseInside = true;
  }

  onMouseLeave(): void {
    this.isMouseInside = false;
    this.closeUserMenu();
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
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
          this.isAdmin = response.role === 'admin';
        },
        error: (err) => {
          this.isLogged = false;
        }
      });
  }

  private updateBreadcrumbs(route: ActivatedRoute, url: string = '') {
    const children: ActivatedRoute[] = route.children;
  
    if (children.length === 0) {
      return;
    }
  
    children.forEach(child => {
      const routeSnapshot = child.snapshot;
      let breadcrumbLabel = routeSnapshot.data['breadcrumb'] || '';
      if (routeSnapshot.paramMap.has('name')) {
        const productName = routeSnapshot.paramMap.get('name');
        if (productName) {
          breadcrumbLabel = decodeURIComponent(productName);
        }
      }
      if (breadcrumbLabel.trim() !== '') {
        const breadcrumb = {
          label: breadcrumbLabel,
          url: url + '/' + routeSnapshot.url.map(segment => segment.path).join('/')
        };
  
        if (!this.breadcrumbs.some(b => b.url === breadcrumb.url)) {
          this.breadcrumbs.push(breadcrumb);
        }
      }
  
      this.updateBreadcrumbs(child, url + '/' + routeSnapshot.url.map(segment => segment.path).join('/'));
    });
  }
  onBreadcrumbClick(index: number): void {
    this.breadcrumbs = this.breadcrumbs.slice(0, index + 1);
    this.router.navigate([this.breadcrumbs[index].url]); 
  }
}
