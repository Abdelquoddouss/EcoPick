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


}
