import { Component } from '@angular/core';
import { CommonModule, NgClass } from "@angular/common";
import { CollecteService } from "../services/collecte.service";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgClass, CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  collectes: any[] = [];

  constructor(
    private collecteService: CollecteService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCollectes();
  }

  getCollectes(): void {
    const user = this.authService.getUser();
    if (!user || !user.address) {
      console.error("Utilisateur non valide ou adresse introuvable.");
      alert("Votre adresse n'est pas définie. Veuillez vérifier votre profil.");
      return;
    }

    this.collecteService.getAllCollectes().subscribe(response => {
      console.log("Réponse API:", response);

      this.collectes = response.filter(collecte => collecte.adresse.toLowerCase() === user.address.toLowerCase());

      if (this.collectes.length === 0) {
        console.log("Aucune collecte trouvée pour votre ville.");
      }
    }, error => {
      console.error('Erreur lors de la récupération des collectes:', error);
    });
  }



  logout() {
    localStorage.removeItem("user");
    this.router.navigate(['/login']);
  }
}
