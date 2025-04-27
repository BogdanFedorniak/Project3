import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './product.service';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private wishlistItems: Product[] = [];
  private wishlistSubject = new BehaviorSubject<Product[]>([]);

  constructor() {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      this.wishlistItems = JSON.parse(savedWishlist);
      this.wishlistSubject.next(this.wishlistItems);
    }
  }

  addToWishlist(product: Product) {
    if (!this.wishlistItems.find((item) => item.id === product.id)) {
      this.wishlistItems.push(product);
      this.updateWishlist();
    }
  }

  removeFromWishlist(productId: number) {
    this.wishlistItems = this.wishlistItems.filter((item) => item.id !== productId);
    this.updateWishlist();
  }

  private updateWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(this.wishlistItems));
    this.wishlistSubject.next(this.wishlistItems);
  }

  getWishlist() {
    return this.wishlistSubject.asObservable();
  }
}
