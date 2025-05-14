import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { BoardComponent } from './board/board.component';
import { CommonModule } from '@angular/common';

interface ScoreEntry {
  username: string;
  score: number;
  date: string;
}

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [BoardComponent, CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent {
  @ViewChild('board') board!: BoardComponent;
  @Input() username: string | null = 'Player'; // Змінити за потреби
  @Output() scoreUpdate = new EventEmitter<number>(); // Для передачі очок у floating-buttons
  score: number = 0;
  leaderboard: ScoreEntry[] = [];

  ngOnInit() {
    this.loadLeaderboard();
  }

  updateScore(newScore: number) {
    this.score = newScore;
    this.scoreUpdate.emit(this.score); // Повідомляємо floating-buttons про оновлення очок
  }

  restartGame() {
    if (this.score > 0 && this.username) {
      const entry: ScoreEntry = {
        username: this.username,
        score: this.score,
        date: new Date().toLocaleDateString()
      };
      this.leaderboard.push(entry);
      this.leaderboard.sort((a, b) => b.score - a.score);
      this.leaderboard = this.leaderboard.slice(0, 5); // Топ-5
      localStorage.setItem('leaderboard', JSON.stringify(this.leaderboard));
    }
    this.score = 0;
    this.scoreUpdate.emit(this.score);
    if (this.board) {
      this.board.restart();
    }
  }

  loadLeaderboard() {
    const saved = localStorage.getItem('leaderboard');
    this.leaderboard = saved ? JSON.parse(saved) : [];
  }
}
