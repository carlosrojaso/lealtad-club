import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ForgotDialogComponent } from './forgot-dialog-component';

@Component({
  selector: 'app-forgot',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatDialogModule],
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss'],
})
export class ForgotComponent {
  forgotForm: FormGroup;

  constructor(private fb: FormBuilder, private auth: Auth, private dialog: MatDialog) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get f() {
    return this.forgotForm.controls;
  }

  async onSubmit() {
    if (this.forgotForm.invalid) {
      this.openDialog('Error', 'Please enter a valid email.');
      return;
    }

    const { email } = this.forgotForm.value;

    try {
      await sendPasswordResetEmail(this.auth, email);
      this.openDialog('Success', 'Reset link sent. Check your email inbox.');
    } catch (error) {
      console.error(error);
      this.openDialog('Error', 'Failed to send reset link. Please try again.');
    }
  }

  openDialog(title: string, message: string) {
    this.dialog.open(ForgotDialogComponent, {
      data: { title, message },
    });
  }
}