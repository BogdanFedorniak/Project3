import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  category: string | null = null;
  subcategory: string | null = null;
  activeInfoTab: string = 'delivery'; // Початкова активна вкладка

  constructor(private route: ActivatedRoute, private productService: ProductService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.category = params['category'] || 'men';
      this.subcategory = params['subcategory'] || null;
    });

    this.route.params.subscribe(params => {
      const productId = +params['id'];
      this.productService.getProductById(productId).subscribe(product => {
        this.product = product;
      });
    });
  }

  addToCart(): void {
    console.log(`Додано ${this.product?.name} до кошика`);
  }

  quickOrder(): void {
    console.log(`Швидке замовлення для ${this.product?.name}`);
  }

  addToWishlist(): void {
    console.log(`Додано ${this.product?.name} до обраного`);
  }

  addToCompare(): void {
    console.log(`Додано ${this.product?.name} до порівняння`);
  }

  setActiveTab(tab: string): void {
    this.activeInfoTab = tab;
  }
}