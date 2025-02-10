import { Routes } from '@angular/router';
import { RegisterComponent } from "./Auth/register/register.component";
import { LoginComponent } from "./Auth/login/login.component";
import { AccountComponent } from "./account/account.component";
import { LayoutComponent } from "./layout/layout.component";
import { HomeComponent } from "./home/home.component";
import { CollectionComponent } from "./collection/collection.component";
import { RequestComponent } from "./request/request.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { PointComponent } from "./point/point.component";
import { NoAuthGuard } from "./guards/no-auth-guard.guard";
import { AuthGuard } from "./guards/auth-guard.guard";
import { RoleGuard } from "./guards/role-guard.guard";

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },

  { path: 'dashboard', component: DashboardComponent, canActivate: [RoleGuard], data: { expectedRole: 'collecteur' } },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'account', component: AccountComponent },
      { path: 'home', component: HomeComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },

      { path: 'addCollection', component: CollectionComponent, canActivate: [RoleGuard], data: { expectedRole: 'particulier' } },
      { path: 'request', component: RequestComponent, canActivate: [RoleGuard], data: { expectedRole: 'particulier' } },
      { path: 'point', component: PointComponent, canActivate: [RoleGuard], data: { expectedRole: 'particulier' } }
    ]
  },

  { path: '**', redirectTo: 'home' }
];
