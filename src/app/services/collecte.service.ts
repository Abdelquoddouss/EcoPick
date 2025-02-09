import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CollecteService {
  private apiUrl = 'http://localhost:3000/collectes';
  constructor(private http: HttpClient) {}

  enregistrerCollecte(formData: any) {
    return this.http.post<any>(this.apiUrl, formData);
  }

  getCollectes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  deleteCollecte(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getUserCollectes(userId: number | null): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?userId=${userId}`);
  }

  updateCollecteStatut(collecteId: string, newStatut: string, collecteurId?: string): Observable<any> {
    const body = { statut: newStatut };
    if (collecteurId) {
      // @ts-ignore
      body['collecteurId'] = collecteurId;
    }
    return this.http.patch(`${this.apiUrl}/${collecteId}`, body);
  }
  getAllCollectes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  calculatePoints(types: { type: string; poids: number }[]): number {
    let totalPoints = 0;
    types.forEach(type => {
      switch (type.type) {
        case 'plastique':
          totalPoints += 2 * (type.poids / 1000);
          break;
        case 'verre':
          totalPoints += 1 * (type.poids / 1000);
          break;
        case 'papier':
          totalPoints += 1 * (type.poids / 1000);
          break;
        case 'métal':
          totalPoints += 5 * (type.poids / 1000);
          break;
      }
    });
    return Math.floor(totalPoints);
  }

}
