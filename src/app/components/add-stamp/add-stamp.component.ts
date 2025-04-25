import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatError } from '@angular/material/form-field';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  CollectionReference,
  doc
} from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { inject } from '@angular/core';

import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { IdentifierType } from '../../enums/identifier-type.enum';
import { setDoc } from 'firebase/firestore';

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
    private dialog: MatDialog,
    private auth: Auth = inject(Auth),
    @Inject(MAT_DIALOG_DATA) public data: { customerId: string }
  ) {
    this.addStampForm = this.fb.group({
      identifier: [data?.customerId || '', [Validators.required]],
    });
  }

  async onSubmit() {
    if (this.addStampForm.invalid) {
      console.log('Please enter a valid identifier.');
      return;
    }
  
    const identifier = this.addStampForm.value.identifier;
    const identifierType = this.identifyValue(identifier);
  
    if (!identifierType) {
      console.error('Invalid identifier format. Please enter a valid email, phone number, NIT, or cedula.');
      return;
    }
  
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Are you sure you want to add a stamp for ${identifier}?` },
    });
  
    confirmDialog.afterClosed().subscribe(async (result) => {
      if (result !== 'yes') {
        this.addStampForm.reset();
        return;
      }
  
      try {
        const user = this.auth.currentUser;
        if (!user?.email) {
          console.error('User not authenticated ', user);
          return;
        }
  
        const cardsRef = collection(this.firestore, 'cards') as CollectionReference;
        const field = this.getFirestoreField(identifierType);
        const q = query(
          cardsRef,
          where(field, '==', identifier),
          where('company_id', '==', user.email)
        );
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          // User exists, update the document
          const docSnap = querySnapshot.docs[0];
          const data = docSnap.data();
          const newStamps = (data['stamps'] || 0) + 1;
  
          await updateDoc(docSnap.ref, { stamps: newStamps });
  
          console.log('Stamp added successfully!');
          this.dialogRef.close();
        } else {
          const newDoc: any = {
            id: identifier,
            company_id: user.email,
            stamps: 1,
          };
  
          if (!newDoc.company_multiplier) {
            newDoc.company_multiplier = 10;
          }
  
          // If the identifier is a cedula, use it as the doc id
          if (identifierType === IdentifierType.Cedula) {
            const newDocRef = doc(this.firestore, 'cards', identifier);
            await updateDoc(newDocRef, newDoc).catch(async () => {
              // If it doesn't exist, create it instead
              await setDoc(newDocRef, newDoc);
            });
          } else {
            await addDoc(cardsRef, newDoc);
          }
  
          console.log('User created and stamp added successfully!');
          this.dialogRef.close();
        }
      } catch (error) {
        console.error('Failed to add stamp. Please try again.', error);
      }
    });
  }
  
  onCancel() {
    this.dialogRef.close();
  }

  identifyValue(value: string): IdentifierType | null {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^3\d{9}$/;
    const nitRegex = /^\d{9,10}$/;
    const cedulaRegex = /^\d{6,10}$/;

    if (emailRegex.test(value)) {
      return IdentifierType.Email;
    } else if (phoneRegex.test(value)) {
      return IdentifierType.Phone;
    } else if (nitRegex.test(value)) {
      return IdentifierType.NIT;
    } else if (cedulaRegex.test(value)) {
      return IdentifierType.Cedula;
    } else {
      return null;
    }
  }

  getFirestoreField(identifierType: IdentifierType): 'id' | 'email' | 'phone' {
    switch (identifierType) {
      case IdentifierType.Email:
        return 'email';
      case IdentifierType.Phone:
        return 'phone';
      case IdentifierType.Cedula:
      case IdentifierType.NIT:
        return 'id';
      default:
        throw new Error('Unknown identifier type');
    }
  }
}
