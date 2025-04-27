import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

interface Review {
  name: string;
  email: string;
  comment: string;
  rating: number;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product | undefined;
  category: string | null = null;
  subcategory: string | null = null;
  activeInfoTab: string = 'delivery';
  review: Review = { name: '', email: '', comment: '', rating: 0 };
  cartItemCount: number = 0;
  private cartSubscription: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    public router: Router, // Змінюємо на public
    private productService: ProductService,
    public authService: AuthService // Залишаємо public для використання в шаблоні
  ) {}

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

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  addToCart(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    console.log(`Додано ${this.product?.name} до кошика`);
  }

  quickOrder(): void {
    console.log(`Швидке замовлення для ${this.product?.name}`);
  }

  addToWishlist(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    console.log(`Додано ${this.product?.name} до обраного`);
  }

  addToCompare(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    console.log(`Додано ${this.product?.name} до порівняння`);
  }

  setActiveTab(tab: string): void {
    this.activeInfoTab = tab;
  }

  setRating(rating: number): void {
    this.review.rating = rating;
  }

  submitReview(form: NgForm): void {
    if (form.valid && this.review.rating > 0) {
      console.log('Відгук надіслано:', this.review);
      this.review = { name: '', email: '', comment: '', rating: 0 }; // Скидання форми
      form.resetForm();
    } else {
      console.log('Заповніть усі поля та поставте оцінку');
    }
  }
}