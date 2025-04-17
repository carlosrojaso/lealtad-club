import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class RegisterComponent {
  registerForm;

  constructor(private fb: FormBuilder, private auth: Auth) {
    this.registerForm = this.fb.group({
      companyName: ['', [Validators.required]],
      id: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      retypePassword: ['', [Validators.required]],
      phone: [''],
    });
  }
  
  get f() {
    return this.registerForm.controls;
  }

  async onSubmit() {
    if (this.registerForm.invalid) {
      alert('Please fill in the form correctly.');
      return;
    }

    if (this.registerForm.value.password !== this.registerForm.value.retypePassword) {
      alert('Passwords do not match.');
      return;
    }

    const { email, password } = this.registerForm.value;

    try {
      // Create user in Firebase Auth
      await createUserWithEmailAndPassword(this.auth, email!, password!);
      alert('Registration successful!');
    } catch (err) {
      console.error(err);
      alert('Registration failed. Please try again.');
    }
  }
}
