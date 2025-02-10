import { Component, OnInit } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { CollecteService } from "../services/collecte.service";
import { AuthService } from "../services/auth.service";
import {RouterLink} from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {
  typesDechets: string[] = ['plastique', 'verre', 'papier', 'métal'];
  collecteTypes: { type: string; poids: number }[] = [];
  adresse: string = '';
  dateCollecte: string = '';
  notes: string = '';
  minDate: string = '';
  maxDate: string = '';
  imageFile: File | null = null;
  imageBase64: string | null = null;

  isAuthenticated: boolean = false;
  userId: number | null = null;

  constructor(private collecteService: CollecteService, private authService: AuthService) {}

  ngOnInit() {
    this.checkAuthStatus();

    if (this.collecteTypes.length === 0) {
      this.ajouterType();
    }

    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    this.minDate = this.formatDate(today);
    this.maxDate = this.formatDate(thirtyDaysFromNow);
  }

  checkAuthStatus() {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.userId = this.authService.getUserId();

    if (!this.isAuthenticated) {
      Swal.fire({
        icon: 'error',
        title: 'Accès refusé',
        text: 'Vous devez être connecté pour enregistrer une collecte.',
        confirmButtonColor: '#16a34a'
      });
    }
  }

  ajouterType() {
    if (this.collecteTypes.length < 4) {
      this.collecteTypes.push({ type: '', poids: 0 });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Limite atteinte',
        text: 'Vous ne pouvez ajouter que 4 types de déchets pour une collecte.',
        confirmButtonColor: '#16a34a'
      });
    }
  }

  supprimerType(index: number) {
    this.collecteTypes.splice(index, 1);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      const reader = new FileReader();

      reader.onload = () => {
        this.imageBase64 = reader.result as string;
      };

      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (!this.isAuthenticated) {
      alert("Vous devez être connecté pour faire une demande de collecte.");
      return;
    }

    this.collecteService.getUserCollectes(this.userId!).subscribe(collectes => {
      const demandesActives = collectes.filter((c: { statut: string; }) => c.statut === "en attente").length;

      if (demandesActives >= 3) {
        Swal.fire({
          icon: 'warning',
          title: 'Trop de demandes',
          text: 'Vous ne pouvez pas avoir plus de 3 demandes simultanées en attente',
          confirmButtonColor: '#16a34a'
        });
        return;
      }

      if (this.validateForm()) {
        const formData = {
          userId: this.userId,
          types: this.collecteTypes,
          adresse: this.adresse,
          date: this.dateCollecte,
          notes: this.notes,
          image: this.imageBase64,
          statut: "en attente"
        };

        this.collecteService.enregistrerCollecte(formData).subscribe(
          response => {
            Swal.fire({
              icon: 'success',
              title: 'Succès !',
              text: 'Votre demande de collecte a été enregistrée avec succès !',
              confirmButtonColor: '#16a34a'
            });
          },
          error => {
            console.error("Erreur lors de l'enregistrement:", error);
            alert("Une erreur est survenue lors de l'enregistrement.");
          }
        );
      }
    }, error => {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue lors de l\'enregistrement.',
        confirmButtonColor: '#16a34a'
      });
    });
  }

  private validateForm(): boolean {
    let totalPoids = 0;

    for (let i = 0; i < this.collecteTypes.length; i++) {
      const collecte = this.collecteTypes[i];

      if (!collecte.type) {
        Swal.fire({
          icon: 'error',
          title: 'Champ manquant',
          text: `Veuillez sélectionner un type pour le déchet numéro ${i + 1}.`,
          confirmButtonColor: '#16a34a'
        });
        return false;
      }
      if (collecte.poids < 1000) {
        Swal.fire({
          icon: 'error',
          title: 'Champ manquant',
          text: `Le poids du déchet numéro ${i + 1} doit être d'au moins 1000g.`,
          confirmButtonColor: '#16a34a'
        });
        return false;
      }


      totalPoids += collecte.poids;
    }

    if (totalPoids > 10000) {
      Swal.fire({
        icon: 'error',
        title: 'Champ manquant',
        text: `Le total des collectes ne doit pas dépasser 10 kg (10000g).`,
        confirmButtonColor: '#16a34a'
      });
      return false;
    }

    if (!this.adresse.trim()) {
      alert("Veuillez renseigner une adresse.");
      return false;
    }

    if (!this.dateCollecte) {
      alert("Veuillez sélectionner une date et une heure.");
      return false;
    }

    if (!this.isValidTimeRange(this.dateCollecte)) {
      Swal.fire({
        icon: 'error',
        title: 'Champ manquant',
        text: `L'heure de collecte doit être comprise entre 09h00 et 18h00.`,
        confirmButtonColor: '#16a34a'
      });
      return false;
    }

    return true;
  }

  private isValidTimeRange(dateTime: string): boolean {
    const selectedDate = new Date(dateTime);
    const hours = selectedDate.getHours();
    return hours >= 9 && hours < 18;
  }

  getTypesDisponibles(index: number): string[] {
    const typesChoisis = this.collecteTypes.map(c => c.type).filter(t => t);
    return this.typesDechets.filter(type => !typesChoisis.includes(type) || this.collecteTypes[index].type === type);
  }

}
