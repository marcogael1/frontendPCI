import { Component, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { CategoriesComponent } from './components/header/categories/categories.component';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { environment } from './config';
import { AuthService } from './services/auth.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { of, filter } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { FooterComponent } from './components/header/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, BreadcrumbModule, FooterComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  showScrollTop = false;
  isLoading = false; 

  constructor(public authService: AuthService, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;  // Muestra la animación cuando cambia la ruta
      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        setTimeout(() => {
          this.isLoading = false; // Oculta la animación después de un pequeño delay
        }, 1000);
      }
    });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.showScrollTop = scrollPosition > 100;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openChat(): void {
    alert('¡Aquí se abrirá el chat! (Funcionalidad por implementar)');
  }

  editAction(): void {
    console.log('¡Acción de editar activada!');
  }

}
