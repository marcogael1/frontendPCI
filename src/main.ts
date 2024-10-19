import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';  
import { provideRouter } from '@angular/router';
import { routes } from '../src/app/app.routes';  
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { firebase } from './app/config';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),  
    provideRouter(routes),  
    provideFirebaseApp(() => initializeApp(firebase.firebaseConfig)),
    provideAuth(() => getAuth())
  ],
}).catch(err => console.error(err));
