import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['expectedRole'];
    const userRole = this.authService.getUserRole();

    if (this.authService.isAuthenticated() && userRole === expectedRole) {
      return true;
    } else {
      if (userRole === 'collecteur') {
        this.router.navigate(['/dashboard']);

      } else if (userRole === 'particulier') {
        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['/login']);
      }
      return false;
    }
  }
}
