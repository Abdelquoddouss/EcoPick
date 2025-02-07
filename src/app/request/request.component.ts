import { Component, OnInit } from '@angular/core';
import { CollecteService } from '../services/collecte.service';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-request',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  collectes: any[] = [];
  userId: string | null = null; // Changer en string

  constructor(private collecteService: CollecteService) {}

  ngOnInit() {
    const user = localStorage.getItem('user');

    if (user) {
      const parsedUser = JSON.parse(user);
      this.userId = String(parsedUser.id); // Convertir en string
    }

    if (this.userId) {
      this.collecteService.getCollectes().subscribe((data) => {
        this.collectes = data
          .filter(collecte => collecte.userId === this.userId)
          .map(collecte => ({
            ...collecte,
            statut: collecte.statut || "non défini"
          }));
      });
    }
  }

  supprimerCollecte(id: string) {
    this.collecteService.deleteCollecte(id).subscribe(() => {
      this.collectes = this.collectes.filter(collecte => collecte.id !== id);
    });
  }
}
