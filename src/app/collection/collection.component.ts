import { Component, OnInit } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: "./collection.component.html",
  styleUrls: ["./collection.component.css"]
})
export class CollectionComponent implements OnInit {
  typesDechets: string[] = ['plastique', 'verre', 'papier', 'métal'];
  collecteTypes: { type: string; poids: number }[] = [];
  adresse: string = '';
  dateCollecte: string = '';
  notes: string = '';
  minDate: string = '';
  maxDate: string = '';

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

  onSubmit() {
    if (this.validateForm()) {
      console.log('Form submitted:', {
        types: this.collecteTypes,
        adresse: this.adresse,
        date: this.dateCollecte,
        notes: this.notes
      });
      // Add your submission logic here
    }
  }

  private validateForm(): boolean {
    // Validate each waste type
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

    // Validate address and date
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
