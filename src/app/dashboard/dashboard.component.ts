import { Component } from '@angular/core';
import {CommonModule, NgClass} from "@angular/common";
import {CollecteService} from "../services/collecte.service";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgClass, CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  collectes: any[] = [];

  constructor(private collecteService: CollecteService, private authService: AuthService) {}

  ngOnInit(): void {
    this.getCollectes();
  }

  getCollectes(): void {
    const userId = this.authService.getUserId();  // Assurez-vous que l'utilisateur est connecté
    this.collecteService.getUserCollectes(userId).subscribe(collectes => {
      this.collectes = collectes;
    }, error => {
      console.error('Erreur lors de la récupération des collectes:', error);
      alert('Impossible de récupérer les collectes.');
    });
  }

  changerStatut(collecte: any): void {
    // Changer le statut de la collecte en "complétée"
    collecte.statut = 'complétée';
    this.collecteService.updateCollecte(collecte).subscribe(response => {
      console.log('Statut mis à jour:', response);
      alert('La collecte a été marquée comme complétée.');
    }, error => {
      console.error('Erreur lors de la mise à jour du statut:', error);
      alert('Erreur lors de la mise à jour du statut.');
    });
  }

  annulerCollecte(collecte: any): void {
    // Annuler la collecte
    collecte.statut = 'annulée';
    this.collecteService.updateCollecte(collecte).subscribe(response => {
      console.log('Collecte annulée:', response);
      alert('La collecte a été annulée.');
    }, error => {
      console.error('Erreur lors de l\'annulation de la collecte:', error);
      alert('Erreur lors de l\'annulation de la collecte.');
    });
  }
}
