import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  constructor() {
    // Завантажуємо кошик із localStorage при ініціалізації
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartSubject.next(this.cartItems);
    }
  }

  // Додаємо товар до кошика
  addToCart(item: CartItem) {
    const existingItem = this.cartItems.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.cartItems.push(item);
    }
    this.updateCart();
  }

  // Видаляємо товар із кошика
  removeFromCart(itemId: number) {
    this.cartItems = this.cartItems.filter((item) => item.id !== itemId);
    this.updateCart();
  }

  // Оновлюємо кошик у localStorage і сповіщаємо підписників
  private updateCart() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.cartSubject.next(this.cartItems);
  }

  // Отримуємо кошик як Observable
  getCart() {
    return this.cartSubject.asObservable();
  }

  // Отримуємо кількість товарів у кошику
  getCartItemCount(): number {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  // Очищаємо кошик (наприклад, при виході)
  clearCart() {
    this.cartItems = [];
    this.updateCart();
  }
}
