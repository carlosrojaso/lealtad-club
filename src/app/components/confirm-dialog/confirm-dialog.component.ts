import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'app-confirm-dialog',
  template: `
    <h1 mat-dialog-title>Confirmation</h1>
    <div mat-dialog-content>
      <p>{{ data.message }}</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onClose('no')">No</button>
      <button mat-raised-button color="primary" (click)="onClose('yes')">Yes</button>
    </div>
  `,
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}

  onClose(result: string) {
    this.dialogRef.close(result);
  }
}
