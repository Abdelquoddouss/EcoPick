import { Routes } from '@angular/router';
import {RegisterComponent} from "./Auth/register/register.component";
import {LoginComponent} from "./Auth/login/login.component";
import {NavbarComponent} from "./navbar/navbar.component";
import {AccountComponent} from "./account/account.component";
import {FooterComponent} from "./footer/footer.component";
import {LayoutComponent} from "./layout/layout.component";
import {HomeComponent} from "./home/home.component";
import {CollectionComponent} from "./collection/collection.component";
import {RequestComponent} from "./request/request.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {PointComponent} from "./point/point.component";

export const routes: Routes = [

  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  { path: 'dashborad', component: DashboardComponent },


  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'account', component: AccountComponent },

      { path: 'home', component: HomeComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },

      { path: 'addCollection', component: CollectionComponent },
      { path: 'request', component: RequestComponent },

      { path: 'point', component: PointComponent }


    ]
  },

];
