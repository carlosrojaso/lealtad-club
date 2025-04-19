import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatError } from '@angular/material/form-field';
import { Firestore, doc, updateDoc, getDoc } from '@angular/fire/firestore';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-add-stamp',
  templateUrl: './add-stamp.component.html',
  styleUrls: ['./add-stamp.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatError
  ],
})
export class AddStampComponent {
  addStampForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddStampComponent>,
    private firestore: Firestore,
    private dialog: MatDialog
  ) {
    this.addStampForm = this.fb.group({
      identifier: ['', [Validators.required]],
    });
  }

  async onSubmit() {
    if (this.addStampForm.invalid) {
      alert('Please enter a valid identifier.');
      return;
    }

    const identifier = this.addStampForm.value.identifier;

    // Confirm action
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Are you sure you want to add a stamp for ${identifier}?` },
    });

    confirmDialog.afterClosed().subscribe(async (result) => {
      if (result === 'yes') {
        try {
          // Fetch the user document
          const userDocRef = doc(this.firestore, 'cards', identifier);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userCards = userDoc.data();
            const updatedStamps = (userCards['stamps'] || 0) + 1;

            // Update the user's stamps
            await updateDoc(userDocRef, { stamps: updatedStamps });

            alert('Stamp added successfully!');
            this.dialogRef.close();
          } else {
            alert('User not found.');
          }
        } catch (error) {
          console.error(error);
          alert('Failed to add stamp. Please try again.');
        }
      } else {
        this.addStampForm.reset();
      }
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
