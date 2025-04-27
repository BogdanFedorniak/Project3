import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Slide {
  image: string;
  alt: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class HomeComponent implements OnInit {
  categories = [
    { name: 'Чоловікам', image: '/assets/images/men.png' },
    { name: 'Сорочки', image: '/assets/images/shirts.png' },
    { name: 'Жінкам', image: '/assets/images/women.png' },
    { name: 'Футболки', image: '/assets/images/tshirts.png' },
    { name: 'Взуття', image: '/assets/images/shoes.png' },
    { name: 'Аксесуари', image: '/assets/images/accessories.png' },
    { name: 'Спортивний одяг', image: '/assets/images/sportswear.png' },
  ];

  products = [
    { name: 'Штани карго', price: '2300', image: '/assets/images/cargo-pants.png' },
    { name: 'Худі', price: '1950', image: '/assets/images/hoodie1.png' },
    { name: 'Кросівки', price: '3800', image: '/assets/images/sneakers1.png' },
    { name: 'Сонцезахисні окуляри', price: '800', image: '/assets/images/sunglasses.png' },
    { name: 'Одежда худі', price: '2700', image: '/assets/images/overhoodie.png' },
    { name: 'Сонцезахисні окуляри', price: '600', image: '/assets/images/sunglasses1.png' }
  ];

  slides: Slide[] = [
    { image: '/assets/images/hero-image.png', alt: 'Hero Image 1' },
    { image: '/assets/images/hero2-image.png', alt: 'Hero Image 2' }
  ];
  currentSlide = 0;
  isExpanded = false;

  ngOnInit(): void {
    this.autoSlide();
    console.log('Slides initialized:', this.slides.map(s => ({ image: s.image, loaded: new Image().src = s.image })));
  }

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    console.log('Next slide:', this.currentSlide);
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    console.log('Prev slide:', this.currentSlide);
  }

  autoSlide(): void {
    setInterval(() => {
      this.nextSlide();
    }, 5000);
  }
}