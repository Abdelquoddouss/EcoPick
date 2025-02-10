import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient} from "@angular/common/http";
import {provideStore} from "@ngrx/store";
import {userReducer} from "./state/user.reducer";
import {provideEffects} from "@ngrx/effects";
import {UserEffects} from "./state/user.effects";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideStore({ user: userReducer }),
    provideEffects([UserEffects]),
  ]


};
