import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes'; // Імпортуємо routes

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes) // Надаємо маршрути через provideRouter
  ]
};