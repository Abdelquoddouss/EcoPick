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
      body['collecteurId'] = collecteurId; // Ajouter collecteurId uniquement si défini
    }
    return this.http.patch(`${this.apiUrl}/${collecteId}`, body);
  }
  getAllCollectes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

}
