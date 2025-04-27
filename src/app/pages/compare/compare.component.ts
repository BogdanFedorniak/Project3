import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CompareService } from '../../services/compare.service';
import { Product } from '../../services/product.service';

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss'],
})
export class CompareComponent implements OnInit {
  compareItems: Product[] = [];

  constructor(private compareService: CompareService) {}

  ngOnInit(): void {
    this.compareService.getCompareItems().subscribe((items: Product[]) => {
      this.compareItems = items;
    });
  }

  removeFromCompare(productId: number): void {
    this.compareService.removeFromCompare(productId);
  }
}
