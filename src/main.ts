import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';  
import { provideRouter } from '@angular/router';
import { routes } from '../src/app/app.routes';  
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { firebase } from './app/config';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ErrorInterceptor } from './app/interceptors/error.interceptor'; // Importar el interceptor

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([ErrorInterceptor]) // Registrar el interceptor funcional
    ),  
    provideRouter(routes),  
    provideFirebaseApp(() => initializeApp(firebase.firebaseConfig)),
    provideAuth(() => getAuth()), 
    provideAnimationsAsync()
  ],
}).catch(err => console.error(err));
