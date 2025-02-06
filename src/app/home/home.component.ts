import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  isAuthenticated = false;

  constructor(private router: Router) {}

  ngOnInit() {
    const user = localStorage.getItem('user');
    this.isAuthenticated = user !== null;
  }

  navigateToAction() {
    if (this.isAuthenticated) {
      // Rediriger vers la page de collection
      this.router.navigate(['/addCollection']);
    } else {
      // Rediriger vers la page de connexion
      this.router.navigate(['/login']);
    }
  }

}
