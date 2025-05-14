import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ScoreEntry {
  username: string;
  score: number;
  date: string;
}

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent {
  @Input() scores: ScoreEntry[] = [];
}
