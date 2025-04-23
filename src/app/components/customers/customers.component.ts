import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { Firestore, collection, query, where, getDocs, deleteDoc, doc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { AddStampComponent } from '../add-stamp/add-stamp.component';

@Component({
  standalone: true,
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  imports: [MatTableModule, MatPaginatorModule],
})
export class CustomersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'email', 'phone', 'company_id', 'company_multiplier', 'stamps', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  pageSize = 20;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(private firestore: Firestore, private auth: Auth, private dialog: MatDialog) {}

  async ngOnInit() {
    const user = this.auth.currentUser;
    if (!user?.email) {
      console.error('User not authenticated');
      return;
    }

    const customersRef = collection(this.firestore, 'cards');
    const q = query(customersRef, where('company_id', '==', user.email));
    const querySnapshot = await getDocs(q);

    const customers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    this.dataSource.data = customers;

    this.dataSource.paginator = this.paginator!;
  }

  openAddStampModal(customerId: string) {
    this.dialog.open(AddStampComponent, {
      width: '400px',
      data: { customerId }, // Pass the customerId to the modal
    });
  }

  async deleteCustomer(customerId: string) {
    if (!confirm('Are you sure you want to delete this customer?')) {
      return;
    }

    try {
      const customerDocRef = doc(this.firestore, 'cards', customerId);
      await deleteDoc(customerDocRef);
      this.dataSource.data = this.dataSource.data.filter(customer => customer.id !== customerId);
      alert('Customer deleted successfully!');
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('Failed to delete customer. Please try again.');
    }
  }
}
