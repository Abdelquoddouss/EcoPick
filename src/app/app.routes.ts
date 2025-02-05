import { Routes } from '@angular/router';
import {RegisterComponent} from "./Auth/register/register.component";
import {LoginComponent} from "./Auth/login/login.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {AccountComponent} from "./account/account.component";
import {FooterComponent} from "./footer/footer.component";
import {LayoutComponent} from "./layout/layout.component";
import {HomeComponent} from "./home/home.component";

export const routes: Routes = [

  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  { path: 'home2', component: HomeComponent },

  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'account', component: AccountComponent },

      { path: 'home', component: HomeComponent },


    ]
  },

];
