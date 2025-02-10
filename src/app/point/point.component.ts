import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-point',
  templateUrl: './point.component.html',
  standalone: true,
  styleUrls: ['./point.component.css']
})
export class PointComponent implements OnInit {
  points: number = 0;
  voucherAmount: number = 0;
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

      this.authService.getUserVoucher(this.userId).subscribe({
        next: (voucher) => this.voucherAmount = voucher,
        error: (err) => {
          console.error('Erreur chargement voucher:', err);
          this.voucherAmount = 0;
        }
      });
    }
  }

  convertPointsToVoucher(pointsToConvert: number): void {
    if (!this.userId) return;

    if (pointsToConvert > this.points) {
      Swal.fire({
        icon: 'warning',
        title: 'Points insuffisants',
        text: 'Pas assez de points',
        confirmButtonColor: '#16a34a'
      });
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
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Montant de conversion invalide',
        confirmButtonColor: '#16a34a'
      });
      return;
    }

    this.authService.updateUserPoints(this.userId, newPointsTotal).subscribe({
      next: () => {
        this.points = newPointsTotal; // Mise à jour locale
        this.authService.addVoucher(this.userId!, voucherAmount).subscribe({
          next: () => {
            this.voucherAmount = voucherAmount; // Mise à jour locale
            Swal.fire({
              icon: 'success',
              title: 'Conversion réussie',
              text: `Bon d'achat de ${voucherAmount}Dh généré !`,
              confirmButtonColor: '#16a34a'
            });          },
          error: (error) => {
            console.error('Erreur:', error);
            alert('Erreur lors de la conversion');
          }
        });
      },
      error: (error) => {
        console.error('Erreur:', error);
        alert('Erreur lors de la conversion');
      }
    });
  }
}
