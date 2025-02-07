import { Component, OnInit } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {CollecteService} from "../services/collecte.service"; // Import du service

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [FormsModule, CommonModule],
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

  constructor(private collecteService: CollecteService) {}

  ngOnInit() {
    if (this.collecteTypes.length === 0) {
      this.ajouterType();
    }

    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    this.minDate = this.formatDate(today);
    this.maxDate = this.formatDate(thirtyDaysFromNow);
  }

  ajouterType() {
    if (this.collecteTypes.length < 4) {
      this.collecteTypes.push({ type: '', poids: 0 });
    } else {
      alert('Vous ne pouvez ajouter que 4 types de déchets pour une collecte.');
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
    }
  }

  onSubmit() {
    if (this.validateForm()) {
      const formData = {
        types: this.collecteTypes,
        adresse: this.adresse,
        date: this.dateCollecte,
        notes: this.notes,
        image: this.imageFile ? this.imageFile.name : null
      };

      console.log('FormData:', formData);  // Ajoutez cette ligne pour déboguer

      this.collecteService.enregistrerCollecte(formData).subscribe(response => {
        console.log('Collecte enregistrée avec succès:', response);
      }, error => {
        console.error('Erreur lors de l\'enregistrement:', error);
      });
    }
  }


  private validateForm(): boolean {
    // Valider chaque type de déchet
    for (let i = 0; i < this.collecteTypes.length; i++) {
      const collecte = this.collecteTypes[i];
      if (!collecte.type) {
        alert(`Veuillez sélectionner un type pour le déchet numéro ${i + 1}.`);
        return false;
      }
      if (collecte.poids < 1000) {
        alert(`Le poids du déchet numéro ${i + 1} doit être d'au moins 1000g.`);
        return false;
      }
    }

    // Valider l'adresse et la date
    if (!this.adresse) {
      alert('Veuillez entrer une adresse de collecte.');
      return false;
    }
    if (!this.dateCollecte) {
      alert('Veuillez sélectionner une date et un créneau horaire pour la collecte.');
      return false;
    }

    return true;
  }
}
