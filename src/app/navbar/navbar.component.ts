import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { NgClass, NgIf } from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs"; // Importer NgIf

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    NgClass,
    NgIf // Ajouter NgIf ici
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isOpen: boolean = false;
  private currentUserSubject: BehaviorSubject<any>
  public currentUser: Observable<any>

  constructor(private http: HttpClient,private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem("user") || "null"))
    this.currentUser = this.currentUserSubject.asObservable()
  }



  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value ;
  }

  logout() {
    localStorage.removeItem("user");
    this.router.navigate(['/login']);
  }

}
