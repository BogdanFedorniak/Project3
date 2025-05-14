import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../services/chat.service';
import { ChatModalComponent } from '../chat-modal/chat-modal.component';
import { GameComponent } from '../game/game.component'; // Імпорт компонента гри

@Component({
  selector: 'app-floating-buttons',
  standalone: true,
  imports: [CommonModule, ChatModalComponent, GameComponent], // Додайте GameComponent
  templateUrl: './floating-buttons.component.html',
  styleUrls: ['./floating-buttons.component.scss'],
})
export class FloatingButtonsComponent {
  showScrollButton = false;
  isChatOpen = false;
  isGameModalOpen = false; // Змінна для модального вікна гри
  score: number = 0; // Зберігаємо очки

  constructor(private chatService: ChatService) {
    this.chatService.isChatOpen$.subscribe((isOpen) => {
      this.isChatOpen = isOpen;
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollButton = window.pageYOffset > 300;
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openChat() {
    this.chatService.openChat();
  }

  openGameModal() {
    this.isGameModalOpen = true;
  }

  closeGameModal() {
    this.isGameModalOpen = false;
  }

  updateScore(newScore: number) {
    this.score = newScore;
  }
}
