import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-point',
  templateUrl: './point.component.html',
  standalone: true,
  styleUrls: ['./point.component.css']
})
export class PointComponent implements OnInit {
  points: number = 0;
  userId: number | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if (this.userId) {
      this.authService.getUserPoints(this.userId).subscribe({
        next: (points) => this.points = points,
        error: (err) => {
          console.error('Erreur chargement points:', err);
          this.points = 0;
        }
      });
    }
  }

  convertPointsToVoucher(pointsToConvert: number): void {
    if (!this.userId) return;

    if (pointsToConvert > this.points) {
      alert('Pas assez de points');
      return;
    }
    const newPointsTotal = this.points - pointsToConvert;

    let voucherAmount = 0;
    if (pointsToConvert >= 500) {
      voucherAmount = 350;
    } else if (pointsToConvert >= 200) {
      voucherAmount = 120;
    } else if (pointsToConvert >= 100) {
      voucherAmount = 50;
    } else {
      alert('Montant de conversion invalide');
      return;
    }

    this.authService.updateUserPoints(this.userId, newPointsTotal).subscribe({
      next: () => {
        this.points = newPointsTotal; // Mise à jour locale
        alert(`Conversion réussie ! Bon d'achat de ${voucherAmount}Dh`);
      },
      error: (error) => {
        console.error('Erreur:', error);
        alert('Erreur lors de la conversion');
      }
    });
  }
}
