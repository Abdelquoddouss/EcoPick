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
      return true; // Autoriser l'accès si l'utilisateur n'est pas authentifié
    } else {
      const userRole = this.authService.getUserRole();

      if (userRole === 'particulier') {
        this.router.navigate(['/home']); // Rediriger les particuliers vers /home
      } else if (userRole === 'collecteur') {
        this.router.navigate(['/dashboard']); // Rediriger les collecteurs vers /dashboard
      } else {
        this.router.navigate(['/home']); // Redirection par défaut
      }

      return false; // Bloquer l'accès à la route demandée
    }
  }
}
