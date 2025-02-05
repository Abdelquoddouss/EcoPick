import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  alertMessage: string | null = null;
  alertType: 'success' | 'error' | null = null;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(private authService: AuthService) {}

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email!, password!).subscribe(users => {
        const user = users.find((u: { email: string | null }) => u.email === email);

        if (user) {
          if (user.password === password) {
            this.showAlert('Connexion réussie !', 'success');
            console.log('Utilisateur connecté :', user);
          } else {
            this.showAlert('Mot de passe incorrect.', 'error');
          }
        } else {
          this.showAlert('Email non trouvé.', 'error');
        }
      }, error => {
        this.showAlert('Erreur de connexion. Veuillez réessayer.', 'error');
        console.error('Erreur de connexion', error);
      });
    } else {
      this.showAlert('Veuillez remplir le formulaire correctement.', 'error');
    }
  }

  private showAlert(message: string, type: 'success' | 'error') {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => this.alertMessage = null, 3000);
  }
}
