import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';
import { AddStampComponent } from '../add-stamp/add-stamp.component';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';


@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    RouterModule
  ],
})
export class DashboardComponent {
  constructor(
    private auth: Auth,
    private dialog: MatDialog,
    private router: Router
  ) {}

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }

  openAddStampModal() {
    this.dialog.open(AddStampComponent, {
      width: '400px',
    });
  }
}
