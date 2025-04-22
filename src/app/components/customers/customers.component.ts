import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Component({
  standalone: true,
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  imports: [MatTableModule, MatPaginatorModule],
})
export class CustomersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'email', 'phone', 'company_id', 'company_multiplier', 'stamps'];
  dataSource = new MatTableDataSource<any>([]);
  pageSize = 20;

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(private firestore: Firestore, private auth: Auth) {}

  async ngOnInit() {
    const user = this.auth.currentUser;
    if (!user?.email) {
      console.error('User not authenticated');
      return;
    }

    const customersRef = collection(this.firestore, 'cards');
    const q = query(customersRef, where('company_id', '==', user.email));
    const querySnapshot = await getDocs(q);

    const customers = querySnapshot.docs.map(doc => doc.data());
    this.dataSource.data = customers;

    this.dataSource.paginator = this.paginator!;
  }
}
