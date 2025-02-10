import {Component, inject} from '@angular/core';
import {FormGroup, FormControl, Validators, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  authService: AuthService = inject(AuthService);
  selectedFileBase64: string | null = null;
  router: Router = inject(Router);


  registerForm = new FormGroup({
    fullName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    address: new FormControl('', [Validators.required, Validators.minLength(5)]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    birthDate: new FormControl('', [Validators.required])
  });

  // Convertir l'image en Base64
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedFileBase64 = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onsubmit() {
    if (this.registerForm.valid) {
      const newUser = {
        ...this.registerForm.value,
        role: 'particulier',
        profilePicture: this.selectedFileBase64
      };

      this.authService.register(newUser).subscribe(response => {
        console.log('User Registered:', response);

        this.router.navigate(['/login']);
      });
    } else {
      console.log('Invalid Form');
    }
  }

}
