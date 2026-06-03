import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { importProvidersFrom } from '@angular/core';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),

    // REGISTRA O MÓDULO DO V3 
    importProvidersFrom(RecaptchaV3Module),

    // SITE KEY V3
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: '6LdJZ7ksAAAAAGeoxw17tDJpQn_nshtK0MekpFsf'
    }
  ]
};