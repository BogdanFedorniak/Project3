import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  subcategory: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private allProducts: Product[] = [
    // Товари для чоловіків
    { id: 1, name: 'Футболка з вирізом', price: 1100, image: 'assets/images/tshirt1.png', category: 'men', subcategory: 'tshirts' },
    { id: 2, name: 'Футболка', price: 1300, image: 'assets/images/tshirt2.png', category: 'men', subcategory: 'tshirts' },
    { id: 3, name: 'Футболка оверсайз', price: 1600, image: 'assets/images/tshirt3.png', category: 'men', subcategory: 'tshirts' },
    { id: 4, name: 'Худі з капюшоном', price: 2000, image: 'assets/images/hoodie1.png', category: 'men', subcategory: 'hoodies' },
    { id: 5, name: 'Світшот', price: 1800, image: 'assets/images/hoodie2.png', category: 'men', subcategory: 'hoodies' },
    { id: 6, name: 'Худі оверсайз', price: 2200, image: 'assets/images/overhoodie.png', category: 'men', subcategory: 'hoodies' },
    { id: 7, name: 'Джинси', price: 1800, image: 'assets/images/pants1.png', category: 'men', subcategory: 'pants' },
    { id: 8, name: 'Штани карго', price: 2000, image: 'assets/images/cargo-pants.png', category: 'men', subcategory: 'pants' },
    // Товари для жінок
    { id: 9, name: 'Футболка оверсайз', price: 1200, image: 'assets/images/women-tshirt1.png', category: 'women', subcategory: 'tshirts' },
    { id: 10, name: 'Футболка базова', price: 1000, image: 'assets/images/women-tshirt2.png', category: 'women', subcategory: 'tshirts' },
    { id: 11, name: 'Сукня Повсякденна', price: 2500, image: 'assets/images/women-dress1.png', category: 'women', subcategory: 'dresses' },
    { id: 12, name: 'Сукня міні', price: 3500, image: 'assets/images/mini-dress1.png', category: 'women', subcategory: 'dresses' },
    { id: 13, name: 'Класичні брюки', price: 1900, image: 'assets/images/women-pants1.png', category: 'women', subcategory: 'pants' },
    { id: 14, name: 'Жіночі Широкі брюки', price: 2100, image: 'assets/images/women-pants2.png', category: 'women', subcategory: 'pants' },
    // Взуття
    { id: 15, name: 'Кросівки', price: 3000, image: 'assets/images/sneakers1.png', category: 'shoes', subcategory: 'shoes' },
    { id: 16, name: 'Кросівки сіткою', price: 4500, image: 'assets/images/sneakers2.png', category: 'shoes', subcategory: 'shoes' },
    // Аксесуари
    { id: 17, name: 'Жіночка сумочка', price: 2500, image: 'assets/images/women-backpack1.png', category: 'accessories', subcategory: 'accessories' },
    { id: 18, name: 'Сонцезахисні окуляри', price: 3200, image: 'assets/images/sunglasses.png', category: 'accessories', subcategory: 'accessories' },
    { id: 19, name: 'Сонцезахисні окуляри', price: 1600, image: 'assets/images/sunglasses1.png', category: 'accessories', subcategory: 'accessories' },
    // Спортивний одяг
    { id: 20, name: 'Спортивний топ', price: 2800, image: 'assets/images/sportswear1.png', category: 'sportswear', subcategory: 'sportswear' },
    { id: 21, name: 'Топ', price: 1500, image: 'assets/images/women-top.png', category: 'sportswear', subcategory: 'sportswear' }
  ];

  constructor() {}

  getProducts(): Observable<Product[]> {
    return of(this.allProducts);
  }

  getProductById(id: number): Observable<Product | undefined> {
    const product = this.allProducts.find(p => p.id === id);
    return of(product);
  }

  getProductsByCategoryAndSubcategory(category: string, subcategory: string): Observable<Product[]> {
    const filteredProducts = this.allProducts.filter(product =>
      product.category === category && product.subcategory === subcategory
    );
    return of(filteredProducts);
  }

  // Новий метод для отримання всіх товарів за категорією
  getProductsByCategory(category: string): Observable<Product[]> {
    const filteredProducts = this.allProducts.filter(product =>
      product.category === category
    );
    return of(filteredProducts);
  }
}