import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.isAuthenticated()) {
      return true;
    } else {
      const userRole = this.authService.getUserRole();

      if (userRole === 'particulier') {
        this.router.navigate(['/home']);
      } else if (userRole === 'collecteur') {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/home']);
      }

      return false;
    }
  }
}
