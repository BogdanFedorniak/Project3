import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../services/chat.service';
import { ChatModalComponent } from '../chat-modal/chat-modal.component';

@Component({
  selector: 'app-floating-buttons',
  standalone: true,
  imports: [CommonModule, ChatModalComponent],
  templateUrl: './floating-buttons.component.html',
  styleUrls: ['./floating-buttons.component.scss'],
})
export class FloatingButtonsComponent {
  showScrollButton = false;
  isChatOpen = false;

  constructor(private chatService: ChatService) {
    // Підписка на стан чату
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
}