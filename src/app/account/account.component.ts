import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit{
  user: any = {
    fullName: '',
    email: '',
    address: '',
    phone: '',
    birthDate: ''
  };

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
      alert('Utilisateur non authentifié !');
    }
  }

  updateUser() {
    if (!this.user.fullName || !this.user.email) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    this.userService.updateUser(this.userId, this.user).subscribe(() => {
      alert('Informations mises à jour avec succès !');

      // Mettre à jour les informations de l'utilisateur dans le localStorage
      const updatedUser = { ...this.user, id: this.userId }; // Ajoutez l'ID si nécessaire
      localStorage.setItem('user', JSON.stringify(updatedUser));
    });
  }

  deleteUser() {
    if (confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
      this.userService.deleteUser(this.userId).subscribe(() => {
        // Supprimer les informations de l'utilisateur dans le localStorage
        localStorage.removeItem('user');

        window.location.href = '/login'; // Redirection vers la page de connexion
        alert('Votre compte a été supprimé avec succès.');
      }, (error) => {
        console.error('Erreur lors de la suppression du compte:', error);
        alert('Une erreur est survenue lors de la suppression de votre compte.');
      });
    }
  }

}
