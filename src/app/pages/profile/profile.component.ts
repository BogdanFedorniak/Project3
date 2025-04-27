import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  firstName: string = '';
  lastName: string = '';
  address: string = '';
  phone: string = '';
  avatarUrl: string = 'https://via.placeholder.com/150'; // За замовчуванням
  username: string = 'Користувач'; // Статичне значення
  email: string = 'example@email.com'; // Статичне значення
  isEditingSettings: boolean = false;
  activeTab: string = 'settings'; // Починаємо з "Дані та налаштування"

  constructor(private router: Router) {}

  ngOnInit() {}

  toggleEditSettings() {
    this.isEditingSettings = !this.isEditingSettings;
  }

  saveProfile() {
    // Статичне збереження (без бекенду)
    this.isEditingSettings = false;
    alert('Дані оновлено!');
  }

  onAvatarChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatarUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  changePassword() {
    this.router.navigate(['/change-password']);
  }

  logout() {
    this.router.navigate(['/login']);
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
    if (tab === 'logout') {
      this.logout();
    }
  }
}