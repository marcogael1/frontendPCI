import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { PasswordRequestComponent } from './components/passwordRequest/passwordRequest.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { TokenGuard } from './guards/token.guard';
import { UserTypeGuard } from './guards/user-type.guard';
import { MfaComponent } from './components/authenticator/authenticator.component';
import { AdminDashboardComponent } from './components/admin/adminDashboard/adminDashboard.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { EmailGuard } from './guards/email.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'mfa', component: MfaComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'home', component: HomeComponent },
    { path: 'passwordRequest', component: PasswordRequestComponent },
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
      {
        path: 'admin-dashboard', 
        component: AdminDashboardComponent,
        canActivate: [UserTypeGuard], 
      },
    { path: '', redirectTo: '/login', pathMatch: 'full' },  
];
