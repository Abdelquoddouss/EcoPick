import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map, Observable, switchMap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/';

  constructor(private http: HttpClient) {}

  register(userData: any): Observable<any> {
    return this.http.post(this.apiUrl + "users", userData);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.get<any[]>(this.apiUrl + "users").pipe(
      map(users => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          // Stocker l'utilisateur dans le localStorage
          localStorage.setItem('user', JSON.stringify(user));
          return user;
        } else {
          throw new Error('Invalid email or password');
        }
      })
    );
  }

  logout(): void {
    // Supprimer l'utilisateur du localStorage
    localStorage.removeItem('user');
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return localStorage.getItem('user') !== null;
  }

  getUserRole(): string | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).role : null;
  }

  getUserId(): number | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).id : null;
  }

  // Récupérer l'objet utilisateur connecté
  getUser(): any | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null; // Convertir en objet si trouvé, sinon retourner null
  }

  // Mettre à jour les points de l'utilisateur
  updateUserPoints(userId: number, newPoints: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}users/${userId}`, {
      points: newPoints
    });
  }

  // Récupérer les points de l'utilisateur
  getUserPoints(userId: number): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}users/${userId}`).pipe(
      map(user => user.points || 0)
    );
  }

  // Ajouter un bon d'achat à l'utilisateur
  addVoucher(userId: number, voucherAmount: number): Observable<any> {
    return this.getUserVoucher(userId).pipe(
      map(existingVoucher => existingVoucher + voucherAmount), // Additionne l'ancien montant
      switchMap(updatedVoucher =>
        this.http.patch(`${this.apiUrl}users/${userId}`, { voucher: updatedVoucher })
      )
    );
  }

  // Récupérer le bon d'achat de l'utilisateur
  getUserVoucher(userId: number): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}users/${userId}`).pipe(
      map(user => user.voucher || 0) // Retourne 0 si pas de bon d'achat
    );
  }
}
