import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-customer-cards',
  templateUrl: './customer-cards.component.html',
  styleUrls: ['./customer-cards.component.scss'],
  imports: [CommonModule, MatSelectModule, MatPaginatorModule],
})
export class CustomerCardsComponent implements OnInit {
  customerId: string | null = null;
  companies: string[] = [];
  selectedCompany: string | null = null;
  cards: number[][] = [];
  paginatedCards: number[][] = [];
  pageSize = 1; // 1 card per page
  currentPage = 0;
  flippedCardIndex: number | null = null;

  flipCard(index: number) {
    this.flippedCardIndex = this.flippedCardIndex === index ? null : index;
  }

  countStamps(card: number[]): number {
    return card.filter(s => s === 1).length;
  }
  constructor(private route: ActivatedRoute, private firestore: Firestore) {}
  async ngOnInit() {
    // Get customerId from query params
    this.customerId = this.route.snapshot.queryParamMap.get('customerId');
    if (!this.customerId) {
      console.error('No customerId provided in query params.');
      return;
    }

    // Fetch cards from Firestore
    const cardsRef = collection(this.firestore, 'cards');
    const q = query(cardsRef, where('id', '==', this.customerId));
    const querySnapshot = await getDocs(q);

    const groupedByCompany: { [key: string]: number } = {};
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const companyId = data['company_id'];
      const stamps = data['stamps'] || 0;

      if (!groupedByCompany[companyId]) {
        groupedByCompany[companyId] = 0;
      }
      groupedByCompany[companyId] += stamps;
    });

    // Populate companies and cards
    this.companies = Object.keys(groupedByCompany);
    if (this.companies.length > 0) {
      this.selectedCompany = this.companies[0];
      this.updateCards(groupedByCompany[this.selectedCompany]);
    }
  }

  updateCards(stamps: number) {
    // Create cards with 6 stamps per card
    const totalCards = Math.ceil(stamps / 6);
    this.cards = Array.from({ length: totalCards }, (_, i) =>
      Array.from({ length: 6 }, (_, j) => (i * 6 + j < stamps ? 1 : 0))
    );
    this.paginateCards();
  }

  paginateCards() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedCards = this.cards.slice(startIndex, endIndex);
  }

  onCompanyChange(companyId: string) {
    this.selectedCompany = companyId;
    this.currentPage = 0;
    this.updateCards(this.cards.length * 6); // Update cards for the selected company
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.paginateCards();
  }
}
