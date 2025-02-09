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

  getCurrentUser() {
    const user = this.authService.getUser();
    if (!user) {
      console.error("Aucun utilisateur connecté.");
      return { id: null };
    }
    return user;
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

      this.collectes = response.filter(collecte =>
        collecte.adresse.toLowerCase() === user.address.toLowerCase() &&
        (collecte.statut === 'en attente' || collecte.collecteurId === user.id)
      );

      if (this.collectes.length === 0) {
        console.log("Aucune collecte trouvée pour votre ville.");
      }
    }, error => {
      console.error('Erreur lors de la récupération des collectes:', error);
    });
  }

  changerStatut(collecte: any, newStatut: string): void {
    const user = this.authService.getUser();
    const collecteurId = newStatut === 'occupée' ? user.id : collecte.collecteurId; // Garder le collecteurId existant

    this.collecteService.updateCollecteStatut(collecte.id, newStatut, collecteurId).subscribe({
      next: (response) => {
        console.log('Statut mis à jour:', response);
        collecte.statut = newStatut;
        collecte.collecteurId = collecteurId; // Mettre à jour l'ID du collecteur localement
        alert(`Le statut de la collecte a été mis à jour : ${newStatut}`);
        this.getCollectes(); // Recharger les collectes après la mise à jour
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du statut:', error);
        alert('Erreur lors de la mise à jour du statut.');
      },
    });
  }



  logout() {
    localStorage.removeItem("user");
    this.router.navigate(['/login']);
  }
}
