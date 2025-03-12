import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { getAuth, provideAuth } from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'join-94775',
          appId: '1:1022981649905:web:f6b1e81b79af38a2cc4050',
          storageBucket: 'join-94775.firebasestorage.app',
          apiKey: 'AIzaSyA5YTqiC_EGxswFAxbcebfWK1ac7iQr_d8',
          authDomain: 'join-94775.firebaseapp.com',
          messagingSenderId: '1022981649905',
          measurementId: 'G-K6Y4LFGZD4',
        })
      )
    ),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore())),
  ],
};
