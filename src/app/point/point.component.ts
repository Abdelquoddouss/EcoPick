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
      this.authService.getUserPoints(this.userId).subscribe(points => {
        this.points = points;
      });
    }
  }

  convertPointsToVoucher(points: number): void {
    if (this.userId) {
      let voucherAmount = 0;
      if (points >= 500) {
        voucherAmount = 350;
      } else if (points >= 200) {
        voucherAmount = 120;
      } else if (points >= 100) {
        voucherAmount = 50;
      } else {
        alert('Pas assez de points pour un bon d\'achat.');
        return;
      }

      this.authService.updateUserPoints(this.userId, -points).subscribe({
        next: () => {
          alert(`Vous avez converti ${points} points en un bon d'achat de ${voucherAmount} Dh.`);
          this.points -= points;
        },
        error: (error) => {
          console.error('Erreur lors de la conversion des points:', error);
        }
      });
    }
  }
}
