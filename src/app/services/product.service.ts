import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  subcategory: string;
  image: string;
  popularity?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5050/api';

  constructor(private http: HttpClient) {}

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  getProducts(category?: string, subcategory?: string): Observable<Product[]> {
    let url = `${this.apiUrl}/products`;
    if (category) {
      url += `?category=${category}`;
      if (subcategory) {
        url += `&subcategory=${subcategory}`;
      }
    }
    return this.http.get<Product[]>(url);
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }
}