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

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' } 
    ]
  },
  { path: 'mfa', component: MfaComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'homeNoSession', component: HomeNoSessionComponent},
  { path: 'passwordRequest', component: PasswordRequestComponent },
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
  { path: '', redirectTo: '/homeNoSession', pathMatch: 'full' }  
];
