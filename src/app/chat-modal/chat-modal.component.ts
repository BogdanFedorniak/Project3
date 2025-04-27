import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-modal.component.html',
  styleUrls: ['./chat-modal.component.scss'],
})
export class ChatModalComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatHistory') chatHistory!: ElementRef;
  message = '';
  messages: { role: string; content: string; timestamp: string; image?: string; buttons?: { label: string; action: string }[] }[] = [];
  isLoading = false;
  showTyping = false;
  showEmojiPicker = false;
  theme: 'light' | 'dark' = 'light';
  emojis = ['😊', '😍', '🔥', '👕', '👖', '🧥', '👟', '👜'];

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    const savedTheme = localStorage.getItem('chatTheme') as 'light' | 'dark';
    this.theme = savedTheme || 'light';

    const welcomeResponse = this.chatService.getResponseSync('welcome');
    this.messages.push({
      role: 'assistant',
      content: welcomeResponse.content,
      timestamp: this.getCurrentTime(),
      buttons: welcomeResponse.buttons,
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage() {
    if (!this.message.trim()) return;

    const userMessage = {
      role: 'user',
      content: this.message,
      timestamp: this.getCurrentTime(),
    };

    this.messages.push(userMessage);
    this.showTyping = true;

    setTimeout(() => {
      this.showTyping = false;
      this.isLoading = true;

      const action = this.mapTextToAction(this.message.toLowerCase().trim());
      if (action === 'custom') {
        this.messages.push({
          role: 'assistant',
          content: 'Дякуємо за ваше повідомлення! Наш менеджер зв’яжеться з вами найближчим часом.',
          timestamp: this.getCurrentTime(),
        });
        this.isLoading = false;
        this.chatService.incrementMessageCount();
      } else {
        this.chatService.getResponse(action).subscribe({
          next: (response) => {
            this.messages.push({
              role: 'assistant',
              content: response.content,
              timestamp: this.getCurrentTime(),
              image: response.image,
              buttons: response.buttons,
            });
            this.isLoading = false;
            this.chatService.incrementMessageCount();
          },
          error: (err) => {
            console.error('Помилка:', err);
            this.messages.push({
              role: 'assistant',
              content: 'Щось пішло не так.',
              timestamp: this.getCurrentTime(),
            });
            this.isLoading = false;
          },
        });
      }
    }, 500);

    this.message = '';
    this.showEmojiPicker = false;
  }

  executeButtonAction(action: string) {
    this.showTyping = true;

    setTimeout(() => {
      this.showTyping = false;
      this.isLoading = true;
      this.chatService.getResponse(action).subscribe({
        next: (response) => {
          this.messages.push({
            role: 'assistant',
            content: response.content,
            timestamp: this.getCurrentTime(),
            image: response.image,
            buttons: response.buttons,
          });
          this.isLoading = false;
          this.chatService.incrementMessageCount();
        },
        error: (err) => {
          console.error('Помилка:', err);
          this.messages.push({
            role: 'assistant',
            content: 'Щось пішло не так.',
            timestamp: this.getCurrentTime(),
          });
          this.isLoading = false;
        },
      });
    }, 500);
  }

  addEmoji(emoji: string) {
    this.message += emoji;
    this.showEmojiPicker = false;
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('chatTheme', this.theme);
  }

  clearChat() {
    const welcomeResponse = this.chatService.getResponseSync('welcome');
    this.messages = [
      {
        role: 'assistant',
        content: welcomeResponse.content,
        timestamp: this.getCurrentTime(),
        buttons: welcomeResponse.buttons,
      },
    ];
  }

  close() {
    this.chatService.closeChat();
    this.messages = [];
    this.isLoading = false;
  }

  private mapTextToAction(text: string): string {
    if (text.includes('тренд') || text.includes('модно')) return 'trends';
    if (text.includes('рекоменда') || text.includes('порадь')) return 'recommend';
    if (text.includes('доставка')) return 'delivery';
    if (text.includes('повернення')) return 'return';
    if (text.includes('графік') || text.includes('роботи')) return 'schedule';
    if (text.includes('допомога')) return 'help';
    return 'custom';
  }

  private scrollToBottom() {
    if (this.chatHistory) {
      this.chatHistory.nativeElement.scrollTop = this.chatHistory.nativeElement.scrollHeight;
    }
  }

  private getCurrentTime(): string {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}