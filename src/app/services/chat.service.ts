import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

interface ChatResponse {
  content: string;
  image?: string;
  thumbnails?: string[];
  buttons?: { label: string; action: string }[];
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private isChatOpen = new BehaviorSubject<boolean>(false);
  isChatOpen$ = this.isChatOpen.asObservable();

  private newMessageCount = new BehaviorSubject<number>(0);
  newMessageCount$ = this.newMessageCount.asObservable();

  private responses: { [key: string]: ChatResponse } = {
    welcome: {
      content: 'Вас вітає підтримка! Як можемо допомогти? 😊',
      buttons: [
        { label: 'Тренди', action: 'trends' },
        { label: 'Рекомендації', action: 'recommend' },
        { label: 'Допомога', action: 'help' },
      ],
    },
    trends: {
      content: 'Цього сезону в тренді:\n- Яскраві кольори\n- Еко-матеріали\n- Оверсайз силуети',
    },
    recommend: {
      content: 'Рекомендації:\n- Поєднуйте контрастні кольори\n- Додавайте аксесуари\n- Обирайте комфорт',
    },
    delivery: {
      content: 'Нова Пошта, 1-3 дні, від 70 грн. Безкоштовно від 1500 грн.',
    },
    return: {
      content: 'Повернення 14 днів, якщо товар не був у вжитку.',
    },
    schedule: {
      content: 'ПН-ПТ 8:00-22:00, СБ-НД 11:00-22:00.',
    },
    help: {
      content: 'Чим можу допомогти? Ось що я можу:',
      buttons: [
        { label: 'Графік', action: 'schedule' },
        { label: 'Доставка', action: 'delivery' },
        { label: 'Повернення', action: 'return' },
      ],
    },
    default: {
      content: 'Не зрозумів. Спробуй ще раз або обери з кнопок нижче.',
      buttons: [
        { label: 'Тренди', action: 'trends' },
        { label: 'Допомога', action: 'help' },
      ],
    },
  };

  constructor() {}

  openChat() {
    this.isChatOpen.next(true);
    this.newMessageCount.next(0);
  }

  closeChat() {
    this.isChatOpen.next(false);
  }

  incrementMessageCount() {
    if (!this.isChatOpen.value) {
      this.newMessageCount.next(this.newMessageCount.value + 1);
    }
  }

  getResponse(action: string): Observable<ChatResponse> {
    const response = this.responses[action] || this.responses['default'];
    return of(response).pipe(delay(800));
  }

  getResponseSync(action: string): ChatResponse {
    return this.responses[action] || this.responses['default'];
  }
}