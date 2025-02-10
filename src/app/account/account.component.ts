import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { loadUser, updateUser, deleteUser } from '../state/user.actions';
import { selectUser, selectLoading, selectError } from '../state/user.selectors';
import Swal from 'sweetalert2';
import { AppState } from '../state/user.state';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
})
export class AccountComponent implements OnInit {
  user$ = this.store.select(selectUser);
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);

  userFormData: any = {
    fullName: '',
    email: '',
    address: '',
    phone: '',
    birthDate: '',
  };

  userId!: number;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const authUser = JSON.parse(storedUser);
      this.userId = authUser.id;

      // Dispatch l'action pour charger l'utilisateur
      this.store.dispatch(loadUser({ userId: this.userId }));

      // Abonnez-vous à l'état de l'utilisateur
      this.user$.subscribe((user) => {
        if (user) {
          this.userFormData = { ...user }; // Copie des données pour le formulaire
        }
      });

      // Gérer les erreurs
      this.error$.subscribe((error) => {
        if (error) {
          Swal.fire('Erreur', error, 'error');
        }
      });
    } else {
      Swal.fire('Erreur', 'Utilisateur non authentifié !', 'error');
    }
  }

  updateUser() {
    if (!this.validateInputs()) return;

    // Dispatch l'action pour mettre à jour l'utilisateur
    this.store.dispatch(updateUser({ userId: this.userId, user: this.userFormData }));
  }

  deleteUser() {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer !',
    }).then((result) => {
      if (result.isConfirmed) {
        // Dispatch l'action pour supprimer l'utilisateur
        this.store.dispatch(deleteUser({ userId: this.userId }));
      }
    });
  }

  validateInputs(): boolean {
    if (!this.userFormData.fullName.trim()) {
      Swal.fire('Validation', 'Le nom complet est requis.', 'warning');
      return false;
    }
    if (!this.userFormData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.userFormData.email)) {
      Swal.fire('Validation', 'Une adresse e-mail valide est requise.', 'warning');
      return false;
    }
    if (!this.userFormData.phone.trim() || !/^\d{10}$/.test(this.userFormData.phone)) {
      Swal.fire('Validation', 'Un numéro de téléphone valide est requis (10 chiffres).', 'warning');
      return false;
    }
    if (!this.userFormData.birthDate) {
      Swal.fire('Validation', 'La date de naissance est requise.', 'warning');
      return false;
    }
    return true;
  }
}
