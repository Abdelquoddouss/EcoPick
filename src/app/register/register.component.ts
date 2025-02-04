import {Component, inject} from '@angular/core';
import {FormGroup, FormControl, Validators, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {

  authService: AuthService=inject(AuthService);


  registerForm = new FormGroup({
    fullName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    address: new FormControl('', [Validators.required, Validators.minLength(5)]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    birthDate: new FormControl('', [Validators.required])
  });

  onsubmit() {
    if (this.registerForm.valid) {
      const newUser = {
        ...this.registerForm.value,
        role: 'particulier'
      };
      this.authService.register(newUser).subscribe(response => {
        console.log('User Registered:', response);
        alert('Inscription réussie !');
      });

    } else {
      console.log('Invalid Form');
    }
  }
}
