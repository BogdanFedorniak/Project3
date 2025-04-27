import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService, CartItem } from '../../services/cart.service';
import { ProductService, Product } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isSearchOpen: boolean = false;
  searchQuery: string = '';
  products: Product[] = [];
  filteredProducts: Product[] = [];
  cartItemCount: number = 0;
  private cartSubscription: Subscription | undefined;

  constructor(
    public authService: AuthService,
    public cartService: CartService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    // Завантажуємо всі товари при ініціалізації
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products;
      },
      error: (err) => {
        console.error('Помилка завантаження товарів:', err);
      }
    });

    // Підписуємося на оновлення кошика
    this.cartSubscription = this.cartService.getCart().subscribe((cartItems: CartItem[]) => {
      this.cartItemCount = this.cartService.getCartItemCount();
    });
  }

  ngOnDestroy(): void {
    // Відписуємося від оновлень кошика, щоб уникнути витоків пам'яті
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen;
    if (!this.isSearchOpen) {
      this.searchQuery = '';
      this.filteredProducts = this.products;
    }
  }

  closeSearch(): void {
    this.isSearchOpen = false;
    this.searchQuery = '';
    this.filteredProducts = this.products;
  }

  searchProducts(): void {
    if (!this.searchQuery.trim()) {
      this.filteredProducts = this.products;
      return;
    }
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      (product.subcategory && product.subcategory.toLowerCase().includes(query))
    );
  }

  logout() {
    this.authService.logout();
    this.cartService.clearCart();
  }
}