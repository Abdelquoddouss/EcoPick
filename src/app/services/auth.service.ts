import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/';

  constructor(private http: HttpClient) {}

  register(userData: any): Observable<any> {
    return this.http.post(this.apiUrl+"users", userData);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.get<any[]>(this.apiUrl+"users");
  }

  logout() {
    localStorage.removeItem("user"); // Supprime les infos de l'utilisateur
  }

  // Vérifier si l'utilisateur est connecté
  isLogged(): boolean {
    return localStorage.getItem('user') !== null;
  }

  // Récupérer l'ID de l'utilisateur connecté
  getUserId(): number | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).id : null;
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null; // Convertir en objet si trouvé, sinon retourner null
  }

  updateUserPoints(userId: number, points: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${userId}`, { points });
  }
  convertirPointsEnBonAchat(userId: number, points: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${userId}`, { points });
  }

}
