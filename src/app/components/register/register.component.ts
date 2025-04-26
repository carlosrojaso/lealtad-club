import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { doc, Firestore, serverTimestamp, setDoc  } from '@angular/fire/firestore';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, MatProgressSpinnerModule, RouterModule],
})
export class RegisterComponent {
  registerForm;
  isLoading = false;

  constructor(private fb: FormBuilder, private auth: Auth, private db: Firestore, private router: Router) {
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
    this.isLoading = true;

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email!, password!);
      const user = userCredential.user;

      // After registration, store additional info in Firestore
      await setDoc(doc(this.db, "users", user.uid), {
        email: user.email,
        createdAt: serverTimestamp(),
        companyName: this.registerForm.value.companyName,
        companyId: this.registerForm.value.id,
        phone: this.registerForm.value.phone,
        role: 'user',
        status: 'active', 
      });
      alert('Registration successful! You can now log in.');
      // Redirect to login page or perform any other action
      this.router.navigate(['/login']);
    } catch (err) {
      console.error(err);
      alert('Registration failed. Please try again.');
    } finally {
      this.isLoading = false;
    }
    // Reset the form after submission
    this.registerForm.reset();
  }
}
