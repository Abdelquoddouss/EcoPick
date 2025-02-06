import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UserService } from "../services/user.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {
  user: any = {
    fullName: '',
    email: '',
    address: '',
    phone: '',
    birthDate: ''
  };

  alertMessage: string = '';
  alertType: string = 'success';

  userId!: number;

  constructor(private userService: UserService) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const authUser = JSON.parse(storedUser);
      this.userId = authUser.id;

      this.userService.getUser(this.userId).subscribe((data) => {
        this.user = data;
      });
    } else {
      Swal.fire('Erreur', 'Utilisateur non authentifié !', 'error');
    }
  }

  validateInputs(): boolean {
    if (!this.user.fullName.trim()) {
      Swal.fire('Validation', 'Le nom complet est requis.', 'warning');
      return false;
    }
    if (!this.user.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.user.email)) {
      Swal.fire('Validation', 'Une adresse e-mail valide est requise.', 'warning');
      return false;
    }

    if (!this.user.phone.trim() || !/^\d{10}$/.test(this.user.phone)) {
      Swal.fire('Validation', 'Un numéro de téléphone valide est requis (10 chiffres).', 'warning');
      return false;
    }
    if (!this.user.birthDate) {
      Swal.fire('Validation', 'La date de naissance est requise.', 'warning');
      return false;
    }
    return true;
  }

  updateUser() {
    if (!this.validateInputs()) return;

    this.userService.updateUser(this.userId, this.user).subscribe(() => {
      Swal.fire({
        title: 'Succès',
        text: 'Informations mises à jour avec succès !',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      const updatedUser = { ...this.user, id: this.userId };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }, (error) => {
      Swal.fire({
        title: 'Erreur',
        text: 'Une erreur est survenue lors de la mise à jour.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      console.error('Erreur lors de la mise à jour :', error);
    });
  }



  deleteUser() {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action est irréversible.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(this.userId).subscribe(() => {
          localStorage.removeItem('user');
          this.alertMessage = 'Votre compte a été supprimé.';
          this.alertType = 'success';
          setTimeout(() => window.location.href = '/login', 2000);
        }, () => {
          this.alertMessage = 'Erreur lors de la suppression.';
          this.alertType = 'error';
          setTimeout(() => this.alertMessage = '', 3000);
        });
      }
    });
  }

}
