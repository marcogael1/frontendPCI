import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { PasswordRequestComponent } from './components/passwordRequest/passwordRequest.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { TokenGuard } from './guards/token.guard';
import { MfaComponent } from './components/authenticator/authenticator.component';
import { AdminDashboardComponent } from './components/admin/adminDashboard/adminDashboard.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { EmailGuard } from './guards/email.guard';
import { AuthComponent } from './components/auth/auth.component';
import { CompanyInformationComponent } from './components/admin/companyInformation/companyInformation.component';
import { AdminMenuComponent } from './components/admin/adminMenu/adminMenu.component';
import { IncidentsComponent } from './components/admin/incidents/incidents.component';
import { AuthGuard } from './guards/user-type.guard';
import { HomeNoSessionComponent } from './components/homeNoSession/home.component';
import { DocumentationComponent } from './components/documentation/documentation.component';
import { DetailComponent } from './components/detail/detail.component';
import { Error404Component } from './pages/error404/error404.component';
import { Error500Component } from './pages/error500/error500.component';
import { Error400Component } from './pages/error400/error400.component';
import { CategoryProductsComponent } from './components/category-products/category-products.component';
import { ContactComponent } from './components/contact/contact.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      { path: 'login', component: LoginComponent, data: { breadcrumb: 'Login' } },
      { path: 'register', component: RegisterComponent, data: { breadcrumb: 'Registro' } },
      { path: '', redirectTo: 'login', pathMatch: 'full' } 
    ]
  },
  { path: 'product/:name', component: DetailComponent, data: { breadcrumb: 'Producto' } },
  { path: 'mfa', component: MfaComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'homeNoSession', component: HomeNoSessionComponent,data: { breadcrumb: 'Home' }},
  { path: 'passwordRequest', component: PasswordRequestComponent },
  { path: 'category/:name', component: CategoryProductsComponent, data: { breadcrumb: 'Categoria' }},
  { path: 'contact', component: ContactComponent, data: { breadcrumb: 'Contacto' }},
  {
    path: 'admin',
    component: AdminMenuComponent, 
    canActivate: [AuthGuard],
    children: [
      { path: 'documents', component: CompanyInformationComponent },
      { path: 'company-profile', component: AdminDashboardComponent },
      { path: 'incidents', component: IncidentsComponent },
    ]
  },
  {
    path: 'reset-password',
    component: PasswordResetComponent,
    canActivate: [TokenGuard],
  },
  { 
    path: 'verify-email', 
    component: VerifyEmailComponent, 
    canActivate: [EmailGuard] 
  },
  { path: 'documentation/:title', component: DocumentationComponent },
  { path: '', redirectTo: '/homeNoSession', pathMatch: 'full' } , 
  { path: 'error/400', component: Error400Component },
  { path: 'error/500', component: Error500Component },
  { path: 'error/404', component: Error404Component },
  { path: '**', redirectTo: '/error/404' } 
];
