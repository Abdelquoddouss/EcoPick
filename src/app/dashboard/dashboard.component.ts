import { Component } from '@angular/core';
import { CommonModule, NgClass } from "@angular/common";
import { CollecteService } from "../services/collecte.service";
import { AuthService } from "../services/auth.service";
import {Router, RouterLink} from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgClass, CommonModule, RouterLink
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
      Swal.fire({
        icon: 'warning',
        title: 'Adresse manquante',
        text: 'Votre adresse n\'est pas définie. Veuillez vérifier votre profil.',
        confirmButtonColor: '#16a34a'
      });
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
    const collecteurId = newStatut === 'occupée' ? user.id : collecte.collecteurId;

    this.collecteService.updateCollecteStatut(collecte.id, newStatut, collecteurId).subscribe({
      next: (response) => {
        console.log('Statut mis à jour:', response);
        collecte.statut = newStatut;
        collecte.collecteurId = collecteurId;

        if (newStatut === 'validée') {
          const points = this.collecteService.calculatePoints(collecte.types);
          this.authService.updateUserPoints(collecte.userId, points).subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: 'Points attribués',
                text: `${points} points ont été ajoutés à l'utilisateur.`,
                confirmButtonColor: '#16a34a'
              });            },
            error: (error) => {
              console.error('Erreur lors de la mise à jour des points:', error);
            }
          });
        }

        this.getCollectes();
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du statut:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Erreur lors de la mise à jour du statut.',
          confirmButtonColor: '#16a34a'
        });      },
    });
  }



  logout() {
    localStorage.removeItem("user");
    this.router.navigate(['/login']);
  }
}
