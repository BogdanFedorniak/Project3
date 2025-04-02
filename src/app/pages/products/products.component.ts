import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  category: string | null = null;
  subcategory: string | null = null;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  minPrice: number = 0;
  maxPrice: number = 5000;

  constructor(private route: ActivatedRoute, private productService: ProductService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      console.log('Query params:', params);
      this.category = params['category'] || 'men';
      this.subcategory = params['subcategory'] || null;
      this.loadProducts();
    });
  }

  loadProducts(): void {
    if (this.category) {
      if (this.subcategory) {
        this.productService.getProductsByCategoryAndSubcategory(this.category, this.subcategory).subscribe(products => {
          this.products = products;
          this.applyPriceFilter();
        });
      } else {
        this.productService.getProductsByCategory(this.category).subscribe(products => {
          this.products = products;
          this.applyPriceFilter();
        });
      }
    }
  }

  applyPriceFilter(): void {
    this.filteredProducts = this.products.filter(product =>
      product.price >= this.minPrice && product.price <= this.maxPrice
    );
  }

  onPriceFilterChange(): void {
    this.applyPriceFilter();
  }

  resetPriceFilter(): void {
    this.minPrice = 0;
    this.maxPrice = 5000;
    this.applyPriceFilter();
  }

  trackById(index: number, product: Product): number {
    return product.id;
  }

  addToCart(product: Product, event: Event): void {
    event.stopPropagation(); // Зупиняємо перехід на сторінку товару при натисканні на іконку
    console.log(`Додано ${product.name} до кошика`);
    // Додайте логіку для додавання в кошик
  }

  addToWishlist(product: Product, event: Event): void {
    event.stopPropagation();
    console.log(`Додано ${product.name} до обраного`);
    // Додайте логіку для додавання в обране
  }

  addToCompare(product: Product, event: Event): void {
    event.stopPropagation();
    console.log(`Додано ${product.name} до порівняння`);
    // Додайте логіку для додавання в порівняння
  }
}