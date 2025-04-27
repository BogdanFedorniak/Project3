import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './product.service';

@Injectable({
  providedIn: 'root',
})
export class CompareService {
  private compareItems: Product[] = [];
  private compareSubject = new BehaviorSubject<Product[]>([]);

  constructor() {
    const savedCompare = localStorage.getItem('compare');
    if (savedCompare) {
      this.compareItems = JSON.parse(savedCompare);
      this.compareSubject.next(this.compareItems);
    }
  }

  addToCompare(product: Product) {
    if (this.compareItems.length < 4 && !this.compareItems.find((item) => item.id === product.id)) {
      this.compareItems.push(product);
      this.updateCompare();
    } else if (this.compareItems.length >= 4) {
      alert('Ви можете порівнювати не більше 4 товарів одночасно.');
    }
  }

  removeFromCompare(productId: number) {
    this.compareItems = this.compareItems.filter((item) => item.id !== productId);
    this.updateCompare();
  }

  private updateCompare() {
    localStorage.setItem('compare', JSON.stringify(this.compareItems));
    this.compareSubject.next(this.compareItems);
  }

  getCompareItems() {
    return this.compareSubject.asObservable();
  }
}
