import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'app-confirm-dialog',
  template: `
    <h2 mat-dialog-title class="title">Confirmation</h2>
    <div mat-dialog-content class="content">
      <p>{{ data.message }}</p>
    </div>
    <div mat-dialog-actions class="actions" align="end">
      <button mat-stroked-button color="warn" (click)="onClose('no')">Cancel</button>
      <button mat-flat-button color="primary" (click)="onClose('yes')">Accept</button>
    </div>
  `,
  styles: [`
    .title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .content {
      font-size: 16px;
      color: #333;
      padding-bottom: 12px;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 12px;
    }

    :host {
      display: block;
      padding: 16px;
      background-color: #fff;
      color: #000;
    }
  `]
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
