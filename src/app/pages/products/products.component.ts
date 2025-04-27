import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { CompareService } from '../../services/compare.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  category: string | undefined = undefined; // Змінюємо null на undefined
  subcategory: string | undefined = undefined; // Змінюємо null на undefined
  products: Product[] = [];
  filteredProducts: Product[] = [];
  minPrice: number = 0;
  maxPrice: number = 5000;
  viewMode: 'grid' | 'list' = 'grid';
  sortOption: string = 'popularity';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private compareService: CompareService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      console.log('Query params:', params);
      this.category = params['category'] || undefined; // Змінюємо null на undefined
      this.subcategory = params['subcategory'] || undefined; // Змінюємо null на undefined
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.productService.getProducts(this.category, this.subcategory).subscribe({
      next: (products: Product[]) => {
        this.products = products;
        this.applyFiltersAndSort();
      },
      error: (err) => {
        console.error('Error loading products:', err);
      },
    });
  }

  applyFiltersAndSort(): void {
    let filtered = this.products.filter(
      (product) => product.price >= this.minPrice && product.price <= this.maxPrice
    );

    if (this.sortOption === 'popularity') {
      filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    } else if (this.sortOption === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.sortOption === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (this.sortOption === 'name') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    this.filteredProducts = filtered;
  }

  onPriceFilterChange(): void {
    this.applyFiltersAndSort();
  }

  resetPriceFilter(): void {
    this.minPrice = 0;
    this.maxPrice = 5000;
    this.applyFiltersAndSort();
  }

  sortByPopularity(): void {
    this.sortOption = 'popularity';
    this.applyFiltersAndSort();
  }

  sortByPriceAsc(): void {
    this.sortOption = 'price-asc';
    this.applyFiltersAndSort();
  }

  sortByPriceDesc(): void {
    this.sortOption = 'price-desc';
    this.applyFiltersAndSort();
  }

  sortByName(): void {
    this.sortOption = 'name';
    this.applyFiltersAndSort();
  }

  setView(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  trackById(index: number, product: Product): number {
    return product.id;
  }

  addToCart(product: Product, event: Event): void {
    event.stopPropagation();
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    this.cartService.addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
    alert(`${product.name} додано до кошика!`);
  }

  addToWishlist(product: Product, event: Event): void {
    event.stopPropagation();
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    this.wishlistService.addToWishlist(product);
    alert(`${product.name} додано до обраного!`);
  }

  addToCompare(product: Product, event: Event): void {
    event.stopPropagation();
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    this.compareService.addToCompare(product);
    alert(`${product.name} додано до порівняння!`);
  }
}
