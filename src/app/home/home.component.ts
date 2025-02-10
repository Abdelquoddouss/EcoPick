import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service"; // Importez AuthService

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  isAuthenticated = false;
  userRole: string | null = null; // Ajoutez une variable pour stocker le rôle de l'utilisateur

  constructor(private router: Router, private authService: AuthService) {} // Injectez AuthService

  ngOnInit() {
    const user = localStorage.getItem('user');
    this.isAuthenticated = user !== null;

    if (this.isAuthenticated) {
      this.userRole = this.authService.getUserRole(); // Récupérez le rôle de l'utilisateur
    }
  }

  navigateToAction() {
    if (this.isAuthenticated) {
      if (this.userRole === 'particulier') {
        // Rediriger vers la page de collection pour les particuliers
        this.router.navigate(['/addCollection']);
      } else if (this.userRole === 'collecteur') {
        // Rediriger vers le dashboard pour les collecteurs
        this.router.navigate(['/dashboard']);
      }
    } else {
      // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
      this.router.navigate(['/login']);
    }
  }
}
