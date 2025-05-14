import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-score',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="score-container p-3 bg-light border rounded">
      <h3>Очки: {{ score }}</h3>
    </div>
  `,
  styles: [`
    .score-container {
      text-align: center;
      font-size: 1.2rem;
    }
  `]
})
export class ScoreComponent {
  @Input() score: number = 0;
}
