import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatCheckboxModule]
})
export class LoginComponent {
  loginForm: any;
  isCompany: boolean = false;
  
  constructor(private fb: FormBuilder, private auth: Auth, private router: Router) {
    this.loginForm = this.fb.group({
      isCompany: [false],
      id: ['', [Validators.minLength(6)]],
      email: ['', [Validators.email]],
      password: ['', [Validators.minLength(6)]]
    });

    this.updateValidators();

    this.loginForm.get('isCompany').valueChanges.subscribe(() => {
      this.updateValidators();
    });
  }

  updateValidators() {
    this.isCompany = this.loginForm.get('isCompany').value;
    
    if (this.isCompany) {
      this.loginForm.get('email').setValidators([Validators.required, Validators.email]);
      this.loginForm.get('password').setValidators([Validators.required, Validators.minLength(6)]);
      this.loginForm.get('id').clearValidators();
    } else {
      this.loginForm.get('id').setValidators([Validators.required, Validators.minLength(6)]);
      this.loginForm.get('email').clearValidators();
      this.loginForm.get('password').clearValidators();
    }
    
    this.loginForm.get('id').updateValueAndValidity();
    this.loginForm.get('email').updateValueAndValidity();
    this.loginForm.get('password').updateValueAndValidity();
  }

  get f() {
    return this.loginForm.controls;
  }

  async onSubmit() {
    if (this.loginForm.invalid) return;

    const isCompany = this.loginForm.value.isCompany;

    if (isCompany) {
      const { email, password } = this.loginForm.value;
      
      try {
        await signInWithEmailAndPassword(this.auth, email!, password!);
        this.goToDashboard();
      } catch (err) {
        console.error(err);
        alert('Login failed');
      }
    } else {
      const { id } = this.loginForm.value;
      this.router.navigate(['/customer-cards'], { queryParams: { customerId: id } });
    }
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
