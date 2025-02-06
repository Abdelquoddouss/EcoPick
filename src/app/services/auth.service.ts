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

}
